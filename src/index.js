const express = require('express')
const helmet = require('helmet')
const session = require('cookie-session')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const colors = require('colors')

globalThis.logger = {
  info: (message = '', info = '') => {
    const date = new Date().toISOString()

    return console.log(`${colors.magenta(`[${date}]:`)} ${colors.cyan(message)}`, colors.cyan(info))
  },
  success: (message = '', info = '') => {
    const date = new Date().toISOString()

    return console.log(
      `${colors.magenta(`[${date}]:`)} ${colors.green(message)}`,
      colors.green(info)
    )
  },
  error: (message = '', info = '') => {
    const date = new Date().toISOString()

    return console.log(`${colors.magenta(`[${date}]:`)} ${colors.red(message)}`, colors.red(info))
  },
  warn: (message = '', info = '') => {
    const date = new Date().toISOString()

    return console.log(
      `${colors.magenta(`[${date}]:`)} ${colors.yellow(message)}`,
      colors.yellow(info)
    )
  },
}

const app = express()

app.use(express.json())
app.use(helmet())
app.use(
  cors({
    methods: ['POST', 'PUT', 'GET', 'DELETE'],
    origin: process.env.TYPE === 'develop' ? '*' : process.env.CORS_ALLOWED_ORIGINS,
  })
)

const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.use(
  session({
    name: 'session',
    keys: [process.env.COOKIE_KEY1, process.env.COOKIE_KEY2],
    cookie: {
      secure: true,
      httpOnly: true,
      domain: 'joaoroldaodev.com',
      path: '/session',
      expires: expiryDate,
    },
  })
)

app.use(cookieParser())

app.disable('x-powered-by') // reduce fingerprint by docs express

const redis = require('./redis')
const { RateLimiterRedis } = require('rate-limiter-flexible')

const rateLimiterRedis = new RateLimiterRedis({
  storeClient: redis,
  points: 10, // max 10 requests
  duration: 60, // 60s
})

const rateLimiterMiddleware = (req, res, next) => {
  rateLimiterRedis
    .consume(req.ip)
    .then(() => {
      next()
    })
    .catch((_) => {
      res.status(429).send('Too Many Requests')
    })
}

app.use(rateLimiterMiddleware)

app.use((req, res, next) => {
  const date = new Date()

  req.on('end', () => {
    logger.info(
      `URL: ${req.originalUrl} | METHOD: ${req.method} | STATUS: ${res.statusCode} | TIME: ${new Date() - date}ms`
    )
  })

  req.redisInstance = redis

  res.returnJson = (stt, message, data) => {
    return res.status(stt).json({ message, data })
  }

  res.returnRes = (stt, data) => {
    return res.status(stt).send(data)
  }

  next()
})

const authRouter = require('./routes/auth.routes')

app.use('/auth', authRouter)

app.use((req, res, next) => {
  res.status(404).send('Route not found')
})

app.use((err, req, res, next) => {
  console.error(err)

  res.status(500).send(`Error: ${err.message}`)
})

const server = app.listen(process.env.PORT || 4000, () => {
  logger.info('Initializing project 3... 2... 1...')
  console.log(`
  █████╗ ██████╗ ██╗    ██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗███████╗
 ██╔══██╗██╔══██╗██║    ██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝██╔════╝
 ███████║██████╔╝██║    ██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║   ███████╗
 ██╔══██║██╔═══╝ ██║    ██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║   ╚════██║
 ██║  ██║██║     ██║    ██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║   ███████║
 ╚═╝  ╚═╝╚═╝     ╚═╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   ╚══════╝

                            public project of api REST

────────────────────────────────────────────────────────────────────────────────────────────

  API project to centralize routes, middleware, routines, queues,
  and access to relational and non-relational databases.

────────────────────────────────────────────────────────────────────────────────────────────
    `)
  logger.info(`🚀 Server running on http://localhost:${process.env.PORT || 4000}`)
  logger.warn(
    'ATENÇÃO: Tudo e qualquer conteúdo foi retirado de documentações reais: express, sequelize, node, prisma, ioredis, helmet, cookies, rate limit...'
  )
})

process.on('SIGTERM', () => {
  debug('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    debug('HTTP server closed')
  })
})
