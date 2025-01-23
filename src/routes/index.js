'use strict'
const express = require('express')
const { apiKey, permission } = require('../auth/checkAuth')
const { pushToLogDiscord } = require('../middlewares')
const router = express.Router()

router.use(pushToLogDiscord)

// check api key
router.use(apiKey)

// check permission
router.use(permission('0000'))

// Add routes
router.use('/v1/api/checkout', require('./checkout'))
router.use('/v1/api/comment', require('./comment'))
router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api/cart', require('./cart'))
router.use('/v1/api/inventory', require('./inventory'))
router.use('/v1/api/product', require('./product'))
router.use('/v1/api', require('./access'))

module.exports = router
