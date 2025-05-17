import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFoodStore, StorageType, StoredFoodItem } from "../stores/useFoodStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useLanguage } from "../i18n/LanguageContext";
import { toast } from "sonner";

interface KitchenProps {
  onExit: () => void;
}

const Kitchen = ({ onExit }: KitchenProps) => {
  const { purchasedFood, removePurchasedFood, refrigeratorFood, pantryFood, removeFromKitchen } = useFoodStore();
  const { playerData, consumeFood, calculateEstimatedLifespan } = usePlayerStore();
  const { t, language } = useLanguage(); // Hook para acceder a las traducciones y el idioma actual
  
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [cookingMode, setCookingMode] = useState<"guided" | "free">("guided");
  
  // Diccionarios de traducciones para la cocina - Definidos fuera de la función para acceso global
  const kitchenTranslationsEN: Record<string, Record<string, string>> = {
    // Ingredientes
    'ingredients': {
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
    // Etiquetas nutricionales
    'labels': {
      'Proteínas': 'Proteins',
      'Carbos': 'Carbs',
      'Grasas': 'Fats',
      'Tu Comida': 'Your Meal',
      'Ingredientes Seleccionados': 'Selected Ingredients',
      'kcal': 'kcal',
      'g': 'g'
    },
    // Mensajes
    'messages': {
      '¡Selecciona ingredientes del refrigerador o la despensa para comenzar a cocinar!': 'Select ingredients from the refrigerator or pantry to start cooking!',
      'Tu despensa está vacía. ¡Visita el mercado para comprar alimentos no perecederos!': 'Your pantry is empty. Visit the market to buy non-perishable food!',
      'Tu refrigerador está vacío. ¡Visita el mercado para comprar alimentos frescos!': 'Your refrigerator is empty. Visit the market to buy fresh food!',
      '¡Comida cocinada y consumida!': 'Food cooked and consumed!',
      '¡Selecciona al menos un ingrediente!': 'Select at least one ingredient!'
    }
  };
  
  const kitchenTranslationsCA: Record<string, Record<string, string>> = {
    // Ingredientes
    'ingredients': {
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
    },
    // Etiquetas nutricionales
    'labels': {
      'Proteínas': 'Proteïnes',
      'Carbos': 'Carbohidrats',
      'Grasas': 'Greixos',
      'Tu Comida': 'El teu Àpat',
      'Ingredientes Seleccionados': 'Ingredients Seleccionats',
      'kcal': 'kcal',
      'g': 'g'
    },
    // Mensajes
    'messages': {
      '¡Selecciona ingredientes del refrigerador o la despensa para comenzar a cocinar!': 'Selecciona ingredients de la nevera o el rebost per començar a cuinar!',
      'Tu despensa está vacía. ¡Visita el mercado para comprar alimentos no perecederos!': 'El teu rebost està buit. Visita el mercat per comprar aliments no peribles!',
      'Tu refrigerador está vacío. ¡Visita el mercado para comprar alimentos frescos!': 'La teva nevera està buida. Visita el mercat per comprar aliments frescos!',
      '¡Comida cocinada y consumida!': 'Menjar cuinat i consumit!',
      '¡Selecciona al menos un ingrediente!': 'Selecciona almenys un ingredient!'
    }
  };
  
  // Función para traducir nombres de alimentos según el idioma actual
  const translateFoodName = (foodName: string): string => {
    if (language === 'es') return foodName; // Mantener el texto original en español
    if (language === 'ca') return kitchenTranslationsCA.ingredients[foodName] || foodName;
    if (language === 'en') return kitchenTranslationsEN.ingredients[foodName] || foodName;
    return foodName;
  };
  
  // Función para traducir etiquetas según el idioma actual
  const translateLabel = (label: string): string => {
    if (language === 'es') return label; // Mantener el texto original en español
    if (language === 'ca') return kitchenTranslationsCA.labels[label] || label;
    if (language === 'en') return kitchenTranslationsEN.labels[label] || label;
    return label;
  };
  
  // Calculate nutritional totals for the selected items
  const calculateTotals = () => {
    return selectedItems.reduce((totals, itemId) => {
      // Buscar el alimento en las diferentes ubicaciones
      const refrigeratorItem = refrigeratorFood.find(f => f.id === itemId);
      const pantryItem = pantryFood.find(f => f.id === itemId);
      const marketItem = purchasedFood.find(f => f.id === itemId);
      
      // Usar el alimento que se encontró
      const item = refrigeratorItem || pantryItem || marketItem;
      
      if (!item) return totals;
      
      return {
        calories: totals.calories + item.calories,
        protein: totals.protein + item.nutritionalValue.protein,
        carbs: totals.carbs + item.nutritionalValue.carbs,
        fat: totals.fat + item.nutritionalValue.fat,
        sustainabilityScore: totals.sustainabilityScore + item.sustainabilityScore
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, sustainabilityScore: 0 });
  };
  
  // Toggle item selection (ahora trabajando con alimentos de la nevera y despensa)
  const toggleItemSelection = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };
  
  // Cook and consume the meal
  const cookMeal = () => {
    if (selectedItems.length === 0) {
      toast.error(language === 'en' ? "Select at least one ingredient!" : 
                 language === 'ca' ? "Selecciona almenys un ingredient!" : 
                 "¡Selecciona al menos un ingrediente!");
      return;
    }
    
    // Calculate meal totals
    const totals = calculateTotals();
    
    // Consume the food (adds to calories consumed)
    consumeFood(totals.calories);
    
    // Identify where each food item comes from (refrigerator or pantry)
    selectedItems.forEach(itemId => {
      // Buscar en refrigerador
      const refrigeratorItem = refrigeratorFood.find(food => food.id === itemId);
      if (refrigeratorItem) {
        removeFromKitchen(itemId, "refrigerator");
        return;
      }
      
      // Buscar en despensa
      const pantryItem = pantryFood.find(food => food.id === itemId);
      if (pantryItem) {
        removeFromKitchen(itemId, "pantry");
        return;
      }
      
      // Si no está en ninguno de los dos, usar el método antiguo
      // (este caso solo ocurriría si hay alimentos que aún no se han transferido)
      removePurchasedFood(itemId);
    });
    
    // Reset selection
    setSelectedItems([]);
    
    // Calculate new estimated lifespan
    calculateEstimatedLifespan();
    
    // Show success message
    toast.success(language === 'en' ? "Food cooked and consumed!" : language === 'ca' ? "Menjar cuinat i consumit!" : "¡Comida cocinada y consumida!");
  };
  
  // Get predefined recipes for guided mode
  const getGuidedRecipes = () => {
    // Define recipe types
    interface Recipe {
      name: string;
      description: string;
      ingredients: string[];
      benefits: string;
    }
    
    // Obtener las recetas según el idioma
    const recipes: Recipe[] = language === 'en' ? 
      // Recetas en inglés
      [
        {
          name: "Balanced Breakfast",
          description: "A nutritious breakfast with eggs, bread and fruit",
          ingredients: ["huevos", "pan", "manzana"],
          benefits: "High in protein and complex carbohydrates for sustained energy"
        },
        {
          name: "Vegetarian Lunch",
          description: "A plant-based lunch with beans, rice and vegetables",
          ingredients: ["frijoles", "arroz", "brócoli", "zanahoria"],
          benefits: "Rich in fiber and provides essential vitamins and minerals"
        },
        {
          name: "Protein Dinner",
          description: "A protein-rich dinner with chicken, potatoes and vegetables",
          ingredients: ["pollo", "patata", "espinaca"],
          benefits: "Supports muscle recovery and overall health"
        }
      ] 
      : language === 'ca' ?
      // Recetas en catalán
      [
        {
          name: "Esmorzar Equilibrat",
          description: "Un esmorzar nutritiu amb ous, pa i fruita",
          ingredients: ["ous", "pa", "poma"],
          benefits: "Alt en proteïnes i carbohidrats complexos per a energia sostinguda"
        },
        {
          name: "Dinar Vegetarià",
          description: "Un dinar a base de plantes amb mongetes, arròs i verdures",
          ingredients: ["mongetes", "arròs", "bròquil", "pastanaga"],
          benefits: "Ric en fibra i proporciona vitamines i minerals essencials"
        },
        {
          name: "Sopar Proteic",
          description: "Un sopar ric en proteïnes amb pollastre, patates i verdures",
          ingredients: ["pollastre", "patata", "espinacs"],
          benefits: "Ajuda a la recuperació muscular i la salut en general"
        }
      ]
      : 
      // Recetas en español (por defecto)
      [
        {
          name: "Desayuno Equilibrado",
          description: "Un desayuno nutritivo con huevos, pan y fruta",
          ingredients: ["huevos", "pan", "manzana"],
          benefits: "Alto en proteínas y carbohidratos complejos para energía sostenida"
        },
        {
          name: "Almuerzo Vegetariano",
          description: "Un almuerzo a base de plantas con frijoles, arroz y verduras",
          ingredients: ["frijoles", "arroz", "brócoli", "zanahoria"],
          benefits: "Rico en fibra y proporciona vitaminas y minerales esenciales"
        },
        {
          name: "Cena Proteica",
          description: "Una cena rica en proteínas con pollo, patatas y verduras",
          ingredients: ["pollo", "patata", "espinaca"],
          benefits: "Apoya la recuperación muscular y la salud en general"
        }
      ];
      
    // For debugging
    console.log("Current language:", language);
    console.log("First recipe name:", recipes[0].name);
    
    return recipes;
  };
  
  const totals = calculateTotals();
  const recipes = getGuidedRecipes();
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-gradient-to-b from-amber-50 to-amber-100 rounded-lg shadow-xl border-4 border-amber-800">
        {/* Header con estilo de madera - similar al del mercado */}
        <div className="bg-amber-800 text-amber-50 p-3 rounded-t-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+CjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB4PSIxNSIgeT0iMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSIjZjNmNGY2Ij48L3JlY3Q+CjxyZWN0IHg9IjAiIHk9IjE1IiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9IiNmM2Y0ZjYiPjwvcmVjdD4KPC9zdmc+')]"></div>
          <div className="mb-2">
            <h1 className="text-4xl font-bold text-amber-50 drop-shadow-md tracking-wide text-center">{t.kitchen}</h1>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="bg-amber-700 px-4 py-2 rounded-lg text-amber-50 border-2 border-amber-600 shadow-inner">
              <span className="font-semibold">{t.calories}: </span>
              <span className="text-yellow-300 font-bold text-xl ml-1">
                {playerData?.caloriesConsumed?.toFixed(0) || 0} / {playerData?.dailyCalories?.toFixed(0) || 0}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setCookingMode("guided")}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  cookingMode === "guided" 
                    ? 'bg-amber-600 hover:bg-amber-700 text-white border-2 border-amber-500' 
                    : 'bg-amber-300 hover:bg-amber-400 text-amber-800 border border-amber-400'
                }`}
              >
                {t.guidedRecipes}
              </Button>
              <Button 
                onClick={() => setCookingMode("free")}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  cookingMode === "free" 
                    ? 'bg-amber-600 hover:bg-amber-700 text-white border-2 border-amber-500' 
                    : 'bg-amber-300 hover:bg-amber-400 text-amber-800 border border-amber-400'
                }`}
              >
                {t.freeCooking}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          {cookingMode === "free" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left side - Available ingredients with tabs for Refrigerator and Pantry */}
              <div>
                <Tabs defaultValue="refrigerator" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-4 bg-amber-200 px-2 pt-2 flex space-x-1 overflow-x-auto border-b-2 border-amber-700">
                    <TabsTrigger 
                      value="refrigerator" 
                      className="capitalize font-bold py-2 px-4 rounded-t-lg transition-all hover:brightness-110 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-900 data-[state=active]:border-2 data-[state=active]:border-b-0 data-[state=active]:border-amber-700 data-[state=inactive]:bg-amber-300 data-[state=inactive]:text-amber-700 data-[state=inactive]:border data-[state=inactive]:border-amber-400 data-[state=inactive]:opacity-80 data-[state=inactive]:hover:opacity-100"
                    >
                      {t.refrigerator}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="pantry" 
                      className="capitalize font-bold py-2 px-4 rounded-t-lg transition-all hover:brightness-110 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-900 data-[state=active]:border-2 data-[state=active]:border-b-0 data-[state=active]:border-amber-700 data-[state=inactive]:bg-amber-300 data-[state=inactive]:text-amber-700 data-[state=inactive]:border data-[state=inactive]:border-amber-400 data-[state=inactive]:opacity-80 data-[state=inactive]:hover:opacity-100"
                    >
                      {t.pantry}
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Refrigerator Content */}
                  <TabsContent value="refrigerator" className="mt-0">
                    <h3 className="text-lg font-semibold mb-2 text-amber-800">{t.refrigeratedItems}</h3>
                    <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
                      {refrigeratorFood.length === 0 ? (
                        <p className="text-amber-500 py-6 text-center col-span-2 bg-amber-50 rounded-md border border-amber-200">
                          {language === 'en' ? 
                            "Your refrigerator is empty. Visit the market to buy fresh food!" : 
                            language === 'ca' ? 
                            "La teva nevera està buida. Visita el mercat per comprar aliments frescos!" :
                            "Tu refrigerador está vacío. ¡Visita el mercado para comprar alimentos frescos!"}
                        </p>
                      ) : (
                        refrigeratorFood.map((food) => (
                          <div 
                            key={food.id} 
                            className={`p-3 bg-amber-50 rounded-lg cursor-pointer border-2 transition-all hover:shadow-md ${
                              selectedItems.includes(food.id) 
                                ? 'border-green-500 bg-green-50 shadow' 
                                : 'border-amber-200 hover:border-amber-300'
                            }`}
                            onClick={() => toggleItemSelection(food.id)}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-amber-800">{translateFoodName(food.name)}</span>
                              <span className="bg-amber-200 px-2 py-1 rounded-full text-xs font-semibold text-amber-800">
                                {food.calories} kcal
                              </span>
                            </div>
                            <div className="text-xs text-amber-600 mt-2 grid grid-cols-3 gap-1">
                              <div>
                                <span className="font-semibold">{language === 'en' ? 'Protein:' : language === 'ca' ? 'Proteïnes:' : 'Proteínas:'}</span> {food.nutritionalValue.protein}g
                              </div>
                              <div>
                                <span className="font-semibold">{language === 'en' ? 'Carbs:' : language === 'ca' ? 'Carbohidrats:' : 'Carbos:'}</span> {food.nutritionalValue.carbs}g
                              </div>
                              <div>
                                <span className="font-semibold">{language === 'en' ? 'Fat:' : language === 'ca' ? 'Greixos:' : 'Grasas:'}</span> {food.nutritionalValue.fat}g
                              </div>
                            </div>
                            {selectedItems.includes(food.id) && (
                              <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                ✓
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                  
                  {/* Pantry Content */}
                  <TabsContent value="pantry" className="mt-0">
                    <h3 className="text-lg font-semibold mb-2 text-amber-800">{t.pantryItems}</h3>
                    <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
                      {pantryFood.length === 0 ? (
                        <p className="text-amber-500 py-6 text-center col-span-2 bg-amber-50 rounded-md border border-amber-200">
                          {language === 'en' 
                            ? "Your pantry is empty. Visit the market to buy non-perishable food!" 
                            : language === 'ca'
                            ? "El teu rebost està buit. Visita el mercat per comprar aliments no peribles!"
                            : "Tu despensa está vacía. ¡Visita el mercado para comprar alimentos no perecederos!"}
                        </p>
                      ) : (
                        pantryFood.map((food) => (
                          <div 
                            key={food.id} 
                            className={`p-3 bg-amber-50 rounded-lg cursor-pointer border-2 transition-all hover:shadow-md ${
                              selectedItems.includes(food.id) 
                                ? 'border-green-500 bg-green-50 shadow' 
                                : 'border-amber-200 hover:border-amber-300'
                            }`}
                            onClick={() => toggleItemSelection(food.id)}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-amber-800">{translateFoodName(food.name)}</span>
                              <span className="bg-amber-200 px-2 py-1 rounded-full text-xs font-semibold text-amber-800">
                                {food.calories} kcal
                              </span>
                            </div>
                            <div className="text-xs text-amber-600 mt-2 grid grid-cols-3 gap-1">
                              <div>
                                <span className="font-semibold">{language === 'en' ? 'Protein:' : language === 'ca' ? 'Proteïnes:' : 'Proteínas:'}</span> {food.nutritionalValue.protein}g
                              </div>
                              <div>
                                <span className="font-semibold">{language === 'en' ? 'Carbs:' : language === 'ca' ? 'Carbohidrats:' : 'Carbos:'}</span> {food.nutritionalValue.carbs}g
                              </div>
                              <div>
                                <span className="font-semibold">{language === 'en' ? 'Fat:' : language === 'ca' ? 'Greixos:' : 'Grasas:'}</span> {food.nutritionalValue.fat}g
                              </div>
                            </div>
                            {selectedItems.includes(food.id) && (
                              <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                ✓
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Right side - Meal preview */}
              <div>
                <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 shadow-md">
                  <h3 className="text-xl font-bold text-amber-800 mb-4 pb-2 border-b border-amber-200">{language === 'en' ? 'Your Meal' : language === 'ca' ? 'El teu Àpat' : 'Tu Comida'}</h3>
                  
                  <h4 className="font-semibold text-amber-700">{language === 'en' ? 'Selected Ingredients:' : language === 'ca' ? 'Ingredients Seleccionats:' : 'Ingredientes Seleccionados:'}</h4>
                  {selectedItems.length === 0 ? (
                    <p className="text-amber-500 my-3 p-3 bg-amber-50 border border-amber-200 rounded-md text-center">
                      {language === 'en' ? 'Select ingredients from the refrigerator or pantry to start cooking!' : language === 'ca' ? 'Selecciona ingredients de la nevera o el rebost per començar a cuinar!' : '¡Selecciona ingredientes del refrigerador o la despensa para comenzar a cocinar!'}
                    </p>
                  ) : (
                    <div className="my-3 grid grid-cols-3 gap-2">
                      {selectedItems.map(itemId => {
                        // Buscar en los diferentes lugares
                        const item = 
                          refrigeratorFood.find(f => f.id === itemId) || 
                          pantryFood.find(f => f.id === itemId) || 
                          purchasedFood.find(f => f.id === itemId);
                        
                        return item ? (
                          <div key={itemId} className="bg-amber-100 rounded-md p-2 text-center border border-amber-200">
                            <span className="text-sm font-medium text-amber-800">{translateFoodName(item.name)}</span>
                            <span className="block text-xs text-amber-600">{item.calories} kcal</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-amber-200">
                    <h4 className="font-semibold text-amber-700 mb-2">{language === 'en' ? 'Nutritional Information:' : language === 'ca' ? 'Informació Nutricional:' : 'Información Nutricional:'}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-amber-100 rounded-md p-3 text-center">
                        <span className="block text-amber-800 text-lg font-bold">{totals.calories.toFixed(0)}</span>
                        <span className="text-xs text-amber-600">{language === 'en' ? 'Total Calories (kcal)' : language === 'ca' ? 'Calories Totals (kcal)' : 'Calorías Totales (kcal)'}</span>
                      </div>
                      <div className="bg-amber-100 rounded-md p-3 text-center">
                        <span className="block text-amber-800 text-lg font-bold">{totals.protein.toFixed(1)}g</span>
                        <span className="text-xs text-amber-600">{language === 'en' ? 'Protein' : language === 'ca' ? 'Proteïnes' : 'Proteínas'}</span>
                      </div>
                      <div className="bg-amber-100 rounded-md p-3 text-center">
                        <span className="block text-amber-800 text-lg font-bold">{totals.carbs.toFixed(1)}g</span>
                        <span className="text-xs text-amber-600">{language === 'en' ? 'Carbohydrates' : language === 'ca' ? 'Carbohidrats' : 'Carbohidratos'}</span>
                      </div>
                      <div className="bg-amber-100 rounded-md p-3 text-center">
                        <span className="block text-amber-800 text-lg font-bold">{totals.fat.toFixed(1)}g</span>
                        <span className="text-xs text-amber-600">{language === 'en' ? 'Fat' : language === 'ca' ? 'Greixos' : 'Grasas'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-sm flex items-center mb-1">
                        <span className="mr-2 text-amber-700 font-medium">{language === 'en' ? 'Sustainability Score:' : language === 'ca' ? 'Puntuació de Sostenibilitat:' : 'Puntuación de Sostenibilidad:'}</span>
                        <div className="h-3 flex-1 bg-amber-100 rounded-full border border-amber-200">
                          <div 
                            className={`h-full rounded-full ${
                              selectedItems.length ? (
                                totals.sustainabilityScore / selectedItems.length > 7 
                                  ? 'bg-green-500' 
                                  : totals.sustainabilityScore / selectedItems.length > 4 
                                    ? 'bg-yellow-500' 
                                    : 'bg-red-500'
                              ) : 'bg-gray-300'
                            }`}
                            style={{
                              width: `${selectedItems.length ? Math.min(100, (totals.sustainabilityScore / selectedItems.length) * 10) : 0}%`
                            }}
                          ></div>
                        </div>
                        <span className="ml-2 text-amber-800 font-bold">
                          {selectedItems.length ? (totals.sustainabilityScore / selectedItems.length).toFixed(1) : '-'}/10
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={cookMeal}
                    disabled={selectedItems.length === 0}
                    className="w-full mt-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-lg flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <span className="mr-2">🍳</span>
                    {t.cookMeal}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Recipe selection */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg shadow-md overflow-hidden">
                <div className="bg-amber-200 p-3 border-b-2 border-amber-300">
                  <h3 className="text-xl font-bold text-amber-800">{language === 'en' ? 'Guided Recipes' : language === 'ca' ? 'Receptes Guiades' : 'Recetas Guiadas'}</h3>
                </div>
                <div className="p-4 max-h-[500px] overflow-y-auto">
                  {recipes.map((recipe, index) => (
                    <Card key={index} className="mb-4 border-amber-200 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-amber-800">{recipe.name}</CardTitle>
                        <CardDescription>{recipe.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-3">
                          <h4 className="font-semibold text-amber-700 mb-2">{language === 'en' ? 'Ingredients:' : language === 'ca' ? 'Ingredients:' : 'Ingredientes:'}</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {recipe.ingredients.map((ingredient, i) => (
                              <div key={i} className="bg-amber-100 p-2 rounded-md text-center">
                                {language === 'ca' ? translateFoodName(ingredient.charAt(0).toUpperCase() + ingredient.slice(1)) : ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-amber-700 mb-1">{language === 'en' ? 'Health Benefits:' : language === 'ca' ? 'Beneficis per a la Salut:' : 'Beneficios para la Salud:'}</h4>
                          <p className="text-sm text-amber-600">{recipe.benefits}</p>
                        </div>
                        <Button 
                          className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white"
                          onClick={() => {
                            // Aquí iría la lógica para seguir la receta
                            toast.info(language === 'en' ? 'Feature coming soon!' : language === 'ca' ? 'Funcionalitat pròximament!' : '¡Funcionalidad próximamente!');
                          }}
                        >
                          {language === 'en' ? 'Follow Recipe' : language === 'ca' ? 'Seguir Recepta' : 'Seguir Receta'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* Right: Instructions and nutrition info */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 shadow-md">
                <h3 className="text-xl font-bold text-amber-800 mb-4 pb-2 border-b border-amber-200">{language === 'en' ? 'Cooking Guide' : language === 'ca' ? 'Guia de Cuina' : 'Guía de Cocina'}</h3>
                <div className="prose prose-amber max-w-none">
                  <p>{language === 'en' 
                    ? 'Select a guided recipe from the left panel to get step-by-step instructions on how to prepare the meal. Each recipe is designed to be nutritionally balanced and uses ingredients available in your refrigerator and pantry.' 
                    : language === 'ca'
                    ? 'Selecciona una recepta guiada del panell esquerre per obtenir instruccions pas a pas sobre com preparar l\'àpat. Cada recepta està dissenyada per ser nutricionalment equilibrada i utilitza ingredients disponibles a la teva nevera i rebost.'
                    : 'Selecciona una receta guiada del panel izquierdo para obtener instrucciones paso a paso sobre cómo preparar la comida. Cada receta está diseñada para ser nutricionalmente equilibrada y utiliza ingredientes disponibles en tu refrigerador y despensa.'}</p>
                  <h4>{language === 'en' ? 'Tips for Healthy Cooking:' : language === 'ca' ? 'Consells per a una Cuina Saludable:' : 'Consejos para una Cocina Saludable:'}</h4>
                  <ul>
                    <li>{language === 'en' 
                      ? 'Balance your meals with proteins, carbohydrates, and healthy fats.' 
                      : language === 'ca'
                      ? 'Equilibra els teus àpats amb proteïnes, carbohidrats i greixos saludables.'
                      : 'Equilibra tus comidas con proteínas, carbohidratos y grasas saludables.'}</li>
                    <li>{language === 'en' 
                      ? 'Include a variety of colorful vegetables for essential vitamins and minerals.' 
                      : language === 'ca'
                      ? 'Inclou una varietat de verdures colorides per obtenir vitamines i minerals essencials.'
                      : 'Incluye una variedad de verduras coloridas para obtener vitaminas y minerales esenciales.'}</li>
                    <li>{language === 'en' 
                      ? 'Pay attention to portion sizes to maintain a healthy calorie intake.' 
                      : language === 'ca'
                      ? 'Presta atenció a les mides de les porcions per mantenir una ingesta calòrica saludable.'
                      : 'Presta atención a los tamaños de las porciones para mantener una ingesta calórica saludable.'}</li>
                    <li>{language === 'en' 
                      ? 'Consider the sustainability score of your ingredients to make environmentally friendly choices.' 
                      : language === 'ca'
                      ? 'Considera la puntuació de sostenibilitat dels teus ingredients per prendre decisions respectuoses amb el medi ambient.'
                      : 'Considera la puntuación de sostenibilidad de tus ingredientes para tomar decisiones respetuosas con el medio ambiente.'}</li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-amber-200">
                  <Button 
                    onClick={() => setCookingMode("free")}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-lg flex justify-center items-center transition-all"
                  >
                    <span className="mr-2">🧪</span>
                    {language === 'en' ? 'Switch to Free Cooking Mode' : language === 'ca' ? 'Canviar a Mode de Cuina Lliure' : 'Cambiar a Modo de Cocina Libre'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Botón flotante circular para volver al mapa */}
        <Button 
          onClick={onExit}
          className="absolute top-2 right-2 w-10 h-10 rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-md flex items-center justify-center p-0 border-2 border-amber-500"
        >
          <span className="text-xl">×</span>
        </Button>
      </div>
    </div>
  );
};

export default Kitchen;