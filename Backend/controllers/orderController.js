// controllers/orderController.js
const mongoose = require('mongoose');
const Order = require('../models/order');
const Cart = require('../models/cart');
const Product = require('../models/product');

// ✅ Helper function to place order, update stock, and clear cart
const placeOrder = async ({ userId, items, shippingAddress, paymentMethod = 'cod', paymentStatus = 'pending', razorpayDetails = {} }) => {
  if (!items || items.length === 0) {
    throw new Error('No items provided for order');
  }

  let total = 0;
  const verifiedItems = [];

  // 1. Verify products & stock availability
  for (const item of items) {
    const productId = item.product || item._id || item.id;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error(`Invalid product ID: ${productId}`);
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error(`Product not found: ${productId}`);
    }

    const requestedQty = Number(item.quantity) || 1;

    if (product.stock < requestedQty) {
      throw new Error(`Only ${product.stock} units of ${product.name} left in stock`);
    }

    total += product.price * requestedQty;
    verifiedItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: requestedQty,
      image: product.image || '',
    });
  }

  // 2. Reduce stock for each product
  for (const item of verifiedItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity }
    });
  }

  // 3. Create & save order
  const order = new Order({
    user: userId,
    items: verifiedItems,
    total: total,
    shippingAddress: shippingAddress || {},
    paymentMethod: paymentMethod,
    paymentStatus: paymentStatus,
    status: 'pending',
    razorpayDetails: razorpayDetails,
    orderDate: new Date()
  });

  await order.save();

  // 4. Clear user's cart in database
  await Cart.findOneAndDelete({ user: userId });

  return order;
};

// @desc    Create order
// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = req.user._id;

    const order = await placeOrder({
      userId,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: 'pending'
    });

    const populatedOrder = await Order.findById(order._id).populate('user', 'name email phone');

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
// GET /api/orders
const getOrders = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user._id };
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ orderDate: -1 });

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
// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone');

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
// PUT /api/orders/:id/status
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
    ).populate('user', 'name email phone');

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
  placeOrder,
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
};