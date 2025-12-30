import express from "express";
import {
  createSection,
  getAllSections,
  getSectionsByClassList,
  updateSection,
  deleteSection,
} from "./section.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = express.Router();

router.post("/", asyncHandler(createSection));
router.get("/", asyncHandler(getAllSections));
router.get("/class/:classListId", asyncHandler(getSectionsByClassList));
router.patch("/:id", asyncHandler(updateSection));
router.delete("/:id", asyncHandler(deleteSection));

export default router;
