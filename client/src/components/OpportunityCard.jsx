// client/src/components/OpportunityCard.jsx
// Collaboration Opportunity card for the Team Finder board

import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Mail, ArrowRight, User } from 'lucide-react';
import { SkillTag } from './SkillTag';

export function OpportunityCard({ opportunity, showOwner = true, onEdit, onDelete }) {
  const requiredSkills = opportunity.required_skills
    ? opportunity.required_skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const isOpen = opportunity.status === 'Open';

  return (
    <div className="card card-hover opportunity-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div>
          <span className={isOpen ? 'opp-badge-open' : 'opp-badge-closed'}>
            ● {opportunity.status || 'Open'}
          </span>
          <h3 style={{ fontSize: '1.2rem', marginTop: '0.5rem', marginBottom: '0.35rem' }}>
            <Link to={`/team-finder/${opportunity.id}`}>{opportunity.title}</Link>
          </h3>
        </div>

        {showOwner && opportunity.student_name && (
          <Link
            to={`/students/${opportunity.user_id}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}
          >
            {opportunity.student_image ? (
              <img
                src={opportunity.student_image}
                alt={opportunity.student_name}
                style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div className="user-avatar-fallback" style={{ width: 34, height: 34, fontSize: '0.85rem' }}>
                {opportunity.student_name.charAt(0)}
              </div>
            )}
          </Link>
        )}
      </div>

      <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: '1.5' }}>
        {opportunity.description}
      </p>

      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>
          Required Skills:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {requiredSkills.map((skill, idx) => (
            <SkillTag key={idx} skill={skill} />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', marginTop: 'auto' }}>
        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
          {opportunity.student_name ? (
            <span>Posted by <strong>{opportunity.student_name}</strong></span>
          ) : (
            <span>University Team Request</span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {onEdit && (
            <button onClick={() => onEdit(opportunity)} className="btn btn-secondary btn-sm">
              Edit
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(opportunity.id)} className="btn btn-danger-outline btn-sm">
              Delete
            </button>
          )}
          <Link to={`/team-finder/${opportunity.id}`} className="btn btn-outline-primary btn-sm">
            <span>Details</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

