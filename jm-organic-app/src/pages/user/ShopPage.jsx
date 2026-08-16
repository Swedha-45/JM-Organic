import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Search, Heart, Leaf, Truck, Shield, CheckCircle, Menu, X, Filter, ChevronDown } from 'lucide-react';

const ShopPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = ['All', 'Vegetables', 'Sprouts', 'Oils', 'Grains & Rice', 'Beverages'];

  const products = [
    {
      id: 1,
      name: "White Radish",
      price: 40,
      unit: "/ kg",
      rating: 4.8,
      reviews: 95,
      badge: "Organic",
      image: "https://images.unsplash.com/photo-1586185242545-6484c095c624?w=300&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Spinach",
      price: 25,
      unit: "/ bunch",
      rating: 4.7,
      reviews: 88,
      badge: "Organic",
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Sprouts",
      price: 35,
      unit: "/ 250g",
      rating: 4.9,
      reviews: 74,
      badge: "Organic",
      image: "https://images.unsplash.com/photo-1586185242545-6484c095c624?w=300&h=300&fit=crop"
    },
    {
      id: 4,
      name: "Carrot",
      price: 50,
      unit: "/ kg",
      rating: 4.8,
      reviews: 92,
      badge: "Organic",
      image: "https://images.unsplash.com/photo-1586185242545-6484c095c624?w=300&h=300&fit=crop"
    },
    {
      id: 5,
      name: "Groundnut",
      price: 90,
      unit: "/ kg",
      rating: 4.7,
      reviews: 81,
      badge: "Organic",
      image: "https://images.unsplash.com/photo-1586185242545-6484c095c624?w=300&h=300&fit=crop"
    },
    {
      id: 6,
      name: "Groundnut Oil",
      price: 350,
      unit: "/ L",
      rating: 4.8,
      reviews: 65,
      badge: "Organic",
      image: "https://images.unsplash.com/photo-1627658036047-98c7c0f6a31d?w=300&h=300&fit=crop"
    },
    {
      id: 7,
      name: "Coconut",
      price: 45,
      unit: "/ piece",
      rating: 4.7,
      reviews: 70,
      badge: "Organic",
      image: "https://images.unsplash.com/photo-1586185242545-6484c095c624?w=300&h=300&fit=crop"
    },
    {
      id: 8,
      name: "Coconut Oil",
      price: 420,
      unit: "/ L",
      rating: 4.8,
      reviews: 63,
      badge: "Organic",
      image: "https://images.unsplash.com/photo-1627658036047-98c7c0f6a31d?w=300&h=300&fit=crop"
    },
    {
      id: 9,
      name: "Mustard Oil",
      price: 300,
      unit: "/ L",
      rating: 4.8,
      reviews: 59,
      badge: "Organic",
      image: "https://images.unsplash.com/photo-1627658036047-98c7c0f6a31d?w=300&h=300&fit=crop"
    },
    {
      id: 10,
      name: "Sesame Oil",
      price: 420,
      unit: "/ L",
      rating: 4.8,
      reviews: 57,
      badge: "Organic",
      image: "https://images.unsplash.com/photo-1627658036047-98c7c0f6a31d?w=300&h=300&fit=crop"
    },
    {
      id: 11,
      name: "Organic Rice",
      price: 85,
      unit: "/ kg",
      rating: 4.7,
      reviews: 76,
      badge: "Organic",
      image: "https://images.unsplash.com/photo-1586185242545-6484c095c624?w=300&h=300&fit=crop"
    },
    {
      id: 12,
      name: "Brown Rice",
      price: 120,
      unit: "/ kg",
      rating: 4.7,
      reviews: 68,
      badge: "Organic",
      image: "https://images.unsplash.com/photo-1586185242545-6484c095c624?w=300&h=300&fit=crop"
    },
    {
      id: 13,
      name: "ABC Juice",
      price: 120,
      unit: "/ 500ml",
      rating: 4.8,
      reviews: 80,
      badge: "Organic",
      image: "https://images.unsplash.com/photo-1586185242545-6484c095c624?w=300&h=300&fit=crop"
    }
  ];

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const totalCartAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Exact match to image */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <Leaf className="w-7 h-7 text-green-700" />
              <span className="text-2xl font-bold text-green-800 ml-2">Agrihora</span>
            </Link>

            {/* Navigation - Exactly as in image */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-green-700 font-medium">Home</Link>
              <Link to="/shop" className="text-green-800 border-b-2 border-green-700 pb-1 font-medium">Shop</Link>
              <Link to="/categories" className="text-gray-700 hover:text-green-700 font-medium">Categories</Link>
              <Link to="/about" className="text-gray-700 hover:text-green-700 font-medium">About Us</Link>
              <Link to="/offers" className="text-gray-700 hover:text-green-700 font-medium">Offers</Link>
              <Link to="/contact" className="text-gray-700 hover:text-green-700 font-medium">Contact</Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-green-700">
                <Search className="w-5 h-5" />
              </button>
              <button className="text-gray-600 hover:text-green-700">
                <Heart className="w-5 h-5" />
              </button>
              <button className="relative text-gray-600 hover:text-green-700">
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
              <Link to="/login">
                <button className="bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-800 transition">
                  Login
                </button>
              </Link>
              <button 
                className="md:hidden text-gray-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-3">
                <Link to="/" className="text-gray-700 hover:text-green-700 font-medium">Home</Link>
                <Link to="/shop" className="text-green-800 font-medium">Shop</Link>
                <Link to="/categories" className="text-gray-700 hover:text-green-700 font-medium">Categories</Link>
                <Link to="/about" className="text-gray-700 hover:text-green-700 font-medium">About Us</Link>
                <Link to="/offers" className="text-gray-700 hover:text-green-700 font-medium">Offers</Link>
                <Link to="/contact" className="text-gray-700 hover:text-green-700 font-medium">Contact</Link>
                <Link to="/login" className="bg-green-700 text-white px-4 py-2 rounded-full text-center font-medium hover:bg-green-800 transition">
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Tagline - Pure.Natural.Organic. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <div className="flex items-center justify-center space-x-2 text-green-700 font-medium text-sm">
          <Leaf className="w-4 h-4" />
          <span>Pure. Natural. Organic.</span>
        </div>
      </div>

      {/* Feature Badges - 3 items exactly as in image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="bg-green-50 rounded-full px-6 py-3 flex flex-wrap items-center justify-center gap-8 md:gap-12">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-700" />
            <span className="text-sm font-medium text-gray-700">100% Organic</span>
            <span className="text-xs text-gray-500 hidden sm:inline">Chemical Free</span>
          </div>
          <div className="flex items-center space-x-2">
            <Truck className="w-4 h-4 text-green-700" />
            <span className="text-sm font-medium text-gray-700">Fast Delivery</span>
            <span className="text-xs text-gray-500 hidden sm:inline">30 mins</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-700" />
            <span className="text-sm font-medium text-gray-700">Secure Payment</span>
            <span className="text-xs text-gray-500 hidden sm:inline">100% Secure</span>
          </div>
        </div>
      </div>

      {/* Categories - Exactly as in image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center gap-6 md:gap-8 overflow-x-auto pb-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap text-sm font-medium transition ${
                activeCategory === category
                  ? 'text-green-800 border-b-2 border-green-700 pb-1'
                  : 'text-gray-600 hover:text-green-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Sort & Filter - Exactly as in image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <span className="text-sm text-gray-600">Popularity</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center space-x-2 text-gray-700">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
          </div>
        </div>
      </div>

      {/* Products Grid - Exact layout from image */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              {/* Product Image */}
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-36 object-cover"
                />
                <span className="absolute top-2 left-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                  {product.badge}
                </span>
              </div>

              {/* Product Details */}
              <div className="p-2.5">
                <h3 className="text-sm font-semibold text-gray-800 mb-0.5 truncate">{product.name}</h3>
                
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs font-medium">{product.rating}</span>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-sm font-bold text-green-800">₹{product.price}{product.unit}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-green-700 text-white px-2.5 py-0.5 rounded-full text-xs font-medium hover:bg-green-800 transition whitespace-nowrap"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary - Exactly as in image */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-20 md:bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-5 py-2.5 flex items-center space-x-5 border border-gray-200 z-40">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-green-700" />
              <span className="font-medium text-sm">{cartItems.length} Items</span>
              <span className="text-green-700 font-bold text-sm">₹{totalCartAmount}</span>
            </div>
            <button className="bg-green-700 text-white px-5 py-1.5 rounded-full text-sm font-medium hover:bg-green-800 transition">
              View Cart
            </button>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation - Exactly as in image */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-30">
        <div className="flex justify-around items-center">
          <Link to="/" className="flex flex-col items-center text-gray-500 hover:text-green-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-0.5">Home</span>
          </Link>
          <Link to="/shop" className="flex flex-col items-center text-green-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-xs mt-0.5">Shop</span>
          </Link>
          <Link to="/categories" className="flex flex-col items-center text-gray-500 hover:text-green-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-xs mt-0.5">Categories</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center text-gray-500 hover:text-green-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs mt-0.5">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;