const app = require('./src/app')

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

// CTRL C to stop the server
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server is stopped')
  })
  // notify.send(ping...)
})
