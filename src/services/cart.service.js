"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { cart } = require("../models/cart.model");

const { getProductById } = require("../models/repositories/product.repo");

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
    const query = { userId: userId, status: "active" },
      updateOrInsert = {
        $addToSet: {
          products: product,
        },
      },
      options = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateOrInsert, options).exec();
  }

  static async updateUserCart({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        userId: userId,
        "products.productId": productId,
        status: "active",
      },
      updateSet = {
        $inc: {
          "products.$.quantity": quantity,
        },
      },
      options = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateSet, options).exec();
  }

  static async addToCart({ userId, product = {} }) {
    const userCart = await cart.findOne({ userId }).exec();
    if (!userCart) return await CartService.createUserCart({ userId, product });

    if (!userCart.products.length) {
      userCart.products = [product];
      return await userCart.save();
    }

    return CartService.updateUserCart({ userId, product });
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
}

module.exports = CartService;
