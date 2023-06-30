"use strict";

const { model, Types, Schema } = require("mongoose");

const DOCUMENT_NAME = "Message";
const COLLECTION_NAME = "messages";

const messageSchema = new Schema(
  {
    sender: { type: Types.ObjectId, required: true, ref: "User" },
    receiver: { type: Types.ObjectId, required: true, ref: "User" },
    conversationId: {
      type: Types.ObjectId,
      required: true,
      ref: "Conversation",
    },
    message: { type: String, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
  }
);

module.exports = model(DOCUMENT_NAME, messageSchema);
