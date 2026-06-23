const mysql = require('mysql2/promise');
require('dotenv').config();

const required = ['DB_HOST', 'DB_USER', 'DB_NAME'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  throw new Error(`Missing required database env var(s): ${missing.join(', ')}`);
}

const pool = mysql.createPool({
  host:             process.env.DB_HOST,
  user:             process.env.DB_USER,
  password:         process.env.DB_PASS     || '',
  database:         process.env.DB_NAME,
  charset:          'utf8mb4',
  waitForConnections: true,
  connectionLimit:  10,
  queueLimit:       0,
});

// Test connection on startup
pool.getConnection()
  .then(conn => {
    console.log('✅  MySQL connected →', process.env.DB_NAME);
    conn.release();
  })
  .catch(err => {
    console.error('❌  MySQL connection failed:', err.message);
    console.error('    Check your .env DB_HOST / DB_USER / DB_PASS / DB_NAME settings.');
  });

module.exports = pool;
