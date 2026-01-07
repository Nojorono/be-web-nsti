/**
 * Script alternatif untuk membuat user admin dengan password admin123
 * Script ini menggunakan dbQuery.js langsung (hardcoded credentials)
 * 
 * Gunakan script ini jika createAdminUser.js mengalami masalah dengan environment variables
 * 
 * Cara menggunakan:
 * 1. Pastikan database MySQL sudah running
 * 2. Jalankan: node createAdminUserDirect.js
 * 
 * Credentials untuk login:
 * Email: admin@admin.com
 * Password: admin123
 */

const sequelize = require('./config/dbQuery');
const { v4: uuid } = require('uuid');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  try {
    // Debug: Tampilkan config yang digunakan
    console.log('Konfigurasi database yang digunakan:');
    console.log('Host:', sequelize.config.host);
    console.log('Database:', sequelize.config.database);
    console.log('Username:', sequelize.config.username);
    console.log('Port:', sequelize.config.port);
    console.log('');
    
    // Test koneksi database terlebih dahulu
    console.log('Mengecek koneksi database...');
    await sequelize.authenticate();
    console.log('✓ Koneksi database berhasil!\n');
    
    // Cek apakah user admin sudah ada
    const existingUsers = await sequelize.query(
      `SELECT * FROM Users WHERE email = 'admin@admin.com' LIMIT 1`,
      { type: sequelize.QueryTypes.SELECT }
    );

    if (existingUsers && existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      console.log('User admin sudah ada!');
      console.log('Email:', existingUser.email);
      console.log('Username:', existingUser.username);
      return;
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    
    // Buat user admin baru
    const adminId = uuid();
    await sequelize.query(
      `INSERT INTO Users (id, username, email, password, first_name, last_name, createdAt, updatedAt) 
       VALUES (:id, :username, :email, :password, :first_name, :last_name, NOW(), NOW())`,
      {
        replacements: {
          id: adminId,
          username: 'admin',
          email: 'admin@admin.com',
          password: hashedPassword,
          first_name: 'Admin',
          last_name: 'User'
        }
      }
    );

    console.log('✓ User admin berhasil dibuat!');
    console.log('Email: admin@admin.com');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\nAnda bisa login dengan:');
    console.log('Email: admin@admin.com');
    console.log('Password: admin123');
  } catch (error) {
    if (error.name === 'SequelizeConnectionRefusedError' || error.code === 'ECONNREFUSED') {
      console.error('\n❌ Error: Tidak bisa terhubung ke database MySQL!');
      console.error('Pastikan:');
      console.error('1. MySQL server sudah running');
      console.error('2. Konfigurasi database di config/dbQuery.js sudah benar');
      console.error('3. Port 3306 tidak diblokir oleh firewall');
      console.error('\nDetail error:', error.message);
    } else if (error.name === 'SequelizeAccessDeniedError') {
      console.error('\n❌ Error: Akses database ditolak!');
      console.error('Pastikan username dan password database di config/dbQuery.js sudah benar');
      console.error('Current config:');
      console.error('  Username:', sequelize.config.username);
      console.error('  Database:', sequelize.config.database);
      console.error('\nDetail error:', error.message);
    } else {
      console.error('\n❌ Error creating admin user:', error.message);
      console.error('Detail:', error);
    }
    process.exit(1);
  } finally {
    // Tutup koneksi database
    await sequelize.close();
  }
}

// Jalankan script
createAdminUser()
  .then(() => {
    console.log('\n✓ Selesai!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  });

