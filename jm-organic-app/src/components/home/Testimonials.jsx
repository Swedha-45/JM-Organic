// components/home/Testimonials.jsx
import React from 'react';
import { Star, BadgeCheck, Tag, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Testimonials data with Tamil translations
const TESTIMONIALS = [
  {
    id: 1,
    name: 'Priya Subramaniam',
    nameTa: 'பிரியா சுப்பிரமணியம்',
    role: 'Home Chef & Food Blogger, Chennai',
    roleTa: 'வீட்டு சமையல்காரர் & உணவு பதிவர், சென்னை',
    quote: 'Switched to JM cold-pressed coconut oil 6 months ago. The aroma is pure traditional wood-pressed quality, and the 5L bottle lasts my family 3 months smoothly.',
    quoteTa: '6 மாதங்களுக்கு முன்பு JM மரச்செக்கு தேங்காய் எண்ணெய்க்கு மாறினேன். வாசனை தூய பாரம்பரிய மரச்செக்கு தரம், மேலும் 5L பாட்டில் என் குடும்பத்திற்கு 3 மாதங்கள் சுமூகமாக நீடிக்கும்.',
    product: 'Cold Pressed Coconut Oil 5L',
    productTa: 'மரச்செக்கு தேங்காய் எண்ணெய் 5L',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
  },
  {
    id: 2,
    name: 'Karthik Rajan',
    nameTa: 'கார்த்திக் ராஜன்',
    role: 'Restaurant Manager, Coimbatore',
    roleTa: 'உணவக மேலாளர், கோயம்புத்தூர்',
    quote: 'We order bulk 50L coconut oil every month for our traditional South Indian kitchen. Consistent quality, fast delivery in Coimbatore, and proper GST invoices.',
    quoteTa: 'எங்கள் பாரம்பரிய தென்னிந்திய சமையலறைக்கு ஒவ்வொரு மாதமும் 50L தேங்காய் எண்ணெய் மொத்தமாக ஆர்டர் செய்கிறோம். நிலையான தரம், கோயம்புத்தூரில் விரைவான டெலிவரி, மற்றும் சரியான GST விலைப்பட்டியல்கள்.',
    product: 'Bulk Coconut Oil 50L',
    productTa: 'மொத்த தேங்காய் எண்ணெய் 50L',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
  },
  {
    id: 3,
    name: 'Dr. Meenakshi Devi',
    nameTa: 'டாக்டர் மீனாட்சி தேவி',
    role: 'Clinical Nutritionist, Madurai',
    roleTa: 'மருத்துவ ஊட்டச்சத்து நிபுணர், மதுரை',
    quote: 'I recommend JM Organic groundnuts and cold-pressed oils to my wellness clients. The nutrition data on their portal matches lab tests accurately.',
    quoteTa: 'JM இயற்கை வேர்க்கடலை மற்றும் மரச்செக்கு எண்ணெய்களை என் ஆரோக்கிய வாடிக்கையாளர்களுக்கு பரிந்துரைக்கிறேன். அவர்களின் போர்ட்டலில் உள்ள ஊட்டச்சத்து தரவு ஆய்வக சோதனைகளுடன் துல்லியமாக பொருந்துகிறது.',
    product: 'Raw Organic Groundnuts',
    productTa: 'பச்சை இயற்கை வேர்க்கடலை',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
  },
];

const Testimonials = () => {
  const { t, i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';

  // Get translated testimonial data
  const getTranslatedTestimonial = (testimonial) => {
    return {
      ...testimonial,
      displayName: isTamil ? (testimonial.nameTa || testimonial.name) : testimonial.name,
      displayRole: isTamil ? (testimonial.roleTa || testimonial.role) : testimonial.role,
      displayQuote: isTamil ? (testimonial.quoteTa || testimonial.quote) : testimonial.quote,
      displayProduct: isTamil ? (testimonial.productTa || testimonial.product) : testimonial.product,
    };
  };

  return (
    <section className="py-24 bg-brand-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-primary">
            {t('realCustomerReviews')}
          </span>
          <h2 className="text-display font-display font-extrabold text-brand-dark mt-2">
            {t('testimonialsTitle')}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {t('testimonialsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, i) => {
            const tData = getTranslatedTestimonial(testimonial);
            return (
              <div
                key={testimonial.id}
                className={`rounded-3xl bg-white border border-brand-border/80 shadow-card p-8 flex flex-col justify-between card-hover animate-fade-in stagger-${
                  i + 1
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-brand-secondary" />
                  </div>

                  <p className="text-brand-dark font-medium text-sm leading-relaxed italic">
                    "{tData.displayQuote}"
                  </p>

                  <div className="mt-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-secondary text-brand-primary font-bold text-xs px-3 py-1.5 border border-brand-border/60">
                      <Tag className="w-3 h-3" />
                      <span>{tData.displayProduct}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-brand-border/60">
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={tData.displayName}
                      className="w-11 h-11 rounded-full object-cover border-2 border-brand-primary/20"
                    />
                    <div>
                      <div className="font-display font-bold text-sm text-brand-dark">
                        {tData.displayName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {tData.displayRole}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span>{t('verified')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;