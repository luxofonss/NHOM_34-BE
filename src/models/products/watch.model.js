"use strict";

const { Schema, Types, model } = require("mongoose");
const DOCUMENT_NAME = "Watch";
const COLLECTION_NAME = "watch";

const watchSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    caseStyle: {
      type: String,
      required: true,
    },
    buckleStyle: {
      type: String,
      required: true,
    },
    warrantyType: {
      type: String,
      required: true,
    },
    glass: {
      type: String,
      required: true,
    },
    skinType: {
      type: String,
      required: true,
    },
    clockFace: {
        type: String,
        required: true,
    },
    clockStyle: {
      type: String,
      required: true,
    },
    diameter: {
      type: Number,
      required: true,
    },
    watchCaseMaterial: {
        type: String,
        required: true,
    },
    strapMaterial: {
        type: String,
        required: true,
    },
    depthWater: {
        type: Number,
        required: true,
    },
    origin: {
        type: String,
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

module.exports = model(DOCUMENT_NAME, watchSchema);
