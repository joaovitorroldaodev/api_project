const express = require('express')
const middleware = require('../middleware')

const authController = require('../controllers/auth.controller')

const router = express.Router()

// router.post('/register', middleware, authController.register)

router.post('/login', middleware, authController.login)

// router.post('/logout', middleware, authController.logout)

module.exports = router
