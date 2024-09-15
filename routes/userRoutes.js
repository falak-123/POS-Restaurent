const express = require("express");
const {
  loginController,
  registerController,
  searchUserController,
} = require("../controllers/userController");

const router = express.Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.get("/search-user/:id", searchUserController);

module.exports = router;
