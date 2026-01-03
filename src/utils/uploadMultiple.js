import multer from "multer";
import path from "path";
import fs from "fs";

// ==========================
// Ensure upload directory exists
// ==========================
const uploadDir = path.join(process.cwd(), "uploads", "students");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ==========================
// Multer storage
// ==========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `student_${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

// ==========================
// Base upload object
// ==========================
const upload = multer({ storage });

// ==========================
// Multiple files middleware
// ==========================
export const uploadMultiple = upload.fields([
  { name: "profileImages", maxCount: 10000 }, // for bulk admission
]);
