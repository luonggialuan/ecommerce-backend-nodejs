'use strict'

const { CREATED, SuccessResponse } = require('../core/success.response')
const AccessService = require('../services/access.service')

class AccessController {
  login = async (req, res, next) => {
    const data = await AccessService.login(req.body)

    new SuccessResponse({
      metadata: data
    }).send(res)
  }

  signUp = async (req, res, next) => {
    const data = await AccessService.signUp(req.body)

    CREATED({
      message: 'Registered OK!',
      metadata: data
    }).send(res)
  }
}

module.exports = new AccessController()
