// server/database/reset.js
// Utility script to reset the database to sample seed data

const fs = require('fs');
const path = require('path');

const dbFiles = [
  path.join(__dirname, 'skillnest.db'),
  path.join(__dirname, 'skillnest.db-journal'),
  path.join(__dirname, 'skillnest.db-wal'),
  path.join(__dirname, 'skillnest.db-shm'),
];

let deleted = 0;
for (const file of dbFiles) {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
      deleted++;
    } catch (err) {
      console.warn(`Could not delete ${file}:`, err.message);
    }
  }
}

if (deleted > 0) {
  console.log('[SkillNest] Database file(s) removed successfully.');
  console.log('[SkillNest] Start or restart the server (`npm run dev`) to re-seed fresh sample data.');
} else {
  console.log('[SkillNest] No existing database file found to delete.');
}
