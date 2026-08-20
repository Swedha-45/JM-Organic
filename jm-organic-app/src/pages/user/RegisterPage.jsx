// pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import GoogleSignIn from '../../components/GoogleSignIn';
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

  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  if (userLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const validateFirstName = (name) => {
    if (!name || name.trim().length === 0) {
      return 'First Name is required.';
    }
    if (name.trim().length < 2) {
      return 'First Name must be at least 2 characters.';
    }
    return '';
  };

  const validateLastName = (name) => {
    if (name && name.trim().length > 0 && name.trim().length < 2) {
      return 'Last Name must be at least 2 characters.';
    }
    return '';
  };

  const validateEmail = (email) => {
    if (!email || email.trim().length === 0) {
      return 'Email is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone || phone.trim().length === 0) {
      return '';
    }
    const phoneRegex = /^(?:\+91[\s-]?)?[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.trim().replace(/\s/g, ''))) {
      return 'Please enter a valid 10-digit Indian phone number.';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password || password.length === 0) {
      return 'Password is required.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    return '';
  };

  const handleBlur = (field) => {
    let error = '';
    switch (field) {
      case 'firstName':
        error = validateFirstName(firstName);
        break;
      case 'lastName':
        error = validateLastName(lastName);
        break;
      case 'email':
        error = validateEmail(email);
        break;
      case 'phone':
        error = validatePhone(phone);
        break;
      case 'password':
        error = validatePassword(password);
        break;
      default:
        break;
    }
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: ''
    });

    const firstNameError = validateFirstName(firstName);
    const lastNameError = validateLastName(lastName);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);
    const passwordError = validatePassword(password);

    setFieldErrors({
      firstName: firstNameError,
      lastName: lastNameError,
      email: emailError,
      phone: phoneError,
      password: passwordError
    });

    if (firstNameError || lastNameError || emailError || phoneError || passwordError) {
      return;
    }

    setLoading(true);
    try {
      await register({
        name: `${firstName} ${lastName}`.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim() || '',
        email: email.trim(),
        phone: phone.trim() || '',
        password,
      });
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Sign In handler
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

  // ✅ Handle Tamil toggler - redirect to admin login
  const handleTamilToggle = () => {
    navigate('/admin/login');
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

            {/* ✅ Tamil Toggler - redirects to admin login */}
            <button
              type="button"
              onClick={handleTamilToggle}
              className="flex items-center gap-1 px-3 py-1 rounded-full border border-brand-border bg-white text-xs font-bold text-emerald-900 hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              <span className="text-[10px] text-muted-foreground uppercase">ENG</span>
              <span>ADMIN</span>
            </button>
          </div>

          <div className="login-form-center">

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

            <form onSubmit={handleRegister} noValidate>
              <div className="grid grid-cols-2 gap-3">
                <div className="login-input-group">
                  <label className="login-input-label">FIRST NAME</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onBlur={() => handleBlur('firstName')}
                    placeholder="Priya"
                    className={`login-sage-input ${fieldErrors.firstName ? 'border-red-500 bg-red-50' : ''}`}
                    required
                  />
                  {fieldErrors.firstName && (
                    <span className="text-[11px] font-bold text-red-600 pl-2 mt-1 block">{fieldErrors.firstName}</span>
                  )}
                </div>

                <div className="login-input-group">
                  <label className="login-input-label">LAST NAME</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onBlur={() => handleBlur('lastName')}
                    placeholder="Sundaram"
                    className={`login-sage-input ${fieldErrors.lastName ? 'border-red-500 bg-red-50' : ''}`}
                  />
                  {fieldErrors.lastName && (
                    <span className="text-[11px] font-bold text-red-600 pl-2 mt-1 block">{fieldErrors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="login-input-group">
                <label className="login-input-label">EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="priya@email.com"
                  className={`login-sage-input ${fieldErrors.email ? 'border-red-500 bg-red-50' : ''}`}
                  required
                />
                {fieldErrors.email && (
                  <span className="text-[11px] font-bold text-red-600 pl-2 mt-1 block">{fieldErrors.email}</span>
                )}
              </div>

              <div className="login-input-group">
                <label className="login-input-label">PHONE NUMBER</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  placeholder="+91 98765 43210"
                  className={`login-sage-input ${fieldErrors.phone ? 'border-red-500 bg-red-50' : ''}`}
                />
                {fieldErrors.phone && (
                  <span className="text-[11px] font-bold text-red-600 pl-2 mt-1 block">{fieldErrors.phone}</span>
                )}
              </div>

              <div className="login-input-group">
                <label className="login-input-label">CREATE PASSWORD</label>
                <div className="login-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    placeholder="At least 6 characters"
                    className={`login-sage-input ${fieldErrors.password ? 'border-red-500 bg-red-50' : ''}`}
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
                {fieldErrors.password && (
                  <span className="text-[11px] font-bold text-red-600 pl-2 mt-1 block">{fieldErrors.password}</span>
                )}
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