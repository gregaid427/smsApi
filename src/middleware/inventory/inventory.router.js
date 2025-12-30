const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createInventory,
  createInventoryCartegory,
  truncateTable,
  getInventoryById,
  getAllInventory,
  updateInventory,
  // updateInventorystatus,
  updateInventorycartegory,
  deleteSingleInventory,
  addstockInventory,
  getstockInventory,
  getCart,
  deleteSingleInventorystock,
  deleteSingleCartstock


} = require("./inventory.controller");




router.get("/",  getAllInventory);
router.get("/cart",  getCart);
router.post("/cart",  createInventoryCartegory);
router.post("/addstock",  addstockInventory);
router.get("/getstock",  getstockInventory);


router.post("/editcartegory",  updateInventorycartegory);
router.post("/",  createInventory);


router.delete("/truncate",  truncateTable);

router.get("/:Inventory_id",  getInventoryById);
router.patch("/item",  updateInventory);
// router.patch("/status/:Inventory_id",  updateInventorystatus);
router.delete("/cartegory/:id",  deleteSingleCartstock);

router.delete("/:id",  deleteSingleInventory);
router.post("/stock/delete",  deleteSingleInventorystock);


module.exports = router;
