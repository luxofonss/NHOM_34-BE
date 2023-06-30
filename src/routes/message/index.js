"use strict";
const express = require("express");
const messageController = require("../../controllers/message.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

router.use(asyncHandler(authentication));

router.post("/", asyncHandler(messageController.sendMessage));
router.get("/", asyncHandler(messageController.getMessageInConversation));

module.exports = router;
