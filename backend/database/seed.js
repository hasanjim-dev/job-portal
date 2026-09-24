// Run once to create a default admin account: node database/seed.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function seed() {
  const hashed = await bcrypt.hash('Admin@123', 10);
  try {
    await pool.query(
      `INSERT INTO users (full_name, email, password, role)
       VALUES (?, ?, ?, 'admin')
       ON DUPLICATE KEY UPDATE full_name = full_name`,
      ['Site Admin', 'admin@jobportal.com', hashed]
    );
    console.log('Admin account ready -> email: admin@jobportal.com | password: Admin@123');
  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    process.exit();
  }
}

seed();
