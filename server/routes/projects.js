// server/routes/projects.js
// Student Project Showcase CRUD

const express = require('express');
const db = require('../database/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/projects - Get all projects or filter
router.get('/', (req, res) => {
  try {
    const { limit, technology, search } = req.query;

    let sql = `
      SELECT p.*, u.full_name as student_name, u.university, u.department, u.profile_image as student_image
      FROM projects p
      JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (technology && technology.trim()) {
      sql += ` AND LOWER(p.technologies) LIKE ?`;
      params.push(`%${technology.trim().toLowerCase()}%`);
    }

    if (search && search.trim()) {
      sql += ` AND (LOWER(p.title) LIKE ? OR LOWER(p.description) LIKE ? OR LOWER(p.technologies) LIKE ?)`;
      const term = `%${search.trim().toLowerCase()}%`;
      params.push(term, term, term);
    }

    sql += ` ORDER BY p.created_at DESC`;

    if (limit && !isNaN(parseInt(limit, 10))) {
      sql += ` LIMIT ?`;
      params.push(parseInt(limit, 10));
    }

    const projects = db.prepare(sql).all(...params);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to retrieve projects.' });
  }
});

// GET /api/projects/:id - Get project details
router.get('/:id', (req, res) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID.' });
    }

    const project = db.prepare(`
      SELECT p.*, u.full_name as student_name, u.university, u.department, 
             u.profile_image as student_image, u.email as student_email
      FROM projects p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `).get(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to retrieve project details.' });
  }
});

// POST /api/projects - Create a new project showcase
router.post('/', requireAuth, (req, res) => {
  try {
    const userId = req.session.userId;
    const { title, description, technologies, github_url, demo_url, image_url } = req.body;

    if (!title || !description || !technologies || !github_url) {
      return res.status(400).json({
        error: 'Project title, description, technologies, and GitHub repository URL are required.',
      });
    }

    const insert = db.prepare(`
      INSERT INTO projects (user_id, title, description, technologies, github_url, demo_url, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      userId,
      title.trim(),
      description.trim(),
      technologies.trim(),
      github_url.trim(),
      (demo_url || '').trim(),
      (image_url || '').trim()
    );

    const newProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({
      message: 'Project published successfully.',
      project: newProject,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to publish project.' });
  }
});

// PUT /api/projects/:id - Update an existing project
router.put('/:id', requireAuth, (req, res) => {
  try {
    const userId = req.session.userId;
    const projectId = parseInt(req.params.id, 10);

    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID.' });
    }

    // Check ownership
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    if (project.user_id !== userId) {
      return res.status(403).json({ error: 'You are not authorized to edit this project.' });
    }

    const { title, description, technologies, github_url, demo_url, image_url } = req.body;

    if (!title || !description || !technologies || !github_url) {
      return res.status(400).json({
        error: 'Project title, description, technologies, and GitHub repository URL are required.',
      });
    }

    const update = db.prepare(`
      UPDATE projects
      SET title = ?, description = ?, technologies = ?, github_url = ?, demo_url = ?, image_url = ?
      WHERE id = ?
    `);

    update.run(
      title.trim(),
      description.trim(),
      technologies.trim(),
      github_url.trim(),
      (demo_url || '').trim(),
      (image_url || '').trim(),
      projectId
    );

    const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
    res.json({
      message: 'Project updated successfully.',
      project: updated,
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project.' });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', requireAuth, (req, res) => {
  try {
    const userId = req.session.userId;
    const projectId = parseInt(req.params.id, 10);

    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID.' });
    }

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    if (project.user_id !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this project.' });
    }

    db.prepare('DELETE FROM projects WHERE id = ?').run(projectId);
    res.json({ message: 'Project removed successfully.', id: projectId });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project.' });
  }
});

module.exports = router;
