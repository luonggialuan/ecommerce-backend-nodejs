'use strict'

const { ReasonPhrases, StatusCodes } = require('http-status-codes')

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metadata = {}
  }) {
    this.message = !message ? reasonStatusCode : message
    this.status = statusCode
    this.metadata = metadata
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this)
  }
}

const OK = ({ message = ReasonPhrases.OK, metadata = {} }) => {
  return new SuccessResponse({
    message,
    metadata,
    statusCode: StatusCodes.OK
  })
}

const CREATED = ({
  message = ReasonPhrases.CREATED,
  metadata = {},
  options = {}
}) => {
  const res = new SuccessResponse({
    message,
    metadata,
    statusCode: StatusCodes.CREATED
  })

  const response = { ...res }
  if (Object.keys(options).length > 0) {
    response.options = options
  }

  return { ...response, send: res.send }
}

module.exports = {
  OK,
  CREATED,
  SuccessResponse
}
