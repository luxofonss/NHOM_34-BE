"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { cart } = require("../models/cart.model");

const { getProductById } = require("../models/repositories/product.repo");
const { convertToObjectIdMongodb } = require("../utils");
const ProductFactory = require("./product.service");

/*
    Key features: Cart Services
    - add product 
    - reduce product quantity
    - increase product quantity
    - get cart (user)
    - delete cart (user)
    - delete cart item (user)
*/

class CartService {
  //Start repo cart
  static async createUserCart({ userId, product }) {
    if (
      await ProductFactory.checkProductStock({
        shopId: product.shopId,
        productId: product.productId,
        variationId: product.variationId,
        quantity: product.quantity,
      })
    ) {
      console.log("create new cart");
      const query = {
          userId: convertToObjectIdMongodb(userId),
          "products.shopId": convertToObjectIdMongodb(product.shopId),
          status: "active",
        },
        updateOrInsert = {
          // $addToSet: {
          products: {
            shopId: product.shopId,
            products: [
              {
                productId: product.productId,
                variationId: product.variationId,
                quantity: product.quantity,
              },
            ],
          },
          // },
        },
        options = {
          upsert: true,
          new: true,
        };
      return await cart.findOneAndUpdate(query, updateOrInsert, options).exec();
    } else {
      throw new BadRequestError("Product is out of stock!");
    }
  }

  static async updateUserCart({ userId, product, checked = false }) {
    console.log("product", product);
    let able = false;

    if (checked) {
      able = true;
    } else {
      able = await ProductFactory.checkProductStock({
        shopId: product.shopId,
        productId: product.productId,
        variationId: product.variationId,
        quantity: product.quantity,
      });
    }
    if (able) {
      const { productId, variationId, quantity } = product;
      const query = {
        userId: convertToObjectIdMongodb(userId),
        "products.shopId": convertToObjectIdMongodb(product.shopId),
        "products.products.productId": convertToObjectIdMongodb(productId),
        "products.products.variationId": convertToObjectIdMongodb(variationId),
        status: "active",
      };

      const foundProduct = await cart.findOne(query).exec();
      console.log("check here:: ", foundProduct);

      if (foundProduct) {
        return await cart
          .findOneAndUpdate(
            query,
            {
              "products.$[outer].products.$[inner].quantity": quantity,
            },
            {
              arrayFilters: [
                { "outer.shopId": convertToObjectIdMongodb(product.shopId) },
                { "inner.variationId": convertToObjectIdMongodb(variationId) },
              ],
            }
          )
          .exec();
      } else {
        const query2 = {
          userId: convertToObjectIdMongodb(userId),
          "products.shopId": convertToObjectIdMongodb(product.shopId),
          status: "active",
        };

        const foundProduct2 = await cart.findOne(query2).exec();
        console.log("check here:: ", foundProduct2);

        if (!foundProduct2) {
          return await cart
            .findOneAndUpdate(
              {
                userId: convertToObjectIdMongodb(userId),
                status: "active",
              },
              {
                $push: {
                  products: {
                    shopId: product.shopId,
                    products: [{ productId, variationId, quantity }],
                  },
                },
              },
              {
                new: true,
                upsert: true,
              }
            )
            .exec();
        } else
          return await cart
            .findOneAndUpdate(
              {
                userId: convertToObjectIdMongodb(userId),
                "products.shopId": convertToObjectIdMongodb(product.shopId),
                status: "active",
              },
              {
                $push: {
                  "products.$[inner].products": {
                    productId,
                    variationId,
                    quantity,
                  },
                },
              },
              {
                arrayFilters: [
                  { "inner.shopId": convertToObjectIdMongodb(product.shopId) },
                ],
                new: true,
                upsert: true,
              }
            )
            .exec();
      }
    } else {
      throw new BadRequestError("Product is out of stock!");
    }
  }

  static async addToCart({ userId, product = {} }) {
    console.log(product, userId);
    if (
      await ProductFactory.checkProductStock({
        shopId: product.shopId,
        productId: product.productId,
        variationId: product.variationId,
        quantity: product.quantity,
      })
    ) {
      console.log("find cart", userId);
      const userCart = await cart
        .findOne({ userId: convertToObjectIdMongodb(userId) })
        .exec();
      if (!userCart)
        return await CartService.createUserCart({ userId, product });

      if (!userCart.products.length) {
        userCart.products = [
          {
            shopId: product.shopId,
            products: [
              {
                productId: product.productId,
                variationId: product.variationId,
                quantity: product.quantity,
              },
            ],
          },
        ];
        return await userCart.save();
      }

      return CartService.updateUserCart({ userId, product, checked: true });
    } else {
      throw new BadRequestError("Product is out of stock!");
    }
  }

  //update cart
  static async addToCartV2({ userId, shop_order_ids = {} }) {
    const { productId, quantity, oldQuantity } =
      shop_order_ids[0]?.item_products[0];
    //check product
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError("");
    //compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0].shopId) {
      throw new NotFoundError("Product does not belong to the shop");
    }

    if (quantity === 0) {
      //delete
    }

