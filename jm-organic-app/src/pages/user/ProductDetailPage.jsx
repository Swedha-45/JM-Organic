// pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Plus, 
  Minus, 
  Check, 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Heart, 
  ShoppingBag
} from 'lucide-react';
import { getProductByIdAsync, getAllProductsAsync } from '../../services/productService';
import { useCart } from '../../contexts/CartContext';
import { useTranslation } from 'react-i18next';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const isTamil = i18n.language === 'ta';

  useEffect(() => {
    const loadProductDetails = async () => {
      setLoading(true);
      const [found, all] = await Promise.all([
        getProductByIdAsync(id),
        getAllProductsAsync()
      ]);
      if (found) {
        setProduct(found);
        setSelectedImage(found.image);
        const related = (all || []).filter((p) => (p.id || p._id) !== id).slice(0, 3);
        setRelatedProducts(related);
      } else {
        setProduct(null);
      }
      setLoading(false);
    };
    loadProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F7F2] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-semibold">{t('loading') || 'Loading Product Details...'}</p>
        </div>
      </div>
    );
  }

  // Show not found if product doesn't exist
  if (!product) {
    return (
      <div className="min-h-screen bg-[#F3F7F2] flex items-center justify-center p-4">
        <div className="text-center bg-white p-10 rounded-3xl border border-brand-border shadow-md max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            🌿
          </div>
          <h2 className="text-2xl font-display font-bold text-emerald-950">{t('productNotFound')}</h2>
          <p className="text-sm text-muted-foreground mt-2">
            {t('productNotFoundDesc')}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-emerald-900 text-white px-6 py-3 rounded-full text-xs font-bold shadow-md hover:bg-emerald-950 transition-all mt-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('backToShop')}</span>
          </Link>
        </div>
      </div>
    );
  }

  // Use Tamil fields if available
  const displayName = isTamil ? (product.tamilName || product.nameTa || product.name) : product.name;
  const displayDescription = isTamil ? (product.tamilDescription || product.descriptionTa || product.description) : product.description;
  const displayCategory = isTamil ? (product.categoryTa || product.category) : product.category;
  const displayNutrition = isTamil ? (product.nutritionTa || product.nutrition) : product.nutrition;

  const discountPct = product.discountPrice
    ? Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)
    : 0;

  const galleryImages = product.gallery || [product.image];

  return (
    <div className="min-h-screen bg-[#F3F7F2] py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-8">
          <Link to="/" className="hover:text-emerald-900 transition-colors">{t('home')}</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-emerald-900 transition-colors">{t('products')}</Link>
          <span>/</span>
          <span className="text-emerald-950 font-bold truncate max-w-[200px]">{displayName}</span>
        </div>

        {/* Main Product Card */}
        <div className="bg-white rounded-3xl shadow-md border border-brand-border/80 overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-6 sm:p-10">
            
            {/* Image Preview & Gallery Thumbnails */}
            <div className="space-y-4">
              <div className="bg-[#E4ECE3] rounded-3xl overflow-hidden h-[360px] sm:h-[420px] border border-brand-border/60 relative">
                <img
                  src={selectedImage || product.image}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 rounded-full bg-emerald-900 text-white text-[10px] font-black px-4 py-1.5 tracking-wider uppercase shadow-md">
                    {product.badge}
                  </span>
                )}
                {discountPct > 0 && (
                  <span className="absolute top-4 left-32 rounded-full bg-red-600 text-white text-[10px] font-extrabold px-3 py-1 shadow-md">
                    {discountPct}% OFF
                  </span>
                )}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label="Wishlist product"
                  className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-white transition-all"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
              </div>

              {/* Gallery Thumbnails List */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all ${
                        selectedImage === img ? 'border-emerald-900 scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Gallery view ${idx+1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Info */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-widest bg-[#E4ECE3] px-3.5 py-1 rounded-full">
                    {displayCategory}
                  </span>
                  <Link to="/reviews" className="flex items-center text-amber-500 text-sm font-bold hover:underline">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                    <span>{product.rating || 4.9}</span>
                    <span className="text-muted-foreground ml-1 font-normal text-xs">
                      ({product.reviewCount || 120} {t('reviews')})
                    </span>
                  </Link>
                </div>

                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-950 tracking-tight mt-2">
                  {displayName}
                </h1>

                <div className="flex items-baseline gap-3 mt-4">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-900">
                    ₹{product.price}
                  </span>
                  {product.discountPrice && (
                    <span className="text-lg text-muted-foreground line-through font-medium">
                      ₹{product.discountPrice}
                    </span>
                  )}
                  <span className="text-xs font-bold text-muted-foreground">
                    / {product.unit}
                  </span>
                </div>

                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mt-4">
                  {displayDescription}
                </p>

                {/* Tags */}
                {product.tags && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {product.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-bold text-emerald-800 bg-[#E4ECE3] px-3 py-1 rounded-full">
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stock Status */}
                <div className="mt-6 p-4 rounded-2xl bg-[#F3F7F2] border border-brand-border flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-950">{t('availability')}:</span>
                    <span className="text-emerald-700 font-bold">{t('inStock')} ({product.stock || 25} {t('units')})</span>
                  </div>
                  <span className="text-muted-foreground">{t('fssaiCertifiedLabel')}</span>
                </div>

                {/* Quantity Controls */}
                <div className="mt-6">
                  <label className="block text-xs font-extrabold text-emerald-950 uppercase tracking-wider mb-2">
                    {t('selectQuantity')}:
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-brand-border rounded-full bg-[#E4ECE3] p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-emerald-100 transition-colors text-emerald-950"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-display font-extrabold text-emerald-950 text-sm">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock || 50, quantity + 1))}
                        className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-emerald-100 transition-colors text-emerald-950"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {t('subtotal')}: <strong className="text-emerald-900 text-sm font-black">₹{(product.price * quantity).toFixed(2)}</strong>
                    </span>
                  </div>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full mt-7 py-4 rounded-full font-bold text-xs uppercase tracking-wider shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${
                    added
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-900 text-white hover:bg-emerald-950 hover:shadow-lg'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t('added')}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-amber-300" />
                      <span>{t('addToCart')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-brand-border/60 grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-900 mb-1" />
                  <span className="text-[10px] font-extrabold text-emerald-950">{t('hundredPure')}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Truck className="w-5 h-5 text-emerald-900 mb-1" />
                  <span className="text-[10px] font-extrabold text-emerald-950">{t('farmExpress')}</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-5 h-5 text-emerald-900 mb-1" />
                  <span className="text-[10px] font-extrabold text-emerald-950">{t('easyReturns')}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Tabbed Specifications */}
        <div className="bg-white rounded-3xl shadow-md border border-brand-border/80 p-6 sm:p-10 mb-16">
          <div className="flex border-b border-brand-border/60 gap-8 overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 text-xs font-extrabold tracking-wide transition-colors relative whitespace-nowrap ${
                activeTab === 'overview' ? 'text-emerald-900 border-b-2 border-emerald-900' : 'text-muted-foreground'
              }`}
            >
              {t('productOverview')}
            </button>

            <button
              onClick={() => setActiveTab('nutrition')}
              className={`pb-3 text-xs font-extrabold tracking-wide transition-colors relative whitespace-nowrap ${
                activeTab === 'nutrition' ? 'text-emerald-900 border-b-2 border-emerald-900' : 'text-muted-foreground'
              }`}
            >
              {t('nutritionFacts')}
            </button>
          </div>

          <div className="pt-6">
            {activeTab === 'overview' && (
              <div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <p>
                  {isTamil 
                    ? (product.descriptionTaLong || 'JM Organic cold-pressed oil is extracted using traditional wood-press techniques.') 
                    : (product.descriptionLong || 'JM Organic cold-pressed oil is extracted using traditional wood-press (marachekku) techniques at low ambient temperatures. This slow extraction method preserves all natural antioxidants, lauric acid, and distinct natural aroma without chemical processing.')}
                </p>
                <ul className="list-disc pl-5 space-y-2 text-emerald-950 font-bold">
                  <li>{t('noChemicals')}</li>
                  <li>{t('richInMCT')}</li>
                  <li>{t('idealForCooking')}</li>
                  <li>{t('fssaiLabTested')}</li>
                </ul>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="max-w-md space-y-3 text-xs font-semibold text-emerald-950">
                {displayNutrition ? (
                  <div className="p-4 bg-[#F3F7F2] rounded-2xl border border-brand-border space-y-2">
                    <h4 className="font-extrabold text-emerald-900 uppercase text-[10px] tracking-wider border-b border-brand-border pb-1">
                      {isTamil ? 'நிர்வாகியால் அமைக்கப்பட்ட ஊட்டச்சத்து விபரம்' : 'Nutritional & Quality Profile'}
                    </h4>
                    <p className="text-xs font-medium text-emerald-950 whitespace-pre-line leading-relaxed">
                      {displayNutrition}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span>{t('energyCalories')}</span>
                      <span className="font-extrabold text-emerald-900">884 kcal / 100g</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span>{t('totalFattyAcids')}</span>
                      <span className="font-extrabold">100g (Cold Pressed)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span>{t('lauricAcid')}</span>
                      <span className="font-extrabold text-emerald-700">51.2% Active MCT</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>{t('transFats')}</span>
                      <span className="font-extrabold text-emerald-700">0.0g (100% Chemical Free)</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-emerald-950 mb-6">
              {t('youMayAlsoLike')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => {
                const relDisplayName = isTamil ? (rel.nameTa || rel.name) : rel.name;
                const relId = rel.id || rel._id;
                return (
                  <Link
                    key={relId}
                    to={`/product/${relId}`}
                    className="bg-white p-4 rounded-3xl border border-brand-border/80 shadow-md hover:scale-[1.02] transition-transform flex items-center gap-4"
                  >
                    <img
                      src={rel.image}
                      alt={relDisplayName}
                      className="w-16 h-16 rounded-2xl object-cover bg-[#E4ECE3] shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-emerald-950 line-clamp-1">
                        {relDisplayName}
                      </h4>
                      <div className="text-xs font-black text-emerald-900 mt-1">
                        ₹{rel.price} <span className="text-muted-foreground font-normal">/ {rel.unit}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetailPage;