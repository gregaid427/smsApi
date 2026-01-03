import pool from "../../config/db.js";
import AppError from "../../utils/AppError.js";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
/* ============================================================
   HELPER: Generate Student ID
   Format: SDYYYYMMXXXX
============================================================ */
const generateStudentId = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const [rows] = await pool.query(
    "SELECT studentId FROM student WHERE studentId LIKE ? ORDER BY studentId DESC LIMIT 1",
    [`SD${year}${month}%`]
  );

  let nextNumber = 1;
  if (rows.length) {
    const lastId = rows[0].studentId;
    nextNumber = parseInt(lastId.slice(-4)) + 1;
  }

  return `SD${year}${month}${String(nextNumber).padStart(4, "0")}`;
};
const generateCode = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  // Prefix: SD + YYYY + MM → 8 characters
  const prefix = `GD${year}${month}`;

  // Generate 4 random alphanumeric characters (A-Z, 0-9)
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  // Final 10-character code
  return prefix + suffix; // e.g., SD202601K9P2
};
/* ============================================================
   HELPER: Generate Guardian Username
============================================================ */
const generateUsername = (email, firstName, lastName) => {
  const base = `${firstName}${lastName}`.toLowerCase().replace(/\s/g, "");
  return `${base}${Math.floor(Math.random() * 1000)}`.slice(0, 12);
};

/* ============================================================
   HELPER: Generate Friendly Password (6 chars)
============================================================ */
const generatePassword = (firstName, lastName) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let pass = "";
  for (let i = 0; i < 6; i++) pass += chars[Math.floor(Math.random() * chars.length)];
  return pass;
};

