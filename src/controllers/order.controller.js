"use strict";

const { Created, SuccessResponse } = require("../core/success.response");
const OrderService = require("../services/order.service");

class OrderController {
  static addNewUserOrder = async (req, res, next) => {
    return new Created({
      message: "Create orders successfully!",
      metadata: await OrderService.addNewUserOrder({
        userId: req.user.userId,
        address: req.body.address,
      }),
    }).send(res);
  };

  static getShopOrders = async (req, res) => {
    return new SuccessResponse({
      message: "Get shop orders successfully!",
      metadata: await OrderService.getShopOrders({
        userId: req.user.userId,
      }),
    }).send(res);
  };

  static getOrderByIdForShop = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get order successfully!",
      metadata: await OrderService.getOrderByIdForShop({
        userId: req.user.userId,
        orderId: req.params.id,
      }),
    }).send(res);
  };

  static updateOrdersStatus = async (req, res, next) => {
    return new SuccessResponse({
      message: "Update order successfully!",
      metadata: await OrderService.updateOrderStatus({
        shopId: req.user.userId,
        orderId: req.body.orderId,
        status: req.body.status,
      }),
    });
  };
}

module.exports = OrderController;
