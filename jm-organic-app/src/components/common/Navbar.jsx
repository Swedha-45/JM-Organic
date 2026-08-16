// components/common/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, ArrowRight, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  // ✅ Use itemCount from CartContext (it's already provided!)
  const { itemCount } = useCart();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = user?.name 
    ? user.name 
    : (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user?.email?.split('@')[0] || 'Member'));

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ta' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-green-700 to-green-900 flex items-center justify-center text-white shadow-md shadow-green-950/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-2xl leading-none">🌿</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-gray-800 group-hover:text-green-800 transition-colors">
                JM Organic
              </span>
              <span className="text-[10px] font-bold tracking-widest text-green-700 uppercase">
                FOODS
              </span>
            </div>
          </Link>

          {/* Center Navigation Capsule Pill */}
          <div className="hidden md:flex items-center bg-white/80 backdrop-blur-md p-1.5 rounded-full border border-gray-200/80 shadow-sm">
            <Link
              to="/"
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                location.pathname === '/' 
                  ? 'bg-green-900 text-white shadow-sm' 
                  : 'text-gray-700 hover:text-green-900 hover:bg-gray-100'
              }`}
            >
              {t('home', 'Home')}
            </Link>
            <Link
              to="/products"
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                location.pathname === '/products'
                  ? 'bg-green-900 text-white shadow-sm'
                  : 'text-gray-700 hover:text-green-900 hover:bg-gray-100'
              }`}
            >
              {t('shop', 'Shop')}
            </Link>
            <Link
              to="/nutrition"
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                location.pathname === '/nutrition'
                  ? 'bg-green-900 text-white shadow-sm'
                  : 'text-gray-700 hover:text-green-900 hover:bg-gray-100'
              }`}
            >
              {t('nutrition', 'Nutrition')}
            </Link>
            <Link
              to="/bulk-orders"
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                location.pathname === '/bulk-orders'
                  ? 'bg-green-900 text-white shadow-sm'
                  : 'text-gray-700 hover:text-green-900 hover:bg-gray-100'
              }`}
            >
              Bulk Orders
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-amber-800 hover:bg-amber-50'
                }`}
              >
                {t('admin', 'Admin')}
              </Link>
            )}
          </div>

          {/* Right Header Controls */}
          <div className="hidden md:flex items-center space-x-3">
            <button 
              type="button" 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-bold text-green-900 hover:bg-green-50 transition-colors shadow-sm"
            >
              <span className="text-[10px] text-gray-500 uppercase">
                {i18n.language === 'ta' ? 'EN' : 'IN'}
              </span>
              <span>{i18n.language === 'ta' ? 'English' : 'தமிழ்'}</span>
            </button>

            <Link
              to="/cart"
              className="relative p-2.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:text-green-900 hover:bg-green-50 transition-all duration-200 shadow-sm"
            >
              <ShoppingBag className="w-5 h-5 text-green-900" />
              {/* ✅ Use itemCount from CartContext */}
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 bg-green-900 hover:bg-green-950 text-white px-4 py-2 rounded-full text-xs font-bold shadow-sm transition-all duration-200"
                >
                  <div className="w-6 h-6 rounded-full bg-green-700 flex items-center justify-center text-[10px] font-black text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{displayName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 bg-green-900 hover:bg-green-950 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-sm hover:shadow-md transition-all duration-200"
              >
                <span>{t('signIn', 'Sign In')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full bg-white border border-gray-200 text-green-900 shadow-sm"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl text-green-900 hover:bg-green-50 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in bg-white/95 rounded-b-3xl p-4 shadow-lg">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-green-900 hover:bg-green-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('home', 'Home')}
              </Link>
              <Link
                to="/products"
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-green-900 hover:bg-green-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('shop', 'Shop')}
              </Link>
              <Link
                to="/nutrition"
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-green-900 hover:bg-green-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nutrition', 'Nutrition')}
              </Link>
              <Link
                to="/bulk-orders"
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-green-900 hover:bg-green-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Bulk Orders
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/profile"
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-green-900 bg-green-50 flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4 text-green-700" />
                    <span>{t('profile', 'My Profile')}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 flex items-center gap-2 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('logout', 'Logout')}</span>
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="bg-green-900 text-white py-3 rounded-xl text-center font-bold text-sm mt-2 shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('signIn', 'Sign In')} →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;