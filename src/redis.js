const Redis = require('ioredis')
const redisClient = new Redis({
  port: process.env.REDIS_PORT ?? 6379,
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  username: process.env.REDIS_USERNAME ?? '',
  password: process.env.REDIS_PASSWORD ?? '',
  enableOfflineQueue: false, // Compatibility with rate limiter
})

redisClient.on('connect', () => {
  logging.info('REDIS: Conexão TCP estabelecida.')
})

redisClient.on('ready', () => {
  logging.success('REDIS: Pronto para receber comandos.')
})

redisClient.on('reconnecting', (delay) => {
  logging.warn(`REDIS: Reconectando em ${delay}ms...`)
})

redisClient.on('close', () => {
  logging.warn('REDIS: Conexão encerrada.')
})

redisClient.on('end', () => {
  logging.error('REDIS: Cliente encerrado. Não haverá novas tentativas de reconexão.')
})

redisClient.on('error', (err) => {
  logging.error('REDIS:', err)
})

module.exports = redisClient
