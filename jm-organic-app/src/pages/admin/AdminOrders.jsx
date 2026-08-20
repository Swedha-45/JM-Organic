// src/pages/admin/AdminOrders.jsx
import React, { useState, useEffect, useMemo } from 'react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import StatusBadge from '../../components/admin/StatusBadge';
import { getAllOrdersAsync } from '../../services/orderService12';
import { orderAPI } from '../../services/api';
import { RefreshCw } from 'lucide-react';

const FILTERS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrdersAsync();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();

    // ✅ Only keep polling interval for updates
    const interval = setInterval(fetchOrders, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const isValidMongoId = (id) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

  const handleStatusChange = async (rawId, newStatus) => {
    if (!rawId) return;
    try {
      setUpdatingId(rawId);
      
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === rawId || o._id === rawId) {
            return { ...o, status: newStatus };
          }
          return o;
        })
      );

      if (isValidMongoId(rawId)) {
        await orderAPI.updateStatus(rawId, newStatus);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const formattedOrders = useMemo(() => {
    return orders.map((o) => {
      let custName = 'Customer';
      if (typeof o.customer === 'string') custName = o.customer;
      else if (o.customer && typeof o.customer === 'object') {
        custName = o.customer.name || o.customer.email || 'Customer';
      } else if (o.user && typeof o.user === 'object') {
        custName = o.user.name || o.user.email || 'Customer';
      }

      let itemsSummary = '';
      if (typeof o.items === 'string') itemsSummary = o.items;
      else if (Array.isArray(o.items)) {
        itemsSummary = o.items.map((i) => `${i.name} (x${i.quantity || 1})`).join(', ');
      }

      const amt = Number(o.total || o.amount || o.totalAmount) || 0;
      const rawDate = o.date || o.orderDate || o.createdAt;
      const d = rawDate ? new Date(rawDate).toLocaleDateString() : 'Today';
      const st = (o.status || o.orderStatus || 'pending').toLowerCase();
      const rawId = o._id || o.id;

      return {
        id: o.id || (rawId ? `JM-${rawId.slice(-6)}` : 'JM-001'),
        rawId: rawId,
        customer: custName,
        items: itemsSummary || 'Organic Produce',
        amount: amt,
        date: d,
        status: st,
      };
    });
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === 'All') return formattedOrders;
    return formattedOrders.filter((o) => o.status.toLowerCase() === activeFilter.toLowerCase());
  }, [formattedOrders, activeFilter]);

  return (
    <div>
      <AdminPageHeader title="Orders" />

      <div className="p-8 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-800">Order Management</h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                  activeFilter === filter
                    ? 'bg-green-800 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
            ))}
            <button
              onClick={fetchOrders}
              className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              title="Refresh Orders"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Order ID', 'Customer', 'Items', 'Amount', 'Date', 'Status', 'Change Status'].map((h) => (
                    <th key={h} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-5 py-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs font-bold text-green-900">{order.id}</td>
                    <td className="px-5 py-4 font-semibold text-gray-800 text-xs">{order.customer}</td>
                    <td className="px-5 py-4 text-xs text-gray-600 max-w-xs truncate">{order.items}</td>
                    <td className="px-5 py-4 font-bold text-gray-900 text-xs">₹{order.amount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-xs text-gray-500">{order.date}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        disabled={updatingId === order.rawId}
                        onChange={(e) => handleStatusChange(order.rawId, e.target.value)}
                        className="text-xs font-semibold bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer shadow-sm disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st.charAt(0).toUpperCase() + st.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-400">
                      No orders found with status "{activeFilter}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;