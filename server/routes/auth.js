// server/routes/auth.js
// Handles student registration, login, logout, and current session check

const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database/db');

const router = express.Router();

// Helper to compute student profile completion percentage
function calculateCompletion(user, skillCount = 0) {
  let score = 50; // Base required fields: full_name, email, university, department, semester
  if (user.bio && user.bio.trim().length > 0) score += 10;
  if (user.profile_image && user.profile_image.trim().length > 0) score += 10;
  if (user.github_url && user.github_url.trim().length > 0) score += 10;
  if (user.linkedin_url && user.linkedin_url.trim().length > 0) score += 10;
  if (skillCount > 0) score += 10;
  return Math.min(100, score);
}

// Helper to sanitize user object (never return password_hash)
function sanitizeUser(user, dbInstance = db) {
  if (!user) return null;
  const { password_hash, ...safeUser } = user;
  
  // Count user skills & projects
  const skillCount = dbInstance.prepare('SELECT COUNT(*) as count FROM skills WHERE user_id = ?').get(user.id).count;
  const projectCount = dbInstance.prepare('SELECT COUNT(*) as count FROM projects WHERE user_id = ?').get(user.id).count;
  const opportunityCount = dbInstance.prepare('SELECT COUNT(*) as count FROM opportunities WHERE user_id = ?').get(user.id).count;

  safeUser.skill_count = skillCount;
  safeUser.project_count = projectCount;
  safeUser.opportunity_count = opportunityCount;
  safeUser.completion_percentage = calculateCompletion(user, skillCount);

  return safeUser;
}

// POST /api/auth/register - Register a new university student
router.post('/register', (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      confirm_password,
      university,
      department,
      semester,
    } = req.body;

    // Validation
    if (!full_name || !email || !password || !university || !department || !semester) {
      return res.status(400).json({ error: 'All registration fields are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (confirm_password !== undefined && password !== confirm_password) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    // Check if email already registered
    const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = ?').get(cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const password_hash = bcrypt.hashSync(password, 10);

    // Insert user into SQLite
    const insert = db.prepare(`
      INSERT INTO users (full_name, email, password_hash, university, department, semester)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      full_name.trim(),
      cleanEmail,
      password_hash,
      university.trim(),
      department.trim(),
      semester.trim()
    );

    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);

    // Create session
    req.session.userId = newUser.id;

    res.status(201).json({
      message: 'Registration successful! Welcome to SkillNest.',
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration. Please try again.' });
  }
});

// POST /api/auth/login - Authenticate student
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE LOWER(email) = ?').get(cleanEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Set user session
    req.session.userId = user.id;

    res.json({
      message: 'Logged in successfully.',
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login. Please try again.' });
  }
});

// POST /api/auth/logout - End current student session
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out.' });
    }
    res.clearCookie('skillnest.sid');
    res.json({ message: 'Logged out successfully.' });
  });
});

// GET /api/auth/me - Retrieve current logged-in student info
router.get('/me', (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.json({ user: null });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.json({ user: null });
    }

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('Auth /me error:', error);
    res.status(500).json({ error: 'Failed to retrieve session user.' });
  }
});

module.exports = router;
module.exports.sanitizeUser = sanitizeUser;

