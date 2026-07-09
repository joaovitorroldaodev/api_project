const express = require('express')

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())

const authRouter = require('./routes/auth.routes')

app.use('/auth', authRouter)

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
  })
})

app.use((err, req, res, next) => {
  console.error(err)

  res.status(500).json({
    message: err.message,
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
