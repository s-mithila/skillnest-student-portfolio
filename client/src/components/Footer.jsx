// client/src/components/Footer.jsx
// Application footer

import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer no-print">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="brand-logo" style={{ marginBottom: '0.85rem' }}>
              <div className="brand-icon">
                <GraduationCap size={20} />
              </div>
              <span>SkillNest</span>
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
              The student portfolio & skill-sharing network designed for university engineers, developers, and creators.
              Showcase technical milestones, discover peers, and build university capstone teams.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#64748b' }}>
              <span>Built with React, Express & SQLite</span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul className="footer-links">
              <li><Link to="/students">Student Directory</Link></li>
              <li><Link to="/projects">Project Showcase</Link></li>
              <li><Link to="/team-finder">Team Finder Board</Link></li>
              <li><Link to="/">Home Overview</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Account</h4>
            <ul className="footer-links">
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Profile</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>University Project</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '0.75rem' }}>
              Computer Science & Engineering 7th-Semester Capstone Project.
            </p>
            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
              <strong>Demo Account:</strong><br />
              <code>demo@skillnest.local</code><br />
              Password: <code>Demo123!</code>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} SkillNest. Free and Open Source University Project.</span>
          <span>Designed with simplicity & functionality</span>
        </div>
      </div>
    </footer>
  );
}

