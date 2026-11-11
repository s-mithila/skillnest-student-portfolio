// server/routes/opportunities.js
// Collaboration Opportunities (Team Finder) CRUD

const express = require('express');
const db = require('../database/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/opportunities - List all collaboration opportunities
router.get('/', (req, res) => {
  try {
    const { status, skill, search } = req.query;

    let sql = `
      SELECT o.*, u.full_name as student_name, u.email as student_email, 
             u.university, u.department, u.profile_image as student_image
      FROM opportunities o
      JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status.trim()) {
      sql += ` AND LOWER(o.status) = ?`;
      params.push(status.trim().toLowerCase());
    }

    if (skill && skill.trim()) {
      sql += ` AND LOWER(o.required_skills) LIKE ?`;
      params.push(`%${skill.trim().toLowerCase()}%`);
    }

    if (search && search.trim()) {
      sql += ` AND (LOWER(o.title) LIKE ? OR LOWER(o.description) LIKE ? OR LOWER(o.required_skills) LIKE ?)`;
      const term = `%${search.trim().toLowerCase()}%`;
      params.push(term, term, term);
    }

    sql += ` ORDER BY o.created_at DESC`;

    const opportunities = db.prepare(sql).all(...params);
    res.json(opportunities);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({ error: 'Failed to retrieve collaboration opportunities.' });
  }
});

// GET /api/opportunities/:id - Get a single collaboration opportunity
router.get('/:id', (req, res) => {
  try {
    const oppId = parseInt(req.params.id, 10);
    if (isNaN(oppId)) {
      return res.status(400).json({ error: 'Invalid opportunity ID.' });
    }

    const opportunity = db.prepare(`
      SELECT o.*, u.full_name as student_name, u.email as student_email, 
             u.university, u.department, u.profile_image as student_image,
             u.bio as student_bio, u.github_url as student_github
      FROM opportunities o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `).get(oppId);

    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found.' });
    }

    res.json(opportunity);
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    res.status(500).json({ error: 'Failed to retrieve opportunity details.' });
  }
});

// POST /api/opportunities - Post a new collaboration opportunity
router.post('/', requireAuth, (req, res) => {
  try {
    const userId = req.session.userId;
    const { title, description, required_skills, status } = req.body;

    if (!title || !description || !required_skills) {
      return res.status(400).json({
        error: 'Title, description, and required skills are required.',
      });
    }

    const validStatus = status === 'Closed' ? 'Closed' : 'Open';

    const insert = db.prepare(`
      INSERT INTO opportunities (user_id, title, description, required_skills, status)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      userId,
      title.trim(),
      description.trim(),
      required_skills.trim(),
      validStatus
    );

    const newOpp = db.prepare('SELECT * FROM opportunities WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({
      message: 'Collaboration opportunity posted successfully.',
      opportunity: newOpp,
    });
  } catch (error) {
    console.error('Error creating opportunity:', error);
    res.status(500).json({ error: 'Failed to create collaboration opportunity.' });
  }
});

// PUT /api/opportunities/:id - Update an opportunity
router.put('/:id', requireAuth, (req, res) => {
  try {
    const userId = req.session.userId;
    const oppId = parseInt(req.params.id, 10);

    if (isNaN(oppId)) {
      return res.status(400).json({ error: 'Invalid opportunity ID.' });
    }

    const opportunity = db.prepare('SELECT * FROM opportunities WHERE id = ?').get(oppId);
    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found.' });
    }

    if (opportunity.user_id !== userId) {
      return res.status(403).json({ error: 'You are not authorized to edit this opportunity.' });
    }

    const { title, description, required_skills, status } = req.body;

    if (!title || !description || !required_skills) {
      return res.status(400).json({
        error: 'Title, description, and required skills are required.',
      });
    }

    const validStatus = status === 'Closed' ? 'Closed' : 'Open';

    const update = db.prepare(`
      UPDATE opportunities
      SET title = ?, description = ?, required_skills = ?, status = ?
      WHERE id = ?
    `);

    update.run(
      title.trim(),
      description.trim(),
      required_skills.trim(),
      validStatus,
      oppId
    );

    const updated = db.prepare('SELECT * FROM opportunities WHERE id = ?').get(oppId);
    res.json({
      message: 'Collaboration opportunity updated successfully.',
      opportunity: updated,
    });
  } catch (error) {
    console.error('Error updating opportunity:', error);
    res.status(500).json({ error: 'Failed to update opportunity.' });
  }
});

// DELETE /api/opportunities/:id - Delete an opportunity
router.delete('/:id', requireAuth, (req, res) => {
  try {
    const userId = req.session.userId;
    const oppId = parseInt(req.params.id, 10);

    if (isNaN(oppId)) {
      return res.status(400).json({ error: 'Invalid opportunity ID.' });
    }

    const opportunity = db.prepare('SELECT * FROM opportunities WHERE id = ?').get(oppId);
    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found.' });
    }

    if (opportunity.user_id !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this opportunity.' });
    }

    db.prepare('DELETE FROM opportunities WHERE id = ?').run(oppId);
    res.json({ message: 'Opportunity removed successfully.', id: oppId });
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    res.status(500).json({ error: 'Failed to delete opportunity.' });
  }
});

module.exports = router;
