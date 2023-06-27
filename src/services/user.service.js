"use strict";

const { USER_ROLE } = require("../constant");
const { ForbiddenError, BadRequestError } = require("../core/error.response");
const userModel = require("../models/user.model");
const getUpdateField = require("../utils/getUpdateField");
const { convertToObjectIdMongodb } = require("../utils");
const { getUserById } = require("../models/repositories/user.repo");
const UploadService = require("./upload.service");

const selectOptions = {
  email: 1,
  password: 1,
  name: 1,
  verify: 1,
  roles: 1,
  oauthId: 1,
  oauthService: 1,
  avatar: 1,
  address: 1,
  shopInfo: 1,
};

class UserService {
  static findByEmail = async ({ email, select = selectOptions }) => {
    return await userModel.findOne({ email }).select(select).lean().exec();
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
    phoneNumber,
    address = [address],
    dateOfBirth,
    roles = [USER_ROLE.SHOP],
  }) => {
    return await userModel.create({
      name,
      email,
      phoneNumber,
      password,
      dateOfBirth,
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

  static registerUserAsShop = async ({ userId, shopInfo }) => {
    const foundUser = await userModel.findById(userId).exec();
    if (!foundUser) throw new ForbiddenError("Không tìm thấy thông tin.");

    if (foundUser.isShop)
      throw new BadRequestError("Bạn đã đăng ký làm nhà bán hàng");
    foundUser.shopInfo = shopInfo;
    foundUser.isShop = true;
    foundUser.roles.push(USER_ROLE.SHOP);
    return await foundUser.save();
  };

  static getShopById = async (shopId) => {
    const foundShop = await userModel
      .findById(shopId)
      .select(
        "name email verify avatar address shopInfo isShop avatar createdAt"
      )
      .exec();

    if (!foundShop) throw new ForbiddenError("Can not find shop.");

    if (!foundShop.isShop) throw new BadRequestError("This is not a shop");

    return foundShop;
  };

  static updateUserInfo = async ({ userId, newUserInfo }) => {
    await getUserById({ userId });
    const updateField = getUpdateField(newUserInfo);
    console.log("updateField:: ", updateField);

    return await userModel
      .findOneAndUpdate({ _id: convertToObjectIdMongodb(userId) }, updateField)
      .exec();
  };

  static updateUserAvatar = async ({ userId, image }) => {
    await getUserById({ userId });
    const url = await UploadService.uploadSingleImage(image);
    return await userModel
      .findOneAndUpdate(
        { _id: convertToObjectIdMongodb(userId) },
        { avatar: url }
      )
      .exec();
  };
}

module.exports = UserService;
