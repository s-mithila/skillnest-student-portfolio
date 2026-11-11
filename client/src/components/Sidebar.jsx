// client/src/components/Sidebar.jsx
// Student Dashboard Sidebar

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserCheck, Code, FolderGit2, Sparkles, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Sidebar({ activeTab, setActiveTab }) {
  const { user } = useAuth();

  if (!user) return null;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'skills', label: 'My Skills', icon: Code },
    { id: 'projects', label: 'My Projects', icon: FolderGit2 },
    { id: 'opportunities', label: 'My Opportunities', icon: Sparkles },
    { id: 'profile', label: 'Edit Profile', icon: UserCheck },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        {user.profile_image ? (
          <img src={user.profile_image} alt={user.full_name} className="sidebar-avatar" />
        ) : (
          <div className="sidebar-avatar user-avatar-fallback" style={{ fontSize: '1.5rem' }}>
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
        )}
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{user.full_name}</h3>
        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{user.department}</p>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user.university}</p>

        <a
          href={`/students/${user.id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.8rem',
            marginTop: '0.75rem',
            fontWeight: 600,
          }}
        >
          <span>View Public Profile</span>
          <ExternalLink size={12} />
        </a>
      </div>

      <ul className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

