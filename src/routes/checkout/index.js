'use strict'
const express = require('express')
const catchAsync = require('../../helpers/catchAsync')
const { authenticationV2 } = require('../../auth/authUtils')
const checkoutController = require('../../controllers/checkout.controller')

const router = express.Router()

//* authentication *//
// router.use(authenticationV2)

router.post('/review', catchAsync(checkoutController.checkoutReview))

module.exports = router
