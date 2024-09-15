const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDb = require("./DB/dbConfig.js");
const itemModel = require("./models/itemModel");
const items = require("./utils/data");

//config
dotenv.config();
connectDb();

//function seeder
const importData = async () => {
  try {
    await itemModel.deleteMany();
    const itemsData = await itemModel.insertMany(items);
    console.log("All Items Added");
    process.exit();
  } catch (error) {
    console.log(`${error}`);
    process.exit(1);
  }
};

importData();
