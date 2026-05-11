'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;

// Fallback: Jika config tidak valid (username/database undefined), gunakan dbQuery.js langsung
if (!config || !config.username || !config.database) {
  console.log('⚠️  Warning: Using dbQuery.js directly due to invalid config');
  const dbQuery = require(__dirname + '/../config/dbQuery.js');
  sequelize = dbQuery;
} else if (config.use_env_variable) {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
} else {
  // Pastikan semua parameter yang diperlukan ada
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      dialect: config.dialect || 'mysql',
      port: config.port || 3306,
      dialectOptions: config.dialectOptions,
      timezone: config.timezone || '+07:00',
      logging: config.logging || false
    }
  );
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
