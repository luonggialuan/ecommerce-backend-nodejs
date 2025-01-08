'use strict'

const { model, Schema } = require('mongoose') // Erase if already required
const { PRODUCT_TYPE } = require('../configs/constants')
const shopModel = require('./shop.model')
const slugify = require('slugify')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const DOCUMENT_CLOTHING = 'Clothing'
const COLLECTION_CLOTHING = 'Clothes'

const DOCUMENT_ELECTRONICS = 'Electronics'
const COLLECTION_ELECTRONICS = 'Electronics'

const DOCUMENT_FURNITURES = 'Furniture'
const COLLECTION_FURNITURES = 'Furnitures'

const productChema = new Schema(
  {
    product_name: {
      type: String,
      required: true
    },
    product_thumb: {
      type: String,
      required: true
    },
    product_description: String,
    product_slug: String,
    product_price: {
      type: Number,
      required: true
    },
    product_quantity: {
      type: Number,
      required: true
    },
    product_type: {
      type: String,
      required: true,
      enum: [
        PRODUCT_TYPE.ELECTRONICS,
        PRODUCT_TYPE.CLOTHING,
        PRODUCT_TYPE.FURNITURE
      ]
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true
    },
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be less than 5.0'],
      set: (val) => Math.round(val * 10) / 10
    },
    product_variations: {
      type: Array,
      default: []
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

// Create index for search
productChema.index({ product_name: 'text', productChema: 'text' })
// Document middleware: runs before .save() and .create()
productChema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true })
  next()
})

const clothingSchema = new Schema(
  {
    brand: {
      type: String,
      required: true
    },
    size: String,
    material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    }
  },
  {
    collection: COLLECTION_CLOTHING,
    timestamps: true
  }
)

const electronicsSchema = new Schema(
  {
    manufacturer: {
      type: String,
      required: true
    },
    model: String,
    color: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    }
  },
  {
    collection: COLLECTION_ELECTRONICS,
    timestamps: true
  }
)

const furnituresSchema = new Schema(
  {
    brand: {
      type: String,
      required: true
    },
    size: String,
    material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    }
  },
  {
    collection: COLLECTION_FURNITURES,
    timestamps: true
  }
)

module.exports = {
  productModel: model(DOCUMENT_NAME, productChema),
  clothingModel: model(DOCUMENT_CLOTHING, clothingSchema),
  electronicModel: model(DOCUMENT_ELECTRONICS, electronicsSchema),
  furnitureModel: model(DOCUMENT_FURNITURES, furnituresSchema)
}
