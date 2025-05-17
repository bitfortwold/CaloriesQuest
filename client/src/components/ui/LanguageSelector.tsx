import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Language } from '../../i18n/translations';

export const LanguageSelector: React.FC = () => {
  const { language, t, changeLanguage } = useLanguage();

  // Cambiar idioma al hacer clic en un botón
  const handleLanguageChange = (lang: Language) => {
    if (lang !== language) {
      changeLanguage(lang);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[1000] flex items-center space-x-2">
      <span className="text-sm text-white font-medium">{t.language}:</span>
      <div className="flex bg-gray-800 rounded-lg overflow-hidden">
        <button
          onClick={() => handleLanguageChange('es')}
          className={`px-3 py-1 text-sm font-medium transition-colors ${
            language === 'es' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-gray-700'
          }`}
          title={t.spanish}
        >
          ES
        </button>
        <button
          onClick={() => handleLanguageChange('en')}
          className={`px-3 py-1 text-sm font-medium transition-colors ${
            language === 'en' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-gray-700'
          }`}
          title={t.english}
        >
          EN
        </button>
        <button
          onClick={() => handleLanguageChange('ca')}
          className={`px-3 py-1 text-sm font-medium transition-colors ${
            language === 'ca' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-gray-700'
          }`}
          title={t.catalan}
        >
          CA
        </button>
      </div>
    </div>
  );
};