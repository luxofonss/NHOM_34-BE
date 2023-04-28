"use strict";

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

module.exports = { insertInventory };
