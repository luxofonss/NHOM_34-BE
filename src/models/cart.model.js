
'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = "Cart"
const COLLECTION_NAME = 'Carts'

const cartSchema = new Schema(
    {
    cartState: {
        type: String, 
        required: true,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active',
    },
    cartProducts: {
        type: Array,
        required: true,
        default: []
    },
    cartCountProduct: {
        type: Number, 
        default: 0
    },
    cartUserId: {
        type: Number, 
        required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt:'createdOn',
        updatedAt:'modifiedOn',
    }
}
)

module.exports = {
    cart: model(DOCUMENT_NAME, cartSchema)
}
