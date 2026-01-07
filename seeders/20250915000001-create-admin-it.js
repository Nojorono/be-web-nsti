'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Hash password untuk admin_it
      const hashedPassword = await bcrypt.hash('@Dm1n123!!', 10);
      
      // Insert admin_it user
      return queryInterface.bulkInsert('Users', [{
        id: 'admin-it-' + Date.now(),
        username: 'admin_it',
        email: 'admin_it@nikkisuper.co.id',
        password: hashedPassword,
        first_name: 'Admin',
        last_name: 'IT',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
    } catch (error) {
      console.error('Error creating admin_it user:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', {
      username: 'admin_it'
    }, {});
  }
};
