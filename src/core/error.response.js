'use strict'

const { STATUS_CODE, REASON_STATUS_CODE } = require('../configs/constants')

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = REASON_STATUS_CODE.CONFLICT,
    statusCode = STATUS_CODE.CONFLICT
  ) {
    super(message, statusCode)
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = REASON_STATUS_CODE.BAD_REQUEST,
    statusCode = STATUS_CODE.BAD_REQUEST
  ) {
    super(message, statusCode)
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(
    message = REASON_STATUS_CODE.UNAUTHORIZED,
    statusCode = STATUS_CODE.UNAUTHORIZED
  ) {
    super(message, statusCode)
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = REASON_STATUS_CODE.NOT_FOUND,
    statusCode = STATUS_CODE.NOT_FOUND
  ) {
    super(message, statusCode)
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(
    message = REASON_STATUS_CODE.FORBIDDEN,
    statusCode = STATUS_CODE.FORBIDDEN
  ) {
    super(message, statusCode)
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError
}
