const mysql = require('mysql2');
require('dotenv').config();

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'grokmemehub_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error connecting to MySQL database:', err.message);
    console.error('Please check your database credentials in .env file');
    process.exit(1);
  }
  console.log('✅ Successfully connected to MySQL database');
  connection.release();
});

// Export promise-based pool for async/await
const promisePool = pool.promise();

module.exports = promisePool;
