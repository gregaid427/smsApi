import express from "express";
import {
  createSubject,
  getAllSubjects,
  updateSubject,
  deleteSubject,
} from "./subject.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = express.Router();

router.post("/", asyncHandler(createSubject));
router.get("/", asyncHandler(getAllSubjects));
router.patch("/:id", asyncHandler(updateSubject));
router.delete("/:id", asyncHandler(deleteSubject));

export default router;
