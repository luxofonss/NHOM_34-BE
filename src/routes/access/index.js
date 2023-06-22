"use strict";

const express = require("express");
const AccessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const verifyAccessToken = require("../../middlewares/verifyAccessToken");
const verifyRefreshToken = require("../../middlewares/verifyRefreshToken");
const router = express.Router();

router.post("/auth/signup", AccessController.signUp);
router.post("/auth/login", asyncHandler(AccessController.logIn));
router.post("/auth/logout", [
  asyncHandler(verifyRefreshToken),
  asyncHandler(AccessController.handleLogout),
]);
router.get("/auth/profile", [
  asyncHandler(verifyAccessToken),
  asyncHandler(AccessController.handleProfile),
]);

// OAuth
router.get("/auth/login/google", AccessController.handleLoginGoogle);
router.get("/auth/google/callback", AccessController.handleLoginGoogleCallback);

// Token
router.get(
  "/auth/refresh-token",
  asyncHandler(AccessController.handleRefreshToken)
);

module.exports = router;
