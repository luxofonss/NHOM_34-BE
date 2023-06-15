"use strict";

const { ErrorResponse } = require("../../core/error.response");
const { convertToObjectIdMongodb } = require("../../utils");
const inventory = require("../inventory.model");
const { Types } = require("mongoose");

const insertInventory = async ({
  productId,
  variation1,
  variation1Value,
  variation2,
  variation2Value,
  stock,
  price,
  thumb,
  isSingle = true,
}) => {
  const newInventory = await inventory.create({
    productId: convertToObjectIdMongodb(productId),
    variation1,
    variation1Value,
    variation2,
    variation2Value,
    stock,
    price,
    thumb,
    isSingle,
  });

  if (newInventory) return newInventory;
  else throw new ErrorResponse("Something went wrong!");
};

module.exports = {
  insertInventory,
};
