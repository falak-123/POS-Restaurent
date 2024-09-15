const express = require("express");
const {
  itemController,
  addItemController,
  deleteItemController,
  editItemController,
  itemImageController,
} = require("../controllers/itemController");
const formidable = require("express-formidable");

const router = express.Router();

router.get("/get-items", itemController);
router.post("/add-item", formidable(), addItemController);
router.delete("/delete-item/:id", deleteItemController);
router.put("/edit-item/:id", formidable(), editItemController);
router.get("/item-image/:id", itemImageController);

module.exports = router;
