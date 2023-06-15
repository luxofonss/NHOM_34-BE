"use strict";

const { model, Types, Schema } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

// Declare the Schema of the Mongo model
const discountSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      default: "fixed",
      enum: ["fixed", "percent"],
      unique: true,
    },
    code: {
      type: String,
      required: true,
    },
    value: { type: Number, required: true },
    maxValue: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    maxUses: { type: Number, required: true },
    usesCount: { type: Number, required: true, default: 0 },
    userUsed: [Types.ObjectId],
    userHasDiscount: [Types.ObjectId],
    maxUsesPerUser: { type: Number, required: true },
    minOrderValue: { type: Number, required: true, default: 0 },
    shopId: { type: Types.ObjectId, required: true, ref: "User" },
    isActive: { type: Boolean, default: true },
    appliesToAll: { type: Boolean, default: false },
    productIds: [Types.ObjectId],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
