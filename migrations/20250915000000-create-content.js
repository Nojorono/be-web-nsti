'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      title_id: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      title_en: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      content_id: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      content_en: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      meta_description_id: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      meta_description_en: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      meta_keywords_id: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      meta_keywords_en: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contents');
  }
};
