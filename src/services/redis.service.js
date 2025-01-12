'use strict'

const { resolve } = require('path')
const redis = require('redis')
const { promisify } = require('util')
const {
  reservationInventory
} = require('../models/repositories/inventory.repo')
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2025_${productId}`
  const retryTimes = 10
  const expireTime = 3000 // 3s lock

  for (let i = 0; i < retryTimes.length; i++) {
    const result = await setnxAsync(key, expireTime)
    console.log(
      '🐾 ~ file: redis.service.js:16 ~ acquireLock ~ result:',
      result
    )

    if (result === 1) {
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId
      })
      if (isReservation.modifiedCount) {
        await pexpire(key, expireTime)
        return key
      }

      return null
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient)
  return await delAsyncKey(keyLock)
}

module.exports = {
  acquireLock,
  releaseLock
}
