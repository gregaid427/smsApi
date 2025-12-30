import pool from "../../config/db.js";
import AppError from "../../utils/AppError.js";
import { generateId } from "../../utils/idGenerator.js";

/* ============================================================
   HELPERS
============================================================ */
const generateUniqueId = async (column) => {
  let id;
  let exists = true;

  while (exists) {
    id = generateId(true); // hex
    const [rows] = await pool.query(
      `SELECT ${column} FROM class WHERE ${column}=? LIMIT 1`,
      [id]
    );
    exists = rows.length > 0;
  }

  return id;
};

/* ============================================================
   GLOBAL SNAPSHOT
============================================================ */
const fetchClassInfo = async () => {
const [classes] = await pool.query(
  "SELECT * FROM class ORDER BY sortOrder ASC, createdAt DESC"
);


  // const [sections] = await pool.query(
  //   "SELECT * FROM section ORDER BY createdAt DESC"
  // );

  // const [classLists] = await pool.query(
  //   "SELECT * FROM classList ORDER BY createdAt DESC"
  // );
console.log(classes)
  return  classes;
};

/* ============================================================
   CREATE CLASS (TRANSACTIONAL)
   POST /
============================================================ */
export const createClass = async (req, res) => {
  const { classListId, sections, instructor, createdBy } = req.body;

  if (!classListId || !sections || !Array.isArray(sections) || sections.length === 0) {
    throw new AppError("classListId and sections array are required", 400);
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Fetch the single classList
    const [classListRows] = await conn.query(
      "SELECT * FROM classList WHERE id=?",
      [classListId]
    );
    const classList = classListRows[0];
    if (!classList) throw new AppError("ClassList not found", 404);

    // Ensure classGroupId exists for this classList
    let classGroupId = classListId;
    if (!classGroupId) {
      classGroupId = await generateUniqueId("classGroupId");
      await conn.query(
        "UPDATE classList SET classGroupId=? WHERE id=?",
        [classGroupId, classListId]
      );
    }

    const createdClasses = [];

    for (let sectionId of sections) {
      // Check for duplicate class + section
      const [duplicateRows] = await conn.query(
        "SELECT id FROM class WHERE classListId=? AND sectionId=? LIMIT 1",
        [classListId, sectionId]
      );
      if (duplicateRows.length) continue; // skip duplicates

      // Fetch section details
      const [sectionRows] = await conn.query(
        "SELECT * FROM section WHERE id=? ",
        [sectionId]
      );
      const section = sectionRows[0];
      if (!section) throw new AppError(`Section not found for this class: ${sectionId}`, 404);

      // Generate unique class ID
      const classId = await generateUniqueId("id");

      // Insert new class
      await conn.query(
        `INSERT INTO class (
          id,
          classGroupId,
          classListId,
          className,
          sectionId,
          sectionName,
          classColor,
          sectionColor,
          instructor,
          createdBy
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          classId,
          classGroupId,
          classList.id,
          classList.className,
          section.id,
          section.sectionName,
          classList.classColor,
          section.sectionColor,
          instructor,
          createdBy
        ]
      );

      createdClasses.push({
        id: classId,
        classGroupId,
        classListId: classList.id,
        className: classList.className,
        sectionId: section.id,
        sectionName: section.sectionName,
        instructor,
      });
    }

    await conn.commit();

    // Fetch updated class info (optional helper)
    const data = await fetchClassInfo();

    res.status(200).json({
      success: 1,
      message: "Classes created successfully",
      info: createdClasses,
      data,
    });
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};


/* ============================================================
   REORDER CLASSES
   PUT /reorder
============================================================ */
export const reorderClasses = async (req, res) => {
  const { items } = req.body;

  /* ================= VALIDATION ================= */
  if (
    !items ||
    !Array.isArray(items) ||
    items.length === 0 ||
    !items.every(
      (i) =>
        typeof i.id === "string" &&
        typeof i.order === "number"
    )
  ) {
    throw new AppError("Invalid reorder payload", 400);
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    for (const item of items) {
      await conn.query(
        `UPDATE class SET sortOrder=? WHERE id=?`,
        [item.order, item.id]
      );
    }

    await conn.commit();

    const [rows] = await pool.query(
      "SELECT * FROM class ORDER BY sortOrder ASC, createdAt DESC"
    );

    res.status(200).json({
      success: 1,
      message: "Classes reordered successfully",
      info: null,
      data: rows,
    });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};


/* ============================================================
   GET ALL CLASSES
   GET /
============================================================ */
export const getAllClasses = async (req, res) => {
  const data = await fetchClassInfo();
console.log(data)
  res.status(200).json({
    success: 1,
    message: "All classes fetched",
    info: null,
    data
  });
};

/* ============================================================
   GET CLASS BY ID
   GET /:id
============================================================ */
export const getClassById = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM class WHERE id=?",
    [req.params.id]
  );

  if (!rows.length) {
    throw new AppError("Class not found", 404);
  }

  const data = await fetchClassInfo();

  res.status(200).json({
    success: 1,
    message: "Class fetched",
    info: rows[0],
    data
  });
};

/* ============================================================
   GET CLASSES BY CLASSLIST
   GET /by-classlist/:classListId
============================================================ */
export const getClassByClassList = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM class WHERE classListId=? ORDER BY sectionName",
    [req.params.classListId]
  );

  const data = await fetchClassInfo();

  res.status(200).json({
    success: 1,
    message: "Classes fetched by class list",
    info: rows,
    data
  });
};

/* ============================================================
   GET CLASSES WITH SECTIONS
   GET /with-sections
============================================================ */
export const getClassWithSections = async (req, res) => {
  const [rows] = await pool.query(`
    SELECT
      classGroupId,
      classListId,
      className,
      classColor,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'classId', id,
          'sectionId', sectionId,
          'sectionName', sectionName,
          'sectionColor', sectionColor,
          'instructor', instructor
        )
      ) AS sections
    FROM class
    GROUP BY classGroupId, classListId, className, classColor
  `);

  const data = await fetchClassInfo();

  res.status(200).json({
    success: 1,
    message: "Classes with sections fetched",
    info: rows,
    data
  });
};

/* ============================================================
   DELETE CLASS
   DELETE /:id
============================================================ */
export const deleteClass = async (req, res) => {
  const [result] = await pool.query(
    "DELETE FROM class WHERE id=?",
    [req.params.id]
  );

  if (!result.affectedRows) {
    throw new AppError("Class not found", 404);
  }

  const data = await fetchClassInfo();

  res.status(200).json({
    success: 1,
    message: "Class deleted successfully",
    info: { id: req.params.id },
    data
  });
};
