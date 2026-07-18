import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../context/SettingsContext';
import { Phone } from 'lucide-react';

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Footer = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const storeName = settings?.storeName || 'El Boutique';
  
  return (
    <footer className="bg-primary-50 border-t border-primary-200 py-12 mt-auto">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-serif text-2xl font-bold text-primary-900 tracking-wide mb-2">{storeName}</h3>
            <p className="text-[13px] text-primary-600 uppercase tracking-[0.1em]">{t('footer.subtitle', 'Elegance in every detail')}</p>
          </div>
          
          <div className="flex gap-6">
            {settings?.socialMedia?.instagram && (
              <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-900 transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </a>
            )}
            {settings?.socialMedia?.facebook && (
              <a href={settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-900 transition-colors">
                <FacebookIcon className="w-5 h-5" />
              </a>
            )}
            {settings?.phoneNumber && (
              <a href={`tel:${settings.phoneNumber}`} className="text-primary-600 hover:text-primary-900 transition-colors">
                <Phone className="w-5 h-5" strokeWidth={1.5} />
              </a>
            )}
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-primary-200 text-center">
          <p className="text-[12px] uppercase tracking-[0.1em] text-primary-500">
            &copy; {new Date().getFullYear()} {storeName}. {t('footer.rights', 'All rights reserved.')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
