// pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import GoogleSignIn from '../../components/GoogleSignIn'; // ✅ Import GoogleSignIn
import './LoginPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const { register, googleAuth, userLoggedIn } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (userLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // ✅ Better validation
    if (!firstName.trim()) {
      setErrorMsg('First Name is required.');
      return;
    }

    if (!email.trim()) {
      setErrorMsg('Email is required.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Password is required.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: `${firstName} ${lastName}`.trim(),
        firstName,
        lastName,
        email,
        phone,
        password,
      });
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMsg(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Real Google Sign In handler (same pattern as LoginPage)
  const handleGoogleSuccess = async (credentialResponse) => {
    setErrorMsg('');
    setLoading(true);
    
    try {
      const idToken = credentialResponse?.token || credentialResponse?.credential;
      const user = await googleAuth(idToken);
      if (user) {
        navigate('/');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      setErrorMsg(error.message || 'Google sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrorMsg('Google sign in failed.');
    setLoading(false);
  };

  return (
    <div className="login-page-container">
      <div className="login-split-grid">
        
        {/* Left Side - Banner */}
        <div className="login-left-banner">
          <img
            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200&q=80"
            alt="Tamil Nadu Coconut Farm"
            className="login-left-bg-img"
          />
          <div className="login-left-overlay" />

          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-amber-300">
              Join JM Organic
            </span>
          </div>

          <div className="login-left-content">
            <h1 className="login-left-title">
              Pure harvest.
              <span className="login-gold-text">Direct to home.</span>
            </h1>

            <p className="login-left-sub">
              Create an account to track orders and earn organic rewards points.
            </p>

            <div className="login-check-list">
              <div className="login-check-item">
                <span>✓</span> FSSAI Certified
              </div>
              <div className="login-check-item">
                <span>✓</span> 100% Organic
              </div>
              <div className="login-check-item">
                <span>✓</span> Farm Traced
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
              className="flex items-center gap-1 px-3 py-1 rounded-full border border-brand-border bg-white text-xs font-bold text-emerald-900"
            >
              <span className="text-[10px] text-muted-foreground uppercase">IN</span>
              <span>தமிழ்</span>
            </button>
          </div>

          <div className="login-form-center">
            
            {/* Capsule Switcher Tab */}
            <div className="login-tab-switcher">
              <button
                type="button"
                className="login-tab-btn inactive"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className="login-tab-btn active"
              >
                Create Account
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div className="grid grid-cols-2 gap-3">
                <div className="login-input-group">
                  <label className="login-input-label">FIRST NAME</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Priya"
                    className="login-sage-input"
                    required
                  />
                </div>

                <div className="login-input-group">
                  <label className="login-input-label">LAST NAME</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Sundaram"
                    className="login-sage-input"
                  />
                </div>
              </div>

              <div className="login-input-group">
                <label className="login-input-label">EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@email.com"
                  className="login-sage-input"
                  required
                />
              </div>

              <div className="login-input-group">
                <label className="login-input-label">PHONE NUMBER</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="login-sage-input"
                />
              </div>

              <div className="login-input-group">
                <label className="login-input-label">CREATE PASSWORD</label>
                <div className="login-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="login-sage-input"
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
              </div>

              <button
                type="submit"
                disabled={loading}
                className="login-primary-btn mt-2"
              >
                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="login-divider">
              <span>or</span>
            </div>

            {/* ✅ Real GoogleSignIn component - same pattern as LoginPage */}
            <div className="flex justify-center">
              <GoogleSignIn
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="signup_with"
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

export default RegisterPage;