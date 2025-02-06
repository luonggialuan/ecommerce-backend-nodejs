'use strict'
const express = require('express')
const catchAsync = require('../../helpers/catchAsync')
const { authenticationV2 } = require('../../auth/authUtils')
const notificationController = require('../../controllers/notification.controller')

const router = express.Router()

//* authentication *//
router.use(authenticationV2)

router.get('', catchAsync(notificationController.listNotiByUser))

module.exports = router
