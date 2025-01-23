const redisPubSubService = require('../services/redisPubSub.service')

class ProductServiceTest {
  purchaseProduct(productId, quantity) {
    const order = { productId, quantity }

    console.log(
      '🐾 ~ file: product.test.js:7 ~ ProductServiceTest ~ purchaseProduct ~ order:',
      order
    )
    redisPubSubService.publish('purchase_events', JSON.stringify(order))
  }
}
module.exports = new ProductServiceTest()
