"use strict";

const { NotFoundError, BadRequestError } = require("../core/error.response");
const CartService = require("./cart.service");
const orderModel = require("../models/order.model");
const { v4: uuidv4 } = require("uuid");
const { decreaseVariation } = require("../models/repositories/variation.repo");
const { convertToObjectIdMongodb } = require("../utils");

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
    return await orderModel
      .aggregate([
        { $match: { shopId: convertToObjectIdMongodb(userId) } },
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
      .exec();
  }

  static async getOrderByIdForShop({ orderId, userId }) {
    // const foundOrder = await orderModel
    //   .aggregate([
    //     { $match: { _id: convertToObjectIdMongodb(orderId) } },
    //     {
    //       $lookup: {
    //         from: "user",
    //         localField: "userId",
    //         foreignField: "_id",
    //         as: "userDetails",
    //         pipeline: [
    //           {
    //             $project: {
    //               email: 1,
    //               name: 1,
    //               phoneNumber: 1,
    //               address: 1,
    //               _id: 1,
    //             },
    //           },
    //         ],
    //       },
    //     },
    //     {
    //       $unwind: "$userDetails",
    //     },
    //     { $unwind: "$products" },
    //     {
    //       $lookup: {
    //         from: "product",
    //         localField: "products.productId",
    //         foreignField: "_id",
    //         as: "productDetails",
    //         pipeline: [
    //           {
    //             $project: { name: 1, thumb: 1, _id: 1 },
    //           },
    //         ],
    //       },
    //     },
    //     {
    //       $lookup: {
    //         from: "variation",
    //         localField: "products.variationId",
    //         foreignField: "_id",
    //         as: "variationDetails",
    //         pipeline: [
    //           {
    //             $project: {
    //               keyVariation: 1,
    //               keyVariationValue: 1,
    //               subVariation: 1,
    //               subVariationValue: 1,
    //               stock: 1,
    //               price: 1,
    //               thumb: 1,
    //               _id: 1,
    //             },
    //           },
    //         ],
    //       },
    //     },
    //     {
    //       $unwind: "$variationDetails",
    //     },
    //     {
    //       $group: {
    //         _id: "$_id",
    //         customer: { $first: "$userDetails" },
    //         checkout: { $first: "$checkout" },
    //         shipping: { $first: "$shipping" },
    //         payment: { $first: "$payment" },
    //         trackingNumber: { $first: "$trackingNumber" },
    //         status: { $first: "$status" },
    //         createdAt: { $first: "$createdAt" },
    //         updatedAt: { $first: "$updatedAt" },
    //         products: {
    //           $push: {
    //             product: "$productDetails",
    //             variation: "$variationDetails",
    //             quantity: "$products.quantity",
    //           },
    //         },
    //       },
    //     },
    //   ])
    //   .exec();
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

  static async updateOrdersStatus({ shopId, orderId, status }) {
    return await orderModel
      .findOneAndUpdate(
        {
          shopId: convertToObjectIdMongodb(shopId),
          _id: convertToObjectIdMongodb(orderId),
        },
        {
          status: status,
        }
      )
      .exec();
  }
}

module.exports = OrderService;
