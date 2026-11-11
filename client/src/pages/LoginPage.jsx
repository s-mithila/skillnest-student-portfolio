// client/src/pages/LoginPage.jsx
// Student Login with Quick Demo Fill for Presentations

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, KeyRound, Mail, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // 1-Click quick fill demo credentials
  const fillDemoAccount = () => {
    setEmail('demo@skillnest.local');
    setPassword('Demo123!');
  };

  return (
    <div className="container" style={{ maxWidth: 460, padding: '3.5rem 1rem' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <LogIn size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Welcome Back</h2>
          <p style={{ fontSize: '0.9rem' }}>Sign in to manage your student portfolio and team requests</p>
        </div>

        {/* Demo Credentials Quick-Fill Banner */}
        <div className="demo-badge-banner">
          <div>
            <strong style={{ display: 'block', color: '#0f172a' }}>Presentation Demo Mode</strong>
            <span style={{ color: '#64748b' }}>demo@skillnest.local</span>
          </div>
          <button
            type="button"
            onClick={fillDemoAccount}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
          >
            <Sparkles size={13} />
            <span>Autofill</span>
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              University Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="e.g. demo@skillnest.local"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginBottom: '1.25rem' }}
            disabled={submitting}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ fontWeight: 600 }}>
              Create a profile
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

