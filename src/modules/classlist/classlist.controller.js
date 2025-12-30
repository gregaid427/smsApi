import pool from "../../config/db.js";
import AppError from "../../utils/AppError.js";
import { generateId } from "../../utils/idGenerator.js";
import { generateColor } from "../../utils/colorGenerator.js";

/* ============================================================
   HELPER: GENERATE UNIQUE 6-CHAR ID
============================================================ */
const generateUniqueId = async () => {
  let id;
  let exists = true;

  while (exists) {
    id = generateId();
    const [rows] = await pool.query(
      "SELECT id FROM classList WHERE id=? LIMIT 1",
      [id]
    );
    exists = rows.length > 0;
  }

  return id;
};

/* ============================================================
   FETCH ALL CLASSLISTS (GLOBAL SNAPSHOT)
============================================================ */
const fetchAllClassLists = async () => {
  const [classLists] = await pool.query(
    "SELECT * FROM classList ORDER BY createdAt DESC"
  );
  return classLists; // <-- just the array for "data"
};

/* ============================================================
   CREATE CLASS LIST
   POST /
============================================================ */
export const createClassList = async (req, res) => {
  const { className, createdBy } = req.body;

  if (!className) {
    throw new AppError("className required", 400);
  }

  const [existing] = await pool.query(
    "SELECT * FROM classList WHERE className=?",
    [className]
  );

  if (existing.length > 0) {
    throw new AppError("Class already exists", 409);
  }

  const id = await generateUniqueId();
  const classColor = generateColor();

  await pool.query(
    `INSERT INTO classList (id, className, classColor, createdBy)
     VALUES (?, ?, ?, ?)`,
    [id, className, classColor, createdBy]
  );

  const data = await fetchAllClassLists();

  res.status(201).json({
    success: 1,
    message: "Class created successfully",
    info: { id, className, classColor },
    data
  });
};

/* ============================================================
   GET ALL CLASS LISTS
   GET /
============================================================ */
export const getAllClassList = async (req, res) => {
  const data = await fetchAllClassLists();

  res.status(200).json({
    success: 1,
    message: "All class lists fetched",
    info: null,
    data
  });
};

/* ============================================================
   GET SINGLE CLASS LIST
   GET /:id
============================================================ */
export const getClassListById = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM classList WHERE id=?",
    [req.params.id]
  );

  if (!rows.length) {
    throw new AppError("Class not found", 404);
  }

  const data = await fetchAllClassLists();

  res.status(200).json({
    success: 1,
    message: "Class fetched",
    info: rows[0],
    data
  });
};

/* ============================================================
   UPDATE CLASS LIST
   PATCH /:id
============================================================ */
export const updateClassList = async (req, res) => {
  const { className } = req.body;

  if (!className) {
    throw new AppError("className required", 400);
  }

  const [result] = await pool.query(
    "UPDATE classList SET className=? WHERE id=?",
    [className, req.params.id]
  );

  if (result.affectedRows === 0) {
    throw new AppError("Class not found", 404);
  }

  const data = await fetchAllClassLists();

  res.status(200).json({
    success: 1,
    message: "Class updated successfully",
    info: { id: req.params.id, className },
    data
  });
};

/* ============================================================
   DELETE CLASS LIST
   DELETE /:id
============================================================ */
export const deleteClassList = async (req, res) => {
  const [result] = await pool.query(
    "DELETE FROM classList WHERE id=?",
    [req.params.id]
  );

  if (result.affectedRows === 0) {
    throw new AppError("Class not found", 404);
  }

  const data = await fetchAllClassLists();

  res.status(200).json({
    success: 1,
    message: "Class deleted successfully",
    info: { id: req.params.id },
    data
  });
};
