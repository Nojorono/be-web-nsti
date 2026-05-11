// Load .env FIRST before requiring app (important for PM2!)
const path = require('path')
const fs = require('fs')

// Try multiple .env paths
const envPaths = [
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../.env.production'),
  path.join(process.cwd(), '.env'),
  path.join(process.cwd(), '.env.production')
]

let envLoaded = false
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    console.log(`📄 Loading .env from: ${envPath}`)
    require('dotenv').config({ path: envPath })
    envLoaded = true
    break
  }
}

if (!envLoaded) {
  console.warn('⚠️  Warning: No .env file found! Using environment variables from PM2 or system.')
}

// Debug: Log if password is loaded (without showing actual password)
console.log(`🔐 DB_PASSWORD_PRODUCTION: ${process.env.DB_PASSWORD_PRODUCTION ? '***SET***' : 'undefined'}`)
console.log(`👤 DB_USERNAME_PRODUCTION: ${process.env.DB_USERNAME_PRODUCTION || 'undefined'}`)
console.log(`🗄️  DB_NAME_PRODUCTION: ${process.env.DB_NAME_PRODUCTION || 'undefined'}`)

const app = require('../app')
const port = process.env.PORT || 3000

// Listen on all interfaces (0.0.0.0) to allow access from Apache reverse proxy
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Backend listening on port ${port}`)
  console.log(`📍 Access at: http://0.0.0.0:${port} or http://localhost:${port}`)
  console.log(`📊 NODE_ENV: ${process.env.NODE_ENV || 'not set'}`)
})