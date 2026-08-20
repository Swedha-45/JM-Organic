// components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ShieldCheck, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // <-- Changed

const Footer = () => {
  const { t } = useTranslation(); // <-- Changed

  return (
    <footer className="bg-[#0B2E19] text-white/80 pt-16 pb-12 border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center text-brand-dark font-bold shadow-md">
                🌿
              </div>
              <span className="text-2xl font-display font-extrabold text-white tracking-tight">
                JM Organic
              </span>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              {t('footerDescription')}
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-accent bg-white/5 border border-white/10 px-3.5 py-2 rounded-full w-fit">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>{t('fssaiCertifiedLabel')} {t('hundredOrganic')} • {t('directFarmSourcing')}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-display font-bold text-base tracking-wide uppercase text-xs text-accent">
              {t('footerQuickLinks')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-accent transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-accent transition-colors">
                  {t('ourProducts')}
                </Link>
              </li>
              <li>
                <Link to="/nutrition" className="hover:text-accent transition-colors">
                  {t('nutrition')}
                </Link>
              </li>
              <li>
                <Link to="/bulk-orders" className="hover:text-accent transition-colors">
                  Bulk Orders
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-accent transition-colors">
                  {t('reviews')}
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-accent transition-colors">
                  {t('shoppingCart')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="space-y-4">
            <h4 className="text-white font-display font-bold text-base tracking-wide uppercase text-xs text-accent">
              {t('footerContact')}
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-white/70">{t('footerAddress')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <span className="text-white/70">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <span className="text-white/70">care@jmorganic.in</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-white font-display font-bold text-base tracking-wide uppercase text-xs text-accent">
              {t('farmUpdates')}
            </h4>
            <p className="text-xs text-white/70">
              {t('newsletterSubtitle')}
            </p>


          </div>
        </div>

        {/* Bottom copyright & badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>{t('footerCopyright', { year: new Date().getFullYear() })}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-white/60">
              {t('craftedWith')} <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> {t('forHealthyLiving')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;