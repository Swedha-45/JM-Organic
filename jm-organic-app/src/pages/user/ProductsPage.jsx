// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { productAPI } from '../../services/api';
import ProductCard from '../../components/ProductCard';
import { Search, Filter, X } from 'lucide-react';

const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'Oils', label: 'Oils' },
    { id: 'Fresh Coconuts', label: 'Fresh Coconuts' },
    { id: 'Bulk Orders', label: 'Bulk Orders' }
  ];

  // ✅ Load products from backend
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get search param from URL
        const params = new URLSearchParams(location.search);
        const search = params.get('search') || '';
        
        if (search) {
          setSearchQuery(search);
        }
        
        // ✅ Fetch from backend
        const response = await productAPI.getAll({ search });
        setProducts(response.products || []);
        setFilteredProducts(response.products || []);
      } catch (err) {
        setError(err.message || 'Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [location.search]);

  // ✅ Filter products locally
  useEffect(() => {
    let result = [...products];
    
    if (selectedCategory !== 'all') {
      result = result.filter(product => 
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(product =>
        product.name?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery]);

  const handleSearch = (e) => {
    const value = e.target.value || '';
    setSearchQuery(value);
    const params = new URLSearchParams();
    if (value.trim()) {
      params.set('search', value.trim());
    }
    navigate(`/products${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId !== 'all') {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        navigate(`/products?search=${encodeURIComponent(category.label)}`);
      }
    } else {
      navigate('/products');
    }
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    navigate('/products');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-red-600">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
      </h1>

      {/* Category Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === category.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search for organic products..."
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        {searchQuery && (
          <button
            onClick={clearFilters}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">No products found</p>
          <button onClick={clearFilters} className="mt-4 text-green-600 hover:text-green-700 font-medium">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;