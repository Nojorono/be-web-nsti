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



// const env = process.env.NODE_ENV

// if (env === 'development' || env === 'test'){
//   require("dotenv").config()
// }

// const capsEnv = env.toUpperCase() 

// const username = process.env["DB_USERNAME_" + capsEnv]
// const password = process.env["DB_PASSWORD_" + capsEnv]
// const database = process.env["DB_NAME_" + capsEnv]
// const host = process.env["DB_HOST_" + capsEnv]
// const dialect = process.env["DB_DIALECT_" + capsEnv]
// const port = process.env["DB_PORT_" + capsEnv]

// console.log(process.env.DB_DATABASE)

// const sequelize = new Sequelize(
//   process.env.DB_DATABASE,
//   process.env.DB_USERNAME,
//   process.env.DB_PASSWORD,
//   {
//     dialect: 'postgres',
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialectOptions: {
//       useUTC: false,
//       dateStrings: true,
//       typeCast: true
//     },
//     timezone: 'Asia/Jakarta',
//     poolmax: 10
//   },

// );

// Gunakan nilai dari .env, bukan hardcoded
// Pastikan host menggunakan IPv4 (127.0.0.1) bukan localhost untuk menghindari IPv6
const finalHost = host === 'localhost' ? '127.0.0.1' : host;

const sequelize = new Sequelize(
    database,
    username,
    password,
    {
      dialect: dialect,
      host: finalHost, // Pastikan menggunakan IPv4
      port: parseInt(port),
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