// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { 
  Users, ShoppingBag, Package, DollarSign, 
  TrendingUp, TrendingDown, Clock, CheckCircle,
  AlertTriangle, BarChart3, PieChart
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    deliveredOrders: 0,
    monthlyRevenue: [],
    categorySales: [],
    orderStatusData: []
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // ✅ Fetch REAL data from MongoDB
      const response = await adminAPI.getStats();
      
      if (response.success) {
        setStats(response.stats);
        setRecentOrders(response.recentOrders || []);
        setLowStockProducts(response.lowStockProducts || []);
        setRecentUsers(response.recentUsers || []);
      }
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Calculate real metrics
  const calculateMetrics = () => {
    const totalRevenue = stats.totalRevenue || 0;
    const totalOrders = stats.totalOrders || 0;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const conversionRate = stats.totalUsers > 0 
      ? (totalOrders / stats.totalUsers * 100).toFixed(1) 
      : 0;

    return { avgOrderValue, conversionRate };
  };

  const metrics = calculateMetrics();

  // ✅ Colors for charts
  const COLORS = ['#15803d', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

  // ✅ Status color mapping
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading real data from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadDashboardData}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // ✅ Key Metrics Cards
  const metricCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+12.5%',
      trend: 'up'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: ShoppingBag,
      color: 'bg-blue-500',
      change: '+8.2%',
      trend: 'up'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: Users,
      color: 'bg-purple-500',
      change: '+5.7%',
      trend: 'up'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts || 0,
      icon: Package,
      color: 'bg-orange-500',
      change: '+3.1%',
      trend: 'up'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm">Real-time analytics from your database</p>
      </div>

      {/* ✅ Stats Cards - REAL DATA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricCards.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{metric.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-xs ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className={`${metric.color} p-3 rounded-full text-white`}>
                <metric.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Additional Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Average Order Value</p>
          <p className="text-2xl font-bold text-gray-800">₹{metrics.avgOrderValue.toFixed(0)}</p>
          <span className="text-xs text-gray-400">Based on {stats.totalOrders} orders</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Conversion Rate</p>
          <p className="text-2xl font-bold text-gray-800">{metrics.conversionRate}%</p>
          <span className="text-xs text-gray-400">Orders / Total Users</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Pending Orders</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
          <span className="text-xs text-gray-400">Need attention</span>
        </div>
      </div>

      {/* ✅ Charts - REAL DATA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Monthly Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#15803d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Sales by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categorySales || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ✅ Order Status Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
          <h3 className="font-semibold text-gray-700 mb-4">Order Status</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={stats.orderStatusData || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label
                >
                  {stats.orderStatusData?.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ✅ Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
          <h3 className="font-semibold text-gray-700 mb-4">Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent orders</p>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">#{order._id.slice(-6)}</p>
                    <p className="text-sm text-gray-500">{order.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-400">{new Date(order.orderDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">₹{order.total}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Low Stock Products */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          Low Stock Products ({lowStockProducts.length})
        </h3>
        {lowStockProducts.length === 0 ? (
          <p className="text-green-600 text-sm">✅ All products have sufficient stock</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase">
                  <th className="pb-2">Product</th>
                  <th className="pb-2">Stock</th>
                  <th className="pb-2">Price</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((product) => (
                  <tr key={product._id} className="border-t border-gray-100">
                    <td className="py-2">{product.name}</td>
                    <td className="py-2 font-medium text-red-600">{product.stock}</td>
                    <td className="py-2">₹{product.price}</td>
                    <td className="py-2">
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                        {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ Recent Users */}
      <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
        <h3 className="font-semibold text-gray-700 mb-4">Recent Users</h3>
        {recentUsers.length === 0 ? (
          <p className="text-gray-500 text-sm">No users registered yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentUsers.map((user) => (
              <div key={user._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">{user.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;