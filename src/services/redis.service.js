"use strict";

const { createClient } = require("redis");
const { promisify } = require("util");
const redisClient = createClient({
  url: "redis://default:5e2OwckODJanB5Z0TvRwKJgeLveQkDNL@redis-13412.c292.ap-southeast-1-1.ec2.cloud.redislabs.com:13412",
});

console.log(process.env.REDIS_URI);

redisClient.on("error", (err) => {
  console.log(err.message);
});

redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
    redisClient.lRange("online_users", 0, -1).then((res) => {
      console.log("res:: ", res);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
// const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const set = promisify(redisClient.set).bind(redisClient);
const LPushAsync = promisify(redisClient.lPush).bind(redisClient);
const LRemAsync = promisify(redisClient.lRem).bind(redisClient);
const LPosAsync = promisify(redisClient.lPos).bind(redisClient);
const LRangeAsync = promisify(redisClient.lRange).bind(redisClient);
const delAsyncKey = promisify(redisClient.del).bind(redisClient);

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
  return await delAsyncKey(keyLock);
};

const onlineUsersKey = "online_users";

const addUserToOnlineList = async (user) => {
  // Add the user to the online users list in Redis
  try {
    console.log("Add the user to the online users list in Redis");
    const res = await LPushAsync(onlineUsersKey, JSON.stringify(user));
    console.log("res::", res);
  } catch (error) {
    console.log("error::", error);
  }
};

const removeUserById = async (userId) => {
  // Find the user with the matching socketId and remove from Redis
  console.log("removing");
  redisClient
    .lRange(onlineUsersKey, 0, -1)
    .then((elements) => {
      console.log("elements:: ", elements);
      elements.forEach((element) => {
        // Parse the JSON string into an object
        const parsedElement = JSON.parse(element);

        // Check if "b" is equal to userId
        if (parsedElement.userId === userId) {
          // Remove the item from the list
          redisClient
            .lRem(onlineUsersKey, 0, element)
            .then((res) => {
              console.log("success");
            })
            .catch((err) => console.log("err:: ", err));
        }
      });
    })
    .catch((err) => console.log("err:: ", err));
};

const removeUserBySocketId = async (socketId) => {
  // Find the user with the matching socketId and remove from Redis
  console.log("removing");
  redisClient
    .lRange(onlineUsersKey, 0, -1)
    .then((elements) => {
      console.log("elements:: ", elements);
      elements.forEach((element) => {
        // Parse the JSON string into an object
        const parsedElement = JSON.parse(element);

        // Check if "b" is equal to socketId
        if (parsedElement.socketId === socketId) {
          // Remove the item from the list
          redisClient
            .lRem(onlineUsersKey, 0, element)
            .then((res) => {
              console.log("success");
            })
            .catch((err) => console.log("err:: ", err));
        }
      });
    })
    .catch((err) => console.log("err:: ", err));
};

const checkIfUserIsOnline = async (userId) => {
  // Find the user with the matching userId
  console.log("checking user is online");
  let socketId = 0;

  await redisClient
    .lRange(onlineUsersKey, 0, -1)
    .then((elements) => {
      console.log("elements:: ", elements);
      elements.forEach((element) => {
        // Parse the JSON string into an object
        const parsedElement = JSON.parse(element);
        console.log("test", userId, parsedElement.userId);
        // Check if "b" is equal to socketId
        if (parsedElement.userId === userId) {
          socketId = parsedElement.socketId;
        }
        console.log("socket:: ", socketId);
      });
      return socketId;
    })
    .catch((err) => console.log("err:: ", err));
  return socketId;
};

const getOnlineUsers = async () => {
  // Find the user with the matching userId
  console.log("getting online users");
  redisClient
    .lRange(onlineUsersKey, 0, -1)
    .then((res) => {
      console.log("res:: ", res);
      return res;
    })
    .catch((error) => {
      console.log("error:: ", error);
    });
};

module.exports = {
  acquiredLock,
  releaseLock,
  addUserToOnlineList,
  getOnlineUsers,
  removeUserById,
  removeUserBySocketId,
  checkIfUserIsOnline,
};
