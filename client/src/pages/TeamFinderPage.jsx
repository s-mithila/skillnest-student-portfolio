// client/src/pages/TeamFinderPage.jsx
// Collaboration Opportunities & Capstone Team Finder Board

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Users } from 'lucide-react';
import { api } from '../services/api';
import { OpportunityCard } from '../components/OpportunityCard';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { EmptyState } from '../components/EmptyState';

export function TeamFinderPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [skill, setSkill] = useState(searchParams.get('skill') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'Open');

  useEffect(() => {
    fetchOpportunities();
  }, [searchParams]);

  async function fetchOpportunities() {
    setLoading(true);
    try {
      const q = searchParams.toString();
      const endpoint = q ? `/api/opportunities?${q}` : '/api/opportunities?status=Open';
      const data = await api.get(endpoint);
      setOpportunities(data);
    } catch (err) {
      console.error('Error fetching opportunities:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (skill.trim()) params.skill = skill.trim();
    if (status) params.status = status;
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearch('');
    setSkill('');
    setStatus('Open');
    setSearchParams({ status: 'Open' });
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1rem 4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>Team Finder Board</h1>
        <p style={{ fontSize: '1.05rem' }}>
          Looking for collaborators for your capstone, research paper, or hackathon? Connect with skilled peers.
        </p>
      </div>

      {/* Filter Bar */}
      <form onSubmit={handleFilterSubmit} className="filter-bar">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '2', minWidth: 220 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Search Keywords</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. React, Capstone, Hackathon, Mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ flex: '1.5', minWidth: 200 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Required Skill</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. React, Python, UI/UX..."
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />
          </div>

          <div style={{ width: 140 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Open">Open Only</option>
              <option value="Closed">Closed Only</option>
              <option value="">All Statuses</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary">
              <Search size={16} /> Filter
            </button>
            <button type="button" onClick={handleReset} className="btn btn-secondary">
              Reset
            </button>
          </div>
        </div>
      </form>

      {/* Opportunities List */}
      {loading ? (
        <LoadingIndicator message="Finding collaboration opportunities..." />
      ) : opportunities.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No opportunities found"
          description="There are currently no team requests matching your filter criteria. Be the first to post one!"
          actionText="Clear Filters"
          onAction={handleReset}
        />
      ) : (
        <div>
          <div style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
            Showing <strong>{opportunities.length}</strong> active collaboration{' '}
            {opportunities.length === 1 ? 'post' : 'posts'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {opportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

