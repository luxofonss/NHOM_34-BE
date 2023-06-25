"use strict";

const ProductFactory = require("../services/product.service");
const { Ok, Created, SuccessResponse } = require("../core/success.response");

class ProductController {
  //POST
  static createProduct = async (req, res, next) => {
    console.log("file: ", req.files);
    console.log("body: ", req.body);
    new SuccessResponse({
      message: "Product created successfully!",
      metadata: await ProductFactory.createProduct(
        req.body.typeId,
        req.files,
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
        req.body.typeId,
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

  static findAllProductsForShop = async (req, res) => {
    console.log("query: ", req.query);
    new SuccessResponse({
      message: "Find all products successfully!",
      metadata: await ProductFactory.findAllProductsForShop({
        stock: req.query.stock,
        sold: req.query.sold,
        limit: req.query.pageSize,
        page: req.query.page,
        filter: JSON.parse(req.query.filter),
        shop: req.user.userId,
      }),
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

  static filterProducts = async (req, res) => {
    console.log("Filter Products");
    console.log(req.body);
    new SuccessResponse({
      message: "Filter products successfully!",
      metadata: await ProductFactory.filterProducts(req.body),
    }).send(res);
  };

  static getProductAttributes = async (req, res) => {
    new SuccessResponse({
      message: "Get product attributes successfully!",
      metadata: await ProductFactory.getProductAttributes({
        typeId: req.query.typeId,
      }),
    }).send(res);
  };

  static getProductsByCategoryId = async (req, res) => {
    console.log("req:: ", req.query, req.params);
    new SuccessResponse({
      message: "Get products successfully!",
      metadata: await ProductFactory.getProductsByCategoryId({
        categoryId: req.params.id,
      }),
    }).send(res);
  };
}

module.exports = ProductController;
