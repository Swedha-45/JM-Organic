// components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../contexts/CartContext';
import { useTranslation } from 'react-i18next';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();
  const [added, setAdded] = useState(false);
  
  const isTamil = i18n.language === 'ta';
  
  // Product name translation
  const displayName = isTamil ? (product.nameTa || product.name) : product.name;
  const displayDescription = isTamil ? (product.descriptionTa || product.description) : product.description;

  // Category translation - using t() function
  const getTranslatedCategory = (category) => {
    if (!category) return '';
    
    // Map category to translation key
    const categoryKeyMap = {
      'Oils': 'oils',
      'Fresh': 'fresh',
      'Fresh Coconuts': 'freshCoconuts',
      'Spices': 'spices',
      'Grains': 'grains',
      'Honey': 'honey',
      'Ghee': 'ghee',
      'Dry Fruits': 'dryFruits',
      'Powders': 'powders',
      'Bulk Orders': 'bulkOrders',
      'Oils & Ghee': 'oils',
      'Coconuts': 'freshCoconuts',
    };
    
    const key = categoryKeyMap[category];
    if (key) {
      return t(key); // This will return English or Tamil based on language
    }
    return category; // Fallback to original if no translation found
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-white rounded-2xl border border-brand-secondary shadow-sm hover:shadow-lg transition overflow-hidden group"
    >
      <div className="relative h-48 bg-brand-light overflow-hidden">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'}
          alt={displayName}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        {product.status === 'low' && (
          <span className="absolute top-3 right-3 bg-brand-accent text-white text-xs px-3 py-1 rounded-full font-bold">
            {t('lowStock')}
          </span>
        )}
      </div>
      <div className="p-4">
        {/* Category - Translates based on language */}
        <div className="text-xs text-brand-primary font-semibold uppercase tracking-wider font-body">
          {getTranslatedCategory(product.category)}
        </div>
        <h3 className="font-display font-semibold text-brand-dark mt-1">{displayName}</h3>
        <p className="text-sm text-brand-dark/60 mt-1 line-clamp-2 font-body">{displayDescription}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-brand-primary font-body">₹{product.price}</span>
          <span className="text-sm text-brand-dark/60 font-body">/ {product.unit}</span>
        </div>
        <button
          onClick={handleAddToCart}
          className={`w-full mt-3 py-2 rounded-xl font-semibold font-body transition flex items-center justify-center gap-2 ${
            added 
              ? 'bg-brand-accent text-white' 
              : 'bg-brand-primary text-white hover:bg-brand-dark'
          }`}
        >
          {added ? (
            <>
              <CheckIcon className="w-4 h-4" />
              {t('added')}
            </>
          ) : (
            <>
              <PlusIcon className="w-4 h-4" />
              {t('addToCart')}
            </>
          )}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;