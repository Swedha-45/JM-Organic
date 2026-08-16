const express = require('express');
const router = express.Router();
const Product = require('../models/product');

const products = [
  {
    name: 'Coconut Oil 1L',
    description: 'Pure cold-pressed coconut oil from Tamil Nadu farms.',
    price: 180,
    originalPrice: 220,
    category: 'Oils',
    image: 'https://images.unsplash.com/photo-1627658036047-98c7c0f6a31d?w=300&h=300&fit=crop',
    badge: 'BEST SELLER',
    isPure: true,
    rating: 4.8,
    reviews: 1240,
    stock: 100,
    isFeatured: true,
    nutritionInfo: { calories: '862', protein: '0', carbs: '0', fat: '100', fiber: '0' }
  },
  {
    name: 'Fresh Tender Coconut',
    description: 'Farm fresh tender coconuts delivered daily.',
    price: 175,
    originalPrice: 210,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1586185242545-6484c095c624?w=300&h=300&fit=crop',
    isPure: false,
    rating: 4.7,
    reviews: 543,
    stock: 200,
    isFeatured: true,
    nutritionInfo: { calories: '19', protein: '2', carbs: '7.5', fat: '0.5', fiber: '3' }
  },
  {
    name: 'Organic Brown Rice',
    description: 'Premium quality organic brown rice from Tamil Nadu.',
    price: 120,
    originalPrice: 150,
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop',
    isPure: true,
    rating: 4.6,
    reviews: 234,
    stock: 80,
    isFeatured: true,
    nutritionInfo: { calories: '370', protein: '7.9', carbs: '77', fat: '2.9', fiber: '3.5' }
  },
  {
    name: 'Cold Pressed Groundnut Oil',
    description: 'Pure cold-pressed groundnut oil for healthy cooking.',
    price: 160,
    originalPrice: 190,
    category: 'Oils',
    image: 'https://images.unsplash.com/photo-1627658036047-98c7c0f6a31d?w=300&h=300&fit=crop',
    isPure: true,
    rating: 4.5,
    reviews: 432,
    stock: 60,
    isFeatured: false,
    nutritionInfo: { calories: '884', protein: '0', carbs: '0', fat: '100', fiber: '0' }
  },
  {
    name: 'Organic Jaggery',
    description: 'Natural organic jaggery from sugarcane farms.',
    price: 90,
    originalPrice: 120,
    category: 'Sweeteners',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e891339e7?w=300&h=300&fit=crop',
    isPure: true,
    rating: 4.8,
    reviews: 567,
    stock: 100,
    isFeatured: false,
    nutritionInfo: { calories: '383', protein: '0.4', carbs: '98', fat: '0.1', fiber: '0' }
  },
  {
    name: 'Organic Honey',
    description: 'Pure organic honey from natural forests.',
    price: 250,
    originalPrice: 300,
    category: 'Sweeteners',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e891339e7?w=300&h=300&fit=crop',
    badge: 'NEW',
    isPure: true,
    rating: 4.9,
    reviews: 890,
    stock: 50,
    isFeatured: true,
    nutritionInfo: { calories: '304', protein: '0.3', carbs: '82.4', fat: '0', fiber: '0.2' }
  }
];

// @desc    Seed products
router.post('/', async (req, res) => {
  try {
    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(products);
    
    res.json({
      success: true,
      message: `${createdProducts.length} products seeded successfully`,
      products: createdProducts
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get seed status
router.get('/status', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({
      success: true,
      count,
      seeded: count > 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

module.exports = router;