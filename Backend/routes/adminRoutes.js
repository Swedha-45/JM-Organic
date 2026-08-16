const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getDashboardStats,
  getAllUsers,
  updateUserRole
} = require('../controllers/adminController');
const User = require('../models/user'); // ✅ Add this

// ✅ TEMPORARY: Force set admin role (remove after testing)
router.post('/fix-admin', async (req, res) => {
  try {
    const result = await User.updateOne(
      { email: 'admin@jmorganic.in' },
      { $set: { role: 'admin' } }
    );
    res.json({
      success: true,
      message: 'Admin role fixed!',
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ✅ Your existing routes
router.get('/stats', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/role', protect, admin, updateUserRole);

module.exports = router;