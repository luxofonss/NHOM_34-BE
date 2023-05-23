"use strict";

const { Schema, Types, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "user";

// Declare the Schema of the Mongo model
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: [],
    },
    oauthService: {
      type: String,
      enum: ["Google", "Local", "Facebook"],
    },
    oauthId: {
      type: String,
    },
    avatar: {
      type: String,
    },
    address: { type: Array, default: [] },
    shopAttributes: {
      description: { type: String, required: true },
      address: { type: String, required: true },
      // followers:
      // rating
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema);
