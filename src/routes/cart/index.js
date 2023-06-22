"use strict";
const express = require("express");
const cartController = require("../../controllers/cart.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

router.use(asyncHandler(authentication));

router.post("", asyncHandler(cartController.addToCart));
router.delete("", asyncHandler(cartController.deleteCart));
router.post("/update", asyncHandler(cartController.updateCart));
router.get("", asyncHandler(cartController.getCart));
router.put("/", asyncHandler(cartController.setAllCheck));
router.put("/shop", asyncHandler(cartController.setShopCheck));
router.put("/product", asyncHandler(cartController.setProductCheck));
router.put("/delete", asyncHandler(cartController.deleteItem));

module.exports = router;
