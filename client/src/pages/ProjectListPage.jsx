// client/src/pages/ProjectListPage.jsx
// Browse all student projects with search and tech filtering

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, FolderGit2 } from 'lucide-react';
import { api } from '../services/api';
import { ProjectCard } from '../components/ProjectCard';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { EmptyState } from '../components/EmptyState';

export function ProjectListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [tech, setTech] = useState(searchParams.get('technology') || '');

  useEffect(() => {
    fetchProjects();
  }, [searchParams]);

  async function fetchProjects() {
    setLoading(true);
    try {
      const q = searchParams.toString();
      const endpoint = q ? `/api/projects?${q}` : '/api/projects';
      const data = await api.get(endpoint);
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (tech.trim()) params.technology = tech.trim();
    setSearchParams(params);
  };

  const handleClear = () => {
    setSearch('');
    setTech('');
    setSearchParams({});
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1rem 4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>Student Project Showcase</h1>
        <p style={{ fontSize: '1.05rem' }}>
          Explore academic systems, open source tools, and semester capstones built by university students.
        </p>
      </div>

      {/* Filter Bar */}
      <form onSubmit={handleSearch} className="filter-bar">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '2', minWidth: 220 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Search Title or Keywords</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Attendance, Carpool, AI Classifier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ flex: '1.5', minWidth: 200 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Technology Used</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. React, Python, Node.js..."
              value={tech}
              onChange={(e) => setTech(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary">
              <Search size={16} /> Search
            </button>
            {(search || tech) && (
              <button type="button" onClick={handleClear} className="btn btn-secondary">
                Clear
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Projects Grid */}
      {loading ? (
        <LoadingIndicator message="Loading projects..." />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No projects match your search"
          description="Try adjusting your keyword or technology filter to discover more student projects."
          actionText="Show All Projects"
          onAction={handleClear}
        />
      ) : (
        <div>
          <div style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
            Showing <strong>{projects.length}</strong> {projects.length === 1 ? 'project' : 'projects'}
          </div>
          <div className="projects-grid">
            {projects.map((proj) => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

