"use strict";

const ConversationService = require("../services/conversation.service");
const { Created, SuccessResponse } = require("../core/success.response");

class ConversationController {
  static getUserConversations = async (req, res, next) => {
    return new Created({
      message: "Create message successfully!",
      metadata: await ConversationService.getUserConversations({
        userId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = ConversationController;
