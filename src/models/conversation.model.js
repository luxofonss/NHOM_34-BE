"use strict";

const { model, Types, Schema } = require("mongoose");

const DOCUMENT_NAME = "Conversation";
const COLLECTION_NAME = "conversations";

const conversationSchema = new Schema(
  {
    members: [{ type: Types.ObjectId, ref: "User" }],
    lastMessage: {
      message: String,
      time: Date,
      from: { type: Types.ObjectId, ref: "User" },
    },
    user: { type: Object, default: {} },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
  }
);

//create index for search
conversationSchema.index({ modifiedOn: 1 });

module.exports = model(DOCUMENT_NAME, conversationSchema);
