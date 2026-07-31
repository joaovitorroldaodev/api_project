const express = require('express')
const middleware = express.Router()
const jwt = require('jsonwebtoken')
const { createAuthCredentials } = require('./helpers/general-tools')

const keys = JSON.parse(process.env.ALLOWED_TOKENS)
const ALLOWED_KEYS = new Map(typeof keys === 'object' ? Object.entries(keys) : null)

middleware.use(async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) return res.returnRes(401, 'No token receive')
  const token = authorization.replace('Bearer ', '')

  if (!ALLOWED_KEYS.get(token)) return res.returnRes(401, 'Invalid token')

  let valid = false

  if (req.baseUrl !== '/auth') {
    const { access_token, refresh_token } = req.cookies

    if (!!access_token) {
      const decoded = jwt.verify(access_token, process.env.JWT_SECRET)

      if (typeof decoded === 'string') {
        return res.returnRes(401, 'Token inválido')
      }

      if (!!decoded) {
        valid = true
        req.decoded = decoded
      }
    }

    if ((!access_token || !valid) && !!refresh_token) {
      const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET)

      if (typeof decoded === 'string') {
        return res.returnRes(401, 'Token inválido')
      }

      if (!!decoded) {
        valid = true
        req.decoded = decoded

        await createAuthCredentials(req, res, decoded)
      }
    }
  } else {
    valid = true
  }

  if (!valid) return res.returnJson(401, 'Invalid authorization credentials', { logged: false })

  next()
})

module.exports = middleware
