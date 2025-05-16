import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFoodStore, StorageType, StoredFoodItem } from "../stores/useFoodStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface KitchenProps {
  onExit: () => void;
}

const Kitchen = ({ onExit }: KitchenProps) => {
  const { purchasedFood, removePurchasedFood, refrigeratorFood, pantryFood, removeFromKitchen } = useFoodStore();
  const { playerData, consumeFood, calculateEstimatedLifespan } = usePlayerStore();
  
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
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex justify-between items-center">
            <span>Kitchen</span>
            <div>
              <span className="text-lg mr-3">
                Calories: {playerData?.caloriesConsumed?.toFixed(0) || 0} / {playerData?.dailyCalories?.toFixed(0) || 0}
              </span>
              <Button variant="outline" onClick={onExit}>Exit</Button>
            </div>
          </CardTitle>
          <CardDescription>
            Cook meals using the ingredients you purchased. Balance your nutrition for better health.
          </CardDescription>
          
          {/* Cooking modes */}
          <div className="flex space-x-2 overflow-x-auto pb-2 mt-2">
            <Button 
              variant={cookingMode === "guided" ? "default" : "outline"}
              onClick={() => setCookingMode("guided")}
            >
              Guided Recipes
            </Button>
            <Button 
              variant={cookingMode === "free" ? "default" : "outline"}
              onClick={() => setCookingMode("free")}
            >
              Free Cooking
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {cookingMode === "free" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left side - Available ingredients with tabs for Refrigerator and Pantry */}
              <div>
                <Tabs defaultValue="refrigerator" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="refrigerator" className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                      Refrigerator
                    </TabsTrigger>
                    <TabsTrigger value="pantry" className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Pantry
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Refrigerator Content */}
                  <TabsContent value="refrigerator" className="mt-0">
                    <h3 className="text-lg font-semibold mb-2">Refrigerated Items</h3>
                    <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
                      {refrigeratorFood.length === 0 ? (
                        <p className="text-gray-500">Your refrigerator is empty. Visit the market to buy fresh food!</p>
                      ) : (
                        refrigeratorFood.map((food) => (
                          <div 
                            key={food.id} 
                            className={`p-3 border rounded-md cursor-pointer ${
                              selectedItems.includes(food.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                            }`}
                            onClick={() => toggleItemSelection(food.id)}
                          >
                            <div className="flex justify-between">
                              <span className="font-medium">{food.name}</span>
                              <span>{food.calories} kcal</span>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Protein: {food.nutritionalValue.protein}g • Carbs: {food.nutritionalValue.carbs}g • Fat: {food.nutritionalValue.fat}g
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                  
                  {/* Pantry Content */}
                  <TabsContent value="pantry" className="mt-0">
                    <h3 className="text-lg font-semibold mb-2">Pantry Items</h3>
                    <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
                      {pantryFood.length === 0 ? (
                        <p className="text-gray-500">Your pantry is empty. Visit the market to buy non-perishables!</p>
                      ) : (
                        pantryFood.map((food) => (
                          <div 
                            key={food.id} 
                            className={`p-3 border rounded-md cursor-pointer ${
                              selectedItems.includes(food.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                            }`}
                            onClick={() => toggleItemSelection(food.id)}
                          >
                            <div className="flex justify-between">
                              <span className="font-medium">{food.name}</span>
                              <span>{food.calories} kcal</span>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Protein: {food.nutritionalValue.protein}g • Carbs: {food.nutritionalValue.carbs}g • Fat: {food.nutritionalValue.fat}g
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Right side - Meal preview */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Your Meal</h3>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium">Selected Ingredients:</h4>
                  {selectedItems.length === 0 ? (
                    <p className="text-gray-500 my-2">No ingredients selected</p>
                  ) : (
                    <ul className="my-2 space-y-1">
                      {selectedItems.map(itemId => {
                        const item = purchasedFood.find(f => f.id === itemId);
                        return item ? (
                          <li key={itemId}>{item.name}</li>
                        ) : null;
                      })}
                    </ul>
                  )}
                  
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium">Nutritional Information:</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                      <div>Total Calories: <span className="font-medium">{totals.calories.toFixed(0)} kcal</span></div>
                      <div>Protein: <span className="font-medium">{totals.protein.toFixed(1)}g</span></div>
                      <div>Carbs: <span className="font-medium">{totals.carbs.toFixed(1)}g</span></div>
                      <div>Fat: <span className="font-medium">{totals.fat.toFixed(1)}g</span></div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="text-sm flex items-center">
                        <span className="mr-2">Avg. Sustainability:</span>
                        <div className="h-2 flex-1 bg-gray-200 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${
                              selectedItems.length ? (
                                totals.sustainabilityScore / selectedItems.length > 7 
                                ? 'bg-green-500' 
                                : totals.sustainabilityScore / selectedItems.length > 4 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                              ) : 'bg-gray-300'
                            }`}
                            style={{ 
                              width: selectedItems.length 
                                ? `${(totals.sustainabilityScore / selectedItems.length) * 10}%` 
                                : '0%' 
                            }}
                          ></div>
                        </div>
                        <span className="ml-2">
                          {selectedItems.length 
                            ? (totals.sustainabilityScore / selectedItems.length).toFixed(1)
                            : 0}/10
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      className="w-full" 
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
            // Guided recipes mode
            <div className="grid grid-cols-1 gap-4">
              {recipes.map((recipe, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{recipe.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{recipe.description}</p>
                    
                    <div className="mt-3">
                      <h4 className="font-medium text-sm">Ingredients:</h4>
                      <ul className="list-disc list-inside text-sm mt-1">
                        {recipe.ingredients.map((ingredient, idx) => (
                          <li key={idx} className="capitalize">{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="font-medium text-sm">Health Benefits:</h4>
                      <p className="text-sm mt-1">{recipe.benefits}</p>
                    </div>
                    
                    <div className="mt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Logic to auto-select ingredients would go here
                          toast.info("Follow this recipe by selecting the ingredients in Free Cooking mode!");
                        }}
                      >
                        Follow Recipe
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              <div className="bg-blue-50 p-4 rounded-md mt-2">
                <h3 className="font-medium">Nutrition Tips:</h3>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>Aim for a balanced mix of proteins, carbs, and healthy fats</li>
                  <li>Include plenty of fruits and vegetables for essential vitamins</li>
                  <li>Choose foods with higher sustainability scores to help the environment</li>
                  <li>Pay attention to your daily calorie needs based on your activity level</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Kitchen;