    return await CartService.updateUserCart({
      userId,
      product: {
        productId,
        quantity: quantity - oldQuantity,
      },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { userId: userId, status: "active" },
      updateSet = {
        $pull: {
          products: {
            productId,
          },
        },
      };

    const deleteCart = await cart.updateOne(query, updateSet).exec();
    return deleteCart;
  }

  static async getListUserCart({ userId, productId }) {
    return await cart
      .findOne({
        userId: +userId,
      })
      .lean()
      .exec();
  }

  static async getCart({ userId, page = 1, sort = "ctime", limit = 20 }) {
    const skip = limit * (page - 1);
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    return await cart
      .aggregate([
        { $match: { userId: convertToObjectIdMongodb(userId) } },
        {
          $unwind: "$products",
        },
        {
          $lookup: {
            from: "user",
            localField: "products.shopId",
            foreignField: "_id",
            as: "shopDetails",
            pipeline: [
              {
                $project: {
                  email: 1,
                  name: 1,
                  shopInfo: 1,
                  address: 1,
                  _id: 1,
                },
              },
            ],
          },
        },

        {
          $project: {
            shopDetails: {
              $filter: {
                input: "$shopDetails",
                as: "shop",
                cond: { $eq: ["$$shop._id", "$products.shopId"] },
              },
            },
            products: 1,
          },
        },
        {
          $unwind: "$shopDetails",
        },
        {
          $unwind: "$products.products",
        },
        {
          $lookup: {
            from: "product",
            localField: "products.products.productId",
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
            localField: "products.products.variationId",
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
            _id: "$products._id",
            shop: { $first: "$shopDetails" },
            checked: { $first: "$products.checked" },
            products: {
              $push: {
                product: "$productDetails",
                variation: "$variationDetails",
                quantity: "$products.products.quantity",
                checked: "$products.products.checked",
              },
            },
            totalPrice: {
              $sum: {
                $cond: {
                  if: { $eq: ["$products.products.checked", 1] },
                  then: {
                    $let: {
                      vars: {
                        price: "$variationDetails.price",
                        quantity: "$products.products.quantity",
                      },
                      in: {
                        $multiply: ["$$price", "$$quantity"],
                      },
                    },
                  },
                  else: 0,
                },
              },
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            checked: { $first: "$checked" },
            shop: { $first: "$shop" },
            products: { $first: "$products" },
            // products: {
            //   $push: "$$ROOT",
            // },
            totalPrice: { $first: "$totalPrice" },
          },
        },
        { $sort: sortBy },
        { $skip: skip },
        { $limit: limit },
      ])
      .exec();
  }

  static async setAllCheck({ checked, userId }) {
    const foundCart = await cart
      .findOne({
        userId: convertToObjectIdMongodb(userId),
      })
      .exec();
    foundCart.toggleChecked(checked);
    await foundCart.save();
    return foundCart;
  }

  static async setShopCheck({ checked, userId, shopId }) {
    return await cart
      .findOneAndUpdate(
        {
          userId: convertToObjectIdMongodb(userId),
          "products.shopId": convertToObjectIdMongodb(shopId),
        },
        {
          "products.$.checked": checked,
          "products.$.products.$[].checked": checked,
        }
      )
      .exec();
  }

  static async setProductCheck({
    userId,
    variationId,
    productId,
    shopId,
    quantity,
    checked,
  }) {
    let able = await ProductFactory.checkProductStock({
      shopId: shopId,
      productId: productId,
      variationId: variationId,
      quantity: quantity,
    });
    if (able)
      return await cart
        .findOneAndUpdate(
          {
            userId: convertToObjectIdMongodb(userId),
            "products.products.variationId":
              convertToObjectIdMongodb(variationId),
          },
          {
            $bit: { "products.$[outer].products.$[inner].checked": { xor: 1 } },
          },
          {
            arrayFilters: [
              {
                "outer.products.variationId":
                  convertToObjectIdMongodb(variationId),
              },
              {
                "inner.variationId": convertToObjectIdMongodb(variationId),
              },
            ],
          }
        )
        .exec();
    else {
      if (!checked)
        await cart
          .findOneAndUpdate(
            {
              userId: convertToObjectIdMongodb(userId),
              "products.products.variationId":
                convertToObjectIdMongodb(variationId),
            },
            {
              "products.$[outer].products.$[inner].checked": 0,
            },
            {
              arrayFilters: [
                {
                  "outer.products.variationId":
                    convertToObjectIdMongodb(variationId),
                },
                {
                  "inner.variationId": convertToObjectIdMongodb(variationId),
                },
              ],
            }
          )
          .exec();
      throw new BadRequestError("Sản phẩm đã hết hàng");
    }
  }

  static async deleteItem({ variationId, userId }) {
    return await cart
      .findOneAndUpdate(
        {
          userId: convertToObjectIdMongodb(userId),
          "products.products.variationId":
            convertToObjectIdMongodb(variationId),
        },
        {
          $pull: {
            "products.$.products": {
              variationId: convertToObjectIdMongodb(variationId),
            },
          },
        }
      )
      .exec();
  }
}

module.exports = CartService;
