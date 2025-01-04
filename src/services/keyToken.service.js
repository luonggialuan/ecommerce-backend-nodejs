'use strict'

const keytokenModel = require('../models/keytoken.model')

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      //   const publicKeyString = publicKey.toString()
      const tokens = await keytokenModel.create({
        user: userId,
        // publicKey: publicKeyString
        publicKey,
        privateKey
      })

      return tokens ? tokens.publicKey : null
    } catch (error) {
      throw error
    }
  }
}

module.exports = KeyTokenService
