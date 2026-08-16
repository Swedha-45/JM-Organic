// src/pages/admin/AdminAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getProducts } from '../../services/productService';
import { orderAPI } from '../../services/api';

const chartTooltipStyle = {
  background: '#FFFFFF',
  border: '1px solid #D1E3CE',
  borderRadius: '12px',
  fontSize: '12px',
};

const AdminAnalytics = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // ✅ Use correct imports
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

  // Compute Revenue by Category dynamically
  const categories = ['Oils', 'Fresh Coconuts', 'Bulk Orders', 'Grains', 'Fruits', 'Vegetables'];
  const categorySales = categories.map((cat) => {
    const catProducts = products.filter((p) => (p.category || '').toLowerCase() === cat.toLowerCase());
    
    // Sum revenue from orders matching these products
    let totalCatRev = 0;
    orders.forEach((o) => {
      if (Array.isArray(o.items)) {
        o.items.forEach((item) => {
          if (catProducts.some((p) => p.name === item.name || p._id === item.product)) {
            totalCatRev += (Number(item.price) || 0) * (Number(item.quantity) || 1);
          }
        });
      }
    });

    return { name: cat, value: totalCatRev };
  });

  // Compute monthly volume
  const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth();
  const recent6Months = [];
  for (let i = 5; i >= 0; i--) {
    const mIdx = (currentMonthIdx - i + 12) % 12;
    recent6Months.push(monthsList[mIdx]);
  }

  const monthlyVolume = recent6Months.map((mName) => {
    const monthOrders = orders.filter((o) => {
      if (!o.orderDate) return false;
      const d = new Date(o.orderDate);
      return monthsList[d.getMonth()] === mName;
    });

    let units = 0;
    monthOrders.forEach((o) => {
      if (Array.isArray(o.items)) {
        units += o.items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
      }
    });

    return { month: mName, units };
  });

  // Top products calculation from live products catalog
  const topProductsList = products.map((p) => {
    // Calculate sold quantity from orders
    let soldQty = 0;
    orders.forEach((o) => {
      if (Array.isArray(o.items)) {
        o.items.forEach((item) => {
          if (item.product === p._id || item.name === p.name) {
            soldQty += Number(item.quantity) || 1;
          }
        });
      }
    });

    const revenueVal = soldQty * (p.price || 0);
    return {
      name: p.name,
      sold: soldQty,
      revenue: `₹${revenueVal.toLocaleString()}`,
      revenueVal
    };
  }).sort((a, b) => b.revenueVal - a.revenueVal).slice(0, 5);

  const maxRevenue = topProductsList[0]?.revenueVal || 1;
  const topProducts = topProductsList.map((p) => ({
    ...p,
    percent: Math.min(100, Math.round((p.revenueVal / maxRevenue) * 100))
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <p className="text-gray-500 text-sm">Real-time business insights</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category sales */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Revenue by Category</h3>
            <p className="text-xs text-gray-500 mb-5">Live Category Revenue</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categorySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4ECE3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#526B57' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#526B57' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => `₹${v.toLocaleString()}`} />
                  <Bar dataKey="value" fill="#164E2B" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly volume */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Units Sold Volume</h3>
            <p className="text-xs text-gray-500 mb-5">6 Months Order Volume</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4ECE3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#526B57' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#526B57' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => `${v} units`} />
                  <Bar dataKey="units" fill="#2C7A4B" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top selling products */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800 mb-5">Catalog Top Selling Products</h3>
          <div className="space-y-5">
            {topProducts.length === 0 ? (
              <div className="text-xs text-gray-500 text-center py-4">No product sales logged yet.</div>
            ) : (
              topProducts.map((p) => (
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="font-semibold text-gray-800">{p.name}</span>
                    <span className="text-gray-500">
                      {p.sold.toLocaleString()} units · {p.revenue}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-emerald-100 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-800" style={{ width: `${p.percent}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;