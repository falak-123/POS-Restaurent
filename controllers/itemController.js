const itemModel = require("../models/itemModel");
const fs = require("fs");
const itemController = async (req, res) => {
  try {
    const Allitems = await itemModel.find({}).select("-image");
    res.status(201).send(Allitems);
  } catch (error) {
    res.status(401).send("Error in get All item controller");
  }
};

const addItemController = async (req, res) => {
  try {
    const { image } = req.files;
    const newItem = new itemModel(req.fields);

    if (image) {
      newItem.image.data = fs.readFileSync(image.path);
      newItem.image.contentType = image.type;
    }

    await newItem.save();
    res.status(201).send("Item Created Successfully!");
  } catch (error) {
    res.status(401).send("Error in add item controller");
  }
};

const deleteItemController = async (req, res) => {
  try {
    const productDeleted = await itemModel.findByIdAndDelete(req.params.id);

    res.status(201).send("Item Deleted Successfully!");
  } catch (error) {
    res.status(401).send("Error in delete item controller");
  }
};

const editItemController = async (req, res) => {
  try {
    const { image } = req.files;

    console.log("1");
    const updatedItem = await itemModel.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );
    console.log("2");
    if (image) {
      updatedItem.image.data = fs.readFileSync(image.path);
      updatedItem.image.contentType = image.type;
    }
    console.log("3");
    await updatedItem.save();
    console.log("4");
    res.status(201).send({
      message: "updated successfully",
    });
  } catch (error) {
    res.status(401).send("Error in Update item controller");
  }
};

const itemImageController = async (req, res) => {
  try {
    const itemImage = await itemModel.findById(req.params.id).select("image");
    if (itemImage.image.data) {
      res.set("Content-type", itemImage.image.contentType);
      return res.status(200).send(itemImage.image.data);
    }
  } catch (error) {
    res.status(401).send("Error in item image controller");
  }
};
module.exports.itemController = itemController;
module.exports.addItemController = addItemController;
module.exports.deleteItemController = deleteItemController;
module.exports.editItemController = editItemController;
module.exports.itemImageController = itemImageController;
