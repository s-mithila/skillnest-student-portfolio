// client/src/pages/DashboardPage.jsx
// Student Dashboard with Overview, Skills, Projects, Opportunities, and Profile Management

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Code,
  FolderGit2,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Github,
  CheckCircle2,
  AlertCircle,
  X,
  User,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { SkillTag } from '../components/SkillTag';
import { ProjectCard } from '../components/ProjectCard';
import { OpportunityCard } from '../components/OpportunityCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingIndicator } from '../components/LoadingIndicator';

export function DashboardPage() {
  const { user, refreshUser, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Skill input
  const [newSkill, setNewSkill] = useState('');
  const [skillError, setSkillError] = useState('');

  // Project Modal State
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    technologies: '',
    github_url: '',
    demo_url: '',
    image_url: '',
  });
  const [projectError, setProjectError] = useState('');

  // Opportunity Modal State
  const [showOppModal, setShowOppModal] = useState(false);
  const [editingOpp, setEditingOpp] = useState(null);
  const [oppForm, setOppForm] = useState({
    title: '',
    description: '',
    required_skills: '',
    status: 'Open',
  });
  const [oppError, setOppError] = useState('');

  // Profile Edit Form
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    university: '',
    department: '',
    semester: '',
    bio: '',
    profile_image: '',
    github_url: '',
    linkedin_url: '',
  });
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Load student personal data
  useEffect(() => {
    if (user) {
      loadStudentData();
      setProfileForm({
        full_name: user.full_name || '',
        university: user.university || '',
        department: user.department || '',
        semester: user.semester || '',
        bio: user.bio || '',
        profile_image: user.profile_image || '',
        github_url: user.github_url || '',
        linkedin_url: user.linkedin_url || '',
      });
    }
  }, [user?.id]);

  async function loadStudentData() {
    setLoading(true);
    try {
      const student = await api.get(`/api/students/${user.id}`);
      setSkills(student.skills || []);
      setProjects(student.projects || []);
      setOpportunities(student.opportunities || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  // --- Skills Handlers ---
  const handleAddSkill = async (e) => {
    e.preventDefault();
    setSkillError('');
    if (!newSkill.trim()) return;

    try {
      const res = await api.post('/api/skills', { skill_name: newSkill.trim() });
      setSkills([...skills, res.skill]);
      setNewSkill('');
      await refreshUser();
    } catch (err) {
      setSkillError(err.message || 'Failed to add skill.');
    }
  };

  const handleRemoveSkill = async (skillItem) => {
    try {
      await api.delete(`/api/skills/${skillItem.id}`);
      setSkills(skills.filter((s) => s.id !== skillItem.id));
      await refreshUser();
    } catch (err) {
      alert(err.message || 'Failed to delete skill.');
    }
  };

  // --- Project Handlers ---
  const openNewProjectModal = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      description: '',
      technologies: '',
      github_url: '',
      demo_url: '',
      image_url: '',
    });
    setProjectError('');
    setShowProjectModal(true);
  };

  const openEditProjectModal = (proj) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title,
      description: proj.description,
      technologies: proj.technologies,
      github_url: proj.github_url,
      demo_url: proj.demo_url || '',
      image_url: proj.image_url || '',
    });
    setProjectError('');
    setShowProjectModal(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setProjectError('');

    try {
      if (editingProject) {
        const res = await api.put(`/api/projects/${editingProject.id}`, projectForm);
        setProjects(projects.map((p) => (p.id === editingProject.id ? res.project : p)));
      } else {
        const res = await api.post('/api/projects', projectForm);
        setProjects([res.project, ...projects]);
      }
      setShowProjectModal(false);
      await refreshUser();
    } catch (err) {
      setProjectError(err.message || 'Failed to save project.');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to remove this project?')) return;
    try {
      await api.delete(`/api/projects/${projectId}`);
      setProjects(projects.filter((p) => p.id !== projectId));
      await refreshUser();
    } catch (err) {
      alert(err.message || 'Failed to delete project.');
    }
  };

  // --- Opportunities Handlers ---
  const openNewOppModal = () => {
    setEditingOpp(null);
    setOppForm({
      title: '',
      description: '',
      required_skills: '',
      status: 'Open',
    });
    setOppError('');
    setShowOppModal(true);
  };

  const openEditOppModal = (opp) => {
    setEditingOpp(opp);
    setOppForm({
      title: opp.title,
      description: opp.description,
      required_skills: opp.required_skills,
      status: opp.status || 'Open',
    });
    setOppError('');
    setShowOppModal(true);
  };

  const handleSaveOpp = async (e) => {
    e.preventDefault();
    setOppError('');

    try {
      if (editingOpp) {
        const res = await api.put(`/api/opportunities/${editingOpp.id}`, oppForm);
        setOpportunities(opportunities.map((o) => (o.id === editingOpp.id ? res.opportunity : o)));
      } else {
        const res = await api.post('/api/opportunities', oppForm);
        setOpportunities([res.opportunity, ...opportunities]);
      }
      setShowOppModal(false);
      await refreshUser();
    } catch (err) {
      setOppError(err.message || 'Failed to save opportunity.');
    }
  };

  const handleDeleteOpp = async (oppId) => {
    if (!window.confirm('Are you sure you want to remove this opportunity post?')) return;
    try {
      await api.delete(`/api/opportunities/${oppId}`);
      setOpportunities(opportunities.filter((o) => o.id !== oppId));
      await refreshUser();
    } catch (err) {
      alert(err.message || 'Failed to delete opportunity.');
    }
  };

  // --- Profile Handler ---
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    try {
      await updateProfile(profileForm);
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(''), 4000);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    }
  };

  if (!user) return null;

  return (
    <div className="container">
      <div className="dashboard-layout">
        {/* Left Column: Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Right Column: Dynamic Content Tabs */}
        <main>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ marginBottom: '1.75rem' }}>
                <h1 style={{ fontSize: '1.85rem', marginBottom: '0.35rem' }}>
                  Welcome back, {user.full_name}! 👋
                </h1>
                <p>Manage your technical profile, semester projects, and campus collaboration requests.</p>
              </div>

              {/* Profile Completion Meter */}
              <div className="completion-box">
                <div className="completion-header">
                  <div>
                    <h3>Profile Strength</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                      Complete your profile to stand out to potential teammates and recruiters.
                    </p>
                  </div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>
                    {user.completion_percentage || 50}%
                  </span>
                </div>

                <div className="completion-bar-outer">
                  <div
                    className="completion-bar-inner"
                    style={{ width: `${user.completion_percentage || 50}%` }}
                  ></div>
                </div>

                {user.completion_percentage < 100 && (
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    <span style={{ color: '#cbd5e1' }}>Tips to reach 100%:</span>
                    {!user.bio && (
                      <button
                        onClick={() => setActiveTab('profile')}
                        style={{ color: '#38bdf8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        + Add Bio
                      </button>
                    )}
                    {!user.github_url && (
                      <button
                        onClick={() => setActiveTab('profile')}
                        style={{ color: '#38bdf8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        + Add GitHub Link
                      </button>
                    )}
                    {skills.length === 0 && (
                      <button
                        onClick={() => setActiveTab('skills')}
                        style={{ color: '#38bdf8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        + Add Skills
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Metrics Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Code size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, display: 'block', lineHeight: 1.1 }}>
                      {skills.length}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Technical Skills</span>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FolderGit2 size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, display: 'block', lineHeight: 1.1 }}>
                      {projects.length}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Projects Published</span>
                  </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, display: 'block', lineHeight: 1.1 }}>
                      {opportunities.length}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Team Posts</span>
                  </div>
                </div>
              </div>

              {/* Recent Projects Preview */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1.35rem' }}>Your Projects</h2>
                  <button onClick={openNewProjectModal} className="btn btn-primary btn-sm">
                    <Plus size={15} /> Add Project
                  </button>
                </div>

                {projects.length === 0 ? (
                  <EmptyState
                    icon={FolderGit2}
                    title="No projects added yet"
                    description="Show off your university assignments, side projects, or capstone prototypes."
                    actionText="Publish Your First Project"
                    onAction={openNewProjectModal}
                  />
                ) : (
                  <div className="projects-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                    {projects.slice(0, 2).map((proj) => (
                      <ProjectCard
                        key={proj.id}
                        project={proj}
                        showAuthor={false}
                        onEdit={openEditProjectModal}
                        onDelete={handleDeleteProject}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Active Opportunities Preview */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1.35rem' }}>Your Collaboration Opportunities</h2>
                  <button onClick={openNewOppModal} className="btn btn-secondary btn-sm">
                    <Plus size={15} /> Post Request
                  </button>
                </div>

                {opportunities.length === 0 ? (
                  <EmptyState
                    icon={Sparkles}
                    title="No collaboration posts"
                    description="Need teammates for an upcoming hackathon, course project, or final year capstone? Post a request here."
                    actionText="Create Team Opportunity"
                    onAction={openNewOppModal}
                  />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {opportunities.slice(0, 2).map((opp) => (
                      <OpportunityCard
                        key={opp.id}
                        opportunity={opp}
                        showOwner={false}
                        onEdit={openEditOppModal}
                        onDelete={handleDeleteOpp}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MY SKILLS */}
          {activeTab === 'skills' && (
            <div className="card">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Technical Skills</h2>
              <p style={{ marginBottom: '1.75rem' }}>
                Add languages, frameworks, libraries, and developer tools you are comfortable working with.
              </p>

              {skillError && (
                <div className="alert alert-danger">
                  <AlertCircle size={16} />
                  <span>{skillError}</span>
                </div>
              )}

              <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. React, Python, C++, Docker, PyTorch"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  style={{ maxWidth: 360 }}
                />
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} /> Add Skill
                </button>
              </form>

              <div>
                <h3 style={{ fontSize: '1rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1rem' }}>
                  Your Listed Skills ({skills.length})
                </h3>

                {skills.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                    No skills listed yet. Add your first skill using the input above!
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {skills.map((skill) => (
                      <SkillTag
                        key={skill.id}
                        skill={skill}
                        onRemove={handleRemoveSkill}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MY PROJECTS */}
          {activeTab === 'projects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>My Projects</h2>
                  <p>Manage and showcase your development portfolio projects.</p>
                </div>
                <button onClick={openNewProjectModal} className="btn btn-primary">
                  <Plus size={16} /> Add New Project
                </button>
              </div>

              {projects.length === 0 ? (
                <EmptyState
                  icon={FolderGit2}
                  title="No projects created yet"
                  description="Add projects to highlight your technical capabilities to peers and university mentors."
                  actionText="Publish Your First Project"
                  onAction={openNewProjectModal}
                />
              ) : (
                <div className="projects-grid">
                  {projects.map((proj) => (
                    <ProjectCard
                      key={proj.id}
                      project={proj}
                      showAuthor={false}
                      onEdit={openEditProjectModal}
                      onDelete={handleDeleteProject}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MY COLLABORATION OPPORTUNITIES */}
          {activeTab === 'opportunities' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>Team Opportunities</h2>
                  <p>Manage calls for teammates, study groups, and hackathon teams.</p>
                </div>
                <button onClick={openNewOppModal} className="btn btn-primary">
                  <Plus size={16} /> Post Opportunity
                </button>
              </div>

              {opportunities.length === 0 ? (
                <EmptyState
                  icon={Sparkles}
                  title="No opportunities posted yet"
                  description="Publish a post describing the project and skills you are seeking."
                  actionText="Post Your First Opportunity"
                  onAction={openNewOppModal}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {opportunities.map((opp) => (
                    <OpportunityCard
                      key={opp.id}
                      opportunity={opp}
                      showOwner={false}
                      onEdit={openEditOppModal}
                      onDelete={handleDeleteOpp}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: EDIT PROFILE */}
          {activeTab === 'profile' && (
            <div className="card" style={{ maxWidth: 700 }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Edit Student Profile</h2>
              <p style={{ marginBottom: '1.75rem' }}>
                Update your academic credentials, biography, and professional social links.
              </p>

              {profileSuccess && (
                <div className="alert alert-success">
                  <CheckCircle2 size={16} />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div className="alert alert-danger">
                  <AlertCircle size={16} />
                  <span>{profileError}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Profile Image URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://images.unsplash.com/..."
                    value={profileForm.profile_image}
                    onChange={(e) => setProfileForm({ ...profileForm, profile_image: e.target.value })}
                  />
                  <small style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                    Tip: Use an Unsplash or GitHub profile image link
                  </small>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">University / Institute *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileForm.university}
                      onChange={(e) => setProfileForm({ ...profileForm, university: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department / Major *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileForm.department}
                      onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Current Semester *</label>
                  <select
                    className="form-select"
                    value={profileForm.semester}
                    onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
                    required
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="3rd Semester">3rd Semester</option>
                    <option value="4th Semester">4th Semester</option>
                    <option value="5th Semester">5th Semester</option>
                    <option value="6th Semester">6th Semester</option>
                    <option value="7th Semester">7th Semester</option>
                    <option value="8th Semester">8th Semester</option>
                    <option value="Graduate / Alumni">Graduate / Alumni</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Short Biography</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    placeholder="Briefly introduce your engineering interests, goals, and passions..."
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">GitHub Profile URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://github.com/username"
                      value={profileForm.github_url}
                      onChange={(e) => setProfileForm({ ...profileForm, github_url: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://linkedin.com/in/username"
                      value={profileForm.linkedin_url}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedin_url: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.75rem' }}>
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* PROJECT MODAL (Create / Edit) */}
      {showProjectModal && (
        <div className="modal-overlay" onClick={() => setShowProjectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.35rem' }}>
                {editingProject ? 'Edit Project' : 'Publish New Project'}
              </h3>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setShowProjectModal(false)}
                style={{ padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            {projectError && (
              <div className="alert alert-danger">
                <AlertCircle size={16} />
                <span>{projectError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProject}>
              <div className="form-group">
                <label className="form-label">Project Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. UniCollab – Realtime Peer Study Platform"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Description *</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  placeholder="What does this project do? Who is it for?"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Technologies Used * (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. React, Node.js, Express, SQLite"
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">GitHub Repository URL *</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://github.com/username/project"
                  value={projectForm.github_url}
                  onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Live Demo URL (Optional)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://my-demo-app.com"
                  value={projectForm.demo_url}
                  onChange={(e) => setProjectForm({ ...projectForm, demo_url: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Project Screenshot / Image URL (Optional)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={projectForm.image_url}
                  onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowProjectModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProject ? 'Update Project' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OPPORTUNITY MODAL (Create / Edit) */}
      {showOppModal && (
        <div className="modal-overlay" onClick={() => setShowOppModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.35rem' }}>
                {editingOpp ? 'Edit Opportunity' : 'Post Team Opportunity'}
              </h3>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setShowOppModal(false)}
                style={{ padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            {oppError && (
              <div className="alert alert-danger">
                <AlertCircle size={16} />
                <span>{oppError}</span>
              </div>
            )}

            <form onSubmit={handleSaveOpp}>
              <div className="form-group">
                <label className="form-label">Opportunity Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Looking for a Frontend React Developer for Final Year Capstone"
                  value={oppForm.title}
                  onChange={(e) => setOppForm({ ...oppForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  rows={4}
                  className="form-textarea"
                  placeholder="Describe your project, team goals, expected workload, and who you are looking for..."
                  value={oppForm.description}
                  onChange={(e) => setOppForm({ ...oppForm, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Required Skills * (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. React, JavaScript, CSS, REST API"
                  value={oppForm.required_skills}
                  onChange={(e) => setOppForm({ ...oppForm, required_skills: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={oppForm.status}
                  onChange={(e) => setOppForm({ ...oppForm, status: e.target.value })}
                >
                  <option value="Open">Open (Actively seeking teammates)</option>
                  <option value="Closed">Closed (Position filled)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowOppModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingOpp ? 'Update Opportunity' : 'Post Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
