'use strict'

const { CREATED, SuccessResponse } = require('../core/success.response')
const AccessService = require('../services/access.service')

class AccessController {
  logout = async (req, res, next) => {
    const data = await AccessService.logout(req.keyStore)

    new SuccessResponse({
      message: 'Logout success',
      metadata: data
    }).send(res)
  }

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
