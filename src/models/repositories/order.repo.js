"use strict";

const { convertToObjectIdMongodb } = require("../../utils");
const orderModel = require("../order.model");

const filterOrders = async ({
  filter,
  populate = { user: {}, product: {} },
  limit,
  sortBy,
  skip,
  getShop = false,
}) => {
  console.log(filter);

  let pipeline = [
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
    { $match: populate.user },
    // { $unwind: "$products" },
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
    { $match: populate.product },
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
    { $limit: parseInt(limit) },
    {
      $facet: {
        count: [{ $count: "numOrders" }],
        orders: [
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
              shop: {
                $first: "$shopDetails",
              },
              products: {
                $push: {
                  product: "$productDetails",
                  variation: "$variationDetails",
                  quantity: "$products.quantity",
                },
              },
              // numOrders: { $sum: "$numOrders" },
            },
          },
        ],
      },
    },
    { $sort: sortBy },
    { $skip: skip },
  ];

  if (getShop) {
    let newPipeline = [
      ...pipeline.slice(0, 2),
      {
        $lookup: {
          from: "user",
          localField: "shopId",
          foreignField: "_id",
          as: "shopDetails",
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
        $unwind: "$shopDetails",
      },
      ...pipeline.slice(2),
    ];
    pipeline = newPipeline;
  }
  const orderList = await orderModel.aggregate(pipeline).exec();
  return {
    count: orderList[0]?.count[0]?.numOrders || 0,
    orders: orderList[0]?.orders || [],
  };
};

module.exports = {
  filterOrders,
};
