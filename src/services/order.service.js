"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const CartService = require("./cart.service");
const orderModel = require("../models/order.model");
const { v4: uuidv4 } = require("uuid");
const { decreaseVariation } = require("../models/repositories/variation.repo");
const { convertToObjectIdMongodb } = require("../utils");
const { ORDER_STATUS } = require("../constant");
const { filterOrders } = require("../models/repositories/order.repo");

class OrderService {
  static async addOrderOneShop({ shopId, address, userId, products }) {}

  static async addNewUserOrder({ userId, address }) {
    console.log("address:: ", address);
    const userCart = await CartService.getCart({ userId, limit: 10000 });
    if (!userCart) throw new NotFoundError("Không tìm thấy người dùng!");
    let orderList = [];
    userCart[0].products.forEach((shop) => {
      let productList = [];
      let productDetailList = [];
      let totalPrice = 0;
      shop.products.forEach((product) => {
        if (product.checked === 1)
          if (product.variation.stock >= product.quantity) {
            productDetailList.push(product);
            productList.push({
              productId: product.product._id,
              variationId: product.variation._id,
              quantity: product.quantity,
            });

            totalPrice += product.variation.price;
          } else
            throw new BadRequestError(
              `${product.product.name} đã hết hàng, vui lòng chọn lại`
            );
      });
      if (productList !== [])
        orderList.push({
          shop: shop,
          shopId: shop.shop._id,
          products: productList,
          productDetailList: productDetailList,
          checkout: { totalPrice, shipFee: 50000 },
        });
    });

    return await Promise.all([
      orderList.map(async (shop) => {
        shop.productDetailList.map(async (product) => {
          console.log("product:: ", product);
          // update variations
          await decreaseVariation({
            variationId: product.variation._id,
            quantity: product.quantity,
          });

          //update cart
          await CartService.deleteItem({
            variationId: product.variation._id,
            userId: userId,
          });
        });

        //create order list
        await orderModel.create({
          userId: userId,
          shopId: shop.shopId,
          checkout: shop.checkout,
          shipping: { address: address, unit: "GHTK" },
          payment: { method: "COD" },
          products: shop.products,
          trackingNumber: shop.shop.shop.name + uuidv4().slice(0, 8),
          status: "PENDING",
        });
      }),
    ]);
  }

