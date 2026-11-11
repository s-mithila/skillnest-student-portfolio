// client/src/components/StudentCard.jsx
// Card component to display student summary in directory and landing page

import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, BookOpen, FolderGit2, ArrowRight } from 'lucide-react';
import { SkillTag } from './SkillTag';

export function StudentCard({ student, onSkillClick }) {
  const skills = student.skills || [];
  const projectCount = student.project_count || 0;

  return (
    <div className="card card-hover student-card">
      <div>
        <div className="student-card-header">
          {student.profile_image ? (
            <img src={student.profile_image} alt={student.full_name} className="student-avatar" />
          ) : (
            <div className="student-avatar user-avatar-fallback" style={{ width: '56px', height: '56px', fontSize: '1.25rem' }}>
              {student.full_name ? student.full_name.charAt(0).toUpperCase() : 'S'}
            </div>
          )}
          <div className="student-info">
            <h3 title={student.full_name}>{student.full_name}</h3>
            <div className="student-meta">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Building2 size={13} /> {student.university}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <BookOpen size={13} /> {student.department} • {student.semester}
              </span>
            </div>
          </div>
        </div>

        {student.bio && <p className="student-bio">{student.bio}</p>}

        <div className="student-skills-wrapper">
          {skills.slice(0, 5).map((skill, idx) => (
            <SkillTag
              key={skill.id || idx}
              skill={skill}
              isClickable={!!onSkillClick}
              onClick={onSkillClick}
            />
          ))}
          {skills.length > 5 && (
            <span className="skill-tag" style={{ background: '#e2e8f0', color: '#475569' }}>
              +{skills.length - 5} more
            </span>
          )}
        </div>
      </div>

      <div className="student-card-footer">
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <FolderGit2 size={14} /> {projectCount} {projectCount === 1 ? 'Project' : 'Projects'}
        </span>
        <Link to={`/students/${student.id}`} className="btn btn-outline-primary btn-sm">
          <span>Portfolio</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
