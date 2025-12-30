const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {

 
  setStudentPicture,
  createSchoolInfo,
} = require("./setting.controller");


router.post("/school",  createSchoolInfo);
router.post("/picture",  setStudentPicture);
// router.get("/",  getUsers);
// router.post("/guardian",  createUserGuardian);
// router.post("/staff",  createUserStaff);
// router.post("/",  createUserStudent);



module.exports = router;
