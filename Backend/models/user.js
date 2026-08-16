// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  firebaseUid: {
    type: String,
    sparse: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  authProvider: {
    type: String,
    enum: ['email', 'google', 'firebase'],
    default: 'email'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.authProvider !== 'email') {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (this.authProvider !== 'email') {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Check if model exists before creating it
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;