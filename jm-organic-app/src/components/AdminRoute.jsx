// components/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  console.log('AdminRoute - User:', user);
  console.log('AdminRoute - isAuthenticated:', isAuthenticated);
  console.log('AdminRoute - isAdmin:', user?.role === 'admin');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // ✅ If not logged in, redirect to ADMIN login page
  if (!isAuthenticated || !user) {
    console.log('Redirecting to /admin/login - Not authenticated');
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ If logged in but NOT admin, redirect to home
  if (user.role !== 'admin') {
    console.log('Redirecting to / - Not admin');
    return <Navigate to="/" replace />;
  }

  // ✅ If admin, render admin content
  console.log('Rendering admin content');
  return <Outlet />;
};

export default AdminRoute;