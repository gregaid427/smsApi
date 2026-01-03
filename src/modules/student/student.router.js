import express from "express";
import {
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  searchStudents,
  getStudentRelatedInfo,
  bulkAdmission,
} from "./student.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { upload } from "../../utils/upload.js";
import { uploadMultiple } from "../../utils/uploadMultiple.js";

const router = express.Router();

router.get(
  "/relatedinfo/:studentId",
  getStudentRelatedInfo
);

/* ============================================================
   GET SINGLE STUDENT
   GET /students/:id
============================================================ */
router.get("/:id", asyncHandler(getStudent));

/* ============================================================
   UPDATE STUDENT
   PATCH /students/:id
============================================================ */
router.patch("/:id", upload.single("profileImage"), asyncHandler(updateStudent));

router.post("/bulk-admission", upload.array("profileImages"), asyncHandler(bulkAdmission));

/* ============================================================
   DELETE STUDENT
   DELETE /students/:id
============================================================ */
router.delete("/:id", asyncHandler(deleteStudent));

router.post("/search", searchStudents);

/* ============================================================
   CREATE STUDENT
   POST /students
============================================================ */
router.post("/", upload.any(), asyncHandler(createStudent));
export default router;
