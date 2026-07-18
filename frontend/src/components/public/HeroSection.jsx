import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="relative bg-primary-100 rounded-none overflow-hidden mb-16 fade-in border border-primary-200">
      {/* Background Image / Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80" 
          alt="Fashion Hero" 
          className="w-full h-full object-cover object-top opacity-80"
        />
        {/* Soft elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/95 via-primary-50/70 to-transparent rtl:bg-gradient-to-l" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 py-24 md:py-36 md:px-20 flex flex-col justify-center min-h-[500px] md:min-h-[600px]">
        <div className="max-w-xl">
          <span className="inline-block text-[11px] font-semibold tracking-[0.2em] uppercase text-primary-600 mb-6 border-b border-primary-300 pb-2">
            {t('hero.badge', 'New Collection')}
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-primary-900 mb-8 leading-[1.1] tracking-tight">
            {t('hero.title', 'Discover Your True Style')}
          </h1>
          <p className="text-base md:text-lg text-primary-700 mb-10 max-w-md leading-relaxed font-light">
            {t('hero.subtitle', 'Explore the latest fashion trends and elevate your wardrobe with our premium selection.')}
          </p>
          <Link 
            to="/products"
            className="inline-flex items-center gap-3 bg-primary-900 text-white px-10 py-4 rounded-none text-[12px] uppercase tracking-[0.15em] hover:bg-primary-700 transition-colors duration-300"
          >
            {t('hero.cta', 'Shop Now')}
            <ArrowRight size={16} className={isRtl ? 'rotate-180' : ''} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
