// server/database/reset.js
// Utility script to reset the database and restore default sample data

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { seedDatabase } = require('./seed');

const dbPath = path.join(__dirname, 'skillnest.db');
const schemaPath = path.join(__dirname, 'schema.sql');

const dbFiles = [
  dbPath,
  path.join(__dirname, 'skillnest.db-journal'),
  path.join(__dirname, 'skillnest.db-wal'),
  path.join(__dirname, 'skillnest.db-shm'),
];

// 1. Remove old database files
for (const file of dbFiles) {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
    } catch (err) {
      console.warn(`Could not delete ${file}:`, err.message);
    }
  }
}

// 2. Re-create tables and populate default sample data immediately
try {
  const db = new Database(dbPath);
  db.pragma('foreign_keys = ON');

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schemaSql);
  seedDatabase(db);

  const studentCount = db.prepare('SELECT count(*) as c FROM users').get().c;
  const projectCount = db.prepare('SELECT count(*) as c FROM projects').get().c;
  const skillCount = db.prepare('SELECT count(*) as c FROM skills').get().c;
  const oppCount = db.prepare('SELECT count(*) as c FROM opportunities').get().c;

  db.close();

  console.log('================================================================');
  console.log('  [SkillNest] Database Reset Complete!');
  console.log(`  Restored default sample data:`);
  console.log(`  - Students: ${studentCount}`);
  console.log(`  - Projects: ${projectCount}`);
  console.log(`  - Skills: ${skillCount}`);
  console.log(`  - Team Opportunities: ${oppCount}`);
  console.log(`  Demo Account: demo@skillnest.local | Password: Demo123!`);
  console.log('================================================================');
} catch (error) {
  console.error('[SkillNest] Error resetting database:', error.message);
}
