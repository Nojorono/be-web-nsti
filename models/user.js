'use strict';
const {
  Model
} = require('sequelize');

const helpers = require('../helpers/helper')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id:{type:DataTypes.STRING,primaryKey:true},
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
      hooks: {
        beforeCreate: (instance, options) => {
          instance.password = helpers.hashPassword(instance.password)
        }
      }
  });
  return User;
};