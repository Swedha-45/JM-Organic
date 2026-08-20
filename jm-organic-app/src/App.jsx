// App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Primary pages loaded eagerly
import UserLayout from './layouts/UserLayout';
import HomePage from './pages/user/HomePage';
import ProductsPage from './pages/user/ProductsPage';

// Components & Contexts
import AdminRoute from './components/AdminRoute'; // ✅ Import AdminRoute
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy-loaded pages to optimize initial bundle size & loading latency
const LoginPage = lazy(() => import('./pages/user/LoginPage'));
const RegisterPage = lazy(() => import('./pages/user/RegisterPage'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const ProductDetailPage = lazy(() => import('./pages/user/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/user/CartPage'));
const CheckoutPage = lazy(() => import('./pages/user/CheckoutPage'));
const ProfilePage = lazy(() => import('./pages/user/ProfilePage'));
const ReviewsPage = lazy(() => import('./pages/user/ReviewsPage'));
const NutritionPage = lazy(() => import('./pages/user/NutritionPage'));
const BulkOrderPage = lazy(() => import('./pages/user/BulkOrderPage'));

// Admin pages lazy loaded
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AddProduct = lazy(() => import('./pages/admin/AddProduct'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
    <div className="spinner-border text-success" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function App() {
  return (
    <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <Suspense fallback={<PageLoader />}>
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
              </Suspense>
            </Router>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
  );
}

export default App;