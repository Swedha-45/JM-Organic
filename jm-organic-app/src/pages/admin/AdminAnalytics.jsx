// src/pages/admin/AdminAnalytics.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { getProducts } from '../../services/productService';
import { orderAPI } from '../../services/api';
import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Award,
  BarChart3,
  Sparkles
} from 'lucide-react';

const CATEGORY_COLORS = ['#164E2B', '#257A47', '#EAB308', '#D97706', '#059669', '#3B82F6', '#8B5CF6'];
const STATUS_COLORS = {
  pending: '#F59E0B',
  processing: '#3B82F6',
  shipped: '#8B5CF6',
  delivered: '#10B981',
  cancelled: '#EF4444'
};

const chartTooltipStyle = {
  background: 'rgba(255, 255, 255, 0.95)',
  border: '1px solid #E2E8F0',
  borderRadius: '12px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  fontSize: '12px',
  padding: '10px 14px'
};

const AdminAnalytics = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30D'); // 7D, 30D, 6M, ALL

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [loadedProducts, ordersResponse] = await Promise.all([
          getProducts(),
          orderAPI.getAll()
        ]);

        setProducts(loadedProducts || []);
        setOrders(ordersResponse.orders || []);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter orders based on time range
  const filteredOrders = useMemo(() => {
    if (!orders.length) return [];
    const now = new Date();
    return orders.filter((o) => {
      const orderDate = new Date(o.orderDate || o.createdAt || now);
      const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
      if (timeRange === '7D') return diffDays <= 7;
      if (timeRange === '30D') return diffDays <= 30;
      if (timeRange === '6M') return diffDays <= 180;
      return true;
    });
  }, [orders, timeRange]);

  // Overall KPI metrics
  const totalRevenue = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + (Number(o.total || o.amount) || 0), 0);
  }, [filteredOrders]);

  const totalOrdersCount = filteredOrders.length;

  const averageOrderValue = useMemo(() => {
    return totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  }, [totalRevenue, totalOrdersCount]);

  // Sales trend data over time (Daily / Monthly)
  const salesTrendData = useMemo(() => {
    if (!filteredOrders.length) return [];
    
    // Group orders by date formatted string
    const map = {};
    filteredOrders.forEach((o) => {
      const d = new Date(o.orderDate || o.createdAt || Date.now());
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!map[dateStr]) {
        map[dateStr] = { date: dateStr, revenue: 0, orders: 0, timestamp: d.getTime() };
      }
      map[dateStr].revenue += Number(o.total || o.amount) || 0;
      map[dateStr].orders += 1;
    });

    return Object.values(map).sort((a, b) => a.timestamp - b.timestamp);
  }, [filteredOrders]);

  // Highest sold products calculations
  const productSalesMap = useMemo(() => {
    const map = {};
    filteredOrders.forEach((o) => {
      if (Array.isArray(o.items)) {
        o.items.forEach((item) => {
          const name = item.name || 'Product';
          if (!map[name]) {
            map[name] = { name, soldQty: 0, revenue: 0 };
          }
          const qty = Number(item.quantity) || 1;
          const price = Number(item.price) || 0;
          map[name].soldQty += qty;
          map[name].revenue += price * qty;
        });
      }
    });

    return Object.values(map).sort((a, b) => b.soldQty - a.soldQty);
  }, [filteredOrders]);

  const topSoldProducts = useMemo(() => {
    return productSalesMap.slice(0, 6);
  }, [productSalesMap]);

  const topPerformer = topSoldProducts[0] || { name: 'N/A', soldQty: 0, revenue: 0 };

  // Revenue by Category calculation
  const categorySalesData = useMemo(() => {
    const defaultCats = ['Oils', 'Fresh Coconuts', 'Bulk Orders', 'Grains', 'Fruits', 'Vegetables'];
    const dbCats = products.map((p) => p.category).filter(Boolean);
    const allCats = Array.from(new Set([...defaultCats, ...dbCats]));

    return allCats.map((cat) => {
      const catProducts = products.filter(
        (p) => (p.category || '').toLowerCase() === cat.toLowerCase()
      );

      let revenue = 0;
      let units = 0;
      filteredOrders.forEach((o) => {
        if (Array.isArray(o.items)) {
          o.items.forEach((item) => {
            if (catProducts.some((p) => p.name === item.name || p._id === item.product)) {
              const qty = Number(item.quantity) || 1;
              revenue += (Number(item.price) || 0) * qty;
              units += qty;
            }
          });
        }
      });

      return { name: cat, revenue, units };
    }).filter((c) => c.revenue > 0 || c.units > 0);
  }, [products, filteredOrders]);

  // Order status distribution
  const statusDistribution = useMemo(() => {
    const counts = { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
    filteredOrders.forEach((o) => {
      const st = (o.status || 'pending').toLowerCase();
      if (counts[st] !== undefined) counts[st]++;
      else counts.pending++;
    });

    return Object.keys(counts).map((st) => ({
      name: st.charAt(0).toUpperCase() + st.slice(1),
      value: counts[st],
      color: STATUS_COLORS[st] || '#9CA3AF'
    })).filter((s) => s.value > 0);
  }, [filteredOrders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[65vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          <p className="text-xs font-semibold text-gray-500">Loading Business Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-gray-900">Analytics & Insights</h1>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-xs font-semibold text-gray-500 mt-1">Real-time performance metrics and sales intelligence</p>
        </div>

        {/* Time Range Filter Buttons */}
        <div className="flex items-center bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
          {['7D', '30D', '6M', 'ALL'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeRange(period)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeRange === period
                  ? 'bg-green-900 text-white shadow-sm'
                  : 'text-gray-600 hover:text-green-900 hover:bg-gray-100'
              }`}
            >
              {period === '7D' ? '7 Days' : period === '30D' ? '30 Days' : period === '6M' ? '6 Months' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-900 to-green-950 text-white p-6 rounded-3xl shadow-lg border border-green-800/80 relative overflow-hidden group">
          <div className="absolute right-3 -bottom-2 opacity-10 text-white group-hover:scale-110 transition-transform">
            <IndianRupee className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-green-200">Total Sales</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-amber-300">₹{totalRevenue.toLocaleString()}</span>
            <p className="text-[11px] text-green-200/80 mt-1 font-medium">Generated across {totalOrdersCount} orders</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200/80 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-2xl">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Orders</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-gray-900">{totalOrdersCount}</span>
            <p className="text-[11px] text-gray-500 mt-1 font-medium">Total customer purchases</p>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200/80 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <IndianRupee className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Avg. Order Value</span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-gray-900">₹{averageOrderValue.toLocaleString()}</span>
            <p className="text-[11px] text-gray-500 mt-1 font-medium">Average revenue per order</p>
          </div>
        </div>

        {/* Top Performing Item */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200/80 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-2xl">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Top Seller</span>
          </div>
          <div className="mt-4 truncate">
            <span className="text-xl font-extrabold text-gray-900 block truncate">{topPerformer.name}</span>
            <p className="text-[11px] text-purple-700 font-semibold mt-1">
              {topPerformer.soldQty} units sold · ₹{topPerformer.revenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Main Visual Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sales & Revenue Trend Graph */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Sales & Revenue Trend</h3>
              <p className="text-xs text-gray-500">Revenue trajectory over selected period</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-green-800 bg-green-50 px-3 py-1.5 rounded-xl">
              <BarChart3 className="w-4 h-4" />
              <span>Live Sales Curve</span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            {salesTrendData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                No revenue recorded in this period.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesTrendData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#164E2B" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#164E2B" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(val, name) => [name === 'revenue' ? `₹${val.toLocaleString()}` : val, name === 'revenue' ? 'Revenue' : 'Orders']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#164E2B"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Order Status Distribution Pie Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-200/80 space-y-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Order Status Breakdown</h3>
            <p className="text-xs text-gray-500">Distribution of order fulfillment states</p>
          </div>

          <div className="h-64 w-full relative flex items-center justify-center">
            {statusDistribution.length === 0 ? (
              <div className="text-xs text-gray-400">No orders logged yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(val) => [`${val} Orders`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Status Legends */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
            {statusDistribution.map((st) => (
              <div key={st.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: st.color }}></span>
                <span className="text-gray-600 font-medium truncate">{st.name}:</span>
                <span className="font-bold text-gray-900">{st.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 2: Highest Sold Products Bar Chart & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Top Selling Products Bar Graph & Leaderboard */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl shadow-sm border border-gray-200/80 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Highest Sold Products</h3>
              <p className="text-xs text-gray-500">Top products ranked by sales volume & revenue</p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
              🔥 Best Sellers
            </span>
          </div>

          <div className="h-64 w-full">
            {topSoldProducts.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                No product sales recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSoldProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(val, name) => [name === 'soldQty' ? `${val} units` : `₹${val.toLocaleString()}`, name === 'soldQty' ? 'Units Sold' : 'Revenue']}
                  />
                  <Bar dataKey="soldQty" fill="#164E2B" radius={[0, 8, 8, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Leaderboard Table */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            {topSoldProducts.map((p, idx) => (
              <div key={p.name} className="flex items-center justify-between bg-gray-50/80 p-3 rounded-2xl text-xs">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                    idx === 0 ? 'bg-amber-400 text-amber-950' : idx === 1 ? 'bg-gray-300 text-gray-800' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-bold text-gray-900">{p.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500 font-medium">{p.soldQty} units</span>
                  <span className="font-extrabold text-green-900">₹{p.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Revenue Breakdown */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl shadow-sm border border-gray-200/80 space-y-5">
          <div>
            <h3 className="text-base font-bold text-gray-900">Revenue by Category</h3>
            <p className="text-xs text-gray-500">Total earnings split across product categories</p>
          </div>

          <div className="h-64 w-full">
            {categorySalesData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                No category sales recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categorySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(val) => [`₹${val.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#257A47" radius={[6, 6, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Category breakdown summary */}
          <div className="space-y-2.5 pt-3 border-t border-gray-100">
            {categorySalesData.map((cat, idx) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}></span>
                  <span className="font-semibold text-gray-700">{cat.name}</span>
                </div>
                <span className="font-bold text-gray-900">₹{cat.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAnalytics;