const express = require("express");
const {
  addBillsController,
  getBillsController,
  deleteBillsController,
} = require("./../controllers/billsController");

const router = express.Router();

router.post("/add-bills", addBillsController);

router.get("/get-bills", getBillsController);
router.delete("/delete-bill/:id", deleteBillsController);

module.exports = router;
