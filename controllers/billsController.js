const billsModel = require("../models/billsModel");

//add items
const addBillsController = async (req, res) => {
  try {
    const newBill = new billsModel(req.body);
    await newBill.save();
    res.send("Bill Created Successfully!");
  } catch (error) {
    res.send("something went wrong");
    console.log(error);
  }
};

//get blls data
const getBillsController = async (req, res) => {
  try {
    const bills = await billsModel.find();
    res.send(bills);
  } catch (error) {
    console.log(error);
  }
};
const deleteBillsController = async (req, res) => {
  try {
    const deletedBill = await billsModel.findByIdAndDelete(req.params.id);
    res.send({
      message: "bill deleted successfully",
      deletedBill,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.addBillsController = addBillsController;
module.exports.getBillsController = getBillsController;
module.exports.deleteBillsController = deleteBillsController;
