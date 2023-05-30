"use strict";

const express = require("express");
const userController = require("../../controllers/user.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const router = express.Router();
const { authentication } = require("../../auth/authUtils");

router.use(authentication);

router.post("/register", asyncHandler(userController.registerUserAsShop));

module.exports = router;
