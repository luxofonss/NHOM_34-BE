"use strict";

const ConversationService = require("../services/conversation.service");
const { Created, SuccessResponse } = require("../core/success.response");

class ConversationController {
  static getUserConversations = async (req, res, next) => {
    return new Created({
      message: "Finding conversations successfully!",
      metadata: await ConversationService.getUserConversations({
        userId: req.user.userId,
      }),
    }).send(res);
  };

  static getNewConversation = async (req, res, next) => {
    return new SuccessResponse({
      message: "Finding conversations successfully!",
      metadata: await ConversationService.getNewConversation({
        userId: req.user.userId,
        receiverId: req.body.receiverId,
      }),
    }).send(res);
  };
}

module.exports = ConversationController;
