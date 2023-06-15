"use strict";

const { SuccessResponse } = require("../core/success.response");
const CategoryService = require("../services/category.service");

class CategoryController {
  static async getAllCategory(req, res, next) {
    return new SuccessResponse({
      message: "Get all categories successfully!",
      metadata: await CategoryService.getAllCategory(),
    }).send(res);
  }

  static async getCategoryById(req, res, next) {
    return new SuccessResponse({
      message: "Get category successfully!",
      metadata: await CategoryService.getCategoryById(req.params.id),
    }).send(res);
  }

  static async getCategoryBySubId(req, res, next) {
    return new SuccessResponse({
      message: "Get category successfully!",
      metadata: await CategoryService.getCategoryBySubCategoryId(req.params.id),
    }).send(res);
  }
}

module.exports = CategoryController;
