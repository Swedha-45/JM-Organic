const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');

// @desc    Get admin dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    const orders = await Order.find().select('total').lean();
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

    const recentOrders = await Order.find()
      .sort({ orderDate: -1 })
      .limit(5)
      .populate('user', 'name email')
      .lean();

    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .select('name stock price')
      .lean();

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt')
      .lean();

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue,
        pendingOrders,
        processingOrders,
        deliveredOrders
      },
      recentOrders,
      lowStockProducts,
      recentUsers
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard stats'
    });
  }
};

// @desc    Get all users (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').lean();
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
};

// @desc    Update user role (Admin)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role'
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole
};