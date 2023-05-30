"use strict";

const product = require("../product.model");
const { Types } = require("mongoose");
const {
  getSelectData,
  getUnselectData,
  convertToObjectIdMongodb,
} = require("../../utils/index");

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const findOneProduct = async ({ productId, unSelect }) => {
  return await product
    .findById(productId)
    .select(getUnselectData(unSelect))
    .exec();
};

const findAllProducts = async ({ limit, page, filter, sort, select }) => {
  const skip = limit * (page - 1);
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    .exec();
  return products;
};

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const searchProducts = async ({ keywords }) => {
  const regexSearch = new RegExp(keywords);
  const results = await product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean()
    .exec();
  return results;
};

const updateProductById = async ({
  productId,
  payload,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, payload, { new: isNew });
};

const publishProductByShop = async ({ shop, productId }) => {
  const foundProduct = await product
    .findOne({
      shop: new Types.ObjectId(shop),
      _id: new Types.ObjectId(productId),
    })
    .exec();

  if (!foundProduct) {
    return null;
  }

  foundProduct.isDraft = false;
  foundProduct.isPublished = true;
  console.log("foundProduct: ", foundProduct);

  const { modifiedCount } = await foundProduct.save();
  return modifiedCount;
};

const unpublishProductByShop = async ({ shop, productId }) => {
  const foundProduct = await product
    .findOne({
      shop: new Types.ObjectId(shop),
      _id: new Types.ObjectId(productId),
    })
    .exec();

  if (!foundProduct) {
    return null;
  }

  foundProduct.isDraft = true;
  foundProduct.isPublished = false;
  console.log("foundProduct: ", foundProduct);

  const { modifiedCount } = await foundProduct.save();
  return modifiedCount;
};

const getProductById = async (productId) => {
  return await product.findById(productId).lean().exec();
};

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product.productId);
      if (foundProduct) {
        return {
          price: foundProduct.price,
          quantity: product.quantity,
          productId: product.productId,
        };
      }
    })
  );
};

module.exports = {
  findOneProduct,
  findAllProducts,
  findAllDraftForShop,
  findAllPublishForShop,
  publishProductByShop,
  unpublishProductByShop,
  searchProducts,
  updateProductById,
  getProductById,
  checkProductByServer,
};
