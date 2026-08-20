// models/order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  total: {
    type: Number,
    required: true
  },
  shippingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  // ✅ Payment Method: cod or online
  paymentMethod: {
    type: String,
    enum: ['cod', 'online', 'razorpay'],
    default: 'cod'
  },
  // ✅ Payment Status: pending, paid, failed, refunded
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  // ✅ Order Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  // ✅ Razorpay details (only for online payments)
  razorpayDetails: {
    orderId: String,
    paymentId: String,
    signature: String,
    errorMessage: String // ✅ Store failure reason
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);