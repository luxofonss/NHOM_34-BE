"use strict";
const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const {
  findAllDiscountCodeUnselect,
  findDiscount,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");
const { convertToObjectIdMongodb } = require("../utils");

// 1. generate discount code
class DiscountService {
  static async createDiscountCode(body) {
    const {
      name,
      description,
      type,
      code,
      value,
      maxValue,
      startDate,
      endDate,
      maxUses,
      maxUsesPerUser,
      minOrderValue,
      shopId,
      isActive,
      appliesTo,
      productIds,
    } = body;

    if (
      new Date() < new Date(startDate) ||
      new Date() > new Date(endDate) ||
      new Date(startDate) > new Date(endDate)
    ) {
      throw new BadRequestError("Invalid date");
    }

    // create index for discount code
    const foundDiscountCode = await findDiscount({
      model: discountModel,
      filter: { code, shopId },
    });
    if (foundDiscountCode && foundDiscountCode.isActive === true) {
      throw new BadRequestError("Discount has already been created");
    }

    const newDiscount = await discountModel.create({
      name,
      description,
      type,
      code,
      value,
      maxValue,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      maxUses,
      maxUsesPerUser,
      minOrderValue,
      shopId,
      isActive,
      appliesTo,
      productIds: appliesTo === "all" ? [] : productIds,
    });

    return newDiscount;
  }

  static async getAllDiscountCodesWithProduct({
    shopId,
    code,
    userId,
    limit,
    page,
  }) {
    // create index for discount code
    const foundDiscount = await findDiscount({
      model: discountModel,
      filter: { code, shopId },
    });

    if (!foundDiscount || !foundDiscount.isActive) {
      throw new NotFoundError("Discount not exists");
    }

    const { appliesTo, productIds } = foundDiscount;

    if (appliesTo === "all") {
      //get all products of shop
      return await findAllProducts({
        limit: +limit,
        page: +page,
        filter: { shop: convertToObjectIdMongodb(shopId), isPublished: true },
        sort: "ctime",
        select: ["name"],
      });
    } else {
      //get specific products of shop
      return await findAllProducts({
        limit: +limit,
        page: +page,
        filter: { _id: { $in: productIds }, isPublished: true },
        sort: "ctime",
        select: ["name"],
      });
    }
  }

  static async getAlDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodeUnselect({
      limit: +limit,
      page: +page,
      filter: {
        shopId: convertToObjectIdMongodb(shopId),
        isActive: true,
        unselect: [__v, shopId],
      },
      model: discountModel,
    });

    return discounts;
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    console.log(codeId, shopId);
    const foundDiscount = await findDiscount({
      model: discountModel,
      filter: {
        _id: convertToObjectIdMongodb(codeId),
        shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError("Discount code not found");

    const {
      isActive,
      maxUses,
      startDate,
      endDate,
      minOrderValue,
      maxUsesPerUser,
      userUsed,
      maxValue,
      type,
      value,
    } = foundDiscount;

    if (!isActive) {
      throw new BadRequestError("Discount code not active");
    }

    if (maxUses === 0) {
      throw new BadRequestError("Discount code is not available");
    }

    if (new Date() < new Date(startDate) || new Date() > new Date(endDate)) {
      throw new BadRequestError("Discount has expired");
    }

    // check if higher than min order value

    let totalOrder = 0;

    if (minOrderValue > 0) {
      // get total
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < minOrderValue) {
        throw new BadRequestError(
          `Discount require min order ${minOrderValue}`
        );
      }
    }

    if (maxUsesPerUser > 0) {
      const userUsedDiscount = userUsed.find((user) => user.userId === userId);

      if (userUsedDiscount && maxUsesPerUser) {
        // user used discount code and discount code can only be used once
        throw new BadRequestError("You can only use this discount code once!");
      }
    }

    // check if discount is fixed
    const amount = type === "fixed" ? value : totalOrder * (value / 100);

    return {
      totalOrder: totalOrder,
      discount: amount > maxValue ? maxValue : amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscount({ shopId, codeId }) {
    const deleted = discountModel.findOneAndDelete({
      shopId: convertToObjectIdMongodb(shopId),
      _id: convertToObjectIdMongodb(codeId),
    });

    return deleted;
  }

  //user

  // when user clicks on a discount card and save the discount code
  static async userGetDiscount({ codeId, userId }) {
    const foundDiscount = await findDiscount({
      model: discountModel,
      filter: {
        _id: convertToObjectIdMongodb(codeId),
      },
    });

    if (!foundDiscount) throw new NotFoundError("Discount not found!");

    if (foundDiscount.userUsed.includes(userId))
      throw new BadRequestError("You have already used this discount!");

    await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $push: {
        userUsed: userId,
      },
    });

    return;
  }

  static async cancelDiscount({ codeId, shopId, userId }) {
    const foundDiscount = findDiscount({
      model: discountModel,
      filter: {
        _id: convertToObjectIdMongodb(codeId),
        shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError("Discount not found!");

    const result = await discountModel
      .findByIdAndUpdate(foundDiscount._id, {
        $pull: {
          userUsed: userId,
        },
        $inc: {
          maxUses: 1,
          usesCount: -1,
        },
      })
      .exec();

    return result;
  }
}

module.exports = DiscountService;
