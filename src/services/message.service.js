"use strict";
const { BadRequestError, NotFoundError } = require("../core/error.response");
const messageModel = require("../models/message.model");
const { checkExistUser } = require("../models/repositories/user.repo");
const { convertToObjectIdMongodb } = require("../utils");
const ConversationService = require("./conversation.service");
const { checkIfUserIsOnline } = require("./redis.service");

// 1. generate message code
class MessageService {
  static async sendMessage({ conversationId, sender, receiver, message, io }) {
    await checkExistUser(sender);
    await checkExistUser(receiver);

    if (!conversationId) {
      const newConversation = await ConversationService.createConversation({
        sender,
        receiver,
      });

      const response = await messageModel.create({
        sender: convertToObjectIdMongodb(sender),
        receiver: convertToObjectIdMongodb(receiver),
        conversationId: newConversation._id,
        message: message,
      });

      await ConversationService.updateLastMessage({
        conversationId,
        message,
        sender,
        time: response.createdOn,
      });

      return response;
    } else {
      const response = await messageModel.create({
        sender: convertToObjectIdMongodb(sender),
        receiver: convertToObjectIdMongodb(receiver),
        conversationId: convertToObjectIdMongodb(conversationId),
        message: message,
      });

      await ConversationService.updateLastMessage({
        conversationId,
        message,
        sender,
        time: response.createdOn,
      });

      const socketId = await checkIfUserIsOnline(receiver);
      console.log("sending message to user", socketId);

      if (socketId) {
        console.log("sending message to user");
        io.to(socketId).emit("receiveMessage", {
          conversationId,
          sender,
          receiver,
          message,
        });
      }

      return response;
    }
  }

  static async getMessageInConversation({ userId, conversationId, page }) {
    const messagePageSize = 20;
    const skip = (page - 1) * messagePageSize;
    await ConversationService.checkIfUserInConversation({
      userId,
      conversationId,
    });
    return await messageModel
      .find({
        conversationId: convertToObjectIdMongodb(conversationId),
      })
      .skip(skip)
      .limit(messagePageSize)
      .sort({ createdOn: -1 })
      .exec();
  }
}

module.exports = MessageService;
