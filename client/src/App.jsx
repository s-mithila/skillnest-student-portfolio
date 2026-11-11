// client/src/App.jsx
// Root Application Router and Protected Route Handling

import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { StudentDirectoryPage } from './pages/StudentDirectoryPage';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { ProjectListPage } from './pages/ProjectListPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { TeamFinderPage } from './pages/TeamFinderPage';
import { OpportunityDetailPage } from './pages/OpportunityDetailPage';
import { useAuth } from './context/AuthContext';
import { LoadingIndicator } from './components/LoadingIndicator';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1rem' }}>
        <LoadingIndicator message="Verifying session..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function App() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/students" element={<StudentDirectoryPage />} />
          <Route path="/students/:id" element={<StudentProfilePage />} />
          <Route path="/projects" element={<ProjectListPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/team-finder" element={<TeamFinderPage />} />
          <Route path="/team-finder/:id" element={<OpportunityDetailPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

