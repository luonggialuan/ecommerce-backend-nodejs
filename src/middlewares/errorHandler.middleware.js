'use strict'

const notFoundHandler = (req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
}

const errorHandler = (error, req, res, next) => {
  const statusCode = error.status || 500
  res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : error.stack
  })
}

module.exports = {
  notFoundHandler,
  errorHandler
}
