// pages/user/CartPage.jsx
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  ShoppingCart,
  X,
  Star
} from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();

  // ✅ Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: '/cart',
          message: 'Please login to view your cart' 
        } 
      });
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  // ✅ If not authenticated, don't render cart (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // ✅ Calculate item count
  const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  // ✅ Handle quantity update
  const handleQuantityChange = (itemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  // ✅ If cart is empty
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Start Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
          <p className="text-gray-500 text-sm">{itemCount} items in your cart</p>
        </div>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Clear Cart
        </button>
      </div>

      {/* Cart Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const itemId = item.id || item._id;
            const itemTotal = (item.price || 0) * (item.quantity || 1);

            return (
              <div 
                key={itemId} 
                className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition border border-gray-100"
              >
                {/* Product Image */}
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={item.image || 'https://via.placeholder.com/100x100/15803d/ffffff?text=Organic'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100/15803d/ffffff?text=Organic';
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/product/${itemId}`}
                    className="font-semibold text-gray-800 hover:text-green-600 transition text-base"
                  >
                    {item.name}
                  </Link>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-gray-900">₹{item.price || 0}</span>
                    <span className="text-xs text-gray-500">/ {item.unit || 'L'}</span>
                    {item.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-gray-700">{item.rating || 4.8}</span>
                    <span className="text-xs text-gray-400">({item.reviews || item.reviewCount || 10})</span>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(itemId, item.quantity, -1)}
                        className="px-3 py-1.5 hover:bg-gray-100 rounded-l-lg transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-gray-800">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(itemId, item.quantity, 1)}
                        className="px-3 py-1.5 hover:bg-gray-100 rounded-r-lg transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(itemId)}
                      className="text-gray-400 hover:text-red-600 transition p-1"
                      aria-label="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-green-600 text-lg">₹{itemTotal.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₹{(cartTotal * 0.05).toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-green-600">₹{(cartTotal + cartTotal * 0.05).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-semibold"
            >
              <ShoppingCart className="w-4 h-4" />
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/products"
              className="block text-center text-sm text-green-600 hover:text-green-700 mt-4"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;