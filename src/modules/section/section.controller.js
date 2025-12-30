import pool from "../../config/db.js";
import AppError from "../../utils/AppError.js";
import { generateId } from "../../utils/idGenerator.js";
import { generateColor } from "../../utils/colorGenerator.js";

/* ============================================================
   UNIQUE ID
============================================================ */
const generateUniqueId = async () => {
  let id;
  let exists = true;

  while (exists) {
    id = generateId();
    const [rows] = await pool.query(
      "SELECT id FROM section WHERE id=? LIMIT 1",
      [id]
    );
    exists = rows.length > 0;
  }

  return id;
};

/* ============================================================
   GLOBAL SNAPSHOT
============================================================ */
const fetchAllSections = async () => {
  const [sections] = await pool.query(
    "SELECT * FROM section ORDER BY createdAt DESC"
  );
  return sections; // <-- return array directly
};

/* ============================================================
   CREATE SECTION
   POST /
============================================================ */
export const createSection = async (req, res) => {
  const { classListId, sectionName, createdBy } = req.body;

  if (!classListId || !sectionName) {
    throw new AppError("classListId and sectionName required", 400);
  }

  const [exists] = await pool.query(
    "SELECT id FROM section WHERE classListId=? AND sectionName=?",
    [classListId, sectionName]
  );

  if (exists.length) {
    throw new AppError("Section already exists for this class", 409);
  }

  const id = await generateUniqueId();
  const sectionColor = generateColor();

  await pool.query(
    `INSERT INTO section
     (id, classListId, sectionName, sectionColor, createdBy)
     VALUES (?, ?, ?, ?, ?)`,
    [id, classListId, sectionName, sectionColor, createdBy]
  );

  const data = await fetchAllSections();

  res.status(201).json({
    success: 1,
    message: "Section created successfully",
    info: { id, classListId, sectionName, sectionColor },
    data // now just "sections": []
  });
};

/* ============================================================
   GET ALL SECTIONS
   GET /
============================================================ */
export const getAllSections = async (req, res) => {
  const data = await fetchAllSections();

  res.status(200).json({
    success: 1,
    message: "All sections fetched",
    info: null,
    data
  });
};

/* ============================================================
   GET SECTIONS BY CLASSLIST
   GET /by-classlist/:classListId
============================================================ */
export const getSectionsByClassList = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM section WHERE classListId=? ORDER BY createdAt DESC",
    [req.params.classListId]
  );

  const data = await fetchAllSections();

  res.status(200).json({
    success: 1,
    message: "Sections fetched by class list",
    info: rows,
    data
  });
};

/* ============================================================
   UPDATE SECTION
   PATCH /:id
============================================================ */
export const updateSection = async (req, res) => {
  const { sectionName } = req.body;

  if (!sectionName) {
    throw new AppError("sectionName required", 400);
  }

  const [result] = await pool.query(
    "UPDATE section SET sectionName=? WHERE id=?",
    [sectionName, req.params.id]
  );
   const [result1] = await pool.query(
    "UPDATE class SET sectionName=? WHERE sectionId=?",
    [sectionName, req.params.id]
  );
  if (!result.affectedRows) {
    throw new AppError("Section not found", 404);
  }

  const data = await fetchAllSections();

  res.status(200).json({
    success: 1,
    message: "Section updated successfully",
    info: { id: req.params.id, sectionName },
    data
  });
};

/* ============================================================
   DELETE SECTION
   DELETE /:id
============================================================ */
export const deleteSection = async (req, res) => {
  const [result] = await pool.query(
    "DELETE FROM section WHERE id=?",
    [req.params.id]
  );

  if (!result.affectedRows) {
    throw new AppError("Section not found", 404);
  }

  const data = await fetchAllSections();

  res.status(200).json({
    success: 1,
    message: "Section deleted successfully",
    info: { id: req.params.id },
    data
  });
};
