import React, { createContext, useState, useContext, useEffect } from 'react';
import { Language, Translation, es, en } from './translations';

interface LanguageContextType {
  language: Language;
  t: Translation;
  changeLanguage: (lang: Language) => void;
}

// Valor predeterminado para el contexto
const defaultContext: LanguageContextType = {
  language: 'es', // Español como idioma predeterminado
  t: es,          // Traducciones en español
  changeLanguage: () => {}
};

// Crear el contexto
const LanguageContext = createContext<LanguageContextType>(defaultContext);

// Proveedor del contexto para envolver la aplicación
export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Intentar recuperar el idioma guardado en localStorage
  const getSavedLanguage = (): Language => {
    try {
      const savedLanguage = localStorage.getItem('language') as Language;
      return savedLanguage === 'en' ? 'en' : 'es'; // Validar que sea un idioma válido
    } catch {
      return 'es'; // Por defecto español si hay algún error
    }
  };

  // Estado para el idioma actual
  const [language, setLanguage] = useState<Language>(getSavedLanguage());
  // Estado para las traducciones según el idioma
  const [translations, setTranslations] = useState<Translation>(language === 'en' ? en : es);

  // Función para cambiar el idioma
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    setTranslations(lang === 'en' ? en : es);
    
    // Guardar preferencia en localStorage
    try {
      localStorage.setItem('language', lang);
    } catch (error) {
      console.error("Error guardando el idioma en localStorage:", error);
    }
  };

  // Actualizar traducciones cuando cambia el idioma
  useEffect(() => {
    setTranslations(language === 'en' ? en : es);
  }, [language]);

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        t: translations, 
        changeLanguage 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personalizado para acceder al contexto desde cualquier componente
export const useLanguage = () => useContext(LanguageContext);