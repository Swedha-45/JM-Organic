const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;