"use strict";

const { model, Types, Schema } = require("mongoose");

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
    checked: { type: Number, default: 0 },
    products: [
      {
        shopId: { type: Types.ObjectId, ref: "User" },
        checked: { type: Number, default: 0 },
        products: [
          {
            productId: { type: Types.ObjectId, ref: "Product" },
            variationId: { type: Types.ObjectId, ref: "Variation" },
            quantity: { type: Number, required: true, min: 1 },
            checked: { type: Number, default: 0 },
          },
        ],
      },
    ],
    productCount: {
      type: Number,
      default: 0,
    },
    userId: {
      type: Types.ObjectId,
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

cartSchema.methods.toggleChecked = function (checked) {
  this.checked = checked;
  this.products = this.products.map((shop) => {
    shop.checked = checked;
    shop.products = shop.products.map((product) => {
      product.checked = checked;
      return product;
    });
    return shop;
  });
};

module.exports = {
  cart: model(DOCUMENT_NAME, cartSchema),
};
