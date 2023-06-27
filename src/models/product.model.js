"use strict";

const slugify = require("slugify");
const { Schema, Types, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "product";

// Declare the Schema of the Mongo model
const productSchema = new Schema(
  {
    shop: { type: Types.ObjectId, ref: "User" },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    slug: String,
    thumb: [
      {
        type: String,
      },
    ],
    quantity: Number,
    sold: { type: Number, default: 0 },
    typeId: {
      type: Types.ObjectId,
      required: true,
    },
    condition: {
      type: Number,
      min: [0, "Condition must be between 0 and 100"],
      max: [100, "Condition must be between 0 and 100"],
      required: true,
    },
    preOrder: {
      type: Boolean,
      default: false,
    },
    minPrice: {
      type: Number,
      min: [0, "Price must be greater than 0"],
    },
    maxPrice: {
      type: Number,
      min: [0, "Price must be greater than 0"],
    },
    brand: {
      type: String,
      required: true,
    },
    manufacturerName: {
      type: Array,
      default: ["Updating"],
    },
    manufacturerAddress: {
      type: Array,
      default: ["Updating"],
    },
    manufactureDate: {
      type: Date,
    },
    attributes: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    variations: [{ type: Schema.Types.ObjectId, ref: "Variation" }],
    shipping: {
      weight: { type: Number, required: true },
      parcelSize: {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
      },
      shippingUnit: {
        type: Array,
        default: ["Express"],
        required: true,
      },
    },
    sku: String,
    //additional
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1"],
      max: [5, "Rating must be under 5"],
      set: (val) => Math.round(val * 10) / 10,
    },
    isDraft: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
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
  //add quantity, minPrice, maxPrice to product
  console.log(this.attributes);
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Export the model
module.exports = model(DOCUMENT_NAME, productSchema);
