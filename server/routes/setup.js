const express = require('express');
const router = express.Router();
const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// SETUP ENDPOINT - Run once to initialize database
router.get('/', async (req, res) => {
  try {
    console.log('🚀 Starting database setup via endpoint...');

    // Read schema.sql
    const schemaPath = path.join(__dirname, '..', '..', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split by semicolon and filter out empty statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    let results = [];

    // Execute each statement separately
    for (const statement of statements) {
      try {
        const [result] = await db.query(statement);
        results.push({ success: true, statement: statement.substring(0, 50) + '...' });
      } catch (err) {
        // Continue even if some statements fail (like DROP TABLE if not exists)
        results.push({ success: false, error: err.message, statement: statement.substring(0, 50) });
      }
    }

    // Verify setup
    const [users] = await db.query('SELECT COUNT(*) as count FROM users');
    const [memes] = await db.query('SELECT COUNT(*) as count FROM memes');
    const [reactions] = await db.query('SELECT COUNT(*) as count FROM reactions');

    res.json({
      success: true,
      message: '✅ Database setup completed!',
      summary: {
        users: users[0].count,
        memes: memes[0].count,
        reactions: reactions[0].count
      },
      details: results
    });

  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({
      success: false,
      message: 'Setup failed',
      error: error.message
    });
  }
});

module.exports = router;
