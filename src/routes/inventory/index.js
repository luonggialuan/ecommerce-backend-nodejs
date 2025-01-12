'use strict'
const express = require('express')
const catchAsync = require('../../helpers/catchAsync')
const { authenticationV2 } = require('../../auth/authUtils')
const inventoryController = require('../../controllers/inventory.controller')

const router = express.Router()

//* authentication *//
router.use(authenticationV2)

router.post('', catchAsync(inventoryController.addStockToInventory))

module.exports = router
