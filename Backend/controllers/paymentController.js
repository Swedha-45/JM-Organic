// controllers/paymentController.js
const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Product = require('../models/product');
const Order = require('../models/order');
const Cart = require('../models/cart'); // ✅ Added missing Cart model import
const { placeOrder } = require('./orderController');

// @desc    Create Razorpay order for online payment
// POST /api/payments/create-order
const createRazorpayOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items provided' });
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const productId = item.product || item._id || item.id;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product not found: ${productId}` });
      }
      const quantity = Number(item.quantity) || 1;
      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} units of ${product.name} left in stock`
        });
      }
      total += product.price * quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image || '',
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    res.status(201).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      orderItems,
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create payment order' });
  }
};

// @desc    Verify online payment (Razorpay)
// POST /api/payments/verify
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      shippingAddress,
    } = req.body;

    // ✅ Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated. Please login again.' 
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing Razorpay payment parameters'
      });
    }

    // ✅ Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    // ✅ If signature is valid - PAYMENT SUCCESS
    if (isSignatureValid) {
      const order = await placeOrder({
        userId: req.user._id,
        items: items,
        shippingAddress: shippingAddress,
        paymentMethod: 'online',
        paymentStatus: 'paid',
        razorpayDetails: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
        },
      });

      console.log('✅ Payment SUCCESS - Order placed:', order._id);

      return res.status(201).json({
        success: true,
        message: 'Payment verified and order placed successfully',
        order: {
          id: order._id,
          orderId: `JM-${order._id.toString().slice(-6).toUpperCase()}`,
          total: order.total,
          items: order.items,
          status: order.status,
          paymentMethod: 'online',
          paymentStatus: 'paid',
        },
      });
    }

    // ❌ If signature is NOT valid - PAYMENT FAILED
    console.log('❌ Payment FAILED - Signature mismatch');

    const failedOrder = new Order({
      user: req.user._id,
      items: items || [],
      total: 0,
      shippingAddress: shippingAddress || {},
      paymentMethod: 'online',
      paymentStatus: 'failed',
      status: 'cancelled',
      razorpayDetails: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        errorMessage: 'Payment verification failed - Signature mismatch'
      },
      orderDate: new Date()
    });

    await failedOrder.save();

    return res.status(400).json({
      success: false,
      message: 'Payment verification failed. Signature mismatch.',
      order: {
        id: failedOrder._id,
        orderId: `JM-${failedOrder._id.toString().slice(-6).toUpperCase()}`,
        paymentStatus: 'failed',
      },
    });

  } catch (error) {
    console.error('❌ Verify payment error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Payment verification failed',
    });
  }
};

// @desc    Create COD Order (Cash on Delivery)
// POST /api/payments/cod
const createCODOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated. Please login.' 
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items provided' });
    }

    // ✅ Place order via helper (handles stock check, stock reduction, order saving & cart clearing)
    const order = await placeOrder({
      userId: req.user._id,
      items: items,
      shippingAddress: shippingAddress,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
    });

    console.log('✅ COD Order SUCCESS - Order placed:', order._id);

    res.status(201).json({
      success: true,
      message: 'COD Order placed successfully! You will pay on delivery.',
      order: {
        id: order._id,
        orderId: `JM-${order._id.toString().slice(-6).toUpperCase()}`,
        total: order.total,
        items: order.items,
        status: order.status,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
      },
    });

  } catch (error) {
    console.error('COD order error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to place COD order' 
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  createCODOrder,
};