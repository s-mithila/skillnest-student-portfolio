// server/routes/skills.js
// Student Technical Skills Management

const express = require('express');
const db = require('../database/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/skills - Add a new technical skill for logged-in student
router.post('/', requireAuth, (req, res) => {
  try {
    const userId = req.session.userId;
    const { skill_name } = req.body;

    if (!skill_name || !skill_name.trim()) {
      return res.status(400).json({ error: 'Skill name cannot be empty.' });
    }

    const cleanSkill = skill_name.trim();

    // Prevent duplicate skill for the same student
    const existing = db.prepare(`
      SELECT id FROM skills 
      WHERE user_id = ? AND LOWER(skill_name) = ?
    `).get(userId, cleanSkill.toLowerCase());

    if (existing) {
      return res.status(409).json({ error: 'This skill is already listed in your profile.' });
    }

    const insert = db.prepare('INSERT INTO skills (user_id, skill_name) VALUES (?, ?)');
    const result = insert.run(userId, cleanSkill);

    const newSkill = db.prepare('SELECT id, user_id, skill_name FROM skills WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({
      message: 'Skill added successfully.',
      skill: newSkill,
    });
  } catch (error) {
    console.error('Error adding skill:', error);
    res.status(500).json({ error: 'Failed to add technical skill.' });
  }
});

// DELETE /api/skills/:id - Delete a skill belonging to the logged-in student
router.delete('/:id', requireAuth, (req, res) => {
  try {
    const userId = req.session.userId;
    const skillId = parseInt(req.params.id, 10);

    if (isNaN(skillId)) {
      return res.status(400).json({ error: 'Invalid skill ID.' });
    }

    // Verify ownership
    const skill = db.prepare('SELECT * FROM skills WHERE id = ?').get(skillId);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found.' });
    }

    if (skill.user_id !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this skill.' });
    }

    db.prepare('DELETE FROM skills WHERE id = ?').run(skillId);
    res.json({ message: 'Skill removed successfully.', id: skillId });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ error: 'Failed to delete technical skill.' });
  }
});

module.exports = router;
