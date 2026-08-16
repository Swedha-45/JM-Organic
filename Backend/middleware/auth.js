const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Protect routes - require authentication
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Not authorized'
    });
  }
};

// Admin middleware
const admin = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Not authorized as admin'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authorization error'
    });
  }
};

module.exports = { protect, admin, generateToken };