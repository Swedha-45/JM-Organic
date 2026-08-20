// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => localStorage.getItem('authToken');

const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// ✅ Auth API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (email, password) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  googleLogin: (idToken) => apiRequest('/auth/google', { method: 'POST', body: JSON.stringify({ idToken }) }),
  getProfile: () => apiRequest('/auth/profile'),
  updateProfile: (profileData) => apiRequest('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
};

// ✅ Product API
export const productAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/products${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiRequest(`/products/${id}`),
  create: (productData) => apiRequest('/products', { method: 'POST', body: JSON.stringify(productData) }),
  update: (id, productData) => apiRequest(`/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) }),
  delete: (id) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
};

// ✅ Cart API - Complete with user-specific functions
export const cartAPI = {
  // Original methods (for backward compatibility)
  get: () => apiRequest('/cart'),
  add: (productId, quantity) => apiRequest('/cart/add', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  update: (itemId, quantity) => apiRequest(`/cart/update/${itemId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  remove: (itemId) => apiRequest(`/cart/remove/${itemId}`, { method: 'DELETE' }),
  clear: () => apiRequest('/cart/clear', { method: 'DELETE' }),
  
  // User-specific cart methods (for authenticated users)
  getCart: (userId) => apiRequest(`/cart/user/${userId}`),
  updateCart: (userId, cartData) => apiRequest(`/cart/user/${userId}`, { 
    method: 'PUT', 
    body: JSON.stringify(cartData) 
  }),
  clearCart: (userId) => apiRequest(`/cart/user/${userId}`, { method: 'DELETE' }),
  mergeCart: (userId, guestCartItems) => apiRequest(`/cart/user/${userId}/merge`, { 
    method: 'POST', 
    body: JSON.stringify({ guestItems: guestCartItems }) 
  }),
};

// ✅ Order API
export const orderAPI = {
  getAll: () => apiRequest('/orders'),
  create: (orderData) => apiRequest('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getById: (id) => apiRequest(`/orders/${id}`),
  updateStatus: (id, status) => apiRequest(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
};

// ✅ Admin API
export const adminAPI = {
  getStats: () => apiRequest('/admin/stats'),
  getAllUsers: () => apiRequest('/admin/users'),
  updateUserRole: (userId, role) => apiRequest(`/admin/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
};

// ✅ Payment API (Razorpay & COD)
export const paymentAPI = {
  createOrder: (items) => apiRequest('/payments/create-order', { method: 'POST', body: JSON.stringify({ items }) }),
  verify: (payload) => apiRequest('/payments/verify', { method: 'POST', body: JSON.stringify(payload) }),
  createCOD: (payload) => apiRequest('/payments/cod', { method: 'POST', body: JSON.stringify(payload) }),
};

// ✅ Default export for backward compatibility
export default { authAPI, productAPI, cartAPI, orderAPI, adminAPI, paymentAPI };