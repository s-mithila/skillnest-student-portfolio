// client/src/pages/ProjectDetailPage.jsx
// Detailed Project View with Author Bio and External Links

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Github, ExternalLink, ArrowLeft, Calendar, Building2, User, Mail } from 'lucide-react';
import { api } from '../services/api';
import { SkillTag } from '../components/SkillTag';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { EmptyState } from '../components/EmptyState';

export function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProject() {
      setLoading(true);
      setError('');
      try {
        const data = await api.get(`/api/projects/${id}`);
        setProject(data);
      } catch (err) {
        setError(err.message || 'Project not found.');
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <LoadingIndicator message="Loading project details..." />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', maxWidth: 600 }}>
        <EmptyState
          title="Project Not Found"
          description="The project you are trying to view does not exist or has been deleted."
          actionText="Back to Projects"
          onAction={() => (window.location.href = '/projects')}
        />
      </div>
    );
  }

  const technologies = project.technologies
    ? project.technologies.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="container" style={{ padding: '2.5rem 1rem 5rem', maxWidth: 900 }}>
      <Link
        to="/projects"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', fontWeight: 600, color: '#64748b' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Project Showcase</span>
      </Link>

      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2.5rem' }}>
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            style={{ width: '100%', maxHeight: 420, objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: 220,
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              fontSize: '1.25rem',
              fontWeight: 700,
            }}
          >
            {project.title}
          </div>
        )}

        <div style={{ padding: '2.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{project.title}</h1>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: '#64748b', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={15} /> Added {new Date(project.created_at).toLocaleDateString()}
            </span>
            <Link
              to={`/students/${project.user_id}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#2563eb', fontWeight: 600 }}
            >
              <User size={15} /> By {project.student_name}
            </Link>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#0f172a' }}>Technologies Used</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {technologies.map((tech, idx) => (
                <SkillTag key={idx} skill={tech} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem', lineHeight: '1.7', fontSize: '1.05rem', color: '#334155' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#0f172a' }}>About the Project</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{project.description}</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-lg"
              >
                <Github size={18} />
                <span>View Source Code on GitHub</span>
              </a>
            )}

            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
              >
                <ExternalLink size={18} />
                <span>Open Live Project Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Author Card */}
      <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {project.student_image ? (
            <img
              src={project.student_image}
              alt={project.student_name}
              style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div className="user-avatar-fallback" style={{ width: 64, height: 64, fontSize: '1.5rem' }}>
              {project.student_name.charAt(0)}
            </div>
          )}

          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{project.student_name}</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {project.department} • {project.university}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/students/${project.user_id}`} className="btn btn-secondary">
            <span>View Full Portfolio</span>
          </Link>
          {project.student_email && (
            <a
              href={`mailto:${project.student_email}?subject=Regarding your project: ${project.title}`}
              className="btn btn-primary"
            >
              <Mail size={16} />
              <span>Contact Creator</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
