const {Sequelize} = require('sequelize');

require("dotenv").config()
const env = process.env.NODE_ENV
console.log(env)
// if (env === 'development' || env === 'test'){
// }

const capsEnv = env.toUpperCase() 

const username = process.env["DB_USERNAME_" + capsEnv]
const password = process.env["DB_PASSWORD_" + capsEnv]
const database = process.env["DB_NAME_" + capsEnv]
const host = process.env["DB_HOST_" + capsEnv]
const dialect = process.env["DB_DIALECT_" + capsEnv]
const port = process.env["DB_PORT_" + capsEnv]



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

const sequelize = new Sequelize(
    database,
    username,
    password,
    {
      dialect: dialect,
      host: host,
      port: port,
      dialectOptions: {
        useUTC: false,
        dateStrings: true,
        typeCast: true
      },
      timezone: 'Asia/Jakarta',
      poolmax: 10
    },
  
  );



module.exports = sequelize;