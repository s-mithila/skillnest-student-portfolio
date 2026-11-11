// client/src/components/Navbar.jsx
// Main application header and navigation bar

import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap, Users, FolderGit2, Sparkles, LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <GraduationCap size={22} />
          </div>
          <span>SkillNest</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/students" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Users size={16} /> Students
              </NavLink>
            </li>
            <li>
              <NavLink to="/projects" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <FolderGit2 size={16} /> Projects
              </NavLink>
            </li>
            <li>
              <NavLink to="/team-finder" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Sparkles size={16} /> Team Finder
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="nav-actions">
          {user ? (
            <div className="user-menu">
              <Link to="/dashboard" className="btn btn-secondary btn-sm" title="Go to Student Dashboard">
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
              <Link to={`/students/${user.id}`} title="View your public profile">
                {user.profile_image ? (
                  <img src={user.profile_image} alt={user.full_name} className="user-avatar-sm" />
                ) : (
                  <div className="user-avatar-fallback">
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm" title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Join SkillNest
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
