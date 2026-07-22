import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Heart, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useFavourites } from '../../context/FavouritesContext';
import { useSettings } from '../../context/SettingsContext';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { cartCount } = useCart();
  const { favouritesCount } = useFavourites();
  const { settings } = useSettings();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const storeName = settings?.storeName || 'El Boutique';

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'fr' : 'ar';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="sticky top-0 z-50 bg-primary-50/90 backdrop-blur-md border-b border-primary-200 fade-in">
      <div className="container mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl md:text-3xl font-serif font-bold text-primary-900 tracking-wide flex items-center gap-3">
          {settings?.logo?.url ? (
            <img src={settings.logo.url} alt={storeName} className="h-10 w-auto object-contain" />
          ) : null}
          <span>{storeName}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          <Link to="/products" className="text-[13px] uppercase tracking-[0.1em] font-medium text-primary-800 hover:text-primary-500 transition-colors">
            {t('header.products', 'Products')}
          </Link>
          
          <div className="flex items-center gap-6 border-l border-primary-200 pl-6 rtl:border-r rtl:border-l-0 rtl:pr-6 rtl:pl-0">
            <Link to="/favourites" className="relative text-primary-800 hover:text-primary-500 transition-colors group">
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              {favouritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-[9px] font-medium h-4 w-4 rounded-full flex items-center justify-center">
                  {favouritesCount}
                </span>
              )}
            </Link>
            
            <Link to="/cart" className="relative text-primary-800 hover:text-primary-500 transition-colors group">
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-[9px] font-medium h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleLanguage}
              className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-600 hover:text-primary-900 transition-colors"
            >
              {i18n.language === 'ar' ? 'FR' : 'AR'}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Button & Icons */}
        <div className="flex items-center gap-5 md:hidden">
          <Link to="/cart" className="relative text-primary-800">
            <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-[9px] font-medium h-4 w-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button 
            className="text-primary-800 p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-primary-50 border-b border-primary-200 shadow-sm py-6 px-6 flex flex-col gap-6 fade-in">
          <Link 
            to="/products" 
            className="text-[13px] uppercase tracking-[0.1em] font-medium text-primary-900"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t('header.products', 'Products')}
          </Link>
          <Link 
            to="/favourites" 
            className="text-[13px] uppercase tracking-[0.1em] font-medium text-primary-900 flex items-center justify-between"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span>{t('header.favourites', 'Favourites')}</span>
            {favouritesCount > 0 && (
              <span className="bg-primary-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                {favouritesCount}
              </span>
            )}
          </Link>
          <div className="pt-6 mt-2 border-t border-primary-200 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.1em] text-primary-600">Language</span>
            <button
              onClick={() => {
                toggleLanguage();
                setIsMobileMenuOpen(false);
              }}
              className="text-[11px] uppercase tracking-[0.15em] font-medium text-primary-900 bg-primary-200 px-4 py-2 rounded-full"
            >
              {i18n.language === 'ar' ? 'Français' : 'العربية'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
