// server/routes/students.js
// Student Directory, Public Profiles, and Profile Updates

const express = require('express');
const db = require('../database/db');
const { requireAuth } = require('../middleware/auth');
const { sanitizeUser } = require('./auth');

const router = express.Router();

// Helper to fetch skills array for a user
function getUserSkills(userId) {
  const rows = db.prepare('SELECT id, skill_name FROM skills WHERE user_id = ? ORDER BY skill_name ASC').all(userId);
  return rows;
}

// GET /api/students - Browse and search student directory
router.get('/', (req, res) => {
  try {
    const { search, university, department, skill } = req.query;

    let sql = `
      SELECT u.id, u.full_name, u.email, u.university, u.department, u.semester, 
             u.bio, u.profile_image, u.github_url, u.linkedin_url, u.created_at,
             (SELECT COUNT(*) FROM projects p WHERE p.user_id = u.id) as project_count
      FROM users u
      WHERE 1=1
    `;
    const params = [];

    if (search && search.trim()) {
      sql += ` AND (LOWER(u.full_name) LIKE ? OR LOWER(u.bio) LIKE ?)`;
      const term = `%${search.trim().toLowerCase()}%`;
      params.push(term, term);
    }

    if (university && university.trim()) {
      sql += ` AND LOWER(u.university) LIKE ?`;
      params.push(`%${university.trim().toLowerCase()}%`);
    }

    if (department && department.trim()) {
      sql += ` AND LOWER(u.department) LIKE ?`;
      params.push(`%${department.trim().toLowerCase()}%`);
    }

    if (skill && skill.trim()) {
      sql += ` AND u.id IN (
        SELECT s.user_id FROM skills s 
        WHERE LOWER(s.skill_name) LIKE ?
      )`;
      params.push(`%${skill.trim().toLowerCase()}%`);
    }

    sql += ` ORDER BY u.created_at DESC`;

    const students = db.prepare(sql).all(...params);

    // Attach skills array to each student
    const enriched = students.map((s) => ({
      ...s,
      skills: getUserSkills(s.id),
    }));

    res.json(enriched);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to retrieve student directory.' });
  }
});

// GET /api/students/:id - Public student profile
router.get('/:id', (req, res) => {
  try {
    const studentId = parseInt(req.params.id, 10);
    if (isNaN(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID.' });
    }

    const student = db.prepare(`
      SELECT id, full_name, email, university, department, semester, bio, 
             profile_image, github_url, linkedin_url, created_at 
      FROM users 
      WHERE id = ?
    `).get(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const skills = getUserSkills(studentId);
    const projects = db.prepare(`
      SELECT id, user_id, title, description, technologies, github_url, demo_url, image_url, created_at 
      FROM projects 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).all(studentId);

    const opportunities = db.prepare(`
      SELECT id, user_id, title, description, required_skills, status, created_at 
      FROM opportunities 
      WHERE user_id = ? AND status = 'Open'
      ORDER BY created_at DESC
    `).all(studentId);

    res.json({
      ...student,
      skills,
      projects,
      opportunities,
    });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ error: 'Failed to retrieve student profile.' });
  }
});

// PUT /api/profile (also mounted at /api/students/profile) - Update student's own profile
router.put('/profile', requireAuth, (req, res) => {
  try {
    const userId = req.session.userId;
    const {
      full_name,
      university,
      department,
      semester,
      bio,
      profile_image,
      github_url,
      linkedin_url,
    } = req.body;

    if (!full_name || !university || !department || !semester) {
      return res.status(400).json({ error: 'Full name, university, department, and semester are required.' });
    }

    const update = db.prepare(`
      UPDATE users 
      SET full_name = ?, university = ?, department = ?, semester = ?,
          bio = ?, profile_image = ?, github_url = ?, linkedin_url = ?
      WHERE id = ?
    `);

    update.run(
      full_name.trim(),
      university.trim(),
      department.trim(),
      semester.trim(),
      (bio || '').trim(),
      (profile_image || '').trim(),
      (github_url || '').trim(),
      (linkedin_url || '').trim(),
      userId
    );

    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    res.json({
      message: 'Profile updated successfully.',
      user: sanitizeUser(updatedUser),
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

module.exports = router;

