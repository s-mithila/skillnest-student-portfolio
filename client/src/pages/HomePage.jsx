// client/src/pages/HomePage.jsx
// SkillNest Landing Page

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Users,
  FolderGit2,
  Code2,
  ArrowRight,
  CheckCircle2,
  Search,
  Rocket,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../services/api';
import { ProjectCard } from '../components/ProjectCard';
import { StudentCard } from '../components/StudentCard';
import { LoadingIndicator } from '../components/LoadingIndicator';

export function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [featuredStudents, setFeaturedStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projects, students] = await Promise.all([
          api.get('/api/projects?limit=3'),
          api.get('/api/students'),
        ]);
        setFeaturedProjects(projects);
        setFeaturedStudents(students.slice(0, 3));
      } catch (err) {
        console.error('Failed to load landing page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Built for University Computer Science & Engineering</span>
          </div>

          <h1 className="hero-title">
            Your Skills. Your Projects. <span className="highlight">Your Future.</span>
          </h1>

          <p className="hero-subtitle">
            SkillNest is the dedicated portfolio and collaboration network for university students.
            Showcase your technical skills, publish course and capstone projects, and find high-performing teammates.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary btn-lg">
              <span>Create Your Portfolio</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/students" className="btn btn-secondary btn-lg">
              <Search size={18} />
              <span>Explore Students</span>
            </Link>
            <Link to="/team-finder" className="btn btn-outline-primary btn-lg">
              <Users size={18} />
              <span>Find Teammates</span>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">100%</span>
              <span className="stat-label">Student Centered</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">5+</span>
              <span className="stat-label">Universities Represented</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">Zero</span>
              <span className="stat-label">External Setup Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '5rem 0', background: '#ffffff' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">How SkillNest Works</span>
            <h2 className="section-title">Designed for Your Academic Journey</h2>
            <p>
              Traditional professional networks are noisy. SkillNest is built specifically for students to demonstrate verified technical capability.
            </p>
          </div>

          <div className="features-grid">
            <div className="card feature-card card-hover">
              <div className="feature-icon-wrapper">
                <GraduationCap size={26} />
              </div>
              <span className="feature-step">Step 01</span>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.65rem' }}>Create Student Profile</h3>
              <p>
                List your university, engineering department, current semester, technical skills, and links to your GitHub and LinkedIn profiles.
              </p>
            </div>

            <div className="card feature-card card-hover">
              <div className="feature-icon-wrapper">
                <FolderGit2 size={26} />
              </div>
              <span className="feature-step">Step 02</span>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.65rem' }}>Showcase Projects</h3>
              <p>
                Publish semester assignments, hackathon prototypes, and capstone systems with screenshots, tech stack tags, and live repository links.
              </p>
            </div>

            <div className="card feature-card card-hover">
              <div className="feature-icon-wrapper">
                <Users size={26} />
              </div>
              <span className="feature-step">Step 03</span>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.65rem' }}>Find Project Teammates</h3>
              <p>
                Post collaboration opportunities specifying the exact technical skills required for upcoming university competitions or final year capstones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section style={{ padding: '5rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-tag">Student Innovation</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Projects</h2>
            </div>
            <Link to="/projects" className="btn btn-secondary">
              <span>View All Projects</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingIndicator message="Loading featured student projects..." />
          ) : (
            <div className="projects-grid">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Student Community Section */}
      <section style={{ padding: '5rem 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-tag">Community</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Meet Fellow Students</h2>
            </div>
            <Link to="/students" className="btn btn-secondary">
              <span>Browse Full Directory</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingIndicator message="Loading student community..." />
          ) : (
            <div className="students-grid">
              {featuredStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{ padding: '4.5rem 0', background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: '#ffffff' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 700 }}>
          <h2 style={{ color: '#ffffff', fontSize: '2.4rem', marginBottom: '1rem', letterSpacing: '-0.5px' }}>
            Ready to Build Your Engineering Portfolio?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Join university peers, document your technical growth, and find the right partners for your next big project.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              <span>Get Started Now — It's Free</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg" style={{ color: '#0f172a' }}>
              <span>Sign In with Demo Account</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