/* ============================================================
   CREATE STUDENT
============================================================ */
export const createStudent = async (req, res) => {
  const connection = await pool.getConnection();
  let baseUrl = process.env.SERVER_BASE_URL;
  try {
    const {
      firstName,
      lastName,
      otherNames,
      gender,
      dateOfBirth,
      religion,
      classId,
      sectionId,
      studentCategoryId,
      finance,
      previousClassId,
      guardians,
    } = req.body;

    if (!firstName || !lastName) {
      throw new AppError("firstName and lastName are required", 400);
    }

    // ==============================
    // Parse finance safely
    // ==============================
    let financeData = null;
    let financeId = null; // will map to table column finaanceCartegory

    if (finance) {
      try {
        financeData = typeof finance === "string" ? JSON.parse(finance) : finance;
        financeId = financeData?.financeCategoryId || null;
      } catch {
        throw new AppError("Invalid finance JSON", 400);
      }
    }

    // ==============================
    // Parse guardians safely
    // ==============================
    let guardiansArray = [];
    if (guardians) {
      try {
        guardiansArray = typeof guardians === "string" ? JSON.parse(guardians) : guardians;
      } catch {
        throw new AppError("Invalid guardians JSON", 400);
      }
    }

    // ==============================
    // Generate unique studentId
    // ==============================
    let studentId;
    let exists = true;

    while (exists) {
      studentId = await generateStudentId();
      const [check] = await connection.query(
        "SELECT id FROM student WHERE studentId=? LIMIT 1",
        [studentId]
      );
      exists = check.length > 0;
    }

    // ==============================
    // Handle profile image
    // ==============================
    let profileImage = null;
    const file =
      req.file ||
      (Array.isArray(req.files) && req.files.length > 0 ? req.files[0] : null);

    if (file) {
      profileImage = `${baseUrl}/uploads/students/${file.filename}`;
    }
    console.log(profileImage)
    // ==============================
    // Start transaction
    // ==============================
    await connection.beginTransaction();

    // ==============================
    // Insert student
    // ==============================
    const [result] = await connection.query(
      `INSERT INTO student
        (
          studentId,
          firstName,
          lastName,
          otherName,
          gender,
          dateOfBirth,
          religion,
          classId,
          sectionId,
          categoryId,
          finaanceCartegory,
          previousClassId,
          profileImage
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        studentId,
        firstName,
        lastName,
        otherNames || null,
        gender || null,
        dateOfBirth || null,
        religion || null,
        classId || null,
        sectionId || null,
        studentCategoryId || null,
        financeId,
        previousClassId || null,
        profileImage,
      ]
    );

    // ==============================
    // Fetch only required student fields
    // ==============================
    const [student] = await connection.query(
      `SELECT id, firstName, lastName, createdAt, classId, sectionId, categoryId, finaanceCartegory AS financeId
       FROM student WHERE id=?`,
      [result.insertId]
    );

    // ==============================
    // Insert guardians
    // ==============================
    const createdGuardians = [];

    for (const g of guardiansArray) {
      if (!g.firstName || !g.lastName) continue;
      const guardianCode = await generateCode(6); // e.g. "GXD4K9"
      const username = generateUsername(g.email, g.firstName, g.lastName);
      const password = generatePassword(g.firstName, g.lastName);
      console.log(studentId)

      const [guardianResult] = await connection.query(
        `INSERT INTO guardian
          ( id,
            studentId,
            firstName,
            lastName,
            email,
            username,
            password,
            contact1,
            contact2,
            address,
            relation
          )
          VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [guardianCode,
          studentId,
          g.firstName,
          g.lastName,
          g.email || null,
          username,
          password,
          g.contact1 || null,
          g.contact2 || null,
          g.address || null,
          g.relation || "Guardian",
        ]
      );
      console.log(guardianResult)

      const [created] = await connection.query(
        `SELECT id, firstName, lastName, username, password, email, relation, contact1,
            contact2,
            address
         FROM guardian WHERE studentId=?`,
        [guardianResult.insertId]
      );

      createdGuardians.push(created[0]);
    }

    // ==============================
    // Commit transaction
    // ==============================
    await connection.commit();

    // ==============================
    // Send response
    // ==============================
    res.status(201).json({
      success: 1,
      message: "Student and guardians created successfully",
      student: student[0],
      guardians: createdGuardians,
    });

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
/* ============================================================
   SEARCH STUDENTS (Class / All Sections via Class Group)
============================================================ */
export const searchStudents = async (req, res) => {
  const { classId, allSection } = req.body;

  if (!classId) {
    throw new AppError("classId is required", 400);
  }

  // Normalize boolean
  const includeAllSections = allSection === "true" || allSection === true;

  let students = [];

  // =====================================================
  // CASE 1: Single class only
  // =====================================================
  if (!includeAllSections) {
    const [rows] = await pool.query(
      `
      SELECT 
       *
      FROM student
      WHERE classId = ?
        AND isActive = 1
        AND status = 'CURRENT'
      ORDER BY createdAt DESC
      `,
      [classId]
    );

    students = rows;
  }

  // =====================================================
  // CASE 2: All sections (same classGroupId)
  // =====================================================
  else {
    // 1️⃣ Get classGroupId from provided classId
    const [classRows] = await pool.query(
      `SELECT classGroupId FROM class WHERE id = ? LIMIT 1`,
      [classId]
    );

    if (!classRows.length || !classRows[0].classGroupId) {
      throw new AppError("Class group not found for provided classId", 404);
    }

    const classGroupId = classRows[0].classGroupId;

    // 2️⃣ Get ALL class IDs in the same classGroup
    const [classIdsRows] = await pool.query(
      `SELECT id FROM class WHERE classGroupId = ?`,
      [classGroupId]
    );

    const classIds = classIdsRows.map(c => c.id);

    if (!classIds.length) {
      return res.status(200).json({
        success: 1,
        message: "No students found",
        students: [],
      });
    }

    // 3️⃣ Fetch students in those classes
    const [rows] = await pool.query(
      `
      SELECT 
        *
      FROM student
      WHERE classId IN (?)
        AND isActive = 1
        AND status = 'CURRENT'
      ORDER BY classId, createdAt DESC
      `,
      [classIds]
    );

    students = rows;
  }

  res.status(200).json({
    success: 1,
    message: "Students fetched successfully",
    count: students.length,
    data: students,
  });
};
/* ============================================================
   GET STUDENT RELATED INFO (GUARDIAN, FINANCE – EXTENSIBLE)
   Route: GET /api/students/:studentId/related
============================================================ */
export const getStudentRelatedInfo = async (req, res) => {
  const { studentId } = req.params;

  if (!studentId) {
    throw new AppError("studentId is required", 400);
  }

  // =====================================================
  // 1️⃣ Validate student exists (using student.studentId)
  // =====================================================
  const [studentRows] = await pool.query(
    `SELECT id, studentId FROM student WHERE studentId = ? LIMIT 1`,
    [studentId]
  );

  if (!studentRows.length) {
    throw new AppError("Student not found", 404);
  }

  // =====================================================
  // 2️⃣ Fetch guardians (1 → many)
  // =====================================================
  const [guardians] = await pool.query(
    `
    SELECT 
     *
    FROM guardian
    WHERE studentId = ?
    ORDER BY createdAt ASC
    `,
    [studentId]
  );

  // =====================================================
  // 3️⃣ Finance (placeholder – future table)
  // =====================================================
  // When finance table is added, replace null with query
  const finance = null;

  // =====================================================
  // 4️⃣ Response
  // =====================================================
  res.status(200).json({
    success: 1,
    message: "Student related info fetched successfully",
    data: {
      guardian: guardians,   // always array (0..n)
      finance,
    },
  });
};


/* ============================================================
   GET STUDENT BY ID
============================================================ */
export const getStudent = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM student WHERE id=?", [req.params.id]);
  if (!rows.length) throw new AppError("Student not found", 404);

  res.status(200).json({
    success: 1,
    message: "Student fetched successfully",
    info: rows[0],
  });
};

