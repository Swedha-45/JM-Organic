// components/home/StatsBar.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const StatsBar = () => {
  // ✅ Add error handling for translation
  let t = (key) => key; // Fallback function
  
  try {
    const translation = useTranslation();
    t = translation.t;
  } catch (error) {
    console.warn('Translation not available, using fallback:', error);
  }

  // ✅ Safe stats with fallback labels
  const stats = [
    { value: '500+', label: t('organicProducts') || 'Organic Products' },
    { value: '100%', label: t('certifiedPure') || 'Certified Pure' },
    { value: '₹180', label: t('avgCoconutOil') || 'Avg. Coconut Oil' },
    { value: '12k+', label: t('happyFamilies') || 'Happy Families' }
  ];

  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-900">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;