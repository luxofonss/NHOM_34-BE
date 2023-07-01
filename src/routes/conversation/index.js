"use strict";
const express = require("express");
const conversationController = require("../../controllers/conversation.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

router.use(asyncHandler(authentication));

router.post("/new", asyncHandler(conversationController.getNewConversation));
router.get("/", asyncHandler(conversationController.getUserConversations));

module.exports = router;
