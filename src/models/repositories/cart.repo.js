"use strict";

const { convertToObjectIdMongodb } = require("../../utils");
const { cart } = require("../cart.model");
const findCartById = async (cartId) => {
  return await cart
    .findOne({ _id: convertToObjectIdMongodb(cartId), status: "active" })
    .lean()
    .exec();
};

const checkIfAllInShopChecked = async ({ userId, shopId }) => {
  const foundCart = await cart
    .findOne({
      userId: convertToObjectIdMongodb(userId),
      "products.products.checked": 0,
      "products.checked": 0,
      "products.shopId": convertToObjectIdMongodb(shopId),
    })
    .exec();
  console.log("foundCart:: ", foundCart);
  if (!foundCart) {
    return await cart
      .findOneAndUpdate(
        {
          userId: convertToObjectIdMongodb(userId),
          "products.shopId": convertToObjectIdMongodb(shopId),
        },
        {
          "products.$.checked": 1,
        }
      )
      .exec();
  }
};

const checkIfAllChecked = async ({ userId }) => {
  const foundCart = await cart
    .findOne({
      userId: convertToObjectIdMongodb(userId),
      "products.checked": 0,
      checked: 0,
    })
    .exec();
  if (!foundCart) {
    return await cart
      .findOneAndUpdate(
        {
          userId: convertToObjectIdMongodb(userId),
        },
        {
          checked: 1,
        }
      )
      .exec();
  }
};

const handleUncheckShop = async ({ userId, shopId }) => {
  return await cart
    .findOneAndUpdate(
      {
        userId: convertToObjectIdMongodb(userId),
        "products.checked": 1,
        "products.shopId": convertToObjectIdMongodb(shopId),
      },
      {
        "products.$.checked": 0,
      }
    )
    .exec();
};

module.exports = {
  findCartById,
  checkIfAllInShopChecked,
  checkIfAllChecked,
  handleUncheckShop,
};
