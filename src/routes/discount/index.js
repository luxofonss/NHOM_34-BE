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

router.use(asyncHandler(authentication));

//for shop
router.post("/amount", asyncHandler(discountController.getDiscountAmount));
router.post("", asyncHandler(discountController.createDiscountCode));
router.get("", asyncHandler(discountController.getALlDiscountCodesByShop));
router.delete("", asyncHandler(discountController.deleteDiscount));

//for user
router.post("/cancel", asyncHandler(discountController.cancelDiscount));
router.get("/:id", asyncHandler(discountController.userGetDiscount));

module.exports = router;
