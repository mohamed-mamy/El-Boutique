import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import arTranslation from '../locales/ar.json';
import frTranslation from '../locales/fr.json';

const resources = {
  ar: { translation: arTranslation },
  fr: { translation: frTranslation }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    }
  });

// Set dir/lang on initial load and on every language change
const applyDirection = (lng) => {
  const dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
};

applyDirection(i18n.language);
i18n.on('languageChanged', applyDirection);

export default i18n;

