"use strict";

const { Schema, Types, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "inventories";

// Declare the Schema of the Mongo model
const inventorySchema = new Schema(
  {
    shopId: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    productId: {
      type: Types.ObjectId,
      required: true,
      ref: "Product",
    },
    location: {
      type: String,
      default: "unKnown",
    },
    stock: {
      type: Number,
      required: true,
    },
    // dat hang truoc
    reservations: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema);
