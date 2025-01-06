'use strict'

const { Types } = require('mongoose')
const keytokenModel = require('../models/keytoken.model')

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken
  }) => {
    try {
      // level 0
      // //   const publicKeyString = publicKey.toString()
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   // publicKey: publicKeyString
      //   publicKey,
      //   privateKey
      // })
      // return tokens ? tokens.publicKey : null
      // level xxx
      const filter = { user: userId }
      const update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken
      }
      const options = {
        upsert: true,
        new: true
      }
      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      )

      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }

  static finByUserId = async (userId) => {
    return await keytokenModel
      .findOne({ user: new Types.ObjectId(userId) })
      .lean()
  }

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne(id)
  }

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean()
  }
  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken })
  }

  static deleteKeyByUderId = async (userId) => {
    return await keytokenModel.findOneAndDelete({ user: userId })
  }
}

module.exports = KeyTokenService
