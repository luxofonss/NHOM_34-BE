"use strict";

const { convertToObjectIdMongodb } = require("../../utils");
const inventory = require("../inventory.model");
const { Types } = require("mongoose");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unKnown",
}) => {
  return await inventory.create({
    productId: productId,
    shopId: shopId,
    stock: stock,
    location: location,
  });
};

const reservationInventory = async ( { productId, quantity, cartId }) => {
  const query = {
    productId: convertToObjectIdMongodb(productId),
    stock: {$gte: quantity}, 
  }, updateSet = {
    $inc: {
      stock: -quantity,
    },
    $push: {
      reservations: {
        quantity,
        cartId, 
        createOn: new Date()
      }
    }
  }, options = { upsert: true, new: true}

  return await inventory.findOne(query, updateSet)
}

module.exports = { insertInventory, reservationInventory };
