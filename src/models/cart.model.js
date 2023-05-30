"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "carts";

const cartSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed", "pending"],
      default: "active",
    },
    products: {
      type: Array,
      required: true,
      default: [],
    },
    productCount: {
      type: Number,
      default: 0,
    },
    userId: {
      type: Number,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
  }
);

module.exports = {
  cart: model(DOCUMENT_NAME, cartSchema),
};
