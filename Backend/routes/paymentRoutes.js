// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createRazorpayOrder, 
  verifyPayment, 
  createCODOrder 
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// ✅ Online payment routes
router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);

// ✅ Cash on Delivery route
router.post('/cod', protect, createCODOrder);

module.exports = router;