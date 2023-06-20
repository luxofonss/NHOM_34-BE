"use strict";

const { Schema, Types, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "order";

// Declare the Schema of the Mongo model
const orderSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    shopId: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    checkout: {
      totalPrice: Number,
      shipFee: Number,
    },
    /**
     * checkout = {
     *  totalPrice,
     *  totalApplyDiscount,
     *  shipFee
     *  }
     */
    shipping: { address: String, unit: String },
    /**
     * street,
     * city,
     * state,
     * country
     */
    payment: { method: String },
    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product" },
        variationId: { type: Types.ObjectId, ref: "Variation" },
        quantity: { type: Number, required: true },
      },
    ],
    trackingNumber: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "DELIVERED",
        "CANCELED",
        "REJECTED",
        "SHIPPING",
        "RETURN",
      ],
    },
    cancel: {
      reason: String,
      canceledAt: Date,
    },
    return: {
      returnAt: Date,
      reason: String,
    },
    reject: {
      rejectedAt: Date,
      reason: String,
    },
    confirmAt: Date,
    deliveredAt: Date,
    shippingAt: Date,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, orderSchema);
