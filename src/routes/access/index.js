'use strict'
const express = require('express')
const accessController = require('../../controllers/access.controller')
const catchAsync = require('../../utils/catchAsync')

const router = express.Router()

// signin
router.post('/shop/sign-up', catchAsync(accessController.signUp))

module.exports = router
