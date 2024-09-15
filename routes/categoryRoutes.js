const express = require("express");
const {
  createCategory,
  allCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.post("/create-category", createCategory);
router.get("/get-categories", allCategory);
router.put("/update-category/:id", updateCategory);
router.delete("/delete-category/:id", deleteCategory);
// router.get("/get-single-category/:slug",singleCategory)

module.exports = router;
