import React from 'react';
import { getRecipes } from './RecipesData';

interface GuidedRecipesProps {
  language: string;
}

const GuidedRecipes: React.FC<GuidedRecipesProps> = ({ language }) => {
  // Obtener todas las recetas
  const allRecipes = getRecipes(language);
  
  // Filtrar por categoría
  const breakfastRecipes = allRecipes.filter(recipe => recipe.category === 'breakfast');
  const mainRecipes = allRecipes.filter(recipe => recipe.category === 'main');
  const specialRecipes = allRecipes.filter(recipe => recipe.category === 'special');

  // Función para renderizar cada receta simple
  const renderSimpleRecipe = (recipe: any) => (
    <div key={recipe.id} className="bg-white rounded-xl overflow-hidden border-2 border-amber-200 shadow-md">
      <div className="bg-amber-500 p-3">
        <h4 className="text-white font-bold">{recipe.name}</h4>
        <p className="text-white text-sm">{recipe.description}</p>
      </div>
      <div className="p-3">
        <div className="flex flex-wrap gap-1 mb-2">
          {recipe.ingredients.slice(0, 4).map((ingredient: string, idx: number) => (
            <span key={idx} className="bg-amber-100 text-amber-800 px-2 py-1 text-xs rounded-lg">
              {ingredient}
            </span>
          ))}
        </div>
        <div className="flex justify-between text-xs text-amber-800">
          <span>{recipe.nutritionalInfo.calories} kcal</span>
          <span>{recipe.nutritionalInfo.protein}g {language === 'en' ? 'protein' : language === 'ca' ? 'proteïna' : 'proteína'}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-4 px-2">
      <h2 className="text-2xl font-bold text-center text-amber-800 mb-2">
        {language === 'en' ? 'Guided Recipes' : language === 'ca' ? 'Receptes Guiades' : 'Recetas Guiadas'}
      </h2>
      <p className="text-amber-800 text-center mb-4">
        {language === 'en' 
          ? 'Follow step-by-step instructions to create delicious and nutritious meals!' 
          : language === 'ca' 
          ? 'Segueix les instruccions pas a pas per crear àpats deliciosos i nutritius!' 
          : '¡Sigue las instrucciones paso a paso para crear comidas deliciosas y nutritivas!'}
      </p>
      
      {/* RECETAS DE DESAYUNO */}
      <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-500 shadow-md mb-6">
        <h3 className="text-xl font-bold text-amber-800 mb-3 border-b border-amber-300 pb-2">
          {language === 'en' ? 'Breakfast Recipes' : language === 'ca' ? 'Receptes d\'Esmorzar' : 'Recetas de Desayuno'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {breakfastRecipes.map(recipe => renderSimpleRecipe(recipe))}
        </div>
      </div>
      
      {/* RECETAS PRINCIPALES */}
      <div className="bg-green-50 p-4 rounded-xl border-2 border-green-500 shadow-md mb-6">
        <h3 className="text-xl font-bold text-green-800 mb-3 border-b border-green-300 pb-2">
          {language === 'en' ? 'Main Course Recipes' : language === 'ca' ? 'Receptes de Plat Principal' : 'Recetas de Plato Principal'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mainRecipes.map(recipe => (
            <div key={recipe.id} className="bg-white rounded-xl overflow-hidden border-2 border-green-200 shadow-md">
              <div className="bg-green-600 p-3">
                <h4 className="text-white font-bold">{recipe.name}</h4>
                <p className="text-white text-sm">{recipe.description}</p>
              </div>
              <div className="p-3">
                <div className="flex flex-wrap gap-1 mb-2">
                  {recipe.ingredients.slice(0, 4).map((ingredient: string, idx: number) => (
                    <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-lg">
                      {ingredient}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-green-800">
                  <span>{recipe.nutritionalInfo.calories} kcal</span>
                  <span>{recipe.nutritionalInfo.protein}g {language === 'en' ? 'protein' : language === 'ca' ? 'proteïna' : 'proteína'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* RECETAS ESPECIALES */}
      <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-500 shadow-md mb-6">
        <h3 className="text-xl font-bold text-blue-800 mb-3 border-b border-blue-300 pb-2">
          {language === 'en' ? 'Special Recipes' : language === 'ca' ? 'Receptes Especials' : 'Recetas Especiales'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {specialRecipes.map(recipe => (
            <div key={recipe.id} className="bg-white rounded-xl overflow-hidden border-2 border-blue-200 shadow-md">
              <div className="bg-blue-600 p-3">
                <h4 className="text-white font-bold">{recipe.name}</h4>
                <p className="text-white text-sm">{recipe.description}</p>
              </div>
              <div className="p-3">
                <div className="flex flex-wrap gap-1 mb-2">
                  {recipe.ingredients.slice(0, 4).map((ingredient: string, idx: number) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-lg">
                      {ingredient}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-blue-800">
                  <span>{recipe.nutritionalInfo.calories} kcal</span>
                  <span>{recipe.nutritionalInfo.protein}g {language === 'en' ? 'protein' : language === 'ca' ? 'proteïna' : 'proteína'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuidedRecipes;