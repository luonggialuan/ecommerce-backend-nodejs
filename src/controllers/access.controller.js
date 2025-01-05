'use strict'

const { CREATED } = require('../core/success.response')
const AccessService = require('../services/access.service')

class AccessController {
  signUp = async (req, res, next) => {
    const data = await AccessService.signUp(req.body)

    CREATED({
      message: 'Registered OK!',
      metadata: data
    }).send(res)
  }
}

module.exports = new AccessController()
