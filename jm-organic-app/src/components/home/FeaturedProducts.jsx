import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { productAPI } from '../../services/api';
import { Star, ShoppingCart } from 'lucide-react';

const FeaturedProducts = ({ products = [], loading: initialLoading = false, title = "Featured Products" }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [loading, setLoading] = useState(initialLoading);
  const [fetchError, setFetchError] = useState(false);

  const loadFeatured = async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const res = await productAPI.getAll();
      setFetchedProducts(res.products || []);
    } catch (err) {
      console.error('Error loading featured products:', err);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products && products.length > 0) {
      setFetchedProducts(products);
    } else {
      loadFeatured();
    }
  }, [products]);

  const rawProducts = fetchedProducts.length > 0 ? fetchedProducts : (Array.isArray(products) ? products : []);
  const safeProducts = rawProducts
    .filter(p => p && typeof p === 'object')
    .sort((a, b) => new Date(b.createdAt || b._id || 0) - new Date(a.createdAt || a._id || 0));

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= fullStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const handleAddToCart = (e, product) => {
    if (e) e.stopPropagation();
    if (product) {
      addToCart(product);
    }
  };

  const handleViewDetails = (productId) => {
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">{title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ✅ If no products or fetch error, show state with retry
  if (safeProducts.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
          <p className="text-gray-500">
            {fetchError ? 'Could not connect to server. Please ensure the backend is running.' : 'No featured products available at the moment.'}
          </p>
          {fetchError && (
            <button
              onClick={loadFeatured}
              className="mt-4 px-5 py-2 bg-green-600 text-white text-xs font-bold rounded-full hover:bg-green-700 transition"
            >
              Retry Connection
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-500 mt-1">Our most popular organic products</p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
          >
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {safeProducts.slice(0, 8).map((product) => (
            <div
              key={product._id || product.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition group cursor-pointer"
              onClick={() => handleViewDetails(product._id || product.id)}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image || 'https://via.placeholder.com/300x300/15803d/ffffff?text=Organic'}
                  alt={product.name || 'Product'}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300/15803d/ffffff?text=Organic';
                  }}
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {product.badge}
                  </span>
                )}
                {product.isPure && (
                  <span className="absolute top-4 right-4 bg-green-700 text-white px-3 py-1 rounded-full text-xs font-bold">
                    PURE
                  </span>
                )}
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-lg transform -rotate-12">
                      OUT OF STOCK
                    </span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">{product.category || 'Uncategorized'}</span>
                  {product.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="flex">{renderStars(product.rating)}</div>
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-green-600">₹{product.price || 0}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                  )}
                </div>

                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={product.stock <= 0}
                  className={`w-full py-2 rounded-lg transition text-sm font-medium flex items-center justify-center gap-2
                    ${product.stock <= 0 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;