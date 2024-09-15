const categorymodel = require("../models/categoryModel");

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(200).send({
        message: "name is required",
      });
    }
    const alreadyExist = await categorymodel.findOne({ name });
    if (alreadyExist) {
      return res.send({
        success: false,
        message: "Category Already Exist",
      });
    }

    const createdCategory = await new categorymodel({
      name,
    }).save();

    if (createdCategory) {
      return res.send({
        success: true,
        message: "Category Added Successfully",
      });
    }
  } catch (error) {
    res.status(404).send({
      message: "Error in creating CATEGORY",
      success: false,
    });
  }
};

const allCategory = async (req, res) => {
  try {
    const Categories = await categorymodel.find({});
    return res.status(201).send({
      success: true,
      message: "All categories list",
      Categories,
    });
  } catch (error) {
    res.status(404).send({
      message: "Error in Getting All CATEGORY",
      success: false,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const categoryDeleted = await categorymodel.findByIdAndDelete(id);

    if (categoryDeleted) {
      return res.status(201).send({
        success: true,
        message: "Category Deleted Successfully",
      });
    }
  } catch (error) {
    res.status(404).send({
      message: "Error in Deleting CATEGORY",
      success: false,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      res.status(200).send({
        message: "name is required",
      });
    }
    const categoryUpdated = await categorymodel.findByIdAndUpdate(
      id,
      { ...name, name },
      { new: true }
    );

    if (categoryUpdated) {
      return res.status(201).send({
        success: true,
        message: "Category Updated Successfully",
      });
    }
  } catch (error) {
    res.status(404).send({
      message: "Error in Updating CATEGORY",
      success: false,
    });
  }
};

module.exports.createCategory = createCategory;
module.exports.allCategory = allCategory;
module.exports.deleteCategory = deleteCategory;
module.exports.updateCategory = updateCategory;
