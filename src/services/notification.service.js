"use strict";
const { BadRequestError, NotFoundError } = require("../core/error.response");
const notificationModel = require("../models/notification.model");
const { checkExistUser } = require("../models/repositories/user.repo");
const { convertToObjectIdMongodb } = require("../utils");

// 1. generate notification code
class NotificationService {
  static async createNotification({
    userId,
    orderId,
    senderId,
    type,
    message,
  }) {
    await checkExistUser(userId);
    await checkExistUser(senderId);
    return await notificationModel.create({
      userId,
      orderId,
      senderId,
      type,
      message,
    });
  }

  static async getUserNotifications({ userId, page }) {
    const limit = 10;
    const skip = (page - 1) * limit;
    return await notificationModel
      .find({
        userId: convertToObjectIdMongodb(userId),
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdOn: -1 })
      .exec();
  }
}

module.exports = NotificationService;
