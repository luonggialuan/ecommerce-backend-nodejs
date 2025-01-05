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
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// init db
require('./dbs/init.mongodb')

// init routes
app.use('/', require('./routes'))

// handling not-found route
app.all('*', notFoundHandler)

// handling errors
app.use(errorHandler)

module.exports = app