  static async getShopOrders({ userId, page = 1, sort = "ctime", limit = 20 }) {
    const skip = limit * (page - 1);
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const filter = { shopId: convertToObjectIdMongodb(userId) };

    const [orders, count] = await Promise.all([
      orderModel
        .aggregate([
          { $match: filter },
          {
            $lookup: {
              from: "user",
              localField: "userId",
              foreignField: "_id",
              as: "userDetails",
              pipeline: [
                {
                  $project: {
                    email: 1,
                    name: 1,
                    phoneNumber: 1,
                    address: 1,
                    _id: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: "$userDetails",
          },
          { $unwind: "$products" },
          {
            $lookup: {
              from: "product",
              localField: "products.productId",
              foreignField: "_id",
              as: "productDetails",
              pipeline: [
                {
                  $project: { name: 1, thumb: 1, _id: 1 },
                },
              ],
            },
          },
          {
            $unwind: "$productDetails",
          },
          {
            $lookup: {
              from: "variation",
              localField: "products.variationId",
              foreignField: "_id",
              as: "variationDetails",
              pipeline: [
                {
                  $project: {
                    keyVariation: 1,
                    keyVariationValue: 1,
                    subVariation: 1,
                    subVariationValue: 1,
                    stock: 1,
                    price: 1,
                    thumb: 1,
                    _id: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: "$variationDetails",
          },
          {
            $group: {
              _id: "$_id",
              customer: { $first: "$userDetails" },
              checkout: { $first: "$checkout" },
              shipping: { $first: "$shipping" },
              payment: { $first: "$payment" },
              trackingNumber: { $first: "$trackingNumber" },
              status: { $first: "$status" },
              createdAt: { $first: "$createdAt" },
              updatedAt: { $first: "$updatedAt" },
              products: {
                $push: {
                  product: "$productDetails",
                  variation: "$variationDetails",
                  quantity: "$products.quantity",
                },
              },
            },
          },
          { $sort: sortBy },
          { $skip: skip },
          { $limit: limit },
        ])
        .exec(),
      orderModel.countDocuments(filter),
    ]);

    return { orders, count };
  }

  static async getOrderByIdForShop({ orderId, userId }) {
    const foundOrder = await orderModel
      .findById(orderId)
      .populate({
        path: "userId",
        select: "name _id email address phoneNumber",
      })
      .populate({
        path: "products",
        populate: [
          {
            path: "productId",
            select: "name thumb _id",
          },
          {
            path: "variationId",
            select:
              "_id keyVariation keyVariationValue subVariation subVariationValue stock price thumb",
          },
        ],
      })
      .exec();
    if (!foundOrder) throw new NotFoundError("Không tìm thấy đơn hàng");
    console.log("foundOrder:: ", foundOrder);
    if (foundOrder.shopId.toString() !== userId) {
      throw new ForbiddenError("Bạn không có quyền xem đơn hàng này");
    }

    return foundOrder;
  }

  static async confirmOrders({ shopId, orderIds }) {
    return await orderModel
      .updateMany(
        {
          shopId: convertToObjectIdMongodb(shopId),
          _id: { $in: orderIds.map((id) => convertToObjectIdMongodb(id)) },
          status: ORDER_STATUS.PENDING,
        },
        {
          status: ORDER_STATUS.CONFIRMED,
          confirmAt: new Date(),
        }
      )
      .exec();
  }

  static async shippingOrders({ shopId, orderIds }) {
    return await orderModel
      .updateMany(
        {
          shopId: convertToObjectIdMongodb(shopId),
          _id: { $in: orderIds.map((id) => convertToObjectIdMongodb(id)) },
          status: ORDER_STATUS.CONFIRMED,
        },
        {
          status: ORDER_STATUS.SHIPPING,
          shippingAt: new Date(),
        }
      )
      .exec();
  }

  static async rejectOrder({ shopId, orderId, reason }) {
    const foundOrder = await orderModel
      .findOne({
        shopId: convertToObjectIdMongodb(shopId),
        _id: convertToObjectIdMongodb(orderId),
      })
      .exec();

    if (
      foundOrder?.status === ORDER_STATUS.CONFIRMED ||
      foundOrder?.status === ORDER_STATUS.PENDING
    ) {
      Promise.all(
        foundOrder.products.map(async (product) => {
          return await decreaseVariation({
            variationId: product.variationId,
            quantity: product.quantity,
          }).exec();
        })
      );

      return await orderModel
        .findOneAndUpdate(
          {
            shopId: convertToObjectIdMongodb(shopId),
            _id: convertToObjectIdMongodb(orderId),
          },
          {
            status: ORDER_STATUS.REJECTED,
            reject: { rejectedAt: new Date(), reason: reason },
          }
        )
        .exec();
    } else {
      throw new BadRequestError("Không thể hủy đơn hàng");
    }
  }

  static async cancelOrder({ userId, orderId, reason }) {
    const foundOrder = await orderModel
      .findOne({
        _id: convertToObjectIdMongodb(orderId),
        userId: convertToObjectIdMongodb(userId),
      })
      .exec();

    if (!foundOrder) throw new NotFoundError("Không tìm thấy đơn hàng!");
    if (foundOrder.status !== ORDER_STATUS.PENDING)
      throw new BadRequestError("Không thể hủy đơn hàng này");

    Promise.all(
      foundOrder.products.map(async (product) => {
        return await decreaseVariation({
          variationId: product.variationId,
          quantity: -product.quantity,
        });
      })
    );
    return await orderModel
      .findOneAndUpdate(
        {
          _id: convertToObjectIdMongodb(orderId),
          userId: convertToObjectIdMongodb(userId),
          status: ORDER_STATUS.PENDING,
        },
        {
          status: ORDER_STATUS.CANCELED,
          cancel: { reason: reason, cancelAt: new Date() },
        }
      )
      .exec();
  }

  static async getAndFilterOrder({ shopId, body }) {
    const {
      trackingNumber = "",
      customer = "",
      productName = "",
      startDate,
      endDate,
      status,
      page = 1,
      sort = "ctime",
      limit = 10,
    } = body;
    console.log("query", typeof limit, typeof page);
    const skip = parseInt(limit) * (parseInt(page) - 1);
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const filter = {
      shopId: convertToObjectIdMongodb(shopId),
      ...(status && { status: status }),
    };
    if (trackingNumber) {
      let regexTracking = new RegExp(trackingNumber, "i");
      filter.trackingNumber = { $regex: regexTracking };
    }
    let newEndDate = new Date(endDate);
    newEndDate.setDate(newEndDate.getDate() + 1);
    if (startDate && !endDate) filter.createdAt = { $gte: new Date(startDate) };
    else if (!startDate && endDate) filter.createdAt = { $lte: newEndDate };
    else if (startDate && endDate)
      filter.createdAt = { $gte: new Date(startDate), $lte: newEndDate };

    let regexCustomer = "",
      regexProduct = "";
    const populate = { user: {}, product: {} };
    if (customer) {
      regexCustomer = new RegExp(customer, "i");
      populate.user = {
        "userDetails.name": { $regex: regexCustomer },
      };
    }
    if (productName) {
      regexProduct = new RegExp(productName, "i");
      populate.product = {
        "productDetails.name": { $regex: regexProduct },
      };
    }

    return await filterOrders({ filter, populate, limit, sortBy, skip });
  }

  static async getUserOrders({ userId, status }) {
    let filter;
    if (status) {
      filter = {
        status: status,
        userId: convertToObjectIdMongodb(userId),
      };
    } else {
      filter = {
        userId: convertToObjectIdMongodb(userId),
      };
    }
    console.log("filter:: ", filter);
    return await filterOrders({
      filter,
      limit: 10000,
      sortBy: { _id: -1 },
      skip: 0,
      getShop: true,
    });
  }
}

module.exports = OrderService;
