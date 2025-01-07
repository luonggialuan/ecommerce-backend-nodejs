'use strict'

const express = require('express')
const catchAsync = require('../../helpers/catchAsync')
const { authenticationV2 } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')

const router = express.Router()

//* authentication *//
router.use(authenticationV2)

router.post('', catchAsync(productController.createProduct))

module.exports = router
