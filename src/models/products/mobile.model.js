"use strict";

const { Schema, Types, model } = require("mongoose");
const DOCUMENT_NAME = "Mobile";
const COLLECTION_NAME = "mobile";

const mobileSchema = new Schema(
  {
    phoneModel: {
      type: String,
      required: true,
    },
    phoneType: {
      type: String,
      required: true,
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
    ram: {
      type: Number,
      required: true,
    },
    rom: {
      type: Number,
      required: true,
    },
    numberOfPrimaryCamera: {
      type: Number,
      required: true,
    },
    supportOperatingSystem: {
      type: String,
      required: true,
    },
    numberOfSIMCardSlot: {
      type: Number,
      required: true,
    },
    SIMType: {
      type: Array,
      default: [],
      required: true,
    },
    caseType: {
      type: Array,
      default: [],
      required: true,
    },
    screenSize: {
      type: Number,
      required: true,
    },
    processorType: {
      type: String,
      required: true,
    },
    mobilePhoneFeatures: {
      type: Array,
      default: [],
      required: true,
    },
    cellular: {
      type: String,
      required: true,
    },
    mobileCableTypes: {
      type: Array,
      default: [],
      required: true,
    },
    screenProtectorType: {
      type: String,
      required: true,
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

module.exports = model(DOCUMENT_NAME, mobileSchema);
