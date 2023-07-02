const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cookieSession = require("cookie-session");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const {
  addUserToOnlineList,
  removeUserById,
  getOnlineUsers,
  checkIfUserIsOnline,
  removeUserBySocketId,
} = require("./services/redis.service");

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3003", "https://sopy.vercel.app"],
    method: ["GET", "POST"],
  },
});

require("dotenv").config();

// init middleware
app.use(morgan("dev"));
app.use(
  compression({
    level: 6,
    threshold: 100 * 1000, //payload less than 100kb should not be compressed
    filter: (req, res) => {
      // don't compress responses with this request header
      if (req.headers["x-no-compression"]) {
        return false;
      }
      // fallback to standard filter function
      return compression.filter(req, res);
    },
  })
);
app.use(helmet());
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.SESSION_SECRET],
  })
);
//cors

const whitelist = [
  "http://localhost:3003",
  "http://127.0.0.1:3003",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5500",
  "https://sopy.vercel.app",
]; //white list consumers
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "x-client-id",
    "device-remember-token",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Headers",
    "withCredentials",
    "credentials",
    "Origin",
    "Accept",
  ],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

// init database
require("./database/init.mongodb");

// passport.js
require("./auth/passport");
require("./auth/passport.GoogleSSO");

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("newConnection", async (userId) => {
    console.log("new connection added");
    await addUserToOnlineList({ userId, socketId: socket.id });
  });

  socket.on("disconnectSocket", async (userId) => {
    console.log("delete connection");
    await removeUserById(userId);

    socket.on("chat msg", async (message) => {
      console.log("chat", message);
      io.emit("sendMsg", message);
      const socketId = await checkIfUserIsOnline("649a5397b57f257e24fca462");
      console.log("socketId:: ", socketId);
    });

    // socketListener(socket, io);

    socket.on("sendMessage", async (data) => {
      console.log("a message is sent");
    });

    console.log("socket closed");
    await removeUserBySocketId(socket.id);
  });

  socket.on("error", function (err) {
    console.log(err);
  });
});

app.use((req, res, next) => {
  res.io = io;
  next();
});

app.use(passport.initialize());
app.use(passport.session());

// check if database overloaded ->
// checkOverload();

// init routes
// app.use("/", (req, res) => {
//   res.send("Hello");
// });
app.use("/", require("./routes"));
app.get("/test-socket", (req, res) => {
  const io = res.io;
  io.emit("connection");
  io.emit("chat msg", "test");
  res.send("success");
});

// handle error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: err.message || "Internal Server Error",
  });
});

module.exports = { app: server, io };
