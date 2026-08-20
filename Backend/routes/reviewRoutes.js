// routes/reviewRoute.js
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// ✅ GET all reviews (public)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ POST submit a review (PUBLIC - no authentication required)
router.post('/', async (req, res) => {
  try {
    const { author, location, productName, rating, title, comment, verified, image } = req.body;
    
    // Validate required fields
    if (!author || !productName || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide: author, productName, rating, title, comment'
      });
    }

    const review = new Review({
      author: author.trim(),
      location: location || '',
      productName: productName.trim(),
      rating: Number(rating),
      title: title.trim(),
      comment: comment.trim(),
      verified: verified !== undefined ? verified : true,
      image: image || null,
      likes: 0
    });
    
    await review.save();
    
    res.status(201).json({ 
      success: true, 
      review,
      message: 'Review submitted successfully!'
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ✅ PUT like a review (public)
router.put('/:id/like', async (req, res) => {
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

// ✅ DELETE a review (admin only - optional)
router.delete('/:id', async (req, res) => {
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

module.exports = router;