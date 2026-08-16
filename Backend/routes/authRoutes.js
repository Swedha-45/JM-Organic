const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  googleAuth,
  getProfile,
  updateProfile
} = require('../controllers/authController');
router.post('/google', googleAuth); 
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;