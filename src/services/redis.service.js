'use strict'

const redis = require('redis')
const { promisify } = require('util')
const {
  reservationInventory
} = require('../models/repositories/inventory.repo')
const redisClient = redis.createClient()

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err)
})
;(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect()
      console.log('Connected to Redis')
    }

    // Proper usage of `ping` in Redis 4.x
    const pingResult = await redisClient.ping()
    console.log('Redis Ping Response:', pingResult) // Should print "PONG" if successful
  } catch (err) {
    console.error('Error connecting to Redis:', err)
    process.exit(1) // Exit process if Redis fails to connect
  }
})()

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
