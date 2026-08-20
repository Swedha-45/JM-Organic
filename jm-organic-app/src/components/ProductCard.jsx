import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { t, language } = useLanguage();
  const { addToCart } = useCart();

  if (!product) return null;

  const productId = product.id || product._id;
  const displayName = (language === 'ta' && (product.tamilName || product.nameTa))
    ? (product.tamilName || product.nameTa)
    : product.name;

  const handleAddToCart = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleHeartClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link
      to={`/product/${productId}`}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group cursor-pointer"
    >
      {/* Image & Badges Container */}
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 bg-emerald-900 text-white text-[10px] tracking-wider uppercase font-bold px-2.5 py-1 rounded-full shadow-sm">
            {product.badge}
          </span>
        )}
        <button
          onClick={handleHeartClick}
          aria-label="Wishlist product"
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:text-red-500 hover:bg-white transition"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        <img
          src={product.image}
          alt={displayName || 'Product'}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Header & Price */}
          <div className="flex justify-between items-start mb-1 gap-2">
            <h3 className="font-semibold text-gray-800 text-base leading-snug line-clamp-1">{displayName}</h3>
            <div className="text-right shrink-0">
              <span className="text-lg font-bold text-gray-900">₹{product.price || 0}</span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through block">₹{product.originalPrice}</span>
              )}
            </div>
          </div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{product.unit || '1 Litre'}</span>

          {/* Feature Tags */}
          <div className="flex flex-wrap gap-1.5 my-3">
            {(product.tags || []).slice(0, 3).map((tag, idx) => (
              <span key={idx} className="bg-emerald-50 text-emerald-800 text-[10px] font-medium px-2 py-0.5 rounded-md border border-emerald-100">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Rating & Add to Cart Button */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{product.rating || 4.8}</span>
            <span className="text-xs text-gray-400">({product.reviews || product.reviewCount || 10})</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              product.stock === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : added
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-emerald-900 hover:bg-emerald-800 text-white active:scale-95'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {product.stock === 0 ? (t('outOfStock') || 'Out of Stock') : added ? (t('added') || 'Added') : (t('addToCart') || 'Add to Cart')}
          </button>
        </div>
      </div>
    </Link>
  );
}