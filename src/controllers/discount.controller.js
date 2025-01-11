'use strict'

const { SuccessResponse } = require('../core/success.response')
const DiscountService = require('../services/discount.service')

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Successful Code Generations',
      metadata: await DiscountService.createDiscount({
        ...req.body,
        shopId: req.user.userId
      })
    }).send(res)
  }

  getAllDiscountCodesByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list code successfully!',
      metadata: await DiscountService.getAllDiscountCodeByShop({
        ...req.query,
        shopId: req.user.userId
      })
    }).send(res)
  }

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: 'successfully!',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body
      })
    }).send(res)
  }

  getAllDiscountCodesWithProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list code successfully!',
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query
      })
    }).send(res)
  }
}

module.exports = new DiscountController()
