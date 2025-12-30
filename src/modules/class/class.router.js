import express from "express";
import {
  createClass,
  getAllClasses,
  getClassById,
  getClassByClassList,
  getClassWithSections,
  deleteClass,
  reorderClasses
} from "./class.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = express.Router();

/* =======================
   CLASS (DERIVED ENTITY)
======================= */

router.patch("/reorder", asyncHandler(reorderClasses));
router.post("/", asyncHandler(createClass));

router.get("/", asyncHandler(getAllClasses));

router.get("/:id", asyncHandler(getClassById));

router.get(
  "/by-classlist/:classListId",
  asyncHandler(getClassByClassList)
);

router.get(
  "/with-sections",
  asyncHandler(getClassWithSections)
);

router.delete("/:id", asyncHandler(deleteClass));

export default router;
