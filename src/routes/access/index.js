'use strict'
const express = require('express')
const accessController = require('../../controllers/access.controller')
const catchAsync = require('../../helpers/catchAsync')
const { authenticationV2 } = require('../../auth/authUtils')

const router = express.Router()

// signin
router.post('/shop/signup', catchAsync(accessController.signUp))
router.post('/shop/login', catchAsync(accessController.login))

//* authentication *//
router.use(authenticationV2)

router.post('/shop/logout', catchAsync(accessController.logout))
router.post(
  '/shop/handler-refresh-token',
  catchAsync(accessController.handlerRefreshToken)
)

module.exports = router
