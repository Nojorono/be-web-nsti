'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Content extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Content.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    title_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    title_en: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    content_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    content_en: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    meta_description_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    meta_description_en: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    meta_keywords_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    meta_keywords_en: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Content',
    tableName: 'contents',
    timestamps: true
  });
  return Content;
};
