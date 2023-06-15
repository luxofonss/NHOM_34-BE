"use strict";

const { Schema, Types, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "inventories";

// Declare the Schema of the Mongo model
const inventorySchema = new Schema(
  {
    productId: {
      type: Types.ObjectId,
      required: true,
      ref: "Product",
    },
    variation1: { type: String, required: true },
    variation1Value: { type: String, required: true },
    variation2: String,
    variation2Value: String,
    isSingle: { type: Boolean, default: true },
    thumb: String,
    price: Number,
    stock: Number,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema);
