const redisPubSubService = require('../services/redisPubSub.service')

class InventoryServiceTest {
  constructor() {
    redisPubSubService.subscribe('purchase_events', (channel, message) => {
      console.log(
        '🐾 ~ file: inventory.test.js:6 ~ InventoryServiceTest ~ redisPubSubService.subscribe ~ message:',
        message
      )
      InventoryServiceTest.updateInventory(message)
    })
  }

  static updateInventory(object) {
    console.log(
      `Update inventory ${JSON.parse(object).productId} with quantity ${
        JSON.parse(object).quantity
      }`
    )
  }
}

module.exports = new InventoryServiceTest()
