'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Hash password untuk admin
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Cek apakah user admin sudah ada
      const [existingUser] = await queryInterface.sequelize.query(
        `SELECT * FROM Users WHERE email = 'admin@admin.com' OR username = 'admin' LIMIT 1`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      if (existingUser) {
        console.log('User admin sudah ada, melewatkan pembuatan user baru');
        return;
      }
      
      // Insert admin user
      return queryInterface.bulkInsert('Users', [{
        id: uuid(),
        username: 'admin',
        email: 'admin@admin.com',
        password: hashedPassword,
        first_name: 'Admin',
        last_name: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
    } catch (error) {
      console.error('Error creating admin user:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', {
      email: 'admin@admin.com'
    }, {});
  }
};

