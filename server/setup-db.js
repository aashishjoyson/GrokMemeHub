const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');

  // Parse DATABASE_URL
  let dbConfig;

  if (process.env.DATABASE_URL) {
    const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
    console.log('📡 Using DATABASE_URL:', dbUrl.replace(/:[^:@]*@/, ':****@')); // Hide password

    const url = new URL(dbUrl);
    dbConfig = {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      port: parseInt(url.port) || 3306,
      multipleStatements: true, // Allow multiple SQL statements
      // Railway requires SSL for public connections
      ssl: {
        rejectUnauthorized: false
      }
    };
  } else {
    console.error('❌ DATABASE_URL not found in .env file!');
    console.error('Please add your Railway MySQL URL to the .env file');
    process.exit(1);
  }

  let connection;

  try {
    // Connect to database
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected successfully!\n');

    // Read schema.sql file
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    console.log('📄 Reading schema.sql...');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('✅ Schema file loaded\n');

    // Execute schema
    console.log('⚡ Executing SQL commands...');
    const [results] = await connection.query(schema);
    console.log('✅ Schema executed successfully!\n');

    // Verify tables were created
    console.log('🔍 Verifying database setup...');
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📊 Tables created:', tables.map(t => Object.values(t)[0]).join(', '));

    // Count records
    const [userCount] = await connection.query('SELECT COUNT(*) as count FROM users');
    const [memeCount] = await connection.query('SELECT COUNT(*) as count FROM memes');
    const [reactionCount] = await connection.query('SELECT COUNT(*) as count FROM reactions');

    console.log('\n✨ Database Setup Complete! ✨');
    console.log('━'.repeat(50));
    console.log(`👥 Users: ${userCount[0].count}`);
    console.log(`🎨 Memes: ${memeCount[0].count}`);
    console.log(`💭 Reactions: ${reactionCount[0].count}`);
    console.log('━'.repeat(50));
    console.log('\n✅ Your database is ready to use!');
    console.log('🚀 You can now start the server with: npm start');

  } catch (error) {
    console.error('\n❌ Error setting up database:');
    console.error(error.message);

    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Connection refused. Please check:');
      console.error('   1. Your DATABASE_URL is correct');
      console.error('   2. Railway MySQL service is running');
      console.error('   3. You are using the PUBLIC connection URL (not mysql.railway.internal)');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Access denied. Please check your database credentials');
    }

    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run setup
setupDatabase();
