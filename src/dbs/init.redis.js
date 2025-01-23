const { createClient } = require('redis')
const { RedisErrorResponse } = require('../core/error.response')
const { StatusCodes } = require('http-status-codes')

let client = {}
let statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
  },
  connectionTimeout

const REDIS_CONNECT_TIMEOUT = 10000
const REDIS_CONNECT_MESSAGE = {
  code: -99,
  message: {
    vn: 'Lỗi',
    en: 'Redis server connection error'
  }
}

const handleTimeoutError = () => {
  connectionTimeout = setTimeout(() => {
    throw new RedisErrorResponse({
      message: REDIS_CONNECT_MESSAGE.message.vn,
      statusCode: REDIS_CONNECT_MESSAGE.code
    })
  }, REDIS_CONNECT_TIMEOUT)
}

const handleEventConnection = (connectionRedis) => {
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log(`Redis - Connection status: ${statusConnectRedis.CONNECT}`)
    clearTimeout(connectionTimeout)
  })

  connectionRedis.on(statusConnectRedis.END, () => {
    console.log(`Redis - Connection status: ${statusConnectRedis.END}`)
    handleTimeoutError()
  })

  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log(`Redis - Connection status: ${statusConnectRedis.RECONNECT}`)
    clearTimeout(connectionTimeout)
  })

  connectionRedis.on(statusConnectRedis.ERROR, (err) => {
    console.log(`Redis - Connection status: ${err}`)
    handleTimeoutError()
  })
}

const initRedis = async () => {
  if (!client.instanceConnect) {
    try {
      const instanceRedis = createClient()
      handleEventConnection(instanceRedis)
      await instanceRedis.connect()
      client.instanceConnect = instanceRedis

      console.log('Redis client initialized successfully')
    } catch (err) {
      console.error('Failed to initialize Redis client:', err)
      throw err
    }
  } else {
    console.warn('Redis client is already initialized.')
  }
}

const getRedis = () => {
  if (!client.instanceConnect) {
    console.warn('Redis client is not initialized yet.')
  }
  return client
}

const closeRedis = async () => {
  if (client.instanceConnect) {
    try {
      await client.instanceConnect.quit()
      console.log('Redis client closed successfully')
      client.instanceConnect = null
    } catch (err) {
      console.error('Failed to close Redis client:', err)
    }
  } else {
    console.warn('Redis client is not initialized or already closed.')
  }
}

module.exports = {
  initRedis,
  getRedis,
  closeRedis
}
