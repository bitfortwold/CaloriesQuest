import React, { createContext, useState, useContext, useEffect } from 'react';
import { Language, Translation, es, en, ca } from './translations';

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
  // Mapas de traducciones para categorías
  // Español -> Inglés
  const esEnCategoryTranslations: Record<string, string> = {
    'frutas': 'fruits',
    'verduras': 'vegetables',
    'proteínas': 'proteins',
    'cereales': 'cereals',
    'lácteos': 'dairy'
  };
  
  // Español -> Catalán
  const esCaCategoryTranslations: Record<string, string> = {
    'frutas': 'fruites',
    'verduras': 'verdures',
    'proteínas': 'proteïnes',
    'cereales': 'cereals',
    'lácteos': 'làctics'
  };

  // Mapas de traducciones para nombres de alimentos
  // Español -> Inglés
  const esEnFoodNameTranslations: Record<string, string> = {
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
  
  // Español -> Catalán
  const esCaFoodNameTranslations: Record<string, string> = {
    'Manzana': 'Poma',
    'Plátano': 'Plàtan',
    'Brócoli': 'Bròquil',
    'Zanahoria': 'Pastanaga',
    'Pechuga de Pollo': 'Pit de Pollastre',
    'Bistec de Ternera': 'Bistec de Vedella',
    'Pescado Sostenible': 'Peix Sostenible',
    'Arroz Integral': 'Arròs Integral',
    'Pan Integral': 'Pa Integral',
    'Patata': 'Patata',
    'Leche': 'Llet',
    'Queso': 'Formatge',
    'Huevos': 'Ous',
    'Frijoles': 'Mongetes',
    'Espinaca': 'Espinacs'
  };

  // Mapas de traducciones para nombres de recetas
  // Español -> Inglés
  const esEnRecipeNameTranslations: Record<string, string> = {
    'Desayuno Equilibrado': 'Balanced Breakfast',
    'Almuerzo Vegetariano': 'Vegetarian Lunch',
    'Cena Proteica': 'Protein Dinner',
    'Ingredientes': 'Ingredients',
    'Beneficios para la Salud': 'Health Benefits',
    'Seguir Receta': 'Follow Recipe'
  };
  
  // Español -> Catalán
  const esCaRecipeNameTranslations: Record<string, string> = {
    'Desayuno Equilibrado': 'Esmorzar Equilibrat',
    'Almuerzo Vegetariano': 'Dinar Vegetarià',
    'Cena Proteica': 'Sopar Proteic',
    'Ingredientes': 'Ingredients',
    'Beneficios para la Salud': 'Beneficis per a la Salut',
    'Seguir Receta': 'Seguir Recepta'
  };

  let categoryTranslations: Record<string, string> = {};
  let foodNameTranslations: Record<string, string> = {};
  let recipeNameTranslations: Record<string, string> = {};
  
  // Seleccionar los mapas de traducción según el idioma
  switch(language) {
    case 'en':
      categoryTranslations = esEnCategoryTranslations;
      foodNameTranslations = esEnFoodNameTranslations;
      recipeNameTranslations = esEnRecipeNameTranslations;
      break;
    case 'ca':
      categoryTranslations = esCaCategoryTranslations;
      foodNameTranslations = esCaFoodNameTranslations;
      recipeNameTranslations = esCaRecipeNameTranslations;
      break;
    default: // 'es' - No necesitamos traducciones para el español, idioma base
      categoryTranslations = {};
      foodNameTranslations = {};
      recipeNameTranslations = {};
  }
  
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
      return (savedLanguage === 'en' || savedLanguage === 'es' || savedLanguage === 'ca') 
        ? savedLanguage as Language 
        : 'es'; // Español como idioma predeterminado si no hay uno guardado
    } catch {
      return 'es'; // Por defecto español si hay algún error
    }
  };

  // Estado para el idioma actual
  const [language, setLanguage] = useState<Language>(getSavedLanguage());
  // Estado para las traducciones según el idioma
  const getTranslations = (lang: Language): Translation => {
    switch (lang) {
      case 'en': return en;
      case 'ca': return ca;
      default: return es; // 'es' como idioma por defecto
    }
  };

  const [translations, setTranslations] = useState<Translation>(getTranslations(language));

  // Función para cambiar el idioma
  const changeLanguage = (lang: Language) => {
    try {
      // Guardar preferencia en localStorage
      localStorage.setItem('language', lang);
      
      // Actualizar estados
      setLanguage(lang);
      setTranslations(getTranslations(lang));
      
      // Forzar una actualización completa
      window.location.reload();
      
    } catch (error) {
      console.error("Error cambiando el idioma:", error);
    }
  };

  // Actualizar traducciones cuando cambia el idioma
  useEffect(() => {
    setTranslations(getTranslations(language));
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