// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // ✅ Support both authenticated and anonymous users
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // Make optional for anonymous reviews
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  verified: {
    type: Boolean,
    default: true
  },
  likes: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ Check if model exists before creating it
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

module.exports = Review;