// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import GoogleSignIn from '../../components/GoogleSignIn';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const { login, googleAuth, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // ✅ If already logged in, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setGeneralError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const user = await login(email, password);
      if (user) {
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        navigate('/');
      }
    } catch (error) {
      setGeneralError(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Firebase Google Login Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    setGeneralError('');
    setLoading(true);
    
    try {
      const idToken = credentialResponse?.token || credentialResponse?.credential;
      const user = await googleAuth(idToken);
      if (user) {
        navigate('/');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setGeneralError(error.message || 'Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setGeneralError('Google login failed.');
    setLoading(false);
  };

  return (
    <div className="login-page-container">
      <div className="login-split-grid">
        {/* Left Side - Banner */}
        <div className="login-left-banner">
          <img
            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200&q=80"
            alt="Tamil Nadu Organic Farm"
            className="login-left-bg-img"
          />
          <div className="login-left-overlay" />

          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-amber-300">
              Welcome to JM Organic
            </span>
          </div>

          <div className="login-left-content">
            <h1 className="login-left-title">
              Pure harvest.
              <span className="login-gold-text">Direct to home.</span>
            </h1>

            <p className="login-left-sub">
              Sign in to manage orders, view certified lab reports, and earn organic rewards.
            </p>

            <div className="login-check-list">
              <div className="login-check-item">
                <span>✓</span> FSSAI Certified
              </div>
              <div className="login-check-item">
                <span>✓</span> 100% Cold-Pressed
              </div>
              <div className="login-check-item">
                <span>✓</span> Farm Traced
              </div>
            </div>

            <div className="login-left-stats">
              <div>
                <div className="login-stat-num">50,000+</div>
                <div className="login-stat-label">Happy Families</div>
              </div>
              <div>
                <div className="login-stat-num">100%</div>
                <div className="login-stat-label">Pure Organic</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="login-right-section">
          <div className="login-right-header">
            <Link to="/" className="login-brand-logo">
              <div className="login-logo-icon">🌿</div>
              <span className="login-logo-title">JM Organic</span>
            </Link>

            <button 
              type="button" 
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-brand-border bg-white text-xs font-bold text-emerald-900 shadow-xs"
            >
              <span className="text-[10px] text-muted-foreground uppercase">IN</span>
              <span>தமிழ்</span>
            </button>
          </div>

          <div className="login-form-center">
            <div className="login-tab-switcher">
              <button
                type="button"
                className="login-tab-btn active"
              >
                Sign In
              </button>
              <button
                type="button"
                className="login-tab-btn inactive"
                onClick={() => navigate('/register')}
              >
                Create Account
              </button>
            </div>

            {generalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl">
                {generalError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="login-input-group">
                <label className="login-input-label">EMAIL ADDRESS</label>
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                    if (generalError) setGeneralError('');
                  }}
                  className={`login-sage-input ${errors.email ? 'border-red-500 bg-red-50' : ''}`}
                  disabled={loading}
                  required
                />
                {errors.email && (
                  <span className="text-[11px] font-bold text-red-600 pl-2 mt-1 block">{errors.email}</span>
                )}
              </div>

              <div className="login-input-group">
                <label className="login-input-label">PASSWORD</label>
                <div className="login-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: '' });
                      if (generalError) setGeneralError('');
                    }}
                    className={`login-sage-input ${errors.password ? 'border-red-500 bg-red-50' : ''}`}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="login-eye-toggle"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-[11px] font-bold text-red-600 pl-2 mt-1 block">{errors.password}</span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs mb-6 px-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-emerald-900">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-emerald-700 focus:ring-emerald-600"
                  />
                  <span>Remember Me</span>
                </label>
                <Link to="/forgot-password" className="login-forgot-link">
                  Forgot Password?
                </Link>
              </div>

              <button 
                type="submit" 
                className="login-primary-btn"
                disabled={loading}
              >
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="login-divider">
              <span>or</span>
            </div>

            <div className="flex justify-center">
              <GoogleSignIn
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="signin_with"
                disabled={loading}
              />
            </div>

            <div className="login-guest-wrap">
              <Link to="/" className="login-guest-link">
                <span>Browse as Guest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
          <div />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;