"use strict";

const { Schema, Types, model } = require("mongoose");
const DOCUMENT_NAME = "Speaker";
const COLLECTION_NAME = "speaker";

const speakerSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    compatibleAudioDevice: {
        type: String,
        required: true,
    },
    frequency: {
        type: Number,
        required: true,
    },
    inputConnection: {
        type: String,
        required: true,
    },
    bluetooth: {
      type: Boolean,
      required: true,
    },
    wattage: {
        type: String,
        required: true,
    },
    connectionType: {
      type: String,
      required: true,
    },
    sensitivity: {
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
    smartSpeaker: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    amliType: {
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

module.exports = model(DOCUMENT_NAME, speakerSchema);
