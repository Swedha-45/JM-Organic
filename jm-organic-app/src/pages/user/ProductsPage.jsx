// src/pages/ProductsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProducts } from '../../services/productService';
import ProductCard from '../../components/ProductCard';
import { Search, X } from 'lucide-react';

const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // ✅ Load products & parse URL params
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams(location.search);
        const search = params.get('search') || '';
        const category = params.get('category') || 'all';
        
        setSearchQuery(search);
        setSelectedCategory(category);
        
        // Fetch product catalog
        const list = await getProducts();
        setProducts(list);
      } catch (err) {
        setError(err.message || 'Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [location.search]);

  // ✅ Dynamically build categories list from products
  const categories = useMemo(() => {
    const defaultCats = ['Oils', 'Fresh Coconuts', 'Fruits', 'Grains', 'Sweeteners', 'Bulk Orders'];
    const dbCats = products.map(p => p.category).filter(Boolean);
    const uniqueCats = Array.from(new Set([...defaultCats, ...dbCats]));
    
    return [
      { id: 'all', label: 'All Products' },
      ...uniqueCats.map(c => ({ id: c, label: c }))
    ];
  }, [products]);

  // ✅ Filter products locally by search query AND selected category
  useEffect(() => {
    let result = [...products];
    
    if (selectedCategory && selectedCategory !== 'all') {
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
    const params = new URLSearchParams(location.search);
    if (value.trim()) {
      params.set('search', value.trim());
    } else {
      params.delete('search');
    }
    const queryString = params.toString();
    navigate(`/products${queryString ? `?${queryString}` : ''}`, { replace: true });
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    const params = new URLSearchParams(location.search);
    if (categoryId !== 'all') {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    const queryString = params.toString();
    navigate(`/products${queryString ? `?${queryString}` : ''}`);
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
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;