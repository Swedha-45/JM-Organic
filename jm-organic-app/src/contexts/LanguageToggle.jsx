// components/LanguageToggle.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'ta' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors text-sm font-medium border border-emerald-200"
    >
      <Globe className="w-4 h-4" />
      <span>{currentLang === 'en' ? 'தமிழ்' : 'English'}</span>
    </button>
  );
};

export default LanguageToggle;