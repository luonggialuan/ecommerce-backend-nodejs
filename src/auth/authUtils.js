'use strict'

const JWT = require('jsonwebtoken')
const catchAsync = require('../helpers/catchAsync')
const { HEADER } = require('../configs/constants')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { finByUserId } = require('../services/keyToken.service')

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //* JWT with RSA
    // // access token
    // const accessToken = JWT.sign(payload, privateKey, {
    //   algorithm: 'RS256',
    //   expiresIn: '1d'
    // })

    // // refresh token
    // const refreshToken = JWT.sign(payload, privateKey, {
    //   algorithm: 'RS256',
    //   expiresIn: '7d'
    // })
    // access token
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: '1d'
    })

    // refresh token
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: '7d'
    })

    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.log('err', err)
      } else console.log('decoded', decoded)
    })

    return { accessToken, refreshToken }
  } catch (error) {}
}

const authentication = catchAsync(async (req, res, next) => {
  // 1. check userId missing?
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError('Invalid Request')

  // 2. get accessToken
  const keyStore = await finByUserId(userId)
  if (!keyStore) throw new NotFoundError('Not found keyStore')

  // 3. Verify Token
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new AuthFailureError('Invalid Request')

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid User')

    req.keyStore = keyStore

    return next()
  } catch (error) {
    throw error
  }
})

const verifyJWT = async (token, keySecret) => {
  return JWT.verify(token, keySecret)
}

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT
}
