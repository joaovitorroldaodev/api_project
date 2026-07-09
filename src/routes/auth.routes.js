const express = require('express')
const middleware = require('../middleware')

const router = express.Router()

router.post('/ping', middleware, (req, res) => {
  return res.status(200).send('PONG')
})

module.exports = router
