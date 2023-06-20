"use strict";
const express = require("express");
const { authentication } = require("../../auth/authUtils");
const orderController = require("../../controllers/order.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");

router.use(asyncHandler(authentication));
router.get("/:id", asyncHandler(orderController.getOrderByIdForShop));
router.get("/shop", asyncHandler(orderController.getShopOrders));
router.post("/add", asyncHandler(orderController.addNewUserOrder));

module.exports = router;
