const mongoose = require("mongoose");

const itemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      data: Buffer,
      contentType: String,
    },

    quantity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const itemModel = mongoose.model("item", itemSchema);
module.exports = itemModel;
