'use strict'

const { inventory } = require('../models/inventory.model')
const { getProductById } = require('../models/repositories/product.repo')
const { BadRequestError } = require('../core/error.response')
class InventoryService {
    static async addStockToInventory({
        stock,
        productId, 
        shopId,
        location = 'Ha Noi'
    }) {
        const product = await getProductById(productId)
        if(!product) throw new BadRequestError('there is no product')

        const query = { shopId: shopId, productId: productId},
        updateSet = {
            $inc: {
                stock: stock
            },
            $set: {
                location: location
            }
        }, options = { upsert: true, new: true }

        return await inventory.findOneAndUpdate( query, updateSet, options )

    }
}

module.exports = InventoryService

