// routes/reviewRoute.js
const express = require('express');

// ✅ Create a router instance
const router = express.Router();

// ✅ Import models
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

// ✅ GET all reviews (public)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ GET user's reviews (protected)
router.get('/my-reviews', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('productId', 'name image')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ POST submit a review (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    
    const review = new Review({
      user: req.user._id,
      productId,
      rating,
      title,
      comment,
      verified: true,
      likes: 0
    });
    
    await review.save();
    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ POST like a review (protected)
router.post('/:id/like', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    review.likes = (review.likes || 0) + 1;
    await review.save();
    res.json({ success: true, likes: review.likes });
  } catch (error) {
    console.error('Like review error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ DELETE a review (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ IMPORTANT: Export the router
module.exports = router;