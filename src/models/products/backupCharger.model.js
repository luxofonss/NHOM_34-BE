"use strict";

const { Schema, Types, model } = require("mongoose");
const DOCUMENT_NAME = "BackupCharger";
const COLLECTION_NAME = "backupCharger";

const backupChargerSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    numberPort: {
      type: Number,
      required: true,
    },
    inputStyle: {
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
    capacity: {
      type: Number,
      required: true,
    },
    cableType: {
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

module.exports = model(DOCUMENT_NAME, backupChargersSchema);
