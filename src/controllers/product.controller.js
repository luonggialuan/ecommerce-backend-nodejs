'use strict'

const { SuccessResponse } = require('../core/success.response')
const ProductFactory = require('../services/product.service')

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Product success!',
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Publish the product success!',
      metadata: await ProductFactory.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id
      })
    }).send(res)
  }

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Unpublish the product success!',
      metadata: await ProductFactory.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id
      })
    }).send(res)
  }

  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list Drafts success',
      metadata: await ProductFactory.findAllDraftsForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list Publish success',
      metadata: await ProductFactory.findAllPublishForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list search product success',
      metadata: await ProductFactory.searchProduct(req.params)
    }).send(res)
  }

  getListAllProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list all product success',
      metadata: await ProductFactory.findAllProduct(req.query)
    }).send(res)
  }

  getProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get the product success',
      metadata: await ProductFactory.findProduct({
        product_id: req.params.product_id
      })
    }).send(res)
  }
}

module.exports = new ProductController()
