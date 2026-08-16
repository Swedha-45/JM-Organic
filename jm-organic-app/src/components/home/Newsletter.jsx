// components/home/Newsletter.jsx
import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Newsletter = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-brand-secondary/60 border border-brand-border p-8 sm:p-14 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-brand-primary text-white flex items-center justify-center mx-auto mb-6 shadow-md shadow-brand-primary/20">
            <Mail className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold px-4 py-1 mb-4 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('newsletterBadge')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-brand-dark tracking-tight">
            {t('newsletterTitle')}
          </h2>
          <p className="text-muted-foreground mt-3 text-sm sm:text-base max-w-xl mx-auto">
            {t('newsletterSubtitle')}
          </p>

          {subscribed ? (
            <div className="mt-8 p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 inline-flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{t('newsletterSuccess')}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                className="flex-1 px-5 py-3.5 rounded-full border border-brand-border bg-white text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary shadow-sm"
              />
              <button
                type="submit"
                className="bg-brand-primary text-white font-bold px-8 py-3.5 rounded-full hover:bg-brand-dark shadow-md shadow-brand-primary/20 transition-all whitespace-nowrap text-sm"
              >
                {t('newsletterClaim')}
              </button>
            </form>
          )}

          <p className="text-[11px] text-muted-foreground mt-4">
            {t('newsletterDisclaimer')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;