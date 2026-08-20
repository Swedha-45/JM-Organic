// src/pages/user/OrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { orderAPI } from '../../services/api';
import { Package } from 'lucide-react';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    // ✅ Only keep polling interval for updates
    const interval = setInterval(loadOrders, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[(status || '').toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No orders placed yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div 
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50/80 transition-colors"
                onClick={() => toggleExpand(order._id)}
              >
                <div>
                  <p className="font-bold text-green-900 text-sm">#{order._id?.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(order.orderDate || order.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="font-extrabold text-gray-900 text-sm">₹{order.total}</p>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border capitalize inline-block mt-1 ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
              {expandedOrder === order._id && (
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-gray-700">
                        <span>{item.name} × {item.quantity}</span>
                        <span className="font-semibold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-2 font-bold text-xs flex justify-between text-gray-900">
                      <span>Total Amount</span>
                      <span>₹{order.total}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;