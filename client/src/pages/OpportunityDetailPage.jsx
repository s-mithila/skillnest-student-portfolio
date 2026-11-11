// client/src/pages/OpportunityDetailPage.jsx
// Detailed View for a Collaboration Opportunity

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Calendar, User, Building2, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { SkillTag } from '../components/SkillTag';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { EmptyState } from '../components/EmptyState';

export function OpportunityDetailPage() {
  const { id } = useParams();
  const [opp, setOpp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadOpp() {
      setLoading(true);
      setError('');
      try {
        const data = await api.get(`/api/opportunities/${id}`);
        setOpp(data);
      } catch (err) {
        setError(err.message || 'Opportunity not found.');
      } finally {
        setLoading(false);
      }
    }
    loadOpp();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <LoadingIndicator message="Loading opportunity..." />
      </div>
    );
  }

  if (error || !opp) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', maxWidth: 600 }}>
        <EmptyState
          title="Opportunity Not Found"
          description="The opportunity post you are trying to view does not exist or has expired."
          actionText="Back to Team Finder"
          onAction={() => (window.location.href = '/team-finder')}
        />
      </div>
    );
  }

  const requiredSkills = opp.required_skills
    ? opp.required_skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const isOpen = opp.status === 'Open';

  return (
    <div className="container" style={{ padding: '2.5rem 1rem 5rem', maxWidth: 850 }}>
      <Link
        to="/team-finder"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', fontWeight: 600, color: '#64748b' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Team Finder Board</span>
      </Link>

      <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span className={isOpen ? 'opp-badge-open' : 'opp-badge-closed'}>
            ● {opp.status || 'Open'}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={14} /> Posted {new Date(opp.created_at).toLocaleDateString()}
          </span>
        </div>

        <h1 style={{ fontSize: '2.1rem', marginBottom: '1.25rem' }}>{opp.title}</h1>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '0.65rem' }}>
            Required Technical Skills
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {requiredSkills.map((skill, idx) => (
              <SkillTag key={idx} skill={skill} />
            ))}
          </div>
        </div>

        <div style={{ lineHeight: '1.7', fontSize: '1.05rem', color: '#334155', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.5rem' }}>
            Opportunity Overview
          </h3>
          <p style={{ whiteSpace: 'pre-line' }}>{opp.description}</p>
        </div>

        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block' }}>Interested in teaming up?</span>
            <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>Reach out to {opp.student_name}</strong>
          </div>

          <a
            href={`mailto:${opp.student_email}?subject=Interested in your SkillNest Opportunity: ${opp.title}`}
            className="btn btn-primary"
          >
            <Mail size={16} />
            <span>Send Email to Apply</span>
          </a>
        </div>
      </div>

      {/* Creator Card */}
      <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {opp.student_image ? (
            <img
              src={opp.student_image}
              alt={opp.student_name}
              style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div className="user-avatar-fallback" style={{ width: 60, height: 60, fontSize: '1.4rem' }}>
              {opp.student_name.charAt(0)}
            </div>
          )}

          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.2rem' }}>{opp.student_name}</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {opp.department} • {opp.university}
            </p>
          </div>
        </div>

        <Link to={`/students/${opp.user_id}`} className="btn btn-secondary">
          <span>View Student Portfolio</span>
        </Link>
      </div>
    </div>
  );
}

