// server/server.js
// SkillNest Backend - Express REST API & Session Server

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

// Initialize database & tables
require('./database/db');

// Route handlers
const authRoutes = require('./routes/auth');
const studentsRoutes = require('./routes/students');
const skillsRoutes = require('./routes/skills');
const projectsRoutes = require('./routes/projects');
const opportunitiesRoutes = require('./routes/opportunities');

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for local development with Vite
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    name: 'skillnest.sid',
    secret: process.env.SESSION_SECRET || 'skillnest_university_dev_secret_key_2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // set to false for local HTTP development
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    project: 'SkillNest',
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/profile', (req, res, next) => {
  // Alias /api/profile to student profile handler
  req.url = '/profile' + (req.url === '/' ? '' : req.url);
  studentsRoutes(req, res, next);
});
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/opportunities', opportunitiesRoutes);

// Serve static client production build if dist directory exists
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Fallback 404 for unmatched API requests
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error('[SkillNest Error]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error.',
  });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  SkillNest Backend API is running!`);
  console.log(`  Server: http://localhost:${PORT}`);
  console.log(`  Health: http://localhost:${PORT}/api/health`);
  console.log(`  Demo Login: demo@skillnest.local | Demo123!`);
  console.log(`=======================================================`);
});
