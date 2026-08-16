// components/home/WhyChooseUs.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Globe, MapPin, ArrowUpRight } from 'lucide-react';

const WhyChooseUs = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  
  return (
    <section id="why-us" className="py-20 bg-[#F3F7F2]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-emerald-950 tracking-tight">
              {language === 'ta' ? 'JM இயற்கையை ஏன் தேர்வு செய்க?' : 'Why Choose JM Organic?'}
              <br className="hidden sm:inline" />
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mt-2 leading-relaxed">
              {t('whyChooseSubtitle')}
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-xs font-black tracking-wider uppercase text-emerald-900 hover:text-emerald-950 transition-colors group"
          >
            <span>{t('shopNow')}</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-7 bg-white rounded-3xl border border-brand-border/80 shadow-md overflow-hidden flex flex-col justify-between relative group min-h-[380px]">
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1000&q=80"
                alt="Tamil Nadu Farmland"
                className="w-full h-full object-cover object-right group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent" />
            </div>

            <div className="relative z-10 p-8 sm:p-10 max-w-lg">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 flex items-center justify-center mb-6">
                <MapPin className="w-5 h-5 text-emerald-800" />
              </div>

              <h3 className="text-2xl font-display font-extrabold text-emerald-950">
                {t('directFromTamilNaduFarms')}
              </h3>

              <p className="text-muted-foreground text-xs sm:text-sm mt-3 leading-relaxed">
                {t('farmSourceDescription')}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#144A29] text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="w-10 h-10 rounded-full border border-amber-400/40 bg-white/10 flex items-center justify-center mb-6">
                <Globe className="w-5 h-5 text-amber-300" />
              </div>

              <h3 className="text-2xl font-display font-extrabold text-white">
                {t('ecoImpactCalculator')}
              </h3>

              <p className="text-emerald-100/80 text-xs sm:text-sm mt-3 leading-relaxed">
                {t('ecoImpactDescription')}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-emerald-700/60 space-y-4 text-xs font-semibold">
              <div className="flex justify-between items-center">
                <span className="text-emerald-200">{t('carbonFootprintSaved')}</span>
                <span className="font-extrabold text-amber-300">{t('carbonPerBottle')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-200">{t('localFarmersSupported')}</span>
                <span className="font-extrabold text-amber-300">{t('organicFarms')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-200">{t('packaging')}</span>
                <span className="font-extrabold text-emerald-300">{t('recyclableGlassTin')}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;