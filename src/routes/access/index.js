'use strict'
const express = require('express')
const accessController = require('../../controllers/access.controller')
const catchAsync = require('../../utils/catchAsync')

const router = express.Router()

// signin
router.post('/shop/signup', catchAsync(accessController.signUp))
router.post('/shop/login', catchAsync(accessController.login))

module.exports = router
