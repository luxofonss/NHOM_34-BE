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
    isShop: {
      type: Boolean,
      default: false,
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
    phoneNumber: { type: String, required: true },
    address: { type: Array, default: [] },
    shopInfo: {
      description: String,
      address: String,
      shopName: String,
      phoneNumber: String,
      avatar: String,
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
