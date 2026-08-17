// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import auth pages
import LoginPage from './pages/user/LoginPage';
import RegisterPage from './pages/user/RegisterPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';

// Import e-commerce & new user pages
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/user/HomePage';
import ProductsPage from './pages/user/ProductsPage';
import ProductDetailPage from './pages/user/ProductDetailPage';
import CartPage from './pages/user/CartPage';
import CheckoutPage from './pages/user/CheckoutPage';
import ProfilePage from './pages/user/ProfilePage';
import ReviewsPage from './pages/user/ReviewsPage';
import NutritionPage from './pages/user/NutritionPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AddProduct from './pages/admin/AddProduct';
import AdminOrders from './pages/admin/AdminOrders';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import BulkOrderPage from './pages/user/BulkOrderPage';
import AdminReviews from './pages/admin/AdminReviews';

// Components & Contexts
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/AdminRoute'; // ✅ Import AdminRoute
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <Routes>
                {/* ======================================== */}
                {/* AUTH ROUTES (Public) */}
                {/* ======================================== */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* ======================================== */}
                {/* USER ROUTES (With UserLayout) */}
                {/* ======================================== */}
                <Route path="/" element={<UserLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="products" element={
                    <ErrorBoundary>
                      <ProductsPage />
                    </ErrorBoundary>
                  } />
                  <Route path="product/:id" element={<ProductDetailPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="reviews" element={<ReviewsPage />} />
                  <Route path="nutrition" element={<NutritionPage />} />
                  <Route path="bulk-orders" element={<BulkOrderPage />} />
                  <Route path="bulk-order" element={<BulkOrderPage />} />
                </Route>

                {/* ======================================== */}
                {/* ADMIN ROUTES (Protected by AdminRoute) */}
                {/* ======================================== */}
                <Route path="/admin" element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="products/add" element={<AddProduct />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="reviews" element={<AdminReviews />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                  </Route>
                </Route>

                {/* ======================================== */}
                {/* CATCH ALL */}
                {/* ======================================== */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
  );
}

export default App;