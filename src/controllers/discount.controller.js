"use strict";

const DiscountService = require("../services/discount.service");
const { Created, SuccessResponse } = require("../core/success.response");

class DiscountController {
  static createDiscountCode = async (req, res, next) => {
    return new Created({
      message: "Create discount successfully!",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  static getAllDiscountCodesWithProduct = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get all discount code with product successfully!",
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query,
      }),
    }).send(res);
  };

  static getALlDiscountCodesByShop = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get all discount code by shop successfully!",
      metadata: await DiscountService.getALlDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  static getDiscountAmount = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get discount amount successfully!",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  };

  static deleteDiscount = async (req, res, next) => {
    return new SuccessResponse({
      message: "Delete discount successfully!",
      metadata: await DiscountService.deleteDiscount({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = DiscountController;
