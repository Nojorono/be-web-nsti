
// {
  
//   "development": {
//     "username": "root",
//     "password": "",
//     "database": "public",
//     "host": "localhost",
//     "dialect": "mysql",
//     "port": 3306
//   },
//   "test": {
//     "username": "root",
//     "password": null,
//     "database": "database_test",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "production": {
//     "username": "root",
//     "password": null,
//     "database": "database_production",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   }
// }
require("dotenv").config()

const env = process.env.NODE_ENV

if (env === 'development' || env === 'test'){
}

const capsEnv = env.toUpperCase() 

const username = process.env["DB_USERNAME_" + capsEnv] ?? "nikkisu1_prod"
// const password = process.env["DB_PASSWORD_" + capsEnv] ?? "nikki1234!SUPER"
const password = process.env["DB_PASSWORD_" + capsEnv] ?? "Dy1Io2sfe3KY"
const database = process.env["DB_NAME_" + capsEnv] ?? "nikkisu1_public"
const host = process.env["DB_HOST_" + capsEnv] ?? "localhost"
const dialect = process.env["DB_DIALECT_" + capsEnv] ?? "mysql"
const port = process.env["DB_PORT_" + capsEnv] ?? 3306

console.log(username, password, database, host,"INI TEST")

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

