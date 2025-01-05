'use strict'
const express = require('express')
const accessController = require('../../controllers/access.controller')
const catchAsync = require('../../helpers/catchAsync')
const { authentication } = require('../../auth/authUtils')

const router = express.Router()

// signin
router.post('/shop/signup', catchAsync(accessController.signUp))
router.post('/shop/login', catchAsync(accessController.login))

//* authentication *//
router.use(authentication)

router.post('/shop/logout', catchAsync(accessController.logout))

module.exports = router
