"use strict";

const io = require("../../server");
const { checkIfUserIsOnline } = require("./redis.service");

const connectSocket = (id) => {
  io.sockets.on("connection", function (socket) {
    console.log("new client connected");
  });
};

// const socketListener = (socket,io) => {
//   socket.on("sendMessage", (data) => {
//     console.log("a message is sent");
//     const socketId = checkIfUserIsOnline(data.receiver);
//     if (socketId) io.to(socketId).emit("receiveMessage", data);
//   });
// };

module.exports = {
  connectSocket,
  // socketListener,
};
