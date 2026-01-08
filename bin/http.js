const app = require('../app')
const port = process.env.PORT || 3000

// Listen on all interfaces (0.0.0.0) to allow access from Apache reverse proxy
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Backend listening on port ${port}`)
  console.log(`📍 Access at: http://0.0.0.0:${port} or http://localhost:${port}`)
})