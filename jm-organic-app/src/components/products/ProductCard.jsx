// components/products/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { t, translateText, language } = useLanguage();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock === 0;

  const displayName = translateText(product.name, product.tamilName);
  const displayDescription = translateText(product.description, product.tamilDescription);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col rounded-3xl bg-card shadow-card card-hover overflow-hidden"
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={displayName}
          className="w-full h-full object-cover product-img-hover"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-primary text-primary-foreground text-xs font-bold px-3 py-1 uppercase">
            {language === 'ta' ? (product.badge === 'BEST SELLER' ? 'அதிக விற்பனை' : 'தூய்மையானது') : product.badge}
          </span>
        )}
        {isLowStock && !product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-accent text-accent-foreground text-xs font-bold px-3 py-1 uppercase">
            {language === 'ta' ? 'குறைந்த இருப்பு' : 'LOW STOCK'}
          </span>
        )}
        <button
          onClick={(e) => e.preventDefault()}
          aria-label={`Add ${displayName} to wishlist`}
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart className="w-4 h-4 text-foreground" />
        </button>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <div className="text-xs text-primary font-semibold uppercase tracking-wider">
          {language === 'ta' ? (product.category === 'Oils' ? 'எண்ணெய்கள்' : product.category === 'Fresh' ? 'புதிய உணவுகள்' : product.category === 'Nuts' ? 'பருப்புகள்' : product.category) : product.category}
        </div>
        <h3 className="font-display font-semibold text-foreground mt-1">
          {displayName}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {displayDescription}
        </p>

        <div className="flex flex-wrap gap-2 mt-3">
          {product.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted text-muted-foreground text-xs px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 mt-3 text-sm">
          <Star className="w-4 h-4 fill-accent text-accent" />
          <span className="font-semibold text-foreground">
            {product.rating}
          </span>
          <span className="text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-bold text-primary">
              ₹{product.price}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-muted-foreground line-through ml-2">
                ₹{product.discountPrice}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            / {product.unit}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full mt-4 flex items-center justify-center gap-2 rounded-xl py-2.5 font-semibold transition-colors ${
            isOutOfStock
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : added
              ? 'bg-accent text-accent-foreground'
              : 'bg-primary text-primary-foreground hover:bg-[var(--green-deep)]'
          }`}
        >
          {isOutOfStock ? (
            t('outOfStock')
          ) : added ? (
            <>
              <Check className="w-4 h-4" />
              {language === 'ta' ? 'சேர்க்கப்பட்டது!' : 'Added!'}
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              {t('addToCart')}
            </>
          )}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;