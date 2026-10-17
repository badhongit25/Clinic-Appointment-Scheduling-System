import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('clinic_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('clinic_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('clinic_user', JSON.stringify(data.user));
      localStorage.setItem('clinic_token', data.token);
      // Compatibility with old keys
      localStorage.setItem('loggedInPatient', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role = 'patient') => {
    setLoading(true);
    try {
      const data = await authApi.register({ name, email, password, role });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('clinic_user', JSON.stringify(data.user));
      localStorage.setItem('clinic_token', data.token);
      localStorage.setItem('loggedInPatient', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('clinic_user');
    localStorage.removeItem('clinic_token');
    localStorage.removeItem('loggedInPatient');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
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
