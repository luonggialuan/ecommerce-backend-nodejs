'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { ROLE_SHOP } = require('../configs/constants')
const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError
} = require('../core/error.response')
const { findByEmail } = require('./shop.service')

class AccessService {
  // static handlerRefreshToken = async (refreshToken) => {
  //   // check token used
  //   const foundToken = await KeyTokenService.findByRefreshTokenUsed(
  //     refreshToken
  //   )

  //   // check refreshToken already use or not
  //   if (foundToken) {
  //     const { userId, email } = await verifyJWT(
  //       refreshToken,
  //       foundToken.privateKey
  //     )

  //     await KeyTokenService.deleteKeyByUderId(userId)
  //     throw new ForbiddenError('Something went wrong! Please login again!')
  //   }

  //   const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
  //   if (!holderToken) throw new AuthFailureError('Shop not registered 1')

  //   // verify token
  //   const { userId, email } = await verifyJWT(
  //     refreshToken,
  //     holderToken.privateKey
  //   )

  //   // check userId
  //   const foundShop = await findByEmail({ email })
  //   if (!foundShop) throw new AuthFailureError('Shop not registered 2')

  //   // create new tokens
  //   const tokens = await createTokenPair(
  //     { userId, email },
  //     holderToken.publicKey,
  //     holderToken.privateKey
  //   )

  //   await holderToken.updateOne({
  //     $set: {
  //       refreshToken: tokens.refreshToken
  //     },
  //     $addToSet: {
  //       refreshTokensUsed: refreshToken
  //     }
  //   })

  //   return {
  //     user: { userId, email },
  //     tokens
  //   }
  // }
  static handlerRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyByUderId(userId)
      throw new ForbiddenError('Something went wrong! Please login again!')
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError('Shop not registered')

    // check userId
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new AuthFailureError('Shop not registered')

    // create new tokens
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    )

    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken // refreshToken alredy used
      }
    })

    return {
      user,
      tokens
    }
  }

  static logout = async (keyStore) => {
    const delKey = KeyTokenService.removeKeyById(keyStore._id)
    return delKey
  }

  static login = async ({ email, password, refreshToken = null }) => {
    // 1. check emailin dbs
    const foundShop = await findByEmail({ email })

    if (!foundShop) throw new BadRequestError('Account not registered!')

    const { _id: userId } = foundShop

    // 2. check password
    const match = bcrypt.compare(password, foundShop.password)
    if (!match) throw new AuthFailureError('Authentication error')

    // 3. create AT and RT and save
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    // 4. generate tokens
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    )

    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken
    })

    // 5. get data return login
    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: foundShop
      }),
      tokens
    }
  }

  static signUp = async ({ name, email, password }) => {
    try {
      // check email is already exist
      const hoderShop = await shopModel.findOne({ email }).lean()

      if (hoderShop) {
        throw new BadRequestError('Email already registered!')
      }

      const passwordHash = await bcrypt.hash(password, 10)

      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [ROLE_SHOP.SHOP]
      })

      if (newShop) {
        // Cryptography Standards
        // created privatedKey, publicKey
        // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: 'pkcs1', // pkcs8
        //     format: 'pem'
        //   },
        //   privateKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem'
        //   }
        // })
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey
        })

        if (!keyStore) {
          return {
            code: 'xxx',
            message: 'keyStore not created'
          }
        }

        // const publicKeyObject = crypto.createPublicKey(publicKeyString) // convert publicKeyString to publicKeyObject

        // create token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email, roles: newShop.roles },
          publicKey,
          privateKey
        )

        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ['_id', 'name', 'email', 'roles'],
              object: newShop
            }),
            tokens
          }
        }
      }

      return {
        code: 200,
        message: null
      }
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error'
      }
    }
  }
}

module.exports = AccessService
