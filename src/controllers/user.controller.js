"use strict";

const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.service");

class UserController {
  static registerUserAsShop = async (req, res, next) => {
    return new SuccessResponse({
      message: "Registered successfully!",
      metadata: await UserService.registerUserAsShop({
        userId: req.user.userId,
        shopInfo: req.body,
      }),
    }).send(res);
  };

  static getShopById = async (req, res, next) => {
    return new SuccessResponse({
      message: "Found shop!",
      metadata: await UserService.getShopById(req.params.id),
    }).send(res);
  };

  static updateUserInfo = async (req, res) => {
    return new SuccessResponse({
      message: "Updated user successfully!",
      metadata: await UserService.updateUserInfo({
        userId: req.user.userId,
        newUserInfo: req.body,
      }),
    }).send(res);
  };
}

module.exports = UserController;
