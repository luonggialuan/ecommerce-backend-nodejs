'use strict'

const { NotFoundError } = require('../core/error.response')
const commentModel = require('../models/comment.model')
const { findProduct } = require('../models/repositories/product.repo')
const { convertToObjectIdMongodb } = require('../utils')

/*
    key features: Comment services
    + add comment [User | SHop]
    + get a list of comments [User, Shop]
    + delete a comment  [User | Shop | Admin]
*/
class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null
  }) {
    const comment = new commentModel({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parenttId: parentCommentId
    })

    let rightValue
    if (parentCommentId) {
      // reply comment
      const parentComment = await commentModel.findById(parentCommentId)
      if (!parentComment) throw new NotFoundError('Comment reply not found!')

      rightValue = parentComment.comment_right

      // update comment
      await commentModel.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_right: { $gte: rightValue }
        },
        { $inc: { comment_right: 2 } }
      )

      await commentModel.updateMany(
        {
          comment_productId: convertToObjectIdMongodb(productId),
          comment_left: { $gt: rightValue }
        },
        { $inc: { comment_left: 2 } }
      )
    } else {
      const maxRightValue = await commentModel.findOne(
        {
          comment_productId: convertToObjectIdMongodb(productId)
        },
        'comment_right',
        {
          sort: { comment_right: -1 }
        }
      )

      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1
      } else {
        rightValue = 1
      }
    }

    // insert to comment
    comment.comment_left = rightValue
    comment.comment_right = rightValue + 1

    await comment.save()
    return comment
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0 // skip
  }) {
    if (parentCommentId) {
      const parent = await commentModel.findById(parentCommentId)
      if (!parent) throw new NotFoundError('Not found comment for profuct')

      const comments = await commentModel
        .find({
          comment_productId: convertToObjectIdMongodb(productId),
          comment_left: { $gt: parent.comment_left },
          comment_right: { $lte: parent.comment_right }
        })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1
        })
        .sort({ comment_left: 1 })

      return comments
    }

    const comments = await commentModel
      .find({
        comment_productId: convertToObjectIdMongodb(productId),
        comment_parentId: parentCommentId
      })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1
      })
      .sort({ comment_left: 1 })

    return comments
  }

  // delete comments
  static async deleteComments({ commentId, productId }) {
    // check the product exist in the database
    const foundProduct = await findProduct({ product_id: productId })

    if (!foundProduct) throw new NotFoundError('Product not found!')

    // xác định left and right of comment
    const comment = await commentModel.findById(commentId)
    if (!comment) throw new NotFoundError('Comment not found!')

    const leftValue = comment.comment_left
    const rightValue = comment.comment_right
    const width = rightValue - leftValue + 1

    // delete comments
    await commentModel.deleteMany({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_left: { $gte: leftValue, $lte: rightValue }
    })

    // cập nhật giá trị left và right còn lại
    await commentModel.updateMany(
      {
        comment_productId: convertToObjectIdMongodb(productId),
        comment_right: { $gt: rightValue }
      },
      { $inc: { comment_right: -width } }
    )

    await commentModel.updateMany(
      {
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: { $gt: rightValue }
      },
      { $inc: { comment_left: -width } }
    )

    return
  }
}

module.exports = CommentService
