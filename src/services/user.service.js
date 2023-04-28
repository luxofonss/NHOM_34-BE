"use strict";

const { USER_ROLE } = require("../constant");
const userModel = require("../models/user.model");

const selectOptions = {
  email: 1,
  password: 1,
  name: 1,
  verify: 1,
  roles: 1,
  oauthId: 1,
  oauthService: 1,
};

class UserService {
  static findByEmail = async ({ email, select = selectOptions }) => {
    return await userModel
      .findOne({ email: email })
      .select(select)
      .lean()
      .exec();
  };

  static findByUserId = async ({ userId, select = selectOptions }) => {
    return await userModel
      .findOne({ _id: userId })
      .select(select)
      .lean()
      .exec();
  };

  static createUser = async ({
    name,
    email,
    password,
    roles = [USER_ROLE.SHOP],
  }) => {
    return await userModel.create({
      name,
      email,
      password,
      roles,
    });
  };

  static createByOAuth = async ({
    name,
    email,
    oauthId,
    oauthService,
    roles = [USER_ROLE.SHOP],
  }) => {
    return await userModel.create({
      name,
      email,
      roles,
      oauthId,
      oauthService,
    });
  };

  static findByOAuthId = async (strategy, id, select = selectOptions) => {
    return await userModel
      .findOne({
        oauthId: id,
        oauthService: strategy,
      })
      .select(select)
      .exec();
  };
}

module.exports = UserService;
