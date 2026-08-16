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
      ref: 'Product'
    },
    name: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'cod'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  deliveryDate: Date,
  notes: String
}, {
  timestamps: true
});

// ✅ Check if model exists before creating it
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = Order;