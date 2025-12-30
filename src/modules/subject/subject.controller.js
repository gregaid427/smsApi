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
      "SELECT id FROM subject WHERE id=? LIMIT 1",
      [id]
    );
    exists = rows.length > 0;
  }

  return id;
};

/* ============================================================
   GLOBAL SNAPSHOT
============================================================ */
const fetchAllSubjects = async () => {
  const [subjects] = await pool.query(
    "SELECT * FROM subject ORDER BY createdAt DESC"
  );
  return subjects;
};

/* ============================================================
   CREATE SUBJECT
   POST /
============================================================ */
export const createSubject = async (req, res) => {
  const { subjectName, createdBy } = req.body;

  if (!subjectName) {
    throw new AppError("subjectName is required", 400);
  }

  const [exists] = await pool.query(
    "SELECT id FROM subject WHERE subjectName=?",
    [subjectName]
  );

  if (exists.length) {
    throw new AppError("Subject already exists", 409);
  }

  const id = await generateUniqueId();
  const subjectColor = generateColor();

  await pool.query(
    `INSERT INTO subject
     (id, subjectName, subjectColor, createdBy)
     VALUES (?, ?, ?, ?)`,
    [id, subjectName, subjectColor, createdBy]
  );

  const data = await fetchAllSubjects();

  res.status(201).json({
    success: 1,
    message: "Subject created successfully",
    info: { id, subjectName, subjectColor },
    data
  });
};

/* ============================================================
   GET ALL SUBJECTS
   GET /
============================================================ */
export const getAllSubjects = async (req, res) => {
  const data = await fetchAllSubjects();

  res.status(200).json({
    success: 1,
    message: "All subjects fetched",
    info: null,
    data
  });
};

/* ============================================================
   UPDATE SUBJECT
   PATCH /:id
============================================================ */
export const updateSubject = async (req, res) => {
  const { subjectName } = req.body;

  if (!subjectName) {
    throw new AppError("subjectName is required", 400);
  }

  const [result] = await pool.query(
    "UPDATE subject SET subjectName=? WHERE id=?",
    [subjectName, req.params.id]
  );

  if (!result.affectedRows) {
    throw new AppError("Subject not found", 404);
  }

 
  const data = await fetchAllSubjects();

  res.status(200).json({
    success: 1,
    message: "Subject updated successfully",
    info: { id: req.params.id, subjectName },
    data
  });
};

/* ============================================================
   DELETE SUBJECT
   DELETE /:id
============================================================ */
export const deleteSubject = async (req, res) => {
  const [result] = await pool.query(
    "DELETE FROM subject WHERE id=?",
    [req.params.id]
  );

  if (!result.affectedRows) {
    throw new AppError("Subject not found", 404);
  }

  const data = await fetchAllSubjects();

  res.status(200).json({
    success: 1,
    message: "Subject deleted successfully",
    info: { id: req.params.id },
    data
  });
};
