// layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  ClipboardDocumentListIcon, 
  ChartBarIcon,
  ArrowLeftIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-5 border-b border-gray-200">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              JM
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">JM Organic</div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500">Admin Panel</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: HomeIcon, label: 'Dashboard', path: '/admin' },
            { icon: ShoppingBagIcon, label: 'Products', path: '/admin/products' },
            { icon: ClipboardDocumentListIcon, label: 'Orders', path: '/admin/orders' },
            { icon: ChartBarIcon, label: 'Analytics', path: '/admin/analytics' },
          ].map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all"
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-green-700 font-bold text-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-900">{user?.name}</div>
              <div className="text-[10px] text-gray-500">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-2 text-center text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Bars3Icon className="w-5 h-5 text-gray-900" />
            </button>
            <Link to="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
              <ArrowLeftIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Shop</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;