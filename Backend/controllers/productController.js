const Product = require('../models/product');

// @desc    Get all products
const getProducts = async (req, res) => {
  try {
    const { search, category, featured } = req.query;
    
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
    
    res.json({
      success: true,
      count: products.length,
      products
    });
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
    const product = await Product.findById(req.params.id).lean();
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.id = product._id ? product._id.toString() : product.id;
    
    res.json({
      success: true,
      product
    });
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