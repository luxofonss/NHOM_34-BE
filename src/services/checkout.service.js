"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");

const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const DiscountService = require("./discount.service");

class CheckoutService {
  static async checkoutReview({ cartId, userId, shopOrderIds = [] }) {
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new BadRequestError("Cart does not exist");

    const checkoutOrder = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };
    let shopOrderIdsNew = [];

    for (let item of shopOrderIds) {
      const { shop, shopDiscounts = [], itemProducts = [] } = item;

      const checkProductServer = await checkProductByServer(itemProducts);
      console.log("checkProductServer", checkProductServer);
      if (!checkProductServer[0]) throw new BadRequestError("order wrong");

      //tong tien don hang
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      //tong tien truoc khi xu ly
      checkoutOrder.totalPrice += checkoutPrice;
      const itemCheckout = {
        shop,
        shopDiscounts,
        priceRaw: checkoutPrice, // truoc khi giam gia
        priceApplyDiscount: checkoutPrice,
        itemProducts: checkProductServer,
      };

      //neu shopDiscount ton tai > 0, check xem co hop le hay khong
      if (shopDiscounts.length > 0) {
        //gia su chi co 1 discount
        //get amount of discount
        const { totalPrice = 0, discount = 0 } =
          await DiscountService.getDiscountAmount({
            codeId: shopDiscounts[0].discountId,
            userId,
            shopId: shop,
            products: checkProductServer,
          });
        //tong cong discount giam gia
        checkoutOrder.totalDiscount += discount;

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      //tong thanh toan cuoi cung
      checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;
      shopOrderIdsNew.push(itemCheckout);
    }

    return {
      shopOrderIds,
      shopOrderIdsNew,
      checkoutOrder,
    };
  }

  //order
  static async orderByUser({
    shopOrderIds,
    cartId,
    userId,
    userAddress = {},
    userPayment = {},
  }) {
    const { shopOrderIdsNew, checkoutOrder } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shopOrderIds,
      });
    // check if item is out of stock or not
    const products = shopOrderIdsNew.flatMap((order) => order.itemProducts);

    console.log("products: ", products);

    for (let product in products) {
      const { productId, quantity } = product;
    }
  }
}

module.exports = CheckoutService;
