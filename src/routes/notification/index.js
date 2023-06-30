"use strict";
const express = require("express");
const notificationController = require("../../controllers/notification.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

router.use(asyncHandler(authentication));

router.get("/", asyncHandler(notificationController.getUserNotifications));

module.exports = router;
