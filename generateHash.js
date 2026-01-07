// nikkiBE/generateHash.js
const bcrypt = require('bcryptjs');

const password = 'admin123';
const existingHash = '$2a$10$UWXgidbMeix4NQq4zQTnyuIAf2jDuUlMlp99gHzus15EP4TLboUYG';

console.log('=== Generate Hash untuk Password: admin123 ===\n');

// Generate hash baru
const newHash = bcrypt.hashSync(password, 10);
console.log('Hash baru yang di-generate:');
console.log(newHash);
console.log('\n');

// Verify hash yang sudah ada
const isValid = bcrypt.compareSync(password, existingHash);
console.log('Verifikasi hash yang diberikan:');
console.log(`Hash: ${existingHash}`);
console.log(`Password "admin123" valid: ${isValid ? 'YA ✓' : 'TIDAK ✗'}`);