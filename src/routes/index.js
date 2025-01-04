'use strict'
const express = require('express')

const router = express.Router()

// Add routes
router.use('/v1/api', require('./access'))

module.exports = router
