'use strict'

const redis = require('redis')
const redisClient = redis.createClient()
const {promisify} = require('until')
const { reservationInventory } = require('../models/repositories/inventory.repo')

const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)

const aquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`
    const retryTimes = 10;
    const expireTime = 3000;

    for(let i =0; i<retryTimes.length; i++) {
        const result = await setnxAsync(key, expireTime)
        console.log(`result:::`, result);
        if(result === 1) {
            const isReservation = await reservationInventory( {
                productId, quantity, cartId
            })
            if(isReservation.modifiedCount) {
                await pexpire(key, expireTime)
                return key
            }
            return null
        }else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)

}

module.exports = {
    aquireLock,
    releaseLock,
}