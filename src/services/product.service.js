"use strict";

const { productAttribute } = require("../constant/productAttributes");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const product = require("../models/product.model");
const mobile = require("../models/products/mobile.model");
const tablet = require("../models/products/tablet.model");
const UploadService = require("../services/upload.service");
const { insertVariation } = require("../models/repositories/variation.repo");
const {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unpublishProductByShop,
  searchProducts,
  findAllProducts,
  findOneProduct,
  updateProductById,
  addVariationToProduct,
  findAllProductsForShop,
} = require("../models/repositories/product.repo");
const {
  removeUndefinedObject,
  getAcceptArray,
  convertToObjectIdMongodb,
} = require("../utils");
const CategoryService = require("./category.service");

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

  static async createProduct(typeId, files, shopId, payload) {
    const hasCategory = await CategoryService.getCategoryBySubCategoryId(
      typeId
    );

    if (!hasCategory) {
      throw new NotFoundError("Category not found, please try again!");
    }

    const className = hasCategory.subTypes[0].classRef;
    console.log("className", className);

    const productClass = ProductFactory.productRegistry[className].classRef;
    if (!productClass) {
      throw new BadRequestError(`invalid type ${className}`);
    }
    return new productClass({ ...payload, files: files }).createProduct(shopId);
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
    const foundProduct = await findOneProduct({ productId, unSelect: ["__v"] });
    console.log("found product", foundProduct);

    const hasCategory = await CategoryService.getCategoryBySubCategoryId(
      foundProduct.typeId
    );

    if (!hasCategory) {
      throw new NotFoundError("Category not found, please try again!");
    }

    const className = hasCategory.subTypes[0].classRef;
    const productModel = ProductFactory.productRegistry[className].model;
    if (!productModel) {
      throw new BadRequestError(`invalid type ${className}`);
    }

    const result = foundProduct.populate([
      { path: "variations" },
      {
        path: "attributes",
        model: productModel,
      },
    ]);

    return result;
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

  static async findAllProductsForShop({
    stock,
    sold,
    limit = 10,
    page = 1,
    filter = {},
    sort = "ctime",
  }) {
    console.log("stock in service:: ", stock);
    return await findAllProductsForShop({
      stock,
      sold,
      limit,
      page,
      filter,
      sort,
      select: [
        "name",
        "thumb",
        "description",
        "thumb",
        "variations",
        "isDraft",
        "sold",
        "sku",
      ],
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

  static async getProductAttributes({ typeId }) {
    const hasCategory = await CategoryService.getCategoryBySubCategoryId(
      typeId
    );

    if (!hasCategory) {
      throw new NotFoundError("Category not found, please try again!");
    }
    const type = hasCategory.subTypes[0].classRef;
    const productClass = ProductFactory.productRegistry[type].classRef;
    if (!productClass) {
      throw new BadRequestError(`invalid type`);
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
    typeId,
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
    files,
    sku,
  }) {
    this.name = name;
    this.description = description;
    this.thumb = thumb;
    this.typeId = typeId;
    this.condition = condition;
    this.preOrder = preOrder;
    this.brand = brand;
    this.manufacturerName = manufacturerName;
    this.manufacturerAddress = manufacturerAddress;
    this.manufactureDate = manufactureDate;
    this.variations = JSON.parse(variations);
    this.shipping = JSON.parse(shipping);
    this.isDraft = isDraft;
    this.isPublished = isPublished;
    this.attributes = JSON.parse(attributes);
    this.files = files;
    this.sku = sku;
  }

  //create new product
  async createProduct(shopId, productId) {
    console.log("in files: ", this.files);

    let productThumbs = [];
    await Promise.all(
      this.files.map(async (file) => {
        console.log("file: ", file);
        if (file.fieldname === "thumb") {
          let url = await UploadService.uploadSingleImage(file);
          console.log("url: " + url);
          productThumbs.push(url);
        }
      })
    );

    console.log("productThumbs:: ", productThumbs);

    let minPrice = 10e9,
      maxPrice = 0;
    let quantity = 0;
    console.log("variations: ", this.variations);

    //cast to number fail NaN
    
    this.variations.forEach((item) => {
      console.log("variations: ", item);
      if (!item.children) {
        quantity += item.stock;
        if (parseInt(item.price) < minPrice) {
          minPrice = parseInt(item.price);
        }
        if (parseInt(item.price) > maxPrice) {
          maxPrice = parseInt(item.price);
        }
      } else {
        item.children.forEach((subItem) => {
          console.log("subItem: ", subItem);

          quantity += parseInt(subItem.stock);
          if (parseInt(subItem.price) < minPrice) {
            minPrice = parseInt(subItem.price);
          }
          if (parseInt(subItem.price) > maxPrice) {
            maxPrice = parseInt(subItem.price);
          }
        });
      }
    });
    this.quantity = quantity;
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    const productAttributes = {
      name: this.name,
      description: this.description,
      typeId: this.typeId,
      condition: this.condition,
      preOrder: this.preOrder,
      brand: this.brand,
      manufacturerName: this.manufacturerName,
      manufacturerAddress: this.manufacturerAddress,
      manufactureDate: this.manufactureDate,
      shipping: this.shipping,
      isDraft: this.isDraft,
      thumb: productThumbs,
      isPublished: this.isPublished,
      sku: this.sku,
      attributes: productId,
      minPrice: minPrice,
      maxPrice: maxPrice,
      quantity: quantity,
    };
    const newProduct = await product.create({
      ...productAttributes,
      shop: shopId,
      _id: productId,
    });
    if (newProduct) {
      await Promise.all(
        this.variations.map(async (variation, index) => {
          let variationThumb = "";
          await Promise.all(
            this.files.map(async (file) => {
              console.log("fieldname:", file.fieldname);
              console.log(
                "equal: ",
                file.fieldname,
                `variations[${index}].thumb`,
                file.fieldname === `variations[${index}].[thumb]`
              );
              if (file.fieldname === `variations[${index}].thumb`) {
                console.log("uploading...");
                let url = await UploadService.uploadSingleImage(file);
                console.log("url: ", url);
                variationThumb = url;
              }
            })
          );

          console.log("variationThumb: ", variationThumb);

          if (variation.children) {
            await Promise.all(
              variation.children.map(async (subVariation) => {
                const newVariation = await insertVariation({
                  productId: newProduct._id,
                  keyVariation: variation.name,
                  keyVariationValue: variation.value,
                  subVariation: subVariation.name,
                  subVariationValue: subVariation.value,
                  stock: subVariation.stock,
                  price: subVariation.price,
                  thumb: variationThumb,
                  isSingle: false,
                });

                await addVariationToProduct({
                  id: newProduct._id,
                  variation: convertToObjectIdMongodb(newVariation._id),
                });
              })
            );
          } else {
            const newVariation = await insertVariation({
              productId: newProduct._id,
              keyVariation: variation.name,
              keyVariationValue: variation.value,
              stock: variation.stock,
              price: variation.price,
              thumb: variationThumb,
            });
            await addVariationToProduct({
              id: newProduct._id,
              variation: convertToObjectIdMongodb(newVariation._id),
            });
          }
        })
      );
    }

    return newProduct;
  }

  async updateProduct(productId, payload) {
    const {
      name,
      description,
      typeId,
      condition,
      preOrder,
      brand,
      manufacturerName,
      manufacturerAddress,
      manufactureDate,
      shipping,
      isDraft,
      thumb,
      isPublished,
      attributes,
    } = payload;

    console.log("typeId: ", typeId);

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
