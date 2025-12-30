import pool from "../../config/db.js";
import AppError from "../../utils/AppError.js";
import { generateId } from "../../utils/idGenerator.js";

/* ============================================================
   UNIQUE ID
============================================================ */
const generateUniqueId = async () => {
  let id;
  let exists = true;

  while (exists) {
    id = generateId();
    const [rows] = await pool.query(
      "SELECT id FROM studentCategory WHERE id=? LIMIT 1",
      [id]
    );
    exists = rows.length > 0;
  }

  return id;
};

/* ============================================================
   GLOBAL SNAPSHOT
============================================================ */
const fetchAllCategories = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM studentCategory ORDER BY createdAt DESC"
  );
  return rows;
};

/* ============================================================
   CREATE CATEGORY
   POST /
============================================================ */
export const createStudentCategory = async (req, res) => {
  const { categoryName, description, createdBy } = req.body;

  if (!categoryName) {
    throw new AppError("categoryName is required", 400);
  }

  const [exists] = await pool.query(
    "SELECT id FROM studentCategory WHERE categoryName=?",
    [categoryName]
  );

  if (exists.length) {
    throw new AppError("Student category already exists", 409);
  }

  const id = await generateUniqueId();

  await pool.query(
    `INSERT INTO studentCategory
     (id, categoryName, description, createdBy)
     VALUES (?, ?, ?, ?)`,
    [id, categoryName, description, createdBy]
  );

  const data = await fetchAllCategories();

  res.status(201).json({
    success: 1,
    message: "Student category created successfully",
    info: { id, categoryName },
    data
  });
};

/* ============================================================
   GET ALL CATEGORIES
   GET /
============================================================ */
export const getAllStudentCategories = async (req, res) => {
  const data = await fetchAllCategories();

  res.status(200).json({
    success: 1,
    message: "Student categories fetched",
    info: null,
    data
  });
};

/* ============================================================
   UPDATE CATEGORY
   PATCH /:id
============================================================ */
export const updateStudentCategory = async (req, res) => {
  const { categoryName, description, isActive } = req.body;

  if (!categoryName) {
    throw new AppError("categoryName is required", 400);
  }

  const [result] = await pool.query(
    `UPDATE studentCategory
     SET categoryName=?, description=?, isActive=?
     WHERE id=?`,
    [categoryName, description, isActive, req.params.id]
  );

  if (!result.affectedRows) {
    throw new AppError("Student category not found", 404);
  }

  const data = await fetchAllCategories();

  res.status(200).json({
    success: 1,
    message: "Student category updated successfully",
    info: { id: req.params.id, categoryName },
    data
  });
};

/* ============================================================
   DELETE CATEGORY
   DELETE /:id
============================================================ */
export const deleteStudentCategory = async (req, res) => {
  const [result] = await pool.query(
    "DELETE FROM studentCategory WHERE id=?",
    [req.params.id]
  );

  if (!result.affectedRows) {
    throw new AppError("Student category not found", 404);
  }

  const data = await fetchAllCategories();

  res.status(200).json({
    success: 1,
    message: "Student category deleted successfully",
    info: { id: req.params.id },
    data
  });
};

export const seedStudentCategory = async () => {
  const categoryName = "GENERAL";

  const [exists] = await pool.query(
    "SELECT id FROM studentCategory WHERE categoryName=? LIMIT 1",
    [categoryName]
  );

  if (exists.length) {
    console.log("Student category GENERAL already exists");
    return;
  }

  const id = generateId();

  await pool.query(
    `INSERT INTO studentCategory
     (id, categoryName, description, createdBy)
     VALUES (?, ?, ?, ?)`,
    [id, categoryName, "Default system category", "SYSTEM"]
  );

  console.log("Student category GENERAL seeded successfully");
};

