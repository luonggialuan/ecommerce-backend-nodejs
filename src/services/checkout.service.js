'use strict'

const { NotFoundError, BadRequestError } = require('../core/error.response')
const orderModel = require('../models/order.model')
const { findCartById } = require('../models/repositories/cart.repo')
const { checkProductByServer } = require('../models/repositories/product.repo')
const { getDiscountAmount } = require('./discount.service')
const { acquireLock, releaseLock } = require('./redis.service')

class CheckoutService {
  static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {
    // check cartId
    const foundCart = await findCartById(cartId)
    if (!foundCart) throw new NotFoundError('Cart does not exists!')

    const checkout_order = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0
    }
    const shop_order_ids_new = []

    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = []
      } = shop_order_ids[i]

      const checkProductServer = await checkProductByServer(item_products)

      if (!checkProductServer[0]) throw new BadRequestError('Order wrong!')

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price
      }, 0)

      checkout_order.totalPrice += checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer
      }

      // if exist shop_discounts
      if (shop_discounts.length > 0) {
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer
        })

        checkout_order.totalDiscount += discount

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
        }
      }
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
      shop_order_ids_new.push(itemCheckout)
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order
    }
  }

  static async orderByUser(
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {}
  ) {
    const { shop_order_ids_new, checkout_order } = await this.checkoutReview({
      cartId,
      userId,
      shop_order_ids
    })

    //
    const products = shop_order_ids_new.flatMap((order) => order.item_products)
    console.log(
      '🐾 ~ file: checkout.service.js:88 ~ CheckoutService ~ products:',
      products
    )
    const acquireProduct = []

    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i]
      const keyLock = await acquireLock(productId, quantity, cartId)

      acquireProduct.push(keyLock ? true : false)
      if (keyLock) await releaseLock(keyLock)
    }

    if (acquireProduct.includes(false))
      throw new BadRequestError(
        'Some products have been updated. Please return to the cart.'
      )

    //
    const newOrder = await orderModel.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new
    })

    // if order success, remove products in cart
    if (newOrder) {
      // remove product in cart
    }

    return newOrder
  }

  // Query orders [Users]
  static async getOrdersByUser() {}

  // Query order using id [Users]
  static async getOneOrderByUser() {}

  // Cancel order
  static async cancelOrderByUser() {}

  // Update order status [Shop | Admin]
  static async updateOrderStatusByShop() {}
}

module.exports = CheckoutService
