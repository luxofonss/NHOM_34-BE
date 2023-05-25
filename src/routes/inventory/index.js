"use strict";
const express = require("express");
const inventoryController = require("../../controllers/inventory.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

router.use(authentication);


router.post('', asyncHandler(inventoryController.addStockToInventory));

module.exports = router;
