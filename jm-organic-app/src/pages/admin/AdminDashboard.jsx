// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { adminAPI, orderAPI } from '../../services/api';
import { 
  Users, ShoppingBag, Package, DollarSign, 
  AlertTriangle, RefreshCw,
  Eye, X, Building2, Phone, Mail, MapPin
} from 'lucide-react';
import { io } from 'socket.io-client';

const statusColors = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-rose-100 text-rose-800 border-rose-200'
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    deliveredOrders: 0,
  });

  const [ordersList, setOrdersList] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'PRODUCT', 'BULK'
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch Backend Stats
      const response = await adminAPI.getStats();

      // 2. Fetch All Backend Orders
      let apiOrders = [];
      try {
        const orderRes = await orderAPI.getAll();
        if (orderRes && Array.isArray(orderRes.orders)) {
          apiOrders = orderRes.orders;
        }
      } catch (e) {
        if (response.recentOrders) apiOrders = response.recentOrders;
      }

      // Format API Orders
      const formattedApiOrders = apiOrders.map((o) => {
        let custName = 'Customer';
        let custEmail = 'customer@jmorganic.in';
        let custPhone = 'N/A';

        if (typeof o.customer === 'string') custName = o.customer;
        else if (o.customer && typeof o.customer === 'object') {
          custName = o.customer.name || o.customer.email || 'Customer';
          custEmail = o.customer.email || custEmail;
          custPhone = o.customer.phone || custPhone;
        } else if (o.user && typeof o.user === 'object') {
          custName = o.user.name || 'Customer';
          custEmail = o.user.email || custEmail;
          custPhone = o.user.phone || custPhone;
        }

        const isBulk = o.isBulk || (o.items && o.items.some(i => (i.name || '').includes('[BULK')));

        return {
          id: o._id ? `JM-${o._id.slice(-6).toUpperCase()}` : (o.id || 'JM-001'),
          rawId: o._id || o.id,
          isBulk: isBulk,
          type: isBulk ? 'bulk' : 'product',
          customerName: custName,
          businessName: o.businessName || (isBulk ? custName : null),
          email: custEmail,
          phone: o.shippingAddress?.phone || custPhone,
          city: o.shippingAddress?.city || o.shippingAddress?.street || 'Tamil Nadu',
          address: o.shippingAddress?.street || 'Online Order',
          items: o.items || [],
          total: Number(o.total || o.amount) || 0,
          status: (o.status || 'pending').toLowerCase(),
          orderDate: o.orderDate || o.createdAt || new Date().toISOString(),
          paymentMethod: o.paymentMethod || 'COD',
          notes: o.notes || o.shippingAddress?.street || ''
        };
      });

      // 3. Fetch Bulk Orders from localStorage
      let localBulkRequests = [];
      try {
        const rawBulk = localStorage.getItem('jm_bulk_requests');
        if (rawBulk) {
          const parsed = JSON.parse(rawBulk);
          localBulkRequests = parsed.map((b) => ({
            id: b.id || `BQ-${Math.floor(100000 + Math.random() * 900000)}`,
            rawId: b.id,
            isBulk: true,
            type: 'bulk',
            customerName: b.contactName || b.businessName || 'Business Client',
            businessName: b.businessName || 'Bulk Partner',
            email: b.email || 'bulk@jmorganic.in',
            phone: b.phone || 'N/A',
            city: b.city || 'Tamil Nadu',
            address: `${b.city} - Bulk Delivery`,
            items: [
              {
                name: `[BULK WHOLESALE] ${b.productName || 'Organic Produce'}`,
                quantity: Number(b.quantity || 10),
                price: Number(b.total ? Math.round(b.total / (b.quantity || 1)) : 180)
              }
            ],
            quantity: b.quantity,
            total: Number(b.total) || 1800,
            status: (b.status || 'pending').toLowerCase(),
            orderDate: b.orderDate || b.createdAt || new Date().toISOString(),
            paymentMethod: 'GST Wholesale Quote',
            notes: b.message || 'Bulk quotation request'
          }));
        }
      } catch (err) {
        console.warn('LocalStorage bulk read error:', err);
      }

      // Deduplicate and Combine Orders
      const combinedMap = new Map();
      [...localBulkRequests, ...formattedApiOrders].forEach((item) => {
        if (!combinedMap.has(item.id)) {
          combinedMap.set(item.id, item);
        }
      });

      const combinedOrders = Array.from(combinedMap.values()).sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );

      setOrdersList(combinedOrders);

      if (response.success) {
        setStats({
          ...response.stats,
          totalOrders: combinedOrders.length,
          totalRevenue: combinedOrders.reduce((sum, o) => sum + (o.total || 0), 0),
          pendingOrders: combinedOrders.filter(o => o.status === 'pending').length
        });
        setLowStockProducts(response.lowStockProducts || []);
        setRecentUsers(response.recentUsers || []);
      }
    } catch (err) {
      console.error('Dashboard loading error:', err);
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Event listener for live bulk orders submitted locally
    const handleBulkEvent = () => loadDashboardData();
    window.addEventListener('bulkOrderSubmitted', handleBulkEvent);

    // Socket.io real-time connection
    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    const socket = io(socketUrl, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      autoConnect: true
    });

    socket.on('order_created', () => loadDashboardData());
    socket.on('order_status_updated', () => loadDashboardData());

    return () => {
      window.removeEventListener('bulkOrderSubmitted', handleBulkEvent);
      if (socket) {
        socket.off('order_created');
        socket.off('order_status_updated');
        socket.disconnect();
      }
    };
  }, []);

  const isValidMongoId = (id) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

  const handleStatusChange = async (orderItem, newStatus) => {
    try {
      setUpdatingId(orderItem.id);
      
      // Optimistically update local state
      setOrdersList((prev) =>
        prev.map((o) => (o.id === orderItem.id ? { ...o, status: newStatus } : o))
      );

      // Update localStorage bulk orders if applicable
      const rawBulk = localStorage.getItem('jm_bulk_requests');
      if (rawBulk) {
        const parsed = JSON.parse(rawBulk);
        const updated = parsed.map((b) => 
          (b.id === orderItem.id || b.id === orderItem.rawId) ? { ...b, status: newStatus } : b
        );
        localStorage.setItem('jm_bulk_requests', JSON.stringify(updated));
      }

      // Only invoke API if rawId is a valid 24-character Mongo ObjectId
      if (orderItem.rawId && isValidMongoId(orderItem.rawId)) {
        await orderAPI.updateStatus(orderItem.rawId, newStatus);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = ordersList.filter((o) => {
    if (activeTab === 'PRODUCT') return !o.isBulk;
    if (activeTab === 'BULK') return o.isBulk;
    return true;
  });

  const totalBulkOrders = ordersList.filter(o => o.isBulk).length;
  const totalProductOrders = ordersList.filter(o => !o.isBulk).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[65vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800 mx-auto"></div>
          <p className="mt-4 text-xs font-semibold text-gray-500">Loading orders & dashboard statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 font-medium text-sm">{error}</p>
        <button
          onClick={loadDashboardData}
          className="mt-4 bg-green-900 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-green-950 transition-colors"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: 'bg-emerald-600',
      subtitle: 'Overall Store & Wholesale Sales'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: ShoppingBag,
      color: 'bg-blue-600',
      subtitle: `${totalProductOrders} Product · ${totalBulkOrders} Bulk`
    },
    {
      title: 'Registered Users',
      value: stats.totalUsers || 0,
      icon: Users,
      color: 'bg-purple-600',
      subtitle: 'Customer Accounts'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts || 0,
      icon: Package,
      color: 'bg-amber-600',
      subtitle: 'Active Inventory Items'
    }
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 bg-gray-50/50 min-h-screen">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Operations Console</h1>
          <p className="text-xs font-semibold text-gray-500 mt-0.5">Real-time order management for both Product Orders & Wholesale Bulk Orders</p>
        </div>
        <button
          onClick={loadDashboardData}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-2xl text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Live Feed</span>
        </button>
      </div>

      {/* Primary Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricCards.map((metric, index) => (
          <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{metric.title}</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{metric.value}</p>
                <p className="text-[11px] text-gray-400 font-medium mt-1">{metric.subtitle}</p>
              </div>
              <div className={`${metric.color} p-3.5 rounded-2xl text-white shadow-md shadow-gray-200`}>
                <metric.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILED ORDERS & BULK ORDERS MANAGEMENT CONSOLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200/80 space-y-6">
        
        {/* Table Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black text-gray-900">Orders & Bulk Requests Feed</h2>
            <p className="text-xs text-gray-500 font-medium">Detailed transactions with customer information and item breakdowns</p>
          </div>

          <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl border border-gray-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'ALL'
                  ? 'bg-green-900 text-white shadow-sm'
                  : 'text-gray-600 hover:text-green-900'
              }`}
            >
              All Orders ({ordersList.length})
            </button>
            <button
              onClick={() => setActiveTab('PRODUCT')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'PRODUCT'
                  ? 'bg-green-900 text-white shadow-sm'
                  : 'text-gray-600 hover:text-green-900'
              }`}
            >
              Product Orders ({totalProductOrders})
            </button>
            <button
              onClick={() => setActiveTab('BULK')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'BULK'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-amber-800'
              }`}
            >
              Bulk Orders ({totalBulkOrders})
            </button>
          </div>
        </div>

        {/* Detailed Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Order ID / Type', 'Customer / Business', 'Items & Quantity Detail', 'Total / Volume', 'Date', 'Fulfillment Status', 'Action'].map((h) => (
                  <th key={h} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-5 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                  
                  {/* ID & Order Type Badge */}
                  <td className="px-5 py-4">
                    <div className="font-mono text-xs font-bold text-green-900">{order.id}</div>
                    {order.isBulk ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase mt-1">
                        <Building2 size={10} />
                        Bulk Wholesale
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 text-green-900 text-[10px] font-black uppercase mt-1">
                        <ShoppingBag size={10} />
                        Standard Retail
                      </span>
                    )}
                  </td>

                  {/* Customer Info */}
                  <td className="px-5 py-4">
                    <div className="font-extrabold text-gray-900 text-xs">
                      {order.businessName ? `${order.businessName}` : order.customerName}
                    </div>
                    <div className="text-[11px] text-gray-500">{order.customerName}</div>
                    <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                      <Phone size={10} /> {order.phone}
                    </div>
                  </td>

                  {/* Items Detail */}
                  <td className="px-5 py-4 max-w-xs">
                    {Array.isArray(order.items) && order.items.length > 0 ? (
                      <div className="space-y-1">
                        {order.items.map((item, i) => (
                          <div key={i} className="text-xs text-gray-800 font-semibold truncate">
                            • {item.name} <span className="text-green-900 font-bold">× {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-600 font-semibold">
                        {order.productName || 'Organic Produce'} (Qty: {order.quantity || 1})
                      </div>
                    )}
                  </td>

                  {/* Total Amount / Volume */}
                  <td className="px-5 py-4">
                    <div className="font-black text-gray-900 text-xs">₹{order.total.toLocaleString()}</div>
                    {order.quantity && (
                      <div className="text-[10px] font-bold text-amber-700">{order.quantity} Litres Volume</div>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 text-xs text-gray-500 font-medium">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>

                  {/* Status Dropdown */}
                  <td className="px-5 py-4">
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order, e.target.value)}
                      className="text-xs font-bold bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-800 cursor-pointer shadow-xs disabled:opacity-50 capitalize"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* View Details Action */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelectedOrderDetails(order)}
                      className="flex items-center gap-1 text-xs font-bold text-green-900 hover:text-green-950 hover:underline"
                    >
                      <Eye size={14} />
                      <span>Details</span>
                    </button>
                  </td>

                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs font-semibold text-gray-400">
                    No orders found in this view category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock & Recent Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Low Stock Products Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>Low Stock Items</span>
            <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
              {lowStockProducts.length} Alert
            </span>
          </h3>
          {lowStockProducts.length === 0 ? (
            <p className="text-emerald-700 text-xs font-semibold bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              ✅ All catalog items have sufficient stock.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <th className="pb-3">Product Name</th>
                    <th className="pb-3">Current Stock</th>
                    <th className="pb-3">Unit Price</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {lowStockProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 font-bold text-gray-900 text-xs">{product.name}</td>
                      <td className="py-3 font-extrabold text-rose-600 text-xs">{product.stock} units</td>
                      <td className="py-3 font-semibold text-gray-700 text-xs">₹{product.price}</td>
                      <td className="py-3">
                        <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 border border-rose-200 rounded-full text-[10px] font-extrabold">
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

        {/* Recent Registered Users */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80">
          <h3 className="text-base font-bold text-gray-900 mb-4">Recent Registered Customers</h3>
          {recentUsers.length === 0 ? (
            <p className="text-gray-400 text-xs">No recent customer registrations.</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div key={u._id} className="flex items-center justify-between p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-green-900 text-white rounded-xl flex items-center justify-center font-extrabold text-xs shadow-xs">
                      {(u.name || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-xs">{u.name}</p>
                      <p className="text-[11px] text-gray-500">{u.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* FULL ORDER & BULK QUOTE DETAILS MODAL */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-auto border border-gray-100 animate-fade-in space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl text-white ${selectedOrderDetails.isBulk ? 'bg-amber-600' : 'bg-green-900'}`}>
                  {selectedOrderDetails.isBulk ? <Building2 size={20} /> : <ShoppingBag size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-gray-900">{selectedOrderDetails.id}</h3>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${statusColors[selectedOrderDetails.status]}`}>
                      {selectedOrderDetails.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    {selectedOrderDetails.isBulk ? 'Wholesale Bulk Order Request' : 'Store Product Order'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-2 rounded-2xl bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Customer & Business Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/80 p-5 rounded-2xl border border-gray-200/60">
              <div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider block mb-1">
                  Customer & Business Info
                </span>
                <p className="font-bold text-gray-900 text-sm">{selectedOrderDetails.customerName}</p>
                {selectedOrderDetails.businessName && (
                  <p className="text-xs text-amber-800 font-bold mt-0.5">🏢 {selectedOrderDetails.businessName}</p>
                )}
                <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                  <Mail size={12} /> {selectedOrderDetails.email}
                </p>
                <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                  <Phone size={12} /> {selectedOrderDetails.phone}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider block mb-1">
                  Shipping & Order Metadata
                </span>
                <p className="text-xs text-gray-800 font-semibold flex items-center gap-1">
                  <MapPin size={12} className="text-green-800" /> {selectedOrderDetails.city || 'Tamil Nadu'}
                </p>
                <p className="text-xs text-gray-600 mt-1">{selectedOrderDetails.address}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Payment: <span className="font-bold text-gray-800 uppercase">{selectedOrderDetails.paymentMethod}</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Placed on: <span className="font-bold text-gray-800">{new Date(selectedOrderDetails.orderDate).toLocaleString()}</span>
                </p>
              </div>
            </div>

            {/* Items Breakdown Table */}
            <div>
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-3">Order Items Breakdown</h4>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/60 space-y-2">
                {Array.isArray(selectedOrderDetails.items) && selectedOrderDetails.items.length > 0 ? (
                  selectedOrderDetails.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-gray-200/50 last:border-0">
                      <span className="font-bold text-gray-900">{item.name}</span>
                      <span className="font-semibold text-gray-600">Qty: {item.quantity} × ₹{item.price} = <strong className="text-green-950 font-black">₹{item.quantity * item.price}</strong></span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs font-bold text-gray-800">
                    {selectedOrderDetails.productName || 'Bulk Order Item'} (Qty: {selectedOrderDetails.quantity || 10})
                  </div>
                )}

                <div className="pt-2 border-t border-gray-300 flex justify-between items-center text-sm font-black text-gray-900">
                  <span>Grand Total</span>
                  <span className="text-green-950 text-base">₹{selectedOrderDetails.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Notes / Message */}
            {selectedOrderDetails.notes && (
              <div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider block mb-1">Customer / Quote Notes</span>
                <p className="text-xs text-gray-700 bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 font-medium leading-relaxed">
                  {selectedOrderDetails.notes}
                </p>
              </div>
            )}

            {/* Close Button */}
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="bg-green-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-green-950 transition-colors"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;