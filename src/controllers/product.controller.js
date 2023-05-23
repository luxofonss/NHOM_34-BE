"use strict";

const ProductFactory = require("../services/product.service");
const { Ok, Created, SuccessResponse } = require("../core/success.response");

class ProductController {
  //POST
  static createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Product created successfully!",
      metadata: await ProductFactory.createProduct(
        req.body.type,
        req.user.userId,
        req.body
      ),
    }).send(res);
  };

  static publishProductByShop = async (req, res) => {
    new SuccessResponse({
      message: "Product published successfully!",
      metadata: await ProductFactory.publishProductByShop({
        shop: req.user.userId,
        productId: req.params.id,
      }),
    }).send(res);
  };

  static unpublishProductByShop = async (req, res) => {
    new SuccessResponse({
      message: "Product unpublished successfully!",
      metadata: await ProductFactory.unpublishProductByShop({
        shop: req.user.userId,
        productId: req.params.id,
      }),
    }).send(res);
  };

  //PATCH
  static updateProduct = async (req, res) => {
    new SuccessResponse({
      message: "Update product successfully!",
      metadata: await ProductFactory.updateProduct(
        req.body.type,
        req.params.productId,
        {
          ...req.body,
          shop: req.user.userId,
        }
      ),
    }).send(res);
  };

  // GET
  static findOneProduct = async (req, res) => {
    new SuccessResponse({
      message: "Find product successfully!",
      metadata: await ProductFactory.findOneProduct({
        productId: req.params.productId,
      }),
    }).send(res);
  };

  static findAllProducts = async (req, res) => {
    new SuccessResponse({
      message: "Find all products successfully!",
      metadata: await ProductFactory.findAllProducts(req.query),
    }).send(res);
  };

  static findAllDraftForShop = async (req, res) => {
    console.log("find all draft for shop");
    new SuccessResponse({
      message: "Find all draft for shop successfully!",
      metadata: await ProductFactory.findAllDraftForShop({
        shop: req.user.userId,
      }),
    }).send(res);
  };

  static findAllPublishForShop = async (req, res) => {
    new SuccessResponse({
      message: "Find all publish for shop successfully!",
      metadata: await ProductFactory.findAllPublishForShop({
        shop: req.user.userId,
      }),
    }).send(res);
  };

  static searchProducts = async (req, res) => {
    new SuccessResponse({
      message: "Search products successfully!",
      metadata: await ProductFactory.searchProducts(req.params),
    }).send(res);
  };
}

module.exports = ProductController;
