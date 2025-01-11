'use strict'
const express = require('express')
const catchAsync = require('../../helpers/catchAsync')
const { authenticationV2 } = require('../../auth/authUtils')
const cartController = require('../../controllers/cart.controller')

const router = express.Router()

//* authentication *//
// router.use(authenticationV2)

router.post('', catchAsync(cartController.addToCart))
router.delete('', catchAsync(cartController.delete))
router.post('/update', catchAsync(cartController.update))
router.get('', catchAsync(cartController.listToCart))

module.exports = router
