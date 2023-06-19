"use strict";

const { ErrorResponse } = require("../../core/error.response");
const { convertToObjectIdMongodb } = require("../../utils");
const variation = require("../variation.model");
const { Types } = require("mongoose");

const insertVariation = async ({
  productId,
  keyVariation,
  keyVariationValue,
  subVariation,
  subVariationValue,
  stock,
  price,
  thumb,
  isSingle = true,
}) => {
  return await variation.create({
    productId: convertToObjectIdMongodb(productId),
    keyVariation,
    keyVariationValue,
    subVariation,
    subVariationValue,
    stock,
    price,
    thumb,
    isSingle,
  });
};

const findVariationById = async (variationId) => {
  return await variation.findById(variationId).exec();
};

module.exports = {
  insertVariation,
  findVariationById,
};
