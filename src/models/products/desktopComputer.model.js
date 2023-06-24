"use strict";

const { Schema, Types, model } = require("mongoose");
const DOCUMENT_NAME = "DesktopComputer";
const COLLECTION_NAME = "desktopComputer";

const mobileSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    port: {
      type: String,
      required: true,
    },
    processor: {
      type: String,
      required: true,
    },
    capacity: {
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
    operationSystem: {
      type: String,
      required: true,
    },
    storage: {
      type: String,
      required: true,
    },
    numberOfCors: {
      type: Number,
      required: true,
    },
    cdDriver: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    CPUfrequency: {
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

module.exports = model(DOCUMENT_NAME, desktopComputerSchema);
