// Función auxiliar para traducir nombres de alimentos según el idioma seleccionado
export function translateFoodName(foodName: string, language: string): string {
  // Si el idioma es español, mantener el nombre original
  if (language === 'es') return foodName;
  
  // Mapas de traducciones para idiomas
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
  
  return foodTranslations[language]?.[foodName] || foodName;
}