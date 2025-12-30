const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createsession,
  getsessionById,
  getAllsession,
  updatesession,
  updatesessionStatus,
  deleteAllsession,
  deleteSinglesession,
  getActivesession,
  backup,
  getbackup,
  getbackupfile,
  updatebackup,
  backupdelete

} = require("./session.controller");
router.get("/active",  getActivesession);
// router.post("/backupfile",  getbackupfile);

router.post("/backup",  backup);
router.post("/updatebackup",  updatebackup);

router.post("/backupdelete",  backupdelete);

router.get("/backup",  getbackup);
router.post("/status/",  updatesessionStatus); 
router.post("/create",  createsession);
router.get("/fetch",  getAllsession);

router.get("/:id", getsessionById );
router.patch("/",  updatesession);
router.post("/single",  deleteSinglesession);

router.delete("/",  deleteAllsession);





module.exports = router;
