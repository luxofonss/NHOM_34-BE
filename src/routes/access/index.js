"use strict";

const express = require("express");
const AccessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const verifyAccessToken = require("../../middlewares/verifyAccessToken");
const verifyRefreshToken = require("../../middlewares/verifyRefreshToken");
const router = express.Router();

router.post("/user/signup", AccessController.signUp);
router.post("/user/login", asyncHandler(AccessController.logIn));
router.post("/user/logout", [
  asyncHandler(verifyRefreshToken),
  asyncHandler(AccessController.handleLogout),
]);
router.get("/user/profile", [
  asyncHandler(verifyAccessToken),
  asyncHandler(AccessController.handleProfile),
]);

// OAuth
router.get("/auth/login/google", AccessController.handleLoginGoogle);
router.get("/auth/google/callback", AccessController.handleLoginGoogleCallback);

// Token
router.get(
  "/user/refresh-token",
  asyncHandler(AccessController.handleRefreshToken)
);

module.exports = router;
