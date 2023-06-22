"use strict";

const CartService = require("../services/cart.service");
const { SuccessResponse } = require("../core/success.response");

class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Add product to cart successfully!",
      metadata: await CartService.addToCart({
        userId: req.user.userId,
        product: req.body,
      }),
    }).send(res);
  };

  //update
  updateCart = async (req, res, next) => {
    new SuccessResponse({
      message: "update a new Cart success",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };
  //delete
  deleteCart = async (req, res, next) => {
    new SuccessResponse({
      message: "delete Cart success",
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  };
  //new cart
  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "list Cart success",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };

  //find user's cart
  getCart = async (req, res, next) => {
    new SuccessResponse({
      message: "get cart success",
      metadata: await CartService.getCart({
        userId: req.user.userId,
        page: req.query.page,
        sort: req.query.sort,
        limit: req.query.limit,
      }),
    }).send(res);
  };

  //check all cart
  setAllCheck = async (req, res, next) => {
    new SuccessResponse({
      message: "set check all successfully!",
      metadatA: await CartService.setAllCheck({
        checked: req.body.checked,
        userId: req.user.userId,
      }),
    }).send(res);
  };

  //check all of shop
  setShopCheck = async (req, res, next) => {
    new SuccessResponse({
      message: "set check all of shop successfully!",
      metadata: await CartService.setShopCheck({
        checked: req.body.checked,
        userId: req.user.userId,
        shopId: req.body.shopId,
      }),
    }).send(res);
  };

  //check product of shop
  setProductCheck = async (req, res, next) => {
    new SuccessResponse({
      message: "set check product successfully!",
      metadata: await CartService.setProductCheck({
        userId: req.user.userId,
        variationId: req.body.variationId,
        shopId: req.body.shopId,
        productId: req.body.productId,
        quantity: req.body.quantity,
        checked: req.body.checked,
      }),
    }).send(res);
  };

  deleteItem = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete item successfully!",
      metadata: await CartService.deleteItem({
        variationId: req.body.variationId,
        userId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new CartController();
