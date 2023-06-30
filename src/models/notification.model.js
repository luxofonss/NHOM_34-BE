"use strict";

const { Schema, Types, model } = require("mongoose"); // Erase if already required
const { NOTIFICATION_TYPE_ENUM } = require("../constant");
const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "notifications";

// Declare the Schema of the Mongo model
const notificationSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    senderId: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    isViewed: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPE_ENUM,
      required: true,
    },
    orderId: {
      type: Types.ObjectId,
      required: true,
      ref: "Order",
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, notificationSchema);
