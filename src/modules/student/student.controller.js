import pool from "../../config/db.js";
import AppError from "../../utils/AppError.js";
import path from "path";
import fs from "fs";

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

  return `SD${year}${String(nextNumber).padStart(4, "0")}`;
};

/* ============================================================
   HELPER: Generate Guardian Username
============================================================ */
const generateUsername = (email, firstName, lastName) => {
  if (email) return email.split("@")[0];
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
    let finaanceCartegory = null;

    if (finance) {
      try {
        financeData = typeof finance === "string" ? JSON.parse(finance) : finance;
        finaanceCartegory = financeData?.financeCategoryId || null;
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
// Handle profile image (diskStorage)
// ==============================
let profileImage = null;

const file =
  req.file ||
  (Array.isArray(req.files) && req.files.length > 0 ? req.files[0] : null);

if (file) {
  // multer already saved the file
  // store relative URL in DB
  profileImage = `/uploads/students/${file.filename}`;
}



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
        finaanceCartegory,
        previousClassId || null,
        profileImage,
      ]
    );

    const [student] = await connection.query(
      "SELECT * FROM student WHERE id=?",
      [result.insertId]
    );

    // ==============================
    // Insert guardians
    // ==============================
    const createdGuardians = [];

    for (const g of guardiansArray) {
      if (!g.firstName || !g.lastName) continue;

      const username = generateUsername(g.email, g.firstName, g.lastName);
      const password = generatePassword(g.firstName, g.lastName);

      const [guardianResult] = await connection.query(
        `INSERT INTO guardian
          (
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
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
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

      const [created] = await connection.query(
        `SELECT id, firstName, lastName, username, email, relation
         FROM guardian WHERE id=?`,
        [guardianResult.insertId]
      );

      createdGuardians.push(created[0]);
    }

    // ==============================
    // Commit transaction
    // ==============================
    await connection.commit();

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
  const {
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
    profileImage,
    status,
    isActive,
  } = req.body;

  const [result] = await pool.query(
    `UPDATE student SET 
      firstName=?, lastName=?, otherName=?, gender=?, dateOfBirth=?, religion=?, 
      classId=?, sectionId=?, categoryId=?, finaanceCartegory=?, previousClassId=?, 
      profileImage=?, status=?, isActive=?
     WHERE id=?`,
    [
      firstName,
      lastName,
      otherName || null,
      gender || null,
      dateOfBirth || null,
      religion || null,
      classId || null,
      sectionId || null,
      categoryId || null,
      finaanceCartegory || null,
      previousClassId || null,
      profileImage || null,
      status || "CURRENT",
      isActive !== undefined ? isActive : 1,
      req.params.id,
    ]
  );

  if (!result.affectedRows) throw new AppError("Student not found", 404);

  const [student] = await pool.query("SELECT * FROM student WHERE id=?", [req.params.id]);

  res.status(200).json({
    success: 1,
    message: "Student updated successfully",
    info: student[0],
  });
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
