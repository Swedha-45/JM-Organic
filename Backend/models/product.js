// models/product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'default-product.jpg'
  },
  images: [String],
  badge: {
    type: String,
    default: null
  },
  isPure: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: '1 Litre'
  },
  nutrition: {
    type: String,
    default: ''
  },
  variants: [{
    size: String,
    tags: [String]
  }],
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  nutritionInfo: {
    calories: { type: String, default: '' },
    protein: { type: String, default: '' },
    carbs: { type: String, default: '' },
    fat: { type: String, default: '' },
    fiber: { type: String, default: '' }
  },
  tamilName: String,
  nameTa: String,
  tamilDescription: String,
  descriptionTa: String,
  nutritionTa: String,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  strict: false
});

// ✅ Check if model exists before creating it
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;