import express from "express";
import cors from "cors";
import path from "path";
import requestLogger from "./utils/requestLogger.js";

//import { fileURLToPath } from "url";

import classListRouter  from "./modules/classlist/classlist.router.js";
import sectionRouter  from "./modules/section/section.router.js";
import classRouter  from "./modules/class/class.router.js";
import StudentRouter  from "./modules/student/student.router.js";

import subjectRouter  from "./modules/subject/subject.router.js";
import studentCartegoryRouter  from "./modules/studentcartegory/cartegory.router.js";



import auth  from "./modules/auth/auth.router.js";


import errorHandler from "./middleware/errorHandler.js"; // FIXED

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

//global.__basedir = __dirname;

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(requestLogger);



// Catch unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION at:", promise, "reason:", reason);
});

// Catch uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});






app.use("/api/auth", auth );

app.use("/api/classlist", classListRouter );
app.use("/api/section", sectionRouter);
app.use("/api/class", classRouter);
app.use("/api/students", StudentRouter);
app.use("/api/subject", subjectRouter);
app.use("/api/student-category", studentCartegoryRouter);



// must be LAST
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`YES API running on port ${PORT}`);
});

export default app;
