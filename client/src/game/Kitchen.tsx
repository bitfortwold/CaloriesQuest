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
  const { t } = useLanguage(); // Hook para acceder a las traducciones
  
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [cookingMode, setCookingMode] = useState<"guided" | "free">("guided");
  
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
      toast.error("Select at least one ingredient!");
      return;
    }
    
    // Calculate meal totals
    const totals = calculateTotals();
    
    // Consume the food (adds to calories consumed)
    consumeFood(totals.calories);
    
    // Identificar de dónde viene cada alimento (nevera o despensa)
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
    toast.success("Meal cooked and consumed!");
  };
  
  // Get predefined recipes for guided mode
  const getGuidedRecipes = () => {
    const recipes = [
      {
        name: "Balanced Breakfast",
        description: "A nutritious breakfast with eggs, bread, and fruit",
        ingredients: ["eggs", "bread", "apple"],
        benefits: "High in protein and complex carbs for sustained energy"
      },
      {
        name: "Vegetarian Lunch",
        description: "A plant-based lunch with beans, rice, and vegetables",
        ingredients: ["beans", "rice", "broccoli", "carrot"],
        benefits: "Fiber-rich and provides essential vitamins and minerals"
      },
      {
        name: "Protein Dinner",
        description: "A protein-packed dinner with chicken, potatoes, and greens",
        ingredients: ["chicken", "potato", "spinach"],
        benefits: "Supports muscle recovery and overall health"
      }
    ];
    
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
                          Your refrigerator is empty. Visit the market to buy fresh food!
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
                              <span className="font-bold text-amber-800">{food.name}</span>
                              <span className="bg-amber-200 px-2 py-1 rounded-full text-xs font-semibold text-amber-800">
                                {food.calories} kcal
                              </span>
                            </div>
                            <div className="text-xs text-amber-600 mt-2 grid grid-cols-3 gap-1">
                              <div>
                                <span className="font-semibold">Protein:</span> {food.nutritionalValue.protein}g
                              </div>
                              <div>
                                <span className="font-semibold">Carbs:</span> {food.nutritionalValue.carbs}g
                              </div>
                              <div>
                                <span className="font-semibold">Fat:</span> {food.nutritionalValue.fat}g
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
                          Your pantry is empty. Visit the market to buy non-perishable foods!
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
                              <span className="font-bold text-amber-800">{food.name}</span>
                              <span className="bg-amber-200 px-2 py-1 rounded-full text-xs font-semibold text-amber-800">
                                {food.calories} kcal
                              </span>
                            </div>
                            <div className="text-xs text-amber-600 mt-2 grid grid-cols-3 gap-1">
                              <div>
                                <span className="font-semibold">Protein:</span> {food.nutritionalValue.protein}g
                              </div>
                              <div>
                                <span className="font-semibold">Carbs:</span> {food.nutritionalValue.carbs}g
                              </div>
                              <div>
                                <span className="font-semibold">Fat:</span> {food.nutritionalValue.fat}g
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
                  <h3 className="text-xl font-bold text-amber-800 mb-4 pb-2 border-b border-amber-200">Your Meal</h3>
                  
                  <h4 className="font-semibold text-amber-700">Selected Ingredients:</h4>
                  {selectedItems.length === 0 ? (
                    <p className="text-amber-500 my-3 p-3 bg-amber-50 border border-amber-200 rounded-md text-center">
                      Select ingredients from the refrigerator or pantry to start cooking!
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
                            <span className="text-sm font-medium text-amber-800">{item.name}</span>
                            <span className="block text-xs text-amber-600">{item.calories} kcal</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-amber-200">
                    <h4 className="font-semibold text-amber-700 mb-2">Nutritional Information:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-amber-100 rounded-md p-3 text-center">
                        <span className="block text-amber-800 text-lg font-bold">{totals.calories.toFixed(0)}</span>
                        <span className="text-xs text-amber-600">Total Calories (kcal)</span>
                      </div>
                      <div className="bg-amber-100 rounded-md p-3 text-center">
                        <span className="block text-amber-800 text-lg font-bold">{totals.protein.toFixed(1)}g</span>
                        <span className="text-xs text-amber-600">Protein</span>
                      </div>
                      <div className="bg-amber-100 rounded-md p-3 text-center">
                        <span className="block text-amber-800 text-lg font-bold">{totals.carbs.toFixed(1)}g</span>
                        <span className="text-xs text-amber-600">Carbohydrates</span>
                      </div>
                      <div className="bg-amber-100 rounded-md p-3 text-center">
                        <span className="block text-amber-800 text-lg font-bold">{totals.fat.toFixed(1)}g</span>
                        <span className="text-xs text-amber-600">Fat</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-sm flex items-center mb-1">
                        <span className="mr-2 text-amber-700 font-medium">Sustainability Score:</span>
                        <div className="h-3 flex-1 bg-amber-100 rounded-full border border-amber-200">
                          <div 
                            className={`h-full rounded-full ${
                              selectedItems.length ? (
                                totals.sustainabilityScore / selectedItems.length > 7 
                                ? 'bg-gradient-to-r from-green-400 to-green-600' 
                                : totals.sustainabilityScore / selectedItems.length > 4 
                                ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
                                : 'bg-gradient-to-r from-red-400 to-red-600'
                              ) : 'bg-gray-300'
                            }`}
                            style={{ 
                              width: selectedItems.length 
                                ? `${(totals.sustainabilityScore / selectedItems.length) * 10}%` 
                                : '0%' 
                            }}
                          ></div>
                        </div>
                        <span className="ml-2 font-bold text-amber-800">
                          {selectedItems.length 
                            ? (totals.sustainabilityScore / selectedItems.length).toFixed(1)
                            : 0}/10
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      className="w-full py-3 rounded-lg font-bold text-center text-lg transition-all bg-gradient-to-b from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-2 border-green-400 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={selectedItems.length === 0}
                      onClick={cookMeal}
                    >
                      Cook & Eat
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Guided recipes mode - con estilo similar al mercado
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recipes.map((recipe, index) => (
                <div key={index} className="bg-amber-50 border-2 border-amber-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-3 flex justify-center items-center border-b-2 border-amber-400">
                    <h3 className="text-xl font-bold text-white">{recipe.name}</h3>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-amber-700 mb-4">{recipe.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-amber-800 mb-2">Ingredients:</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {recipe.ingredients.map((ingredient, idx) => (
                          <div key={idx} className="bg-amber-100 p-2 rounded-md text-center border border-amber-200">
                            <span className="text-sm capitalize">{ingredient}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-amber-800 mb-2">Health Benefits:</h4>
                      <p className="text-sm text-amber-700 p-2 bg-amber-100/50 rounded-md border border-amber-200">
                        {recipe.benefits}
                      </p>
                    </div>
                    
                    <Button 
                      className="w-full py-2 bg-gradient-to-b from-amber-500 to-amber-600 text-white border-2 border-amber-400 hover:from-amber-600 hover:to-amber-700 hover:scale-105 rounded-lg font-bold text-center transition-all"
                      onClick={() => {
                        toast.info("Follow this recipe by selecting the ingredients in Free Cooking mode!");
                        setCookingMode("free");
                      }}
                    >
                      Follow Recipe
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="col-span-full mt-4">
                <div className="bg-amber-100 border-2 border-amber-300 p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold text-amber-800 mb-3">Nutrition Tips:</h3>
                  <ul className="grid grid-cols-2 gap-3">
                    <li className="bg-amber-50 p-3 rounded-md border border-amber-200 text-amber-700">
                      Aim for a balanced mix of proteins, carbs, and healthy fats for optimal nutrition.
                    </li>
                    <li className="bg-amber-50 p-3 rounded-md border border-amber-200 text-amber-700">
                      Include plenty of fruits and vegetables to get essential vitamins and minerals.
                    </li>
                    <li className="bg-amber-50 p-3 rounded-md border border-amber-200 text-amber-700">
                      Choose foods with higher sustainability scores to support environmental health.
                    </li>
                    <li className="bg-amber-50 p-3 rounded-md border border-amber-200 text-amber-700">
                      Pay attention to your daily calorie needs based on your age, weight and activity level.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Kitchen;