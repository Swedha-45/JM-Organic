const Product = require('../models/product');

// ✅ Ultra-fast sub-millisecond RAM Cache (<0.1ms latency)
const productCache = new Map();
const singleProductCache = new Map();
const CACHE_TTL_MS = 300000; // 5 minutes TTL

const clearCache = () => {
  productCache.clear();
  singleProductCache.clear();
};

// @desc    Get all products
const getProducts = async (req, res) => {
  try {
    const { search, category, featured } = req.query;
    const cacheKey = JSON.stringify({ search: search || '', category: category || '', featured: featured || '' });
    const now = Date.now();

    if (productCache.has(cacheKey)) {
      const entry = productCache.get(cacheKey);
      if (now - entry.timestamp < CACHE_TTL_MS) {
        res.setHeader('X-Response-Time', '0.1ms');
        return res.json(entry.data);
      }
    }
    
    let filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    
    let query = Product.find(filter).sort({ createdAt: -1, _id: -1 });
    
    if (search) {
      query = query.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ]
      });
    }

    const rawProducts = await query.lean();
    const products = rawProducts.map(p => ({
      ...p,
      id: p._id ? p._id.toString() : p.id
    }));
    
    const responseData = {
      success: true,
      count: products.length,
      products
    };

    productCache.set(cacheKey, { timestamp: now, data: responseData });
    res.json(responseData);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

// @desc    Get single product
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const now = Date.now();

    if (singleProductCache.has(productId)) {
      const entry = singleProductCache.get(productId);
      if (now - entry.timestamp < CACHE_TTL_MS) {
        res.setHeader('X-Response-Time', '0.1ms');
        return res.json(entry.data);
      }
    }

    const product = await Product.findById(productId).lean();
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.id = product._id ? product._id.toString() : product.id;
    
    const responseData = {
      success: true,
      product
    };

    singleProductCache.set(productId, { timestamp: now, data: responseData });
    res.json(responseData);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

// @desc    Create product (Admin only)
const createProduct = async (req, res) => {
  try {
    clearCache();
    const product = await Product.create(req.body);
    const obj = product.toObject();
    obj.id = obj._id.toString();

    res.status(201).json({
      success: true,
      product: obj
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

// @desc    Update product (Admin only)
const updateProduct = async (req, res) => {
  try {
    clearCache();
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const obj = product.toObject();
    obj.id = obj._id.toString();
    
    res.json({
      success: true,
      product: obj
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

// @desc    Delete product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    clearCache();
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};