order.aggregate(
  [
    { $match: { shopId: new ObjectId("64455e0a6143eca3f689ee85") } },
    {
      $lookup: {
        from: "user",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
        pipeline: [
          {
            $project: { email: 1, name: 1, phoneNumber: 1, address: 1, _id: 1 },
          },
        ],
      },
    },
    { $unwind: "$userDetails" },
    { $match: {} },
    {
      $lookup: {
        from: "product",
        localField: "products.productId",
        foreignField: "_id",
        as: "productDetails",
        pipeline: [{ $project: { name: 1, thumb: 1, _id: 1 } }],
      },
    },
    { $match: {} },
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
              products: {
                $push: {
                  product: "$productDetails",
                  variation: "$variationDetails",
                  quantity: "$products.quantity",
                },
              },
            },
          },
        ],
      },
    },
    { $sort: { _id: -1 } },
    { $skip: 0 },
    { $limit: 1 },
  ],
  {}
);
