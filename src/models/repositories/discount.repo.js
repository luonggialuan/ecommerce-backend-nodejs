'use strict'

const { unGetSelectData } = require('../../utils')

const findAllDiscountCodeUnSelect = async ({
  limit = 50,
  sort = 'ctime',
  page = 1,
  filter,
  unselect,
  model
}) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const result = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unselect))
    .lean()

  return result
}

const findAllDiscountCodeSelect = async ({
  limit = 50,
  sort = 'ctime',
  page = 1,
  filter,
  select,
  model
}) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const result = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(select))
    .lean()

  return result
}

const checkDiscountExists = async ({ model, filter }) => {
  return await model.findOne(filter).lean()
}

module.exports = {
  findAllDiscountCodeSelect,
  findAllDiscountCodeUnSelect,
  checkDiscountExists
}
