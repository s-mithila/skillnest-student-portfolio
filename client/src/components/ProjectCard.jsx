// client/src/components/ProjectCard.jsx
// Displays a student project card with tags and links

import React from 'react';
import { Link } from 'react-router-dom';
import { Github, ExternalLink, Calendar } from 'lucide-react';
import { SkillTag } from './SkillTag';

export function ProjectCard({ project, showAuthor = true, onEdit, onDelete }) {
  // Parse comma-separated tech stack
  const technologies = project.technologies
    ? project.technologies.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="card card-hover project-card">
      <div className="project-image-box">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="project-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #1e293b, #334155)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            {project.title}
          </div>
        )}
      </div>

      <div className="project-card-body">
        {showAuthor && project.student_name && (
          <Link to={`/students/${project.user_id}`} className="project-author-tag">
            {project.student_image ? (
              <img src={project.student_image} alt={project.student_name} />
            ) : (
              <div className="user-avatar-fallback" style={{ width: 22, height: 22, fontSize: '0.65rem' }}>
                {project.student_name.charAt(0)}
              </div>
            )}
            <span>{project.student_name} • {project.university}</span>
          </Link>
        )}

        <h3 className="project-title">
          <Link to={`/projects/${project.id}`}>{project.title}</Link>
        </h3>

        <p className="project-desc">{project.description}</p>

        <div className="project-tech-stack">
          {technologies.slice(0, 4).map((tech, idx) => (
            <SkillTag key={idx} skill={tech} />
          ))}
          {technologies.length > 4 && (
            <span className="skill-tag" style={{ background: '#e2e8f0', color: '#475569' }}>
              +{technologies.length - 4}
            </span>
          )}
        </div>

        <div className="project-actions">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
            >
              <Github size={14} />
              <span>Code</span>
            </a>
          )}

          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary btn-sm"
              style={{ flex: 1 }}
            >
              <ExternalLink size={14} />
              <span>Demo</span>
            </a>
          )}

          {/* If user is owner managing from dashboard */}
          {onEdit && (
            <button onClick={() => onEdit(project)} className="btn btn-secondary btn-sm">
              Edit
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(project.id)} className="btn btn-danger-outline btn-sm">
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

