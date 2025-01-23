'use strict'
const express = require('express')
const catchAsync = require('../../helpers/catchAsync')
const { authenticationV2 } = require('../../auth/authUtils')
const commentController = require('../../controllers/comment.controller')

const router = express.Router()

//* authentication *//
router.use(authenticationV2)

router.get('', catchAsync(commentController.getCommentsByParentId))
router.post('', catchAsync(commentController.createComment))

module.exports = router
