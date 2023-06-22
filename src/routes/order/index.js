"use strict";
const express = require("express");
const { authentication } = require("../../auth/authUtils");
const orderController = require("../../controllers/order.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");

router.use(asyncHandler(authentication));
router.get("", asyncHandler(orderController.getAndFilterOrder));
router.get("/me", asyncHandler(orderController.getUserOrders));
router.get("/shop", asyncHandler(orderController.getShopOrders));
router.put("/confirm", asyncHandler(orderController.confirmOrders));
router.put("/reject", asyncHandler(orderController.rejectOrder));
router.put("/cancel", asyncHandler(orderController.cancelOrder));
router.put("/shipping", asyncHandler(orderController.shippingOrders));
router.post("/add", asyncHandler(orderController.addNewUserOrder));
router.get("/:id", asyncHandler(orderController.getOrderByIdForShop));

module.exports = router;
