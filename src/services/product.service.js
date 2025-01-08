'use strict'

const { PRODUCT_TYPE } = require('../configs/constants')
const { BadRequestError } = require('../core/error.response')
const {
  productModel,
  clothingModel,
  electronicModel,
  furnitureModel
} = require('../models/product.model')
const {
  queryProduct,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser
} = require('../models/repositories/product.repo')

class ProductFactory {
  // Only Factory Pattern
  //   static async createProduct(type, payload) {
  //     switch (type) {
  //       case PRODUCT_TYPE.CLOTHING:
  //         return new Clothing(payload).createProduct()
  //       case PRODUCT_TYPE.ELECTRONICS:
  //         return new Electronics(payload).createProduct()
  //       default:
  //         throw new BadRequestError(`Invalid Product Types ${type}`)
  //     }
  //   }

  // Factory and Strategy Pattern
  static productRegistry = {} // key-class

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass)
      throw new BadRequestError(`Invalid Product Types ${type}`)

    return new productClass(payload).createProduct()
  }

  // PUT //
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id })
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id })
  }
  // END PUT //

  // query
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true }
    return await queryProduct({ query, limit, skip })
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true }
    return await queryProduct({ query, limit, skip })
  }

  static async searchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch })
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

// Define sub-class for different product type Furnitures
class Furnitures extends Product {
  async createProduct() {
    const newFurniture = await furnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newFurniture) throw new BadRequestError('Create new Furniture error')

    const newProduct = await super.createProduct(newFurniture._id)
    if (!newProduct) throw new BadRequestError('Create new Product error')

    return newProduct
  }
}

ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Furnitures', Furnitures)

module.exports = ProductFactory