/* ============================================================
   UPDATE STUDENT
============================================================ */
export const updateStudent = async (req, res) => {
  const conn = await pool.getConnection();


  try {
    await conn.beginTransaction();

    const {
      firstName,
      lastName,
      otherNames,
      gender,
      religion,
      dateOfBirth,
      classId,
      sectionId,
      studentCategoryId,
      financeCategoryId,
      accountBalance,
      scholarshipId,
      feeItems,
      guardians,
    } = req.body;

    const studentDbId = req.params.id;

    /* ===============================
       PROFILE IMAGE
    =============================== */
    /* ===============================
   PROFILE IMAGE
============================== */
    const baseUrl = process.env.SERVER_BASE_URL;

    let profileImage = null;

    const file =
      req.file ||
      (Array.isArray(req.files) && req.files.length > 0 ? req.files[0] : null);

    if (file) {
      profileImage = baseUrl + `/uploads/students/${file.filename}`;
    }
    console.log(profileImage)

    /* ===============================
       UPDATE STUDENT
    =============================== */
    const [studentResult] = await conn.query(
      `UPDATE student SET
        firstName=?,
        lastName=?,
        otherName=?,
        gender=?,
        religion=?,
        dateOfBirth=?,
        classId=?,
        sectionId=?,
        categoryId=?,
        profileImage=COALESCE(?, profileImage)
       WHERE studentId=?`,
      [
        firstName,
        lastName,
        otherNames || null,
        gender,
        religion,
        dateOfBirth || null,
        classId,
        sectionId,
        studentCategoryId,
        profileImage,
        studentDbId,
      ]
    );

    if (!studentResult.affectedRows) {
      throw new Error("Student not found");
    }

    /* ===============================
       UPSERT FINANCE
    =============================== */
    // await conn.query(
    //   `INSERT INTO student_finance
    //     (studentId, financeCategoryId, scholarshipId, accountBalance, feeItems)
    //    VALUES (?, ?, ?, ?, ?)
    //    ON DUPLICATE KEY UPDATE
    //     financeCategoryId=VALUES(financeCategoryId),
    //     scholarshipId=VALUES(scholarshipId),
    //     accountBalance=VALUES(accountBalance),
    //     feeItems=VALUES(feeItems)`,
    //   [
    //     studentDbId,
    //     financeCategoryId || null,
    //     scholarshipId || null,
    //     Number(accountBalance) || 0,
    //     feeItems || "[]",
    //   ]
    // );

    /* ===============================
       GUARDIANS (REPLACE STRATEGY)
    =============================== */
    /* ===============================
      GUARDIANS: SMART UPSERT (Update existing + Insert new + Delete removed)
   ============================== */

    const parsedGuardians = JSON.parse(guardians || "[]");



    // Step 1: Collect IDs of guardians that still exist (sent from frontend)
    const incomingGuardianIds = parsedGuardians
      .filter(g => g.id && !isNaN(g.id))
      .map(g => g.id);

    // Step 2: Delete guardians that were removed in the UI
    if (incomingGuardianIds.length > 0) {
      await conn.query(
        `DELETE FROM guardian 
     WHERE studentId = ? AND id NOT IN (${incomingGuardianIds.map(() => '?').join(',')})`,
        [studentDbId, ...incomingGuardianIds]
      );
    } else {
      // No guardians with IDs → user removed all → delete everything
      await conn.query(`DELETE FROM guardian WHERE studentId = ?`, [studentDbId]);
    }

    // Step 3: Update existing OR Insert new guardians
    for (const g of parsedGuardians) {
      if (g.id && !isNaN(g.id)) {
        // ────── UPDATE existing guardian ──────
        await conn.query(
          `UPDATE guardian SET
         firstName = ?,
         lastName = ?,
         email = ?,
         contact1 = ?,
         contact2 = ?,
         address = ?,
         relation = ?,
         updatedAt = CURRENT_TIMESTAMP
       WHERE id = ? AND studentId = ?`,
          [
            g.firstName || null,
            g.lastName || null,
            g.email || null,
            g.contact1 || null,
            g.contact2 || null,
            g.address || null,
            g.relation || "Mother",
            g.id,
            studentDbId
          ]
        );
      } else {
        // ────── INSERT new guardian (same as createStudent) ──────
        if (!g.firstName || !g.lastName) continue; // skip empty
        const guardianCode = await generateCode(6); // e.g. "GXD4K9"
        const username = generateUsername(g.email, g.firstName);
        const password = generatePassword(g.firstName,);

        await conn.query(
          `INSERT INTO guardian
         (id,studentId, firstName, lastName, email, username, password,
          contact1, contact2, address, relation, active)
       VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [guardianCode,
            studentDbId,
            g.firstName,
            g.lastName,
            g.email || null,
            username,
            password,
            g.contact1 || null,
            g.contact2 || null,
            g.address || null,
            g.relation || "Mother"
          ]
        );
      }
    }


    await conn.commit();

    /* ===============================
       RETURN UPDATED DATA
    =============================== */
    const [[student]] = await conn.query(
      "SELECT * FROM student WHERE studentId=?",
      [studentDbId]
    );
    const [guardian] = await conn.query(
      "SELECT * FROM guardian WHERE studentId=?",
      [studentDbId]
    );

    res.status(200).json({
      success: 1,
      message: "Student updated successfully",
      data: {
        student,
        guardian
      },
      info: student,
    });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};



export const bulkAdmission = async (req, res) => {
  const connection = await pool.getConnection();
  const baseUrl = process.env.SERVER_BASE_URL;

  try {
    console.log("=============== BULK ADMISSION START ===============");
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    // --------------------------
    // 1️⃣ Normalize students input
    // --------------------------
    let students = JSON.parse(req.body.students);

    if (!students) throw new AppError("No student data provided", 400);
    if (!Array.isArray(students) || !students.length) {
      throw new AppError("No student data provided", 400);
    }

    const classId = req.body.classId;
    if (!classId) throw new AppError("classId is required", 400);

    // --------------------------
    // 2️⃣ Get sectionId for the class
    // --------------------------
    const [classRows] = await connection.query(
      "SELECT sectionId FROM class WHERE id=?",
      [classId]
    );
    const sectionId = classRows.length ? classRows[0].sectionId : null;

    await connection.beginTransaction();

    // ======================================================
    // 🔐 NEW: Read LAST studentId once and prepare counter
    // ======================================================
    await connection.query(
      "SELECT studentId FROM student ORDER BY studentId DESC LIMIT 1 FOR UPDATE"
    );

    const [lastRow] = await connection.query(
      "SELECT studentId FROM student ORDER BY studentId DESC LIMIT 1"
    );

    let nextNumber = 1;

    if (lastRow.length) {
      const lastStudentId = lastRow[0].studentId;
      const numericPart = lastStudentId.replace(/\D/g, "");
      nextNumber = parseInt(numericPart, 10) + 1;
    }

    const generateNextStudentId = () =>
      `SD${String(nextNumber++).padStart(8, "0")}`;
    // ======================================================

    const createdStudents = [];

    // --------------------------
    // 3️⃣ Process each student
    // --------------------------
    for (let i = 0; i < students.length; i++) {
      const s = students[i];
      console.log(`Processing row ${i + 1}:`, s);

      if (!s.firstName || !s.lastName || !s.gender) {
        throw new AppError(`Row ${i + 2}: Missing required student fields`, 400);
      }
      if (!s.guardian1 || !s.guardian1.firstName || !s.guardian1.lastName) {
        throw new AppError(`Row ${i + 2}: Guardian 1 missing required name`, 400);
      }

      // --------------------------
      // ✅ Generate studentId (SAFE)
      // --------------------------
      const studentId = generateNextStudentId();

      // --------------------------
      // 4️⃣ Handle profile image
      // --------------------------
      let profileImage = null;
      if (req.files?.length > i) {
        const file = req.files[i];
        if (file) {
          profileImage = `${baseUrl}/uploads/students/${file.filename}`;
        }
      }

      // --------------------------
      // 5️⃣ Insert student
      // --------------------------
      const [studentResult] = await connection.query(
        `INSERT INTO student
          (studentId, firstName, lastName, otherName, gender, dateOfBirth, religion, classId, sectionId, categoryId, finaanceCartegory, previousClassId, profileImage)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          studentId,
          s.firstName,
          s.lastName,
          s.otherName || null,
          s.gender,
          s.dateOfBirth || null,
          s.religion || null,
          classId,
          sectionId,
          s.categoryName || null,
          s.financeCategory || null,
          s.previousClassId || null,
          profileImage,
        ]
      );

      // --------------------------
      // 6️⃣ Insert guardians
      // --------------------------
      const guardiansResponse = [];
      const guardiansArray = [s.guardian1];
      if (s.guardian2) guardiansArray.push(s.guardian2);

      for (const g of guardiansArray) {
        if (!g.firstName || !g.lastName) continue;

        const guardianCode = await generateCode();
        const username = generateUsername(g.email, g.firstName, g.lastName);
        const password = generatePassword(g.firstName, g.lastName);

        await connection.query(
          `INSERT INTO guardian
            (id, studentId, firstName, lastName, email, username, password, contact1, contact2, address, relation)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            guardianCode,
            studentId,
            g.firstName,
            g.lastName,
            g.email || null,
            username,
            password,
            g.contact1 || null,
            g.contact2 || null,
            g.address || null,
            g.relation || "Guardian",
          ]
        );

        guardiansResponse.push({
          firstName: g.firstName,
          lastName: g.lastName,
          email: g.email || null,
          username,
          password,
          relation: g.relation || "Guardian",
        });
      }

      // --------------------------
      // 7️⃣ Fetch inserted student
      // --------------------------
      const [studentRow] = await connection.query(
        `SELECT studentId, firstName, lastName, classId, sectionId, profileImage
         FROM student WHERE id=?`,
        [studentResult.insertId]
      );

      createdStudents.push({
        student: studentRow[0],
        guardians: guardiansResponse,
      });
    }

    // --------------------------
    // 8️⃣ Commit transaction
    // --------------------------
    await connection.commit();

    res.status(200).json({
      success: 1,
      message: `${createdStudents.length} students admitted successfully`,
      data: createdStudents,
    });
  } catch (err) {
    await connection.rollback();
    console.error("BULK ADMISSION ERROR:", err);
    res.status(err.statusCode || 500).json({
      success: 0,
      message: err.message || "Bulk admission failed",
    });
  } finally {
    connection.release();
  }
};







/* ============================================================
   DELETE STUDENT
============================================================ */
export const deleteStudent = async (req, res) => {
  const [result] = await pool.query("DELETE FROM student WHERE id=?", [req.params.id]);
  if (!result.affectedRows) throw new AppError("Student not found", 404);

  res.status(200).json({
    success: 1,
    message: "Student deleted successfully",
    info: { id: req.params.id },
  });
};
