'use strict'

const { STATUS_CODE, REASON_STATUS_CODE } = require('../configs/constants')

class SuccessResponse {
  constructor({
    message,
    statusCode = STATUS_CODE.OK,
    reasonStatusCode = REASON_STATUS_CODE.OK,
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

const OK = ({ message = REASON_STATUS_CODE.OK, metadata = {} }) => {
  return new SuccessResponse({
    message,
    metadata,
    statusCode: STATUS_CODE.OK
  })
}

const CREATED = ({
  message = REASON_STATUS_CODE.CREATED,
  metadata = {},
  options = {}
}) => {
  const res = new SuccessResponse({
    message,
    metadata,
    statusCode: STATUS_CODE.CREATED
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
