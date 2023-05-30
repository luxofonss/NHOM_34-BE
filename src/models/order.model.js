"use strict";

const { Schema, Types, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "order";

// Declare the Schema of the Mongo model
const orderSchema = new Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    checkout: { type: Object, default: {} },
    /**
     * checkout = {
     *  totalPrice,
     *  totalApplyDiscount,
     *  shipFee
     *  }
     */
    shipping: { type: Object, default: {} },
    /**
     * street,
     * city,
     * state,
     * country
     */
    payment: { type: Object, default: {} },
    products: {
      type: Array,
      required: true,
    },
    trackingNumber: { type: String, default: "#00000119032023" },
    status: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "DELIVERED",
        "CANCELED",
        "REJECTED",
        "SHIPPING",
      ],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, orderSchema);
