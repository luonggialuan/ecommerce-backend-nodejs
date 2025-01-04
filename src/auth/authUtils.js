'use strict'

const JWT = require('jsonwebtoken')

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

module.exports = {
  createTokenPair
}
