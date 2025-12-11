const mysql = require('mysql2');
require('dotenv').config();

// Parse DATABASE_URL if provided (Railway format)
let dbConfig;

if (process.env.DATABASE_URL || process.env.MYSQL_URL) {
  // Railway provides DATABASE_URL or MYSQL_URL
  const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  console.log('📡 Using DATABASE_URL for MySQL connection');

  // Parse the URL: mysql://user:password@host:port/database
  const url = new URL(dbUrl);

  // Check if using Railway internal network (no SSL needed)
  const isInternalNetwork = url.hostname.includes('railway.internal');

  dbConfig = {
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1), // Remove leading '/'
    port: parseInt(url.port) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  };

  // Only use SSL for external connections
  if (!isInternalNetwork) {
    dbConfig.ssl = {
      rejectUnauthorized: false
    };
  }

  console.log(`🔗 Connecting to: ${url.hostname} (SSL: ${!isInternalNetwork})`);
} else {
  // Use individual environment variables
  console.log('📡 Using individual DB credentials');
  dbConfig = {
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
  };
}

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

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
