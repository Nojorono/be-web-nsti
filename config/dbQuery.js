const {Sequelize} = require('sequelize');

require("dotenv").config()

const env = process.env.NODE_ENV || 'development'
const capsEnv = env.toUpperCase() 

// Baca dari .env dengan format: DB_USERNAME_DEVELOPMENT, DB_PASSWORD_DEVELOPMENT, dll
// Atau gunakan fallback values jika .env tidak ada
const username = process.env["DB_USERNAME_" + capsEnv] ?? process.env.DB_USERNAME ?? "root"
const password = process.env["DB_PASSWORD_" + capsEnv] ?? process.env.DB_PASSWORD ?? "admin123"
const database = process.env["DB_NAME_" + capsEnv] ?? process.env.DB_NAME ?? "nikkisu1_public"
const host = process.env["DB_HOST_" + capsEnv] ?? process.env.DB_HOST ?? "127.0.0.1"
const dialect = process.env["DB_DIALECT_" + capsEnv] ?? process.env.DB_DIALECT ?? "mysql"
const port = process.env["DB_PORT_" + capsEnv] ?? process.env.DB_PORT ?? 3306


// Gunakan nilai dari .env, bukan hardcoded
// Pastikan host menggunakan IPv4 (127.0.0.1) bukan localhost untuk menghindari IPv6
const finalHost = host === 'localhost' ? '127.0.0.1' : host;

const sequelize = new Sequelize(
    database,
    username,
    password,
    {
      dialect: 'mysql',
      host: host,
      port: port,
      dialectOptions: {
        // useUTC tidak valid untuk MySQL2, dihapus
        dateStrings: true,
        typeCast: true
      },
      timezone: '+07:00', // Format timezone yang benar untuk Sequelize (bukan 'Asia/Jakarta')
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    },
  
  );



module.exports = sequelize;