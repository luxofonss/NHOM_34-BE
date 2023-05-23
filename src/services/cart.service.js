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
    const query = { cart_userId: userId, cart_state: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateOrInsert, options).exec();
  }

  static async updateUserCart({ userId, product }) {
    const { productId, quantity } = product;
    console.log("product: ", product);
    const query = {
        cart_userId: userId,
        "cart_products.productId": productId,
        cart_state: "active",
      },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      options = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateSet, options).exec();
  }

  static async addtoCart({ userId, product = {} }) {
    const userCart = await cart.findOne({ cart_userId: userId }).exec();
    if (!userCart) {
      //create a new cart
      return await CartService.createUserCart({ userId, product });
    }
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }
    //update quantity
    return await CartService.updateUserCart({ userId, product });
  }

  //update cart
  static async addToCartV2({ userId, shop_order_ids = {} }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];
    //check product
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError("");
    //compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0].shopId) {
      throw new NotFoundError("Product do not belong to the shop");
    }
    if (quantity === 0) {
      //delete
    }
    return await CartService.updateUserCart({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateSet = {
        $pull: {
          cart_products: {
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
        cart_userId: +userId,
      })
      .lean()
      .exec();
  }
}

module.exports = CartService;
