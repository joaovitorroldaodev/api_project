const express = require('express')
const middleware = express.Router()

const ALLOWED_KEYS = new Map(process.env.ALLOWED_TOKENS ?? [])

middleware.use((req, res, next) => {
  const authorizationToken = req.headers.authorization

  if (!authorizationToken || !ALLOWED_KEYS.get(authorizationToken))
    return res.returnRes('No token receive', 404)

  next()
})

module.exports = middleware
