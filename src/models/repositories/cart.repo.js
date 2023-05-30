"use strict";

const { convertToObjectIdMongodb } = require("../../utils");
const { cart } = require("../cart.model");
const findCartById = async (cartId) => {
  return await cart
    .findOne({ _id: convertToObjectIdMongodb(cartId), status: "active" })
    .lean()
    .exec();
};

module.exports = {
  findCartById,
};
