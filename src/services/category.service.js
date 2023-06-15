"use strict";

const category = require("../models/category.model");
const { convertToObjectIdMongodb } = require("../utils");

class CategoryService {
  static getAllCategory = async () => {
    return await category.find().lean().exec();
  };

  static getCategoryById = async (id) => {
    return await category.findById(id).exec();
  };

  static increaseSubCategory = async (categoryId, subCategoryId) => {
    const foundCategory = await category
      .findOne({
        _id: convertToObjectIdMongodb(categoryId),
        "subTypes._id": subCategoryId,
      })
      .exec();

    console.log("found category: ", foundCategory);
    return 1;
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
