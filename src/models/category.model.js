"use strict";

const { Schema, Types, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Category";
const COLLECTION_NAME = "categories";

// Declare the Schema of the Mongo model
const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    subTypes: [
      {
        name: String,
        quantity: Number,
        slug: String,
        classRef: String,
      },
    ],
    slug: String,
    thumb: String,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, categorySchema);
