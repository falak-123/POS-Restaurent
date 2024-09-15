const userModel = require("../models/userModel");

const loginController = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await userModel.findOne({ userId });

    if (user.password === password) {
      return res.status(201).send({
        success: true,
        message: "user Logged in",
        user,
      });
    }
    res.status.send({
      success: false,
      message: "Wrong credentials",
    });
  } catch (error) {
    res.status(401).send("Error in register controller");
  }
};

const registerController = async (req, res) => {
  try {
    const { name, userId, password } = req.body;
    const user = await userModel.findOne({ userId });
    if (user) {
      return res.send({
        success: false,
        message: "user already exist with this ID",
        user,
      });
    }
    const newUser = new userModel({
      name,
      userId,
      password,
    }).save();

    res.status(201).send({
      success: true,
      message: "user added successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(401).send("Error in register controller");
  }
};

const searchUserController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.params.id });

    res.status(201).send({
      success: true,
      message: "User Profile",
      user,
    });
  } catch (error) {
    res.status(401).send("Error in register controller");
  }
};

module.exports.loginController = loginController;
module.exports.registerController = registerController;
module.exports.searchUserController = searchUserController;
