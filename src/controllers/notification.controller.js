"use strict";

const NotificationService = require("../services/notification.service");
const { Created, SuccessResponse } = require("../core/success.response");

class NotificationController {
  static getUserNotifications = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get notifications successfully!",
      metadata: await NotificationService.getUserNotifications({
        userId: req.user.userId,
        page: req.params.page,
      }),
    }).send(res);
  };
}

module.exports = NotificationController;
