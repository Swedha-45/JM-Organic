// src/services/orderService12.js
import { orderAPI } from './api';

// ✅ Get all orders (for admin / catalog)
export const getAllOrdersAsync = async () => {
  try {
    const response = await orderAPI.getAll();
    if (response.success && Array.isArray(response.orders)) {
      return response.orders.map(o => ({
        id: o._id ? o._id.toString() : (o.id || 'JM-001'),
        customer: o.user ? (o.user.name || o.user.email || 'Customer') : (o.shippingAddress?.name || 'Customer'),
        items: o.items || [],
        amount: o.total || 0,
        total: o.total || 0,
        date: o.orderDate || o.createdAt || new Date().toISOString(),
        status: o.status || 'pending',
        shippingAddress: o.shippingAddress,
        paymentMethod: o.paymentMethod
      }));
    }
    const saved = localStorage.getItem('jm_orders');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error fetching all orders:', error);
    const saved = localStorage.getItem('jm_orders');
    return saved ? JSON.parse(saved) : [];
  }
};

// ✅ Get orders by user email
export const getOrdersByEmailAsync = async (email) => {
  try {
    const orders = await getAllOrdersAsync();
    if (!email) return orders;
    return orders.filter(o => {
      if (typeof o.customer === 'string') return o.customer.toLowerCase().includes(email.toLowerCase());
      if (o.customer && o.customer.email) return o.customer.email.toLowerCase() === email.toLowerCase();
      return true;
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    const saved = localStorage.getItem('jm_orders');
    return saved ? JSON.parse(saved) : [];
  }
};

// ✅ Create a new order
export const createOrder = async (orderData) => {
  try {
    const response = await orderAPI.create(orderData);
    if (response.success && response.order) {
      const created = response.order;
      const formatted = {
        id: created._id ? created._id.toString() : (created.id || `JM-${Date.now()}`),
        ...created
      };
      
      try {
        const saved = localStorage.getItem('jm_orders');
        const existing = saved ? JSON.parse(saved) : [];
        const cleanItems = (formatted.items || []).map(i => ({ name: i.name, quantity: i.quantity, price: i.price, product: i.product }));
        const lightweight = { ...formatted, items: cleanItems };
        localStorage.setItem('jm_orders', JSON.stringify([lightweight, ...existing.slice(0, 19)]));
      } catch (storageErr) {
        console.warn('LocalStorage save skipped:', storageErr);
      }
      
      return formatted;
    }
    throw new Error(response.message || 'Failed to place order');
  } catch (error) {
    console.error('Error creating order:', error);
    
    const fallbackOrder = {
      id: `JM-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      status: 'pending',
      ...orderData
    };
    try {
      const saved = localStorage.getItem('jm_orders');
      const existing = saved ? JSON.parse(saved) : [];
      const cleanItems = (fallbackOrder.items || []).map(i => ({ name: i.name, quantity: i.quantity, price: i.price, product: i.product }));
      const lightweight = { ...fallbackOrder, items: cleanItems };
      localStorage.setItem('jm_orders', JSON.stringify([lightweight, ...existing.slice(0, 19)]));
    } catch (storageErr) {
      console.warn('LocalStorage save skipped:', storageErr);
    }
    
    return fallbackOrder;
  }
};

export default {
  getAllOrdersAsync,
  getOrdersByEmailAsync,
  createOrder
};
