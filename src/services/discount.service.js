'use strict'

const { filter } = require('lodash')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const discountModel = require('../models/discount.model')
const {
  findAllDiscountCodeUnSelect,
  checkDiscountExists
} = require('../models/repositories/discount.repo')
const { findAllProduct } = require('../models/repositories/product.repo')
const { convertToObjectIdMongodb } = require('../utils')

/*
    Discount services
    1. Generate Discount [Shop | Admin]
    2. Get discount account [User]
    3. Get all discount codes [User | Shop]
    4. Verify discount code [User]
    5. Delete discount code [Admin | Shop]
    6. Cancel discount code [User]
*/

class DiscountService {
  static async createDiscount(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      users_used,
      max_uses_per_user
    } = payload

    const currentDate = new Date()
    const startDate = new Date(start_date)
    const endDate = new Date(end_date)

    if (startDate >= endDate)
      throw new BadRequestError('Start date must be before end date')

    // create index for discount code
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId)
      })
      .lean()

    if (foundDiscount && foundDiscount.discount_is_active)
      throw new BadRequestError('Discount already existed!')

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_uses: max_uses,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids
    })

    return newDiscount
  }

  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page
  }) {
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId)
      })
      .lean()

    if (!foundDiscount || !foundDiscount.discount_is_active)
      throw new BadRequestError('Discount not existed!')

    const { discount_applies_to, discount_product_ids } = foundDiscount

    let products

    if (discount_applies_to === 'all') {
      // get all product
      products = await findAllProduct({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }

    if (discount_applies_to === 'specific') {
      // get the product ids
      products = await findAllProduct({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }

    return products
  }

  static async getAllDiscountCodeByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodeUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true
      },
      unselect: ['__v', 'discount_shopId'],
      model: discountModel
    })

    return discounts
  }

  // apply discount code
  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId)
      }
    })

    if (!foundDiscount) throw new NotFoundError('Discount not exists')

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_users_used,
      discount_start_date,
      discount_end_date,
      discount_max_uses_per_user,
      discount_type,
      discount_value
    } = foundDiscount

    if (!discount_is_active) throw new NotFoundError('Discount expired!')
    if (!discount_max_uses) throw new NotFoundError('Discount are out!')

    const currentDate = new Date()
    const startDate = new Date(discount_start_date)
    const endDate = new Date(discount_end_date)

    if (currentDate < startDate || currentDate > endDate)
      throw new BadRequestError('Discount code has expired!')

    let totalOrder = 0
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price
      }, 0)

      if (totalOrder < discount_min_order_value)
        throw new BadRequestError(
          `Discount requires a minium order value of ${discount_min_order_value}!`
        )
    }

    if (discount_max_uses_per_user > 0) {
      const userUseDiscount = discount_users_used.find(
        (user) => user.userId === userId
      )

      if (userUseDiscount) {
        // throw new BadRequestError(
        //   'You have reached the maximum uses for this discount code!'
        // )
      }
    }

    //
    const amount =
      discount_type === 'fixed_amount'
        ? discount_value
        : (totalOrder * discount_value) / 100

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const removed = await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId)
    })

    return removed
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId)
      }
    })

    if (!foundDiscount) throw new NotFoundError('Discount not exists')

    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1
      }
    })

    return result
  }
}

module.exports = DiscountService
