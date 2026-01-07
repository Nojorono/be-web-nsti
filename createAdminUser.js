/**
 * Script untuk membuat user admin dengan password admin123
 * 
 * Cara menggunakan:
 * 1. Pastikan database MySQL sudah running
 * 2. Pastikan konfigurasi database di config/dbQuery.js sudah benar
 * 3. Jalankan: node createAdminUser.js
 * 
 * Credentials untuk login:
 * Email: admin@admin.com
 * Password: admin123
 */

// Set NODE_ENV jika belum diset
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const { User, sequelize } = require('./models');
const { v4: uuid } = require('uuid');

async function createAdminUser() {
  try {
    // Debug: Tampilkan config yang digunakan
    const config = sequelize.config;
    console.log('Konfigurasi database yang digunakan:');
    console.log('Host:', config.host);
    console.log('Database:', config.database);
    console.log('Username:', config.username);
    console.log('Port:', config.port);
    console.log('');
    
    // Test koneksi database terlebih dahulu
    console.log('Mengecek koneksi database...');
    await sequelize.authenticate();
    console.log('✓ Koneksi database berhasil!\n');
    // Cek apakah user admin sudah ada
    const existingUser = await User.findOne({
      where: {
        email: 'admin@admin.com'
      }
    });

    if (existingUser) {
      console.log('User admin sudah ada!');
      console.log('Email:', existingUser.email);
      console.log('Username:', existingUser.username);
      return;
    }

    // Buat user admin baru
    // Password akan di-hash otomatis oleh hook beforeCreate di model User
    const adminUser = await User.create({
      id: uuid(),
      username: 'admin',
      email: 'admin@admin.com',
      password: 'admin123', // Akan di-hash otomatis
      first_name: 'Admin',
      last_name: 'User'
    });

    console.log('✓ User admin berhasil dibuat!');
    console.log('Email:', adminUser.email);
    console.log('Username:', adminUser.username);
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
      console.error('Pastikan username dan password database benar');
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

