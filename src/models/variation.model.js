"use strict";

const { Schema, Types, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Variation";
const COLLECTION_NAME = "variation";

// Declare the Schema of the Mongo model
const variationSchema = new Schema(
  {
    productId: {
      type: Types.ObjectId,
      required: true,
      ref: "Product",
    },
    keyVariation: { type: String, required: true },
    keyVariationValue: { type: String, required: true },
    subVariation: String,
    subVariationValue: String,
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
module.exports = model(DOCUMENT_NAME, variationSchema);
