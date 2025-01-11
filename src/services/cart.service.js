'use strict'

const { NotFoundError } = require('../core/error.response')
const cartModel = require('../models/cart.model')
const { getProductById } = require('../models/repositories/product.repo')

class CartService {
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: 'active' }
    const updateOrInsert = {
      $addToSet: {
        cart_products: product
      }
    }
    const options = { upsert: true, new: true }

    return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product
    const query = {
      cart_userId: userId,
      'cart_products.productId': productId,
      cart_state: 'active'
    }
    const updateSet = {
      $inc: {
        'cart_products.$.quantity': quantity
      }
    }
    const options = { upsert: true, new: true }

    return await cartModel.findOneAndUpdate(query, updateSet, options)
  }

  static async addToCart({ userId, product = {} }) {
    const userCart = await cartModel.findOne({ cart_userId: userId })
    if (!userCart) {
      return await this.createUserCart({ userId, product })
    }

    if (!userCart.cart_products.length) {
      userCart.cart_products = [product]
      return await userCart.save()
    }

    return await this.updateUserCartQuantity({ userId, product })
  }

  /*
    shop_order_ids:[
      {
        shopId,
        item_products: [
          {
            quantity,
            price,
            shopId,
            old_quantity,
            productId
          }
        ],
        version
      }
    ]
  */
  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0]

    const foundShop = await getProductById(productId)
    if (!foundShop) throw new NotFoundError('Product not found')

    // compare
    if (foundShop.product_shop.toString() !== shop_order_ids[0]?.shopId)
      throw new NotFoundError('Product does not belong to the shop')

    if (quantity === 0) {
      return await this.deleteUserCart({ userId, productId })
    }

    return await this.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity
      }
    })
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: 'active' }
    const updateSet = {
      $pull: {
        cart_products: {
          productId
        }
      }
    }

    const deleteCart = await cartModel.updateOne(query, updateSet)

    return deleteCart
  }

  static async getListUserCart({ userId }) {
    return await cartModel
      .findOne({
        cart_userId: +userId
      })
      .lean()
  }
}

module.exports = CartService
