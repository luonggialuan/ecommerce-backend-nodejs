'use strict'

const express = require('express')
const catchAsync = require('../../helpers/catchAsync')
const { authenticationV2 } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')

const router = express.Router()

router.get(
  '/search/:keySearch',
  catchAsync(productController.getListSearchProduct)
)
router.get('', catchAsync(productController.getListAllProduct))
router.get('/:product_id', catchAsync(productController.getProduct))

//* authentication *//
router.use(authenticationV2)

router.post('', catchAsync(productController.createProduct))
router.put('/publish/:id', catchAsync(productController.publishProductByShop))
router.put(
  '/unpublish/:id',
  catchAsync(productController.unPublishProductByShop)
)

// Query
router.get('/drafts/all', catchAsync(productController.getAllDraftsForShop))
router.get('/published/all', catchAsync(productController.getAllPublishForShop))

module.exports = router
