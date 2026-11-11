// client/src/pages/StudentProfilePage.jsx
// Public Student Profile / Portfolio Page

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  BookOpen,
  Mail,
  Github,
  Linkedin,
  FolderGit2,
  Sparkles,
  Share2,
  Printer,
  Calendar,
  Check,
} from 'lucide-react';
import { api } from '../services/api';
import { SkillTag } from '../components/SkillTag';
import { ProjectCard } from '../components/ProjectCard';
import { OpportunityCard } from '../components/OpportunityCard';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { EmptyState } from '../components/EmptyState';

export function StudentProfilePage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadStudent() {
      setLoading(true);
      setError('');
      try {
        const data = await api.get(`/api/students/${id}`);
        setStudent(data);
      } catch (err) {
        setError(err.message || 'Student not found.');
      } finally {
        setLoading(false);
      }
    }
    loadStudent();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <LoadingIndicator message="Loading student portfolio..." />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', maxWidth: 600 }}>
        <EmptyState
          title="Student Profile Not Found"
          description="The student profile you are looking for does not exist or may have been removed."
          actionText="Back to Student Directory"
          onAction={() => window.location.href = '/students'}
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1rem 5rem', maxWidth: 1000 }}>
      {/* Profile Header Card */}
      <div className="card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {student.profile_image ? (
              <img
                src={student.profile_image}
                alt={student.full_name}
                style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e2e8f0' }}
              />
            ) : (
              <div className="user-avatar-fallback" style={{ width: 100, height: 100, fontSize: '2.5rem' }}>
                {student.full_name.charAt(0)}
              </div>
            )}

            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>{student.full_name}</h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: '#475569', fontSize: '0.95rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building2 size={16} color="#2563eb" /> {student.university}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BookOpen size={16} color="#2563eb" /> {student.department} • {student.semester}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Print, Share, Email) */}
          <div className="no-print" style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleCopyLink}
              className="btn btn-secondary btn-sm"
              title="Copy shareable portfolio link"
            >
              {copied ? <Check size={14} color="#10b981" /> : <Share2 size={14} />}
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="btn btn-secondary btn-sm"
              title="Print academic CV summary"
            >
              <Printer size={14} />
              <span>Print CV</span>
            </button>

            <a
              href={`mailto:${student.email}?subject=SkillNest Inquiry: Connecting with ${student.full_name}`}
              className="btn btn-primary btn-sm"
            >
              <Mail size={14} />
              <span>Contact Student</span>
            </a>
          </div>
        </div>

        {/* Biography */}
        {student.bio && (
          <div style={{ marginBottom: '1.75rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #2563eb' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '0.4rem', color: '#0f172a' }}>About</h3>
            <p style={{ color: '#334155', fontSize: '0.95rem', margin: 0 }}>{student.bio}</p>
          </div>
        )}

        {/* Social and Contact Links */}
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
          <a
            href={`mailto:${student.email}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.9rem' }}
          >
            <Mail size={16} />
            <span>{student.email}</span>
          </a>

          {student.github_url && (
            <a
              href={student.github_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.9rem' }}
            >
              <Github size={16} />
              <span>GitHub Profile</span>
            </a>
          )}

          {student.linkedin_url && (
            <a
              href={student.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.9rem' }}
            >
              <Linkedin size={16} />
              <span>LinkedIn Profile</span>
            </a>
          )}
        </div>
      </div>

      {/* Technical Skills Section */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Technical Skills</h2>
        {student.skills && student.skills.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {student.skills.map((skill) => (
              <SkillTag key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No skills listed yet.</p>
        )}
      </div>

      {/* Published Projects Showcase */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>
          Projects & Portfolio Work ({student.projects?.length || 0})
        </h2>

        {!student.projects || student.projects.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
            <p>This student hasn't published any projects yet.</p>
          </div>
        ) : (
          <div className="projects-grid">
            {student.projects.map((proj) => (
              <ProjectCard key={proj.id} project={proj} showAuthor={false} />
            ))}
          </div>
        )}
      </div>

      {/* Collaboration Opportunities Posted */}
      {student.opportunities && student.opportunities.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>
            Active Teammate Requests
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {student.opportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} showOwner={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
