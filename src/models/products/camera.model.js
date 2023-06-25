"use strict";

const { Schema, Types, model } = require("mongoose");
const DOCUMENT_NAME = "Camera";
const COLLECTION_NAME = "camera";

const cameraSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    lensType: {
      type: String,
      required: true,
    },
    screenSize: {
      type: Number,
      required: true,
    },
    cameraModel: {
      type: String,
      required: true,
    },
    resolution: {
      type: Number,
      required: true,
    },
    aperture: {
      type: String,
      required: true,
    },
    memoryCard: {
      type: String,
      required: true,
    },
    batteryType: {
      type: String,
      required: true,
    },
    warrantyType: {
      type: String,
      required: true,
    },
    warrantyDuration: {
      type: Number,
      required: true,
      min: [0, "Warranty duration must be greater than zero!"],
    },
    waterproof: {
      type: Boolean,
      required: true,
    },
    frameRate: {
      type: String,
      required: true,
    },
    standardRange: {
      type: Number,
      required: true,
    },
    weight: {
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

module.exports = model(DOCUMENT_NAME, cameraSchema);
