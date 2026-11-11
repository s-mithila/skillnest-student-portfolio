// client/src/pages/StudentDirectoryPage.jsx
// Student Directory with Search and Multi-Criteria Filtering

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw, Users, Building2, BookOpen, Code2 } from 'lucide-react';
import { api } from '../services/api';
import { StudentCard } from '../components/StudentCard';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { EmptyState } from '../components/EmptyState';

export function StudentDirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter form state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [university, setUniversity] = useState(searchParams.get('university') || '');
  const [department, setDepartment] = useState(searchParams.get('department') || '');
  const [skill, setSkill] = useState(searchParams.get('skill') || '');

  useEffect(() => {
    fetchStudents();
  }, [searchParams]);

  async function fetchStudents() {
    setLoading(true);
    try {
      const queryString = searchParams.toString();
      const endpoint = queryString ? `/api/students?${queryString}` : '/api/students';
      const data = await api.get(endpoint);
      setStudents(data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (university.trim()) params.university = university.trim();
    if (department.trim()) params.department = department.trim();
    if (skill.trim()) params.skill = skill.trim();
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearch('');
    setUniversity('');
    setDepartment('');
    setSkill('');
    setSearchParams({});
  };

  const handleSkillClick = (skillName) => {
    setSkill(skillName);
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (university.trim()) params.university = university.trim();
    if (department.trim()) params.department = department.trim();
    params.skill = skillName;
    setSearchParams(params);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1rem 4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>Student Directory</h1>
        <p style={{ fontSize: '1.05rem' }}>
          Discover aspiring software engineers, researchers, and project partners across universities.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <form onSubmit={handleFilterSubmit} className="filter-bar">
        <div className="filter-grid">
          <div>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Search by Name / Bio</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Amina, Marcus, Full-stack..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>University</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. State University..."
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Department</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Computer Science..."
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Skill</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. React, Python..."
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" title="Apply Filters">
              <Search size={16} />
              <span>Search</span>
            </button>
            {(search || university || department || skill) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-secondary"
                title="Reset Filters"
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Active Filter Badges */}
      {(search || university || department || skill) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Active Filters:</span>
          {search && <span className="skill-tag">Search: "{search}"</span>}
          {university && <span className="skill-tag">University: "{university}"</span>}
          {department && <span className="skill-tag">Department: "{department}"</span>}
          {skill && <span className="skill-tag">Skill: "{skill}"</span>}
          <button
            onClick={handleResetFilters}
            style={{ fontSize: '0.8rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* Directory Grid */}
      {loading ? (
        <LoadingIndicator message="Searching student directory..." />
      ) : students.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students found"
          description="Try broadening your search criteria or resetting filters to view all registered students."
          actionText="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div>
          <div style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
            Showing <strong>{students.length}</strong> {students.length === 1 ? 'student' : 'students'}
          </div>
          <div className="students-grid">
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onSkillClick={handleSkillClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

