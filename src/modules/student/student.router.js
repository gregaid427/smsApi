import express from "express";
import {
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
} from "./student.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { upload } from "../../utils/upload.js";

const router = express.Router();

/* ============================================================
   CREATE STUDENT
   POST /students
============================================================ */
router.post("/", upload.any(), asyncHandler(createStudent));
/* ============================================================
   GET SINGLE STUDENT
   GET /students/:id
============================================================ */
router.get("/:id", asyncHandler(getStudent));

/* ============================================================
   UPDATE STUDENT
   PATCH /students/:id
============================================================ */
router.patch("/:id", asyncHandler(updateStudent));

/* ============================================================
   DELETE STUDENT
   DELETE /students/:id
============================================================ */
router.delete("/:id", asyncHandler(deleteStudent));

export default router;
