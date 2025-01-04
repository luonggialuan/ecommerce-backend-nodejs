'use strict'

const { HEADER } = require('../configs/constants')
const { findById } = require('../services/apikey.service')

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString()
    if (!key) {
      return res.status(401).json({ message: 'Forbidden Error' })
    }
    // check object key
    const objKey = await findById(key)

    if (!objKey) {
      return res.status(401).json({ message: 'Forbidden Error' })
    }

    req.objKey = objKey

    return next()
  } catch (error) {
    return next(error)
  }
}

const permission = (permission) => {
  return async (req, res, next) => {
    if (!req.objKey.permissions.includes(permission)) {
      return res.status(401).json({ message: 'Permission denied' })
    }

    return next()
  }
}

module.exports = {
  apiKey,
  permission
}
