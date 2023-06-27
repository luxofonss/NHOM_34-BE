"use strict";

const { Schema, Types, model } = require("mongoose");
const DOCUMENT_NAME = "Tablet";
const COLLECTION_NAME = "tablet";

const tabletSchema = new Schema(
  {
    model: {
      type: String,
      required: false,
    },
    storeCapacity: {
      type: Number,
      required: true,
    },
    primaryCameraResolution: {
      type: Number,
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
    registrationId: {
      type: Number,
      required: false,
    },
    EReader: {
      type: Boolean,
    },
    batteryCapacity: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        enum: ["mAh", "cell", "Wh"],
      },
    },
    screenSize: {
      type: Number,
      required: true,
    },
    tabletCableTypes: {
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

module.exports = model(DOCUMENT_NAME, tabletSchema);
