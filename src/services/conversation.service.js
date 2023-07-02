"use strict";
const { BadRequestError, NotFoundError } = require("../core/error.response");
const conversationModel = require("../models/conversation.model");
const { checkExistUser } = require("../models/repositories/user.repo");
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
    return await conversationModel
      .findOneAndUpdate(
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
      )
      .exec();
  }

  static async getUserConversations({ userId }) {
    let allConversation = await conversationModel
      .find({
        members: { $in: userId },
      })
      .populate("members", "name _id avatar")
      .sort({ modifiedOn: -1 })
      .exec();

    allConversation.forEach((conversation, index) => {
      if (!conversation.thumb) {
        conversation.members.forEach((member) => {
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

  static async getNewConversation({ userId, receiverId }) {
    await checkExistUser(receiverId);
    const foundConversation = await conversationModel
      .findOne({
        members: { $all: [userId, receiverId] },
      })
      .exec();

    if (foundConversation) {
      let allConversations = await conversationModel
        .find({
          members: { $in: userId, $nin: [receiverId] },
        })
        .populate("members", "name _id avatar")
        .exec();

      allConversations.forEach((conversation, index) => {
        if (!conversation.thumb) {
          conversation.members.forEach((member) => {
            if (member._id.toString() !== userId) {
              console.log("found");
              allConversations[index].user = {
                _id: member._id,
                name: member.name,
                avatar: member.avatar,
              };
            }
          });
        }
      });
      const result = [foundConversation, ...allConversations];
      return result;
    } else {
      return [];
    }
  }
}

module.exports = ConversationService;
