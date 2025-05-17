import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface TranslatedFoodNameProps {
  foodName: string;
  className?: string;
}

const TranslatedFoodName: React.FC<TranslatedFoodNameProps> = ({ foodName, className = '' }) => {
  const { language } = useLanguage();
  
  // Diccionarios de traducción para los nombres de alimentos
  const foodTranslations: Record<string, Record<string, string>> = {
    // Español -> Inglés
    'en': {
      'Huevos': 'Eggs',
      'Pan': 'Bread',
      'Manzana': 'Apple',
      'Frijoles': 'Beans',
      'Arroz': 'Rice',
      'Brócoli': 'Broccoli',
      'Zanahoria': 'Carrot',
      'Pollo': 'Chicken',
      'Patata': 'Potato',
      'Espinaca': 'Spinach',
      'Lechuga': 'Lettuce',
      'Tomate': 'Tomato',
      'Cebolla': 'Onion',
      'Ajo': 'Garlic',
      'Carne': 'Meat',
      'Pescado': 'Fish'
    },
    
    // Español -> Catalán
    'ca': {
      'Huevos': 'Ous',
      'Pan': 'Pa',
      'Manzana': 'Poma',
      'Frijoles': 'Mongetes',
      'Arroz': 'Arròs',
      'Brócoli': 'Bròquil',
      'Zanahoria': 'Pastanaga',
      'Pollo': 'Pollastre',
      'Patata': 'Patata',
      'Espinaca': 'Espinacs',
      'Lechuga': 'Enciam',
      'Tomate': 'Tomàquet',
      'Cebolla': 'Ceba',
      'Ajo': 'All',
      'Carne': 'Carn',
      'Pescado': 'Peix'
    }
  };
  
  // Si el idioma es español, mostrar el nombre original
  if (language === 'es') return <span className={className}>{foodName}</span>;
  
  // Obtener el nombre traducido según el idioma, o usar el original si no hay traducción
  const translatedName = foodTranslations[language]?.[foodName] || foodName;
  
  return <span className={className}>{translatedName}</span>;
};

export default TranslatedFoodName;