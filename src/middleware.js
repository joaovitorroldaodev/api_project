const express = require('express')
const middleware = express.Router()

middleware.use((req, res, next) => {
  next()
})

module.exports = middleware
