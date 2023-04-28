"use strict";

const slugify = require("slugify");

const { Schema, Types, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "product";

// Declare the Schema of the Mongo model
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    slug: String,
    thumb: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Accessory"],
    },
    shop: { type: Types.ObjectId, ref: "User" },
    attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    //additional
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1"],
      max: [5, "Rating must be under 5"],
      set: (val) => Math.round(val * 10) / 10,
    },
    variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
//create index for search
productSchema.index({ name: "text", description: "text" });

//Document middleware: run before .save() method and .create() method
productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
  },
  {
    collection: "clothes",
    timestamps: true,
  }
);

const electronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
  },
  {
    collection: "electronic",
    timestamps: true,
  }
);

//Export the model
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("Clothing", clothingSchema),
  electronic: model("Electronic", electronicSchema),
};
