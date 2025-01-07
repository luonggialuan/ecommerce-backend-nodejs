'use strict'

const { PRODUCT_TYPE } = require('../configs/constants')
const { BadRequestError } = require('../core/error.response')
const {
  productModel,
  clothingModel,
  electronicModel
} = require('../models/product.model')

class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case PRODUCT_TYPE.CLOTHING:
        return new Clothing(payload).createProduct()
      case PRODUCT_TYPE.ELECTRONICS:
        return new Electronics(payload).createProduct()
      default:
        throw new BadRequestError(`Invalid Product Types ${type}`)
    }
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
  }

  // create new product
  async createProduct(product_id) {
    return await productModel.create({ ...this, _id: product_id })
  }
}

// Define sub-class for different product type Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newClothing) throw new BadRequestError('Create new Clothing error')

    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) throw new BadRequestError('Create new Product error')

    return newProduct
  }
}

// Define sub-class for different product type Electronics
class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newElectronic)
      throw new BadRequestError('Create new Electronics error')

    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) throw new BadRequestError('Create new Product error')

    return newProduct
  }
}

module.exports = ProductFactory
