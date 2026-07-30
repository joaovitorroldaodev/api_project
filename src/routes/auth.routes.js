const express = require('express')
const middleware = require('../middleware')

const router = express.Router()

router.post('/ping', middleware, (req, res) => {
  return res.returnRes('PONG', 200)
})

module.exports = router
