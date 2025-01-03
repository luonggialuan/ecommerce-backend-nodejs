const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const app = express()

// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// init db
require('./dbs/init.mongodb')

// init routes
app.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Hello World'
  })
})
// handling errors

module.exports = app
