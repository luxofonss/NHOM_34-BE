"use strict";
const express = require("express");
const discountController = require("../../controllers/discount.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

router.get(
  "/list-product-code",
  asyncHandler(discountController.getAllDiscountCodesWithProduct)
);

router.use(authentication);

router.post("/amount", asyncHandler(discountController.getDiscountAmount));
router.post("", asyncHandler(discountController.createDiscountCode));
router.get("", asyncHandler(discountController.getALlDiscountCodesByShop));

module.exports = router;
