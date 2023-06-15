"use strict";

const redis = require("redis");
const { promisify } = require("util");
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const set = promisify(redisClient.set).bind(redisClient);

const acquiredLock = async ({ productId, quantity, cartId }) => {
  const key = `lock_v1_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000;

  for (let time in retryTimes) {
    // create a key
    const result = await setnxAsync(key, expireTime);
    console.log("result: ", result);

    if (result === 1) {
      // action allowed
      console.log("action with variation");

      return key;
    } else {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    }
  }
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquiredLock,
  releaseLock,
};
