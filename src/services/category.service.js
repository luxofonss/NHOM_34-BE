"use strict";

const category = require("../models/category.model");

class CategoryService {
  static getAllCategory = async () => {
    return await category.find().lean().exec();
  };

  static getCategoryById = async (id) => {
    return await category.findById(id).exec();
  };

  static getCategoryBySubCategoryId = async (subCategoryId) => {
    return await category
      .findOne(
        {
          "subTypes._id": subCategoryId,
        },
        { "subTypes.$": 1 }
      )
      .exec();
  };
}

module.exports = CategoryService;
