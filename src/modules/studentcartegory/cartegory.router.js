import express from "express";
import {
  createStudentCategory,
  getAllStudentCategories,
  updateStudentCategory,
  deleteStudentCategory,
  seedStudentCategory
} from "./cartegory.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = express.Router();


router.patch("/:id", asyncHandler(updateStudentCategory));
router.delete("/:id", asyncHandler(deleteStudentCategory));
router.delete("/seed", asyncHandler(seedStudentCategory));
router.post("/", asyncHandler(createStudentCategory));
router.get("/", asyncHandler(getAllStudentCategories));
export default router;


