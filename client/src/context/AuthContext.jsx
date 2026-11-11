// client/src/context/AuthContext.jsx
// Manages global student authentication and session state

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check active session on initial app load
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const data = await api.get('/api/auth/me');
      setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const data = await api.post('/api/auth/login', { email, password });
    setUser(data.user);
    return data.user;
  }

  async function register(userData) {
    const data = await api.post('/api/auth/register', userData);
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    try {
      await api.post('/api/auth/logout');
    } finally {
      setUser(null);
    }
  }

  async function refreshUser() {
    try {
      const data = await api.get('/api/auth/me');
      setUser(data.user);
    } catch (err) {
      // ignore
    }
  }

  async function updateProfile(profileData) {
    const data = await api.put('/api/profile', profileData);
    setUser(data.user);
    return data.user;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

