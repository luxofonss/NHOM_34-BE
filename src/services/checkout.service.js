'use strict'

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { order } = require("../models/order.model")
const { findCartById } = require('../models/repositories/cart.repo');
const { getDiscountAmount } = require('./discount.service')
const { checkProductByServer } = require("../models/repositories/product.repo");
const { aquireLock, releaseLock } = require("./redis.service");

class CheckoutService {

    static async checkoutReview({
        cartId, userId, shopOrderIds=[]
    }) {
        const foundCart = await findCartById(cartId)
        if(!foundCart) throw new BadRequestError("Cart does not exist")

        const checkoutOrder = {
            totalPrice: 0, 
            feeShip:0,
            totalDiscount: 0, 
            totalCheckout: 0,
        }, shopOrderIdsNew = []
    
    for(let i = 0; i < shopOrderIds.length; i++) {
        const { shop, shopDiscounts=[], itemProducts=[]} = shopOrderIds[i]

        const checkProductServer = await checkProductByServer(itemProducts)
        console.log("checkProductServer", checkProductServer)
        if(!checkProductServer[0]) throw new BadRequestError('order wrong')


        //tong tien don hang
        const checkoutPrice = checkProductServer.reduce((acc, product) => {
            return acc + (product.quantity * product.price)
        },0)

        //tong tien truoc khi xu ly
        checkoutOrder.totalPrice += checkoutPrice
        const itemCheckout = {
            shop, 
            shopDiscounts,
            priceRaw: checkoutPrice, // truoc khi giam gia
            priceApplyDiscount: checkoutPrice,
            itemProducts: checkProductServer
        }

        //neu shopDiscount ton tai > 0, check xem co hop le hay khong
        if(shopDiscounts.length > 0) {
            //gia su chi co 1 discount
            //get amount of discount
            const {totalPrice = 0, discount = 0} = await getDiscountAmount({ 
                code: shopDiscounts[0].code,
                userId,
                shop,
                products: checkProductServer
            })
            //tong cong discount giam gia
            checkoutOrder.totalDiscount += discount

            if(discount > 0) {
                itemCheckout.priceApplyDiscount = checkoutPrice + discount 
            }
        }

        //tong thanh toan cuoi cung
        checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount
        shopOrderIdsNew.push(itemCheckout)
        }
    

        return{
            shopOrderIds,
            shopOrderIdsNew,
            checkoutOrder
        }
    }


    static async orderByUser( {
        shopOrderIds, 
        cartId,
        userId,
        userAddress = {},
        userPayment = {},
    }) {
        const {shopOrderIdsNew, checkoutOrder } = await CheckoutService.checkoutReview( {
            cartId,
            userId,
            shopOrderIds,
        })

        //check lai
        const products = shopOrderIdsNew.flatMap( order => order.itemProducts)
        console.log(`[1]:`, products)
        const acquireProduct = []
        for(let i = 0; i< products.length; i++) {
            const { productId, quantity } = products[i];
            const keyLock = await aquireLock(productId, quantity, cartId)
            acquireProduct.push(keyLock ? true : false)
            if(keyLock) {
                await releaseLock(keyLock)
            }
        }


        //check neu co mot san pham het hang
        if(acquireProduct.includes(false)) {
            throw new BadRequestError('Mot so san pham da duoc cap nhat, vui long quay lai gio hang..')
        }
        const newOrder = await order.create({
            orderUserId: userId,
            orderCheckout: checkoutOrder,
            orderShipping: userAddress,
            orderPayment: userPayment,
            orderProducts: shopOrderIdsNew 
        })

        //neu insert thanh cong, remove product khoi cart
        if(newOrder) {

        }
        return newOrder
    }

    static async getOrderByUser() {

    }

    static async getOneOrderByUser() {
        
    }

    static async cancelOrderByUser() {
        
    }

    static async updateOrderStatusByShop() {
        
    }
}

module.exports = CheckoutService;