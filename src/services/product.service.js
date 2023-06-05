"use strict";

const { productAttribute } = require("../constant/productAttributes");
const { BadRequestError } = require("../core/error.response");
const product = require("../models/product.model");
const mobile = require("../models/products/mobile.model");
const tablet = require("../models/products/tablet.model");
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
const { removeUndefinedObject, getAcceptArray } = require("../utils");

// define Factory class to create products
class ProductFactory {
  /**
   * type: 'Clothing'
   * payload {}
   */

  static productRegistry = {};

  static registerProductType(type, classRef, model) {
    this.productRegistry[type] = { classRef, model: model };
  }

  static async createProduct(type, shopId, payload) {
    const productClass = ProductFactory.productRegistry[type].classRef;
    if (!productClass) {
      throw new BadRequestError(`invalid type ${type}`);
    }
    return new productClass(payload).createProduct(shopId);
  }

  //PATCH
  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type].classRef;
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
      select: ["name", "thumb", "description", "price", "thumb", "shop"],
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

  static async filterProducts({
    limit = 50,
    page = 1,
    filter = {},
    price = { start: 0, end: 10e9 },
    sort = "ctime",
  }) {
    return await findAllProducts({
      limit,
      sort,
      filter: { ...filter, isPublished: true },
      page,
      select: ["name", "thumb", "description", "price", "thumb", "shop"],
    });
  }

  static async getProductAttributes({ type }) {
    const productClass = ProductFactory.productRegistry[type].classRef;
    if (!productClass) {
      throw new BadRequestError(`invalid type ${type}`);
    }
    const prodModel = ProductFactory.productRegistry[type].model;
    console.log("test");
    let attributes = [];
    prodModel.schema.eachPath(function (path) {
      console.log(productAttribute.get(path));
      attributes.push(productAttribute.get(path));
    });

    return getAcceptArray(attributes, ["createdAt", "updatedAt", "_id", "__v"]);
  }
}
// define base product class
class Product {
  constructor({
    name,
    description,
    thumb,
    price,
    type,
    condition,
    preOrder,
    brand,
    manufacturerName,
    manufacturerAddress,
    manufactureDate,
    variations,
    shipping,
    isDraft,
    isPublished,
    attributes,
  }) {
    this.name = name;
    this.description = description;
    this.thumb = thumb;
    this.price = price;
    this.type = type;
    this.condition = condition;
    this.preOrder = preOrder;
    this.brand = brand;
    this.manufacturerName = manufacturerName;
    this.manufacturerAddress = manufacturerAddress;
    this.manufactureDate = manufactureDate;
    this.variations = variations;
    this.shipping = shipping;
    this.isDraft = isDraft;
    this.isPublished = isPublished;
    this.attributes = attributes;
  }

  //create new product
  async createProduct(shopId, productId) {
    const newProduct = await product.create({
      ...this,
      shop: shopId,
      _id: productId,
    });
    if (newProduct) {
      // add product stock to inventory
      await insertInventory({
        productId: newProduct._id,
        shopId: shopId,
        stock: newProduct.quantity,
      });
    }
    return newProduct;
  }

  async updateProduct(productId, payload) {
    return await updateProductById({ productId, payload, model: product });
  }
}

//define sub classes for different products
// class Clothing extends Product {
//   async createProduct() {
//     const newClothing = await clothing.create(this.attributes);
//     if (!newClothing) throw new BadRequestError("create new clothing error");

//     const newProduct = await super.createProduct(newClothing._id);
//     if (!newProduct) throw new BadRequestError("create new product error");

//     return newProduct;
//   }

//   async updateProduct(productId) {
//     //1. remove attr has null || undefined
//     const objectParams = removeUndefinedObject(this);
//     console.log("objectParams: ", objectParams);
//     //2. check update field
//     if (objectParams.attributes) {
//       //update child
//       await updateProductById({ productId, objectParams, model: clothing });
//     }

//     const updateProduct = await super.updateProduct(productId, objectParams);
//     return updateProduct;
//   }
// }

class Mobile extends Product {
  async createProduct(shopId) {
    const newMobile = await mobile.create(this.attributes);

    if (!newMobile) throw new BadRequestError("create new mobile error");

    const newProduct = await super.createProduct(shopId, newMobile._id);
    if (!newProduct) throw new BadRequestError("create new product error");

    return newProduct;
  }

  async getProductAttributes() {
    console.log("test");
    const attributes = [];
    mobile.schema.eachPath(function (path) {
      console.log(path);
      attributes.push(path);
      console.log(path);
    });

    return attributes;
  }
}

class Tablet extends Product {
  async createProduct() {
    const newTablet = await tablet.create(this.attributes);

    if (!newTablet) throw new BadRequestError("create new tablet error");

    const newProduct = await super.createProduct(newTablet._id);
    if (!newProduct) throw new BadRequestError("create new product error");

    return newProduct;
  }

  async getProductAttributes() {
    const attributes = [];
    tablet.schema.eachPath(function (path) {
      attributes.push(path);
      console.log(path);
    });

    return attributes;
  }
}

// register product type
// ProductFactory.registerProductType("Electronic", Electronic);
// ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Mobile", Mobile, mobile);
ProductFactory.registerProductType("Tablet", Tablet, tablet);

module.exports = ProductFactory;
