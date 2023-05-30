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
}

module.exports = UserController;
