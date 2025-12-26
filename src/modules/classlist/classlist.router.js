import express from "express";
import { protect } from "../../middleware/protect.js";

import {
  createClassList,
  getAllClassList,
  getClassListById,
  updateClassList,
  deleteClassList,
} from "./classlist.controller.js";

import { asyncHandler } from "../../utils/asyncHandler.js";

const router = express.Router();

router.post("/", asyncHandler(createClassList));
router.get("/", asyncHandler(getAllClassList));  
router.get("/:id", asyncHandler(getClassListById));
router.patch("/:id", asyncHandler(updateClassList));
router.delete("/:id", asyncHandler(deleteClassList));

export default router;


//<--- protect the route
router.get("/",protect, asyncHandler(getAllClassList));  
