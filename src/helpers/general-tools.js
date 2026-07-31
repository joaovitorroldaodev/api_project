const jwt = require('jsonwebtoken')

module.exports.encode = (value, type = 'utf8', hashTo = 'base64') => {
  return Buffer.from(value, type).toString(hashTo)
}

module.exports.decode = (value, type = 'base64', hashTo = 'utf8') => {
  return Buffer.from(value, type).toString(hashTo)
}

module.exports.compare = (value1, value2) => {
  return Buffer.compare(value1, value2)
}

module.exports.createAuthCredentials = async (req, res, user) => {
  const redis = req.redisInstance

  const payload = {
    userId: user.id,
    userUid: user.uuid,
    userRole: user.role,
    dt_token: new Date().toISOString(),
  }

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' })
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })

  const key = `refresh:${user.uuid}`
  await redis.del(key)
  await redis.set(key, refreshToken, 'EX', 60 * 60 * 24 * 7)

  await res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: 60 * 15,
  })

  await res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return true
}
