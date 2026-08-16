import React, { useState } from 'react';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const { t } = useLanguage();
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    if (e) e.stopPropagation();
    if (product) {
      addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      {/* Image & Badges Container */}
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 bg-emerald-900 text-white text-[10px] tracking-wider uppercase font-bold px-2.5 py-1 rounded-full shadow-sm">
            {product.badge}
          </span>
        )}
        <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:text-red-500 hover:bg-white transition">
          <Heart className="w-4 h-4" />
        </button>

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Header & Price */}
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-gray-800 text-base leading-snug">{product.name}</h3>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through block">₹{product.originalPrice}</span>
              )}
            </div>
          </div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{product.unit}</span>

          {/* Feature Tags */}
          <div className="flex flex-wrap gap-1.5 my-3">
            {(product.tags || []).map((tag, idx) => (
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
            <span className="font-semibold">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              added
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-emerald-900 hover:bg-emerald-800 text-white active:scale-95'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {added ? t('added') : t('addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}