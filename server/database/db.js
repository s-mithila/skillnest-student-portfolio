// server/database/db.js
// SQLite database connection and auto-initialization

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const { seedDatabase } = require('./seed');

const dbPath = path.join(__dirname, 'skillnest.db');
const schemaPath = path.join(__dirname, 'schema.sql');

// Open SQLite database file (creates it if it does not exist)
const db = new Database(dbPath);

// Enable foreign key constraints
db.pragma('foreign_keys = ON');

// Initialize database tables
try {
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);
  // Auto-seed sample university data if empty
  seedDatabase(db);
  console.log(`[Database] SQLite connected at ${dbPath}`);
} catch (error) {
  console.error('[Database] Initialization error:', error.message);
}

module.exports = db;
