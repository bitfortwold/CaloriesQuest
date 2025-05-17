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

// Función auxiliar para traducir textos dinámicos
export function translateFoodNames(language: Language) {
  // Mapa de traducciones para categorías
  const categoryTranslations: Record<string, string> = {
    // Español -> Inglés
    'frutas': 'fruits',
    'verduras': 'vegetables',
    'proteínas': 'proteins',
    'cereales': 'cereals',
    'lácteos': 'dairy'
  };

  // Mapa de traducciones para nombres de alimentos
  const foodNameTranslations: Record<string, string> = {
    'Manzana': 'Apple',
    'Plátano': 'Banana',
    'Brócoli': 'Broccoli',
    'Zanahoria': 'Carrot',
    'Pechuga de Pollo': 'Chicken Breast',
    'Bistec de Ternera': 'Beef Steak',
    'Pescado Sostenible': 'Sustainable Fish',
    'Arroz Integral': 'Brown Rice',
    'Pan Integral': 'Whole Wheat Bread',
    'Patata': 'Potato',
    'Leche': 'Milk',
    'Queso': 'Cheese',
    'Huevos': 'Eggs',
    'Frijoles': 'Beans',
    'Espinaca': 'Spinach'
  };

  // Mapa de traducciones para nombres de recetas
  const recipeNameTranslations: Record<string, string> = {
    'Desayuno Equilibrado': 'Balanced Breakfast',
    'Almuerzo Vegetariano': 'Vegetarian Lunch',
    'Cena Proteica': 'Protein Dinner',
    'Ingredientes': 'Ingredients',
    'Beneficios para la Salud': 'Health Benefits',
    'Seguir Receta': 'Follow Recipe'
  };

  return {
    categoryTranslations,
    foodNameTranslations,
    recipeNameTranslations
  };
}

// Proveedor del contexto para envolver la aplicación
export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Intentar recuperar el idioma guardado en localStorage
  const getSavedLanguage = (): Language => {
    try {
      const savedLanguage = localStorage.getItem('language');
      return (savedLanguage === 'en' || savedLanguage === 'es') 
        ? savedLanguage as Language 
        : 'es'; // Español como idioma predeterminado si no hay uno guardado
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
    // Guardar preferencia en localStorage primero
    try {
      localStorage.setItem('language', lang);
      
      // Actualizar la URL con un parámetro de consulta para forzar la recarga con el nuevo idioma
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      
      // Redireccionar a la misma página pero con el parámetro de idioma
      // Esto garantizará que toda la aplicación se recargue con el nuevo idioma
      window.location.href = url.toString();
      
    } catch (error) {
      console.error("Error guardando el idioma en localStorage:", error);
      
      // Intentar actualizar los estados de todos modos
      setLanguage(lang);
      setTranslations(lang === 'en' ? en : es);
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