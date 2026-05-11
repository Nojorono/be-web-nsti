require("dotenv").config()

const env = process.env.NODE_ENV || 'development'

const capsEnv = env.toUpperCase()

// Debug: Log environment variables
console.log('=== Database Configuration ===');
console.log('NODE_ENV:', env);
console.log('capsEnv:', capsEnv);
console.log('DB_USERNAME_' + capsEnv + ':', process.env["DB_USERNAME_" + capsEnv]);
console.log('DB_PASSWORD_' + capsEnv + ':', process.env["DB_PASSWORD_" + capsEnv] ? '***SET***' : 'undefined');
console.log('DB_NAME_' + capsEnv + ':', process.env["DB_NAME_" + capsEnv]);
console.log('DB_HOST_' + capsEnv + ':', process.env["DB_HOST_" + capsEnv]);
console.log('');

const username = process.env["DB_USERNAME_" + capsEnv] ?? "nikkisu1_prod"
// const password = process.env["DB_PASSWORD_" + capsEnv] ?? "nikki1234!SUPER"
const password = process.env["DB_PASSWORD_" + capsEnv] ?? "Dy1Io2sfe3KY"
const database = process.env["DB_NAME_" + capsEnv] ?? "nikkisu1_public"
// Pastikan menggunakan IPv4 (127.0.0.1) bukan localhost untuk menghindari masalah IPv6
let host = process.env["DB_HOST_" + capsEnv] ?? "127.0.0.1"
host = host === 'localhost' ? '127.0.0.1' : host
const dialect = process.env["DB_DIALECT_" + capsEnv] ?? "mysql"
const port = process.env["DB_PORT_" + capsEnv] ?? 3306

console.log('=== Final Database Config ===');
console.log('Username:', username);
console.log('Password:', password ? '***SET***' : 'undefined');
console.log('Database:', database);
console.log('Host:', host);
console.log('Dialect:', dialect);
console.log('Port:', port);
console.log('');

module.exports = {
  "development": {
    username,
    password, 
    database,
    host,
    dialect,
    port
  },
  "test": {
    username,
    password,
    database,
    host,
    dialect,
    port
  },
  "production": { 
    username,
    password,
    database,
    host,
    dialect,
    port,
    use_env_variable:"localhost",
    // dialectOptions: {
    //   ssl: {
    //       rejectUnauthorized: false
    //   }
    // }
  }
}

