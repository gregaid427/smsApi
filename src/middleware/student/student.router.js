const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  getstudent,
  getstudentbiodata,
  updatestudent,
  getstudentbyClass,
  getstudentbyClassCustom,
  deleteStudentsingle,
  truncateTable,
  setstudentwaiting,
  allpromote,
  setStudentLogo,
  selectedpromote,
  getstudentbyClassCustomPromote,
  getstudentbyClassPromote,
  getstudentbyClassCustomBal,
  getstudentbyClassbal,
  bulkAdmission,
  getgraduated,
  delgraduated,
  graduatesingledel,
  getstudentcustom, updatefeecart, getCart, createstudentCartegory, deleteSingleStudentCart,
  getdeletedstudent,
  delalldeletedstudent,
  deldeletedstudent,
  getstudentbyClass2,
  getstudentbyClassCustom3,
  globalsearch,
  getdetails,
  movestudent
} = require("./student.controller");


router.get("/", getstudent);
router.post("/custom1", getstudentbyClassCustom);
router.post("/custom3", getstudentbyClassCustom3);
router.post("/globalsearch", globalsearch);


router.post("/custom", getstudentbyClass);
router.post("/custom2", getstudentbyClass2);


router.post("/custom1account", getstudentbyClassCustomBal);
router.post("/customaccount", getstudentbyClassbal);
router.post("/studentcustom", getstudentcustom);
router.post("/movestudent", movestudent);

router.post("/custom1promote", getstudentbyClassCustomPromote);
router.post("/customPromote", getstudentbyClassPromote);
router.get("/single/:student_id", getstudentbiodata);
router.post("/delete", deleteStudentsingle);
router.post("/waiting", setstudentwaiting);
router.post("/allpromote", allpromote);
router.post("/selectedpromote", selectedpromote);
router.post("/studentlogo", setStudentLogo);
router.post("/bulkAdmission", bulkAdmission);
router.post("/graduatesingledel", graduatesingledel);


router.post("/delStudentCart", deleteSingleStudentCart);
router.post("/createstudentcart", createstudentCartegory);
router.get("/getcart", getCart);
router.get("/graduated", getgraduated);
router.get("/deletedstudent", getdeletedstudent);
router.post("/getdetails", getdetails);


router.delete("/delgraduated", delgraduated);
router.post("/deldeletedstudent", deldeletedstudent);
router.delete("/delalldeletedstudent", delalldeletedstudent);



router.post("/updatestudentcart", updatefeecart);



router.patch("/", updatestudent);

router.delete("/truncate", truncateTable);


module.exports = router;
