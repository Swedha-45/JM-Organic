// controllers/paymentController.js
const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Product = require('../models/product');
const { placeOrder } = require('./orderController');

// @desc    Create a Razorpay order for the customer's cart
// POST /api/payments/create-order
//
// SECURITY: the amount is calculated HERE from real product prices in
// the database — never trust a total sent from the browser. The
// frontend only sends which products + quantities; the price for each
// is looked up fresh.
const createRazorpayOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items provided' });
    }

    let total = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product not found: ${item.product}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} units of ${product.name} left in stock`
        });
      }
      total += product.price * item.quantity;
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // Razorpay expects paise, not rupees
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    res.status(201).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID, // public key, safe to send to frontend
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
};

// @desc    Verify Razorpay's payment signature, then place the real order
// POST /api/payments/verify
//
// SECURITY: this signature check is the ONLY thing standing between "a
// real payment happened" and "someone faked a success response in dev
// tools." Never skip it, never trust razorpay_payment_id alone.
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      shippingAddress,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed — signature mismatch. This payment was not confirmed by Razorpay.',
      });
    }

    // Signature is valid — the payment is real. Now place the order.
    const order = await placeOrder({
      userId: req.user._id,
      items,
      shippingAddress,
      paymentMethod: 'online',
      paymentStatus: 'paid',
      razorpayIds: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Payment verified and order placed',
      order,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};

module.exports = { createRazorpayOrder, verifyPayment };