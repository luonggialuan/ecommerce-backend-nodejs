'use strict'

const { SuccessResponse } = require('../core/success.response')
const CommentService = require('../services/comment.service')

class CommentController {
  createComment = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new comment',
      metadata: await CommentService.createComment(req.body)
    }).send(res)
  }

  getCommentsByParentId = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new comment',
      metadata: await CommentService.getCommentsByParentId(req.query)
    }).send(res)
  }

  deleteComments = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete comments successfully!',
      metadata: await CommentService.deleteComments(req.body)
    }).send(res)
  }
}

module.exports = new CommentController()
