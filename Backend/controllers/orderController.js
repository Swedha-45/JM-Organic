const mongoose = require('mongoose');
const Order = require('../models/order');
const Cart = require('../models/cart');
const Product = require('../models/product');

// @desc    Create order
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = req.user._id;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order'
      });
    }

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update stock
    for (const item of items) {
      if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    const order = new Order({
      user: userId,
      items,
      total,
      shippingAddress: shippingAddress || {
        name: req.user.name,
        phone: req.user.phone,
        street: 'Online Address'
      },
      paymentMethod: (paymentMethod && ['card', 'upi', 'cod'].includes(paymentMethod)) ? paymentMethod : 'cod',
      status: 'pending',
      orderDate: new Date()
    });

    await order.save();

    // Clear cart
    await Cart.findOneAndDelete({ user: userId });

    const populatedOrder = await Order.findById(order._id).populate('user', 'name email phone').lean();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: populatedOrder || order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create order'
    });
  }
};

// @desc    Get user orders (or all orders if admin)
const getOrders = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user._id };
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ orderDate: -1 })
      .lean();

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders'
    });
  }
};

// @desc    Get single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order'
    });
  }
};

// @desc    Update order status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Order not found in database'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email phone').lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated',
      order
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order'
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
};