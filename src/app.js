const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const {
  notFoundHandler,
  errorHandler
} = require('./middlewares/errorHandler.middleware')
const app = express()

// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// init db
require('./dbs/init.mongodb')
const { initRedis } = require('./dbs/init.redis')

;(async () => {
  try {
    await initRedis()
    console.log('Redis initialized successfully')
  } catch (error) {
    console.error('Failed to initialize Redis:', error)
    process.exit(1) // Exit the app if Redis fails to initialize
  }
})()
// test pub sub redis
// require('./tests/inventory.test')
// const productTest = require('./tests/product.test')
// productTest.purchaseProduct('product:001', 10)

// init routes
app.use('/', require('./routes'))

// handling not-found route
app.use(notFoundHandler)

// handling errors
app.use(errorHandler)

module.exports = app
