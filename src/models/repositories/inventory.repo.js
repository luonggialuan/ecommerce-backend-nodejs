const { convertToObjectIdMongodb } = require('../../utils')
const inventoryModel = require('../inventory.model')

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = 'unKnow'
}) => {
  return await inventoryModel.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location
  })
}

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
    inven_productId: convertToObjectIdMongodb(productId),
    inven_stock: { $gre: quantity }
  }
  const updateSet = {
    $inc: {
      inven_stock: -quantity
    },
    $push: {
      inven_reservation: {
        quantity,
        cartId,
        createOn: new Date()
      }
    }
  }
  const options = { upsert: true, new: true }

  return await inventoryModel.updateOne(query, updateSet)
}

module.exports = {
  insertInventory,
  reservationInventory
}
