"use strict";

const slugify = require("slugify");

const { Schema, Types, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "order";


const orderSchema = new Schema({
    orderUserId: {
        type: Number,
        required: true,
    },
    orderCheckout: {
        type: Object,
        default: {}
    },
    orderShipping: {
        type: Object,
        default: {},
    },
    orderPayment: {
        type: Object,
        default: {},
    },
    orderProducts: {
        type: Array,
        required: true,
    },
    orderTrackingNumber: {
        type: String,
        default: '#0000125062023',
    },
    orderStatus: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'CANCELED', 'DELIVERED'],
        default: 'PENDING',
    },

    },
    {
      timestamps: {
        createdAt: 'createdOn',
        updatedAt: "modifiedOn",
      },
      collection: COLLECTION_NAME,
    }
  );
  //create index for search
 
  //Export the model
  module.exports = {
    DOCUMENT_NAME,
    orderSchema
  };
  