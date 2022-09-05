'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class career extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  career.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    location: DataTypes.STRING,
    link: DataTypes.STRING,
    level: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'career',
  });
  return career;
};