'use strict'

const express = require('express')
const catchAsync = require('../../helpers/catchAsync')
const { authenticationV2 } = require('../../auth/authUtils')
const discountController = require('../../controllers/discount.controller')

const router = express.Router()

// get amount a discount
router.post('/amount', catchAsync(discountController.getDiscountAmount))
router.get(
  '/list-product-code',
  catchAsync(discountController.getAllDiscountCodesWithProduct)
)

//* authentication *//
router.use(authenticationV2)

router.post('', catchAsync(discountController.createDiscountCode))
router.get('', catchAsync(discountController.getAllDiscountCodesByShop))

module.exports = router
