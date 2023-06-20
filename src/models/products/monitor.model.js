"use strict";

const { Schema, Types, model } = require("mongoose");
const DOCUMENT_NAME = "Monitor";
const COLLECTION_NAME = "monitor";

const monitorSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    panelType: {
      type: String,
      required: true,
    },
    weight: {
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
    gameFocus: {
      type: Boolean,
      required: true,
    },
    monitorInterfaceType: {
      type: String,
      required: true,
    },
    resolution: {
      type: String,
      required: true,
    },
    condition: {
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

module.exports = model(DOCUMENT_NAME, monitorSchema);
