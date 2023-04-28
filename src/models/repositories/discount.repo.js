"use strict";

const { getUnselectData, getSelectData } = require("../../utils");

const findDiscount = async ({ model, filter }) => {
  return await model.findOne(filter).lean().exec();
};

const findAllDiscountCodeUnselect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter = {},
  unselect = [],
  model,
}) => {
  const skip = limit * (page - 1);
  const sortBy = sort === "ctime" ? { _id: -1 } : { id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnselectData(unselect))
    .lean()
    .exec();
  return documents;
};

const findAllDiscountCodeSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter = {},
  select = [],
  model,
}) => {
  const skip = limit * (page - 1);
  const sortBy = sort === "ctime" ? { _id: -1 } : { id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    .exec();
  return documents;
};

module.exports = {
  findDiscount,
  findAllDiscountCodeUnselect,
  findAllDiscountCodeSelect,
};
