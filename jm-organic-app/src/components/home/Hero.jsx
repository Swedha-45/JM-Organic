// components/home/Hero.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // <-- Changed to useTranslation
import { Search, ChevronDown, Tag } from 'lucide-react';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const { t, i18n } = useTranslation(); // <-- Changed
  const navigate = useNavigate();
  const language = i18n.language; // <-- Get current language

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    if (selectedCategory && selectedCategory !== 'All Products') {
      params.set('category', selectedCategory);
    }
    const queryString = params.toString();
    navigate(`/products${queryString ? `?${queryString}` : ''}`);
  };

  const handleTagClick = (tagName) => {
    navigate(`/products?search=${encodeURIComponent(tagName)}`);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-emerald-950 text-white">
      {/* Background High-Res Coconut Farm Plantation Image */}
      <img
        src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1600&q=80"
        alt="Tamil Nadu organic coconut plantation"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
      />

      {/* Multi-Layer Gradient Blur Overlay matching Image 1 */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/70 to-emerald-950/40" />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headline, Description & Capsule Search */}
          <div className="lg:col-span-7 space-y-6 animate-fade-in">
            
            {/* Top Green Tag Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-950/80 backdrop-blur-md px-4 py-1.5 text-xs font-extrabold tracking-wider text-white border border-emerald-700/60 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="uppercase text-[11px] tracking-widest text-emerald-100">
                {t('heroTagline')}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-hero-xl font-display font-extrabold text-white leading-tight tracking-tight">
              {language === 'ta' ? (
                <>
                  100% இயற்கை தயாரிப்புகள்,<br />
                  <span className="text-amber-gold">நேர்மையான விலையில்.</span>
                </>
              ) : (
                <>
                  Pure Organic,<br />
                  <span className="text-amber-gold">Honest Prices.</span>
                </>
              )}
            </h1>

            {/* Subtitle - Using t() function */}
            <p className="text-base sm:text-lg text-white/90 font-normal max-w-xl leading-relaxed">
              {t('heroSubtitle')}
            </p>

            {/* Capsule Search Bar matching Image 1 */}
            <form onSubmit={handleSearch} className="pt-2">
              <div className="flex flex-col sm:flex-row items-stretch bg-white/95 backdrop-blur-md rounded-3xl sm:rounded-full p-2 border border-white/60 shadow-xl max-w-2xl text-emerald-950 gap-2">
                
                {/* Left Category Dropdown */}
                <div className="relative flex items-center px-4 py-2.5 sm:border-r border-gray-200 shrink-0">
                  <Tag className="w-4 h-4 text-emerald-800 mr-2" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-transparent text-xs font-extrabold text-emerald-950 outline-none cursor-pointer pr-6 appearance-none"
                  >
                    <option value="All Products">{t('allProducts')}</option>
                    <option value="Oils">{t('oils')}</option>
                    <option value="Fresh Coconuts">{t('freshCoconuts')}</option>
                    <option value="Bulk Orders">{t('bulkOrders')}</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2 pointer-events-none" />
                </div>

                {/* Search Input Field */}
                <div className="flex-1 flex items-center px-3 py-1">
                  <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full bg-transparent text-xs font-semibold text-gray-800 placeholder-gray-400 outline-none"
                  />
                </div>

                {/* Solid Green Search Button */}
                <button
                  type="submit"
                  className="bg-emerald-900 hover:bg-emerald-950 text-white px-7 py-3 rounded-full text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>{t('search')}</span>
                </button>
              </div>
            </form>

            {/* Quick Filter Tag Pills matching Image 1 */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleTagClick('Coconut Oil 1L')}
                className="px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold hover:bg-white/30 transition-colors"
              >
                {t('coconutOil1L')}
              </button>
              <button
                type="button"
                onClick={() => handleTagClick('Bulk 25L')}
                className="px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold hover:bg-white/30 transition-colors"
              >
                {t('bulk25L')}
              </button>
              <button
                type="button"
                onClick={() => handleTagClick('Cold Pressed')}
                className="px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold hover:bg-white/30 transition-colors"
              >
                {t('coldPressed')}
              </button>
              <button
                type="button"
                onClick={() => handleTagClick('Fresh Coconuts')}
                className="px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold hover:bg-white/30 transition-colors"
              >
                {t('freshCoconuts')}
              </button>
            </div>

          </div>

          {/* Right Column: 4 Floating Dark Forest Green Cards matching Image 1 */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            
            {/* Card 1 */}
            <div className="bg-[#144A29] p-6 sm:p-7 rounded-3xl border border-emerald-800/80 shadow-xl backdrop-blur-sm hover:scale-[1.02] transition-transform">
              <div className="text-3xl sm:text-4xl font-display font-extrabold text-amber-gold">
                500+
              </div>
              <div className="text-[11px] font-extrabold tracking-wider uppercase text-emerald-100/90 mt-2">
                {t('organicProducts')}
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#144A29] p-6 sm:p-7 rounded-3xl border border-emerald-800/80 shadow-xl backdrop-blur-sm hover:scale-[1.02] transition-transform">
              <div className="text-3xl sm:text-4xl font-display font-extrabold text-amber-gold">
                100%
              </div>
              <div className="text-[11px] font-extrabold tracking-wider uppercase text-emerald-100/90 mt-2">
                {t('certifiedPure')}
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#144A29] p-6 sm:p-7 rounded-3xl border border-emerald-800/80 shadow-xl backdrop-blur-sm hover:scale-[1.02] transition-transform">
              <div className="text-3xl sm:text-4xl font-display font-extrabold text-amber-gold">
                ₹180
              </div>
              <div className="text-[11px] font-extrabold tracking-wider uppercase text-emerald-100/90 mt-2">
                {t('avgCoconutOil')}
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#144A29] p-6 sm:p-7 rounded-3xl border border-emerald-800/80 shadow-xl backdrop-blur-sm hover:scale-[1.02] transition-transform">
              <div className="text-3xl sm:text-4xl font-display font-extrabold text-amber-gold">
                12k+
              </div>
              <div className="text-[11px] font-extrabold tracking-wider uppercase text-emerald-100/90 mt-2">
                {t('happyFamilies')}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;