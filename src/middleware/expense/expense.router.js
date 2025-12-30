const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createExpense,
  createExpenseHead,
  getExpenseById,
  getallexpense,
  getallexpensehead,
  updateExpense,
  updateExpensestatus,
  deleteallexpense,
  getcustomexpense,
  truncateTable,
  deleteSingleExpense,
  deleteSingleExpenseHead,
  updateExpenseHead

} = require("./expense.controller");


router.get("/head",  getallexpensehead);
router.post("/custom",  getcustomexpense);
router.post("/update",  updateExpense);

router.get("/",  getallexpense);
router.post("/head",  createExpenseHead);
router.patch("/updatehead",  updateExpenseHead);

router.post("/",  createExpense);
router.get("/:expense_id",  getExpenseById);
// router.post("/resetPassword",  resetPassword);
router.patch("/status/:expense_id",  updateExpensestatus);
router.delete("/truncate",  truncateTable);
router.delete("/head/:id",  deleteSingleExpenseHead);
router.delete("/:id", checkToken ,deleteSingleExpense);

router.delete("/",  deleteallexpense);


module.exports = router;
