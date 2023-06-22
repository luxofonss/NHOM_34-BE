"use strict";

const {
  ErrorResponse,
  AuthFailureError,
} = require("../../core/error.response");
const { convertToObjectIdMongodb } = require("../../utils");
const userModel = require("../user.model");

const getUserById = async ({ userId }) => {
  const foundUser = await userModel.findById(userId).exec();
  if (!foundUser) throw new AuthFailureError("Không tìm thấy tài khoản.");
  return foundUser;
};

module.exports = {
  getUserById,
};
