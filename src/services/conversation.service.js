"use strict";
const { BadRequestError, NotFoundError } = require("../core/error.response");
const conversationModel = require("../models/conversation.model");
const { convertToObjectIdMongodb } = require("../utils");

// 1. generate message code
class ConversationService {
  static async createConversation({ sender, receiver }) {
    return await conversationModel.create({
      members: [
        convertToObjectIdMongodb(sender),
        convertToObjectIdMongodb(receiver),
      ],
    });
  }

  static async updateLastMessage({ conversationId, message, sender, time }) {
    console.log("time:: ", time);
    return await conversationModel.findOneAndUpdate(
      {
        _id: convertToObjectIdMongodb(conversationId),
      },
      {
        lastMessage: {
          message: message,
          from: convertToObjectIdMongodb(sender),
          time: time,
        },
      }
    );
  }

  static async getUserConversations({ userId }) {
    let allConversation = await conversationModel
      .find({
        members: { $in: userId },
      })
      .populate("members", "name _id avatar")
      .exec();

    allConversation.map((conversation, index) => {
      if (!conversation.thumb) {
        conversation.members.map((member) => {
          if (member._id.toString() !== userId) {
            console.log("found");
            allConversation[index].user = {
              _id: member._id,
              name: member.name,
              avatar: member.avatar,
            };
          }
        });
      }
    });

    return allConversation;
  }

  static async checkIfUserInConversation({ userId, conversationId }) {
    const foundConversation = await conversationModel
      .find({
        members: { $in: userId },
      })
      .exec();
    if (!foundConversation) {
      throw new BadRequestError("User is not in this conversation");
    } else {
      return 1;
    }
  }
}

module.exports = ConversationService;
