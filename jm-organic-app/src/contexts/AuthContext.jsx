// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const normalizeUser = useCallback((u) => {
    if (!u) return null;
    const id = u.id || u._id || u.uid;
    return {
      ...u,
      id,
      _id: id
    };
  }, []);

  // ✅ Email/Password Register
  const register = useCallback(async (userData) => {
    setLoading(true);
    try {
      const response = await authAPI.register(userData);
      if (response.success) {
        const normUser = normalizeUser(response.user);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(normUser));
        setUser(normUser);
        setIsAuthenticated(true);
        return normUser;
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [normalizeUser]);

  // ✅ Email/Password Login
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      if (response.success) {
        const normUser = normalizeUser(response.user);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(normUser));
        setUser(normUser);
        setIsAuthenticated(true);
        return normUser;
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [normalizeUser]);

  // ✅ Firebase Google Login
  const googleAuth = useCallback(async (idToken) => {
    setLoading(true);
    try {
      const response = await authAPI.googleLogin(idToken);
      if (response.success) {
        const normUser = normalizeUser(response.user);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(normUser));
        setUser(normUser);
        setIsAuthenticated(true);
        return normUser;
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [normalizeUser]);

  // ✅ Update Profile in MongoDB & Local State
  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    try {
      const response = await authAPI.updateProfile(profileData);
      if (response.success && response.user) {
        const normUser = normalizeUser(response.user);
        localStorage.setItem('user', JSON.stringify(normUser));
        setUser(normUser);
        return normUser;
      }
      throw new Error(response.message || 'Failed to update profile');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [normalizeUser]);

  // ✅ Logout
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  }, []);

  // ✅ Check for existing session
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const normUser = normalizeUser(JSON.parse(storedUser));
        setUser(normUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error restoring session:', error);
        logout();
      }
    }
  }, [normalizeUser, logout]);

  const value = useMemo(() => ({
    user,
    login,
    register,
    googleAuth,
    updateProfile,
    logout,
    loading,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user'
  }), [user, login, register, googleAuth, updateProfile, logout, loading, isAuthenticated]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;