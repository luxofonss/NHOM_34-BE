"use strict";

const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronic } = require("../models/product.model");
const { insertInventory } = require("../models/repositories/inventory.repo");
const {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unpublishProductByShop,
  searchProducts,
  findAllProducts,
  findOneProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { removeUndefinedObject } = require("../utils");

// define Factory class to create products
class ProductFactory {
  /**
   * type: 'Clothing'
   * payload {}
   */

  static productRegistry = {};

  static registerProductType(type, classRef) {
    this.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`invalid type ${type}`);
    }
    return new productClass(payload).createProduct();
  }

  //PATCH
  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`invalid type ${type}`);
    }
    return new productClass(payload).updateProduct(productId);
  }

  //PUT
  static async publishProductByShop({ shop, productId }) {
    return await publishProductByShop({ shop, productId });
  }

  static async unpublishProductByShop({ shop, productId }) {
    return await unpublishProductByShop({ shop, productId });
  }

  //GET
  static async findOneProduct({ productId }) {
    return await findOneProduct({ productId, unSelect: ["__v"] });
  }

  static async findAllProducts({
    limit = 50,
    page = 1,
    filter = { isPublished: true },
    sort = "ctime",
  }) {
    return await findAllProducts({
      limit,
      sort,
      filter,
      page,
      select: ["name", "description", "price", "thumb", "shop"],
    });
  }

  static async findAllDraftForShop({ shop, limit = 50, skip = 0 }) {
    const query = { shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ shop, limit = 50, skip = 0 }) {
    const query = { shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async searchProducts({ keywords }) {
    return await searchProducts({ keywords });
  }
}
// define base product class
class Product {
  constructor({
    name,
    description,
    thumb,
    quantity,
    type,
    price,
    shop,
    attributes,
  }) {
    this.name = name;
    this.description = description;
    this.thumb = thumb;
    this.quantity = quantity;
    this.type = type;
    this.price = price;
    this.shop = shop;
    this.attributes = attributes;
  }

  //create new product
  async createProduct(productId) {
    const newProduct = await product.create({ ...this, _id: productId });
    if (newProduct) {
      // add product stock to inventory
      await insertInventory({
        productId: newProduct._id,
        shopId: this.shop,
        stock: this.quantity,
      });
    }
    return newProduct;
  }

  async updateProduct(productId, payload) {
    return await updateProductById({ productId, payload, model: product });
  }
}

//define sub classes for different products
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.attributes);
    if (!newClothing) throw new BadRequestError("create new clothing error");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("create new product error");

    return newProduct;
  }

  async updateProduct(productId) {
    //1. remove attr has null || undefined
    const objectParams = removeUndefinedObject(this);
    console.log("objectParams: ", objectParams);
    //2. check update field
    if (objectParams.attributes) {
      //update child
      await updateProductById({ productId, objectParams, model: clothing });
    }

    const updateProduct = await super.updateProduct(productId, objectParams);
    return updateProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create(this.attributes);
    if (!newElectronic)
      throw new BadRequestError("create new electronic error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("create new product error");

    return newProduct;
  }
}

// register product type
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);

module.exports = ProductFactory;
