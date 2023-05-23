'use strict'

const CartService = require('../services/cart.service')
const { SuccessResponse } = require('../core/success.response')

class CartController {
    addToCart = async(req, res, next) => {
        new SuccessResponse( {
            message: 'Create a new Cart success',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

//update 
    update = async(req, res, next) => {
        new SuccessResponse( {
            message: 'update a new Cart success',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }
//delete
    delete = async(req, res, next) => {
        new SuccessResponse( {
            message: 'delete Cart success',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }
//new cart
    listToCart = async(req, res, next) => {
        new SuccessResponse( {
            message: 'list Cart success',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }
}

module.exports = new CartController()