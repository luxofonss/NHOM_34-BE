"use strict";

const MessageService = require("../services/message.service");
const { Created, SuccessResponse } = require("../core/success.response");

class MessageController {
  static sendMessage = async (req, res, next) => {
    return new Created({
      message: "Create message successfully!",
      metadata: await MessageService.sendMessage({
        ...req.body,
        sender: req.user.userId,
        io: res.io,
      }),
    }).send(res);
  };

  static getMessageInConversation = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get all messages in conversation successfully!",
      metadata: await MessageService.getMessageInConversation({
        userId: req.user.userId,
        conversationId: req.query.conversationId,
        page: req.query.page,
      }),
    }).send(res);
  };
}

module.exports = MessageController;
