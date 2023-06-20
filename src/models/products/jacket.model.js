"use strict";

const { Schema, Types, model } = require("mongoose");
const DOCUMENT_NAME = "Jacket";
const COLLECTION_NAME = "jacket";

const jacketSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    skinType: {
      type: String,
      required: true,
    },
    buttonStyle: {
      type: String,
      required: true,
    },
    tallFit: {
      type: Boolean,
      required: true,
    },
    lengthSleeve: {
      type: Number,
      required: true,
    },
    jacketModel: {
      type: String,
      required: true,
    },
    style: {
      type: String,
      required: true,
    },
    veryBig: {
      type: Boolean,
      required: true,
   },
    dimensions: {
      L: { type: Number, required: true },
      W: { type: Number, required: true },
      H: { type: Number, required: true },
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, jacketSchema);
