"use strict";
const express = require("express");
const categoryController = require("../../controllers/category.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");

router.get("/:id", asyncHandler(categoryController.getCategoryById));
router.get("/", asyncHandler(categoryController.getAllCategory));
router.get("/sub/:id", asyncHandler(categoryController.getCategoryBySubId));

module.exports = router;
