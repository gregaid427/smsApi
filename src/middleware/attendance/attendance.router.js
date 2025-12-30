const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createattendance, 
  deleteSinglesession,
  getdaterecords,
  sessionrecords,
  getdetail,deleteAllAttendance,
  UpdateStatus,
  gettodayrecord

} = require("./attendance.controller");

router.post("/sessionrecords",  sessionrecords); 
router.post("/createattendance",  createattendance);
router.post("/getdetail",  getdetail);
router.post("/gettodayrecord",  gettodayrecord);
router.post("/daterecords", getdaterecords );
router.post("/updatestatus",  UpdateStatus);
router.delete("/single/:id",  deleteSinglesession);

router.delete("/",  deleteAllAttendance);

module.exports = router;
