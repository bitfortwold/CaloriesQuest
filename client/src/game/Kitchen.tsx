import { useState, useEffect } from "react";
import { useFoodStore, StorageType, StoredFoodItem } from "../stores/useFoodStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { toast } from "sonner";

interface KitchenProps {
  onExit: () => void;
}

const Kitchen = ({ onExit }: KitchenProps) => {
  const { purchasedFood, removePurchasedFood, refrigeratorFood, pantryFood, removeFromKitchen } = useFoodStore();
  const { playerData, consumeFood, calculateEstimatedLifespan } = usePlayerStore();
  
  // Estados para cocina
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [cookingMode, setCookingMode] = useState<"guided" | "free">("guided");
  const [activeTab, setActiveTab] = useState<"pantry" | "refrigerator" | "cooking" | "free">("refrigerator");
  
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
  
  // Función para renderizar el refrigerador con estilo visual
  const renderRefrigerator = () => {
    const gridItemClass = "bg-sky-100 border-2 border-sky-300 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-sky-200 transition-all text-center relative";
    const selectedClass = "ring-4 ring-blue-500 border-blue-400 bg-sky-200";
    
    return (
      <div className="bg-white rounded-2xl p-4 shadow-lg border-4 border-sky-300 relative overflow-hidden">
        {/* Refrigerator body */}
        <div className="bg-sky-100 rounded-xl p-2 shadow-inner">
          {refrigeratorFood.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-sky-500 text-lg">Your refrigerator is empty! Visit the market to buy fresh food.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto p-2">
              {refrigeratorFood.map((food) => (
                <div 
                  key={food.id} 
                  className={`${gridItemClass} ${selectedItems.includes(food.id) ? selectedClass : ''}`}
                  onClick={() => toggleItemSelection(food.id)}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white rounded-full mx-auto mb-2 flex items-center justify-center">
                      {/* Iconos representativos según categoría */}
                      {food.category.toLowerCase().includes('fruit') && (
                        <span className="text-2xl">🍎</span>
                      )}
                      {food.category.toLowerCase().includes('vegetable') && (
                        <span className="text-2xl">🥦</span>
                      )}
                      {food.category.toLowerCase().includes('dairy') && (
                        <span className="text-2xl">🥛</span>
                      )}
                      {food.category.toLowerCase().includes('meat') && (
                        <span className="text-2xl">🥩</span>
                      )}
                      {!food.category.toLowerCase().includes('fruit') && 
                       !food.category.toLowerCase().includes('vegetable') && 
                       !food.category.toLowerCase().includes('dairy') && 
                       !food.category.toLowerCase().includes('meat') && (
                        <span className="text-2xl">🍽️</span>
                      )}
                    </div>
                    <span className="font-medium text-sm">{food.name}</span>
                    <span className="text-xs block text-sky-700">{food.calories} kcal</span>
                  </div>
                  {selectedItems.includes(food.id) && (
                    <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Refrigerator door handle */}
        <div className="absolute top-1/2 right-2 transform -translate-y-1/2 w-3 h-16 rounded-full bg-yellow-500"></div>
        
        <h2 className="text-center mt-3 text-xl font-bold text-sky-600 uppercase tracking-wider">REFRIGERATOR</h2>
      </div>
    );
  };
  
  // Función para renderizar la despensa con estilo visual
  const renderPantry = () => {
    const gridItemClass = "bg-amber-100 border-2 border-amber-300 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-amber-200 transition-all text-center relative";
    const selectedClass = "ring-4 ring-amber-500 border-amber-400 bg-amber-200";
    
    return (
      <div className="bg-white rounded-2xl p-4 shadow-lg border-4 border-amber-300 relative overflow-hidden">
        {/* Pantry shelves */}
        <div className="bg-amber-100 rounded-xl p-2 shadow-inner">
          {pantryFood.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-amber-600 text-lg">Your pantry is empty! Visit the market to buy non-perishable food.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-2">
              {pantryFood.map((food) => (
                <div 
                  key={food.id} 
                  className={`${gridItemClass} ${selectedItems.includes(food.id) ? selectedClass : ''}`}
                  onClick={() => toggleItemSelection(food.id)}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white rounded-full mx-auto mb-2 flex items-center justify-center">
                      {/* Iconos representativos según categoría */}
                      {food.category.toLowerCase().includes('grain') && (
                        <span className="text-2xl">🌾</span>
                      )}
                      {food.category.toLowerCase().includes('bread') && (
                        <span className="text-2xl">🍞</span>
                      )}
                      {food.category.toLowerCase().includes('legume') && (
                        <span className="text-2xl">🥜</span>
                      )}
                      {food.category.toLowerCase().includes('canned') && (
                        <span className="text-2xl">🥫</span>
                      )}
                      {!food.category.toLowerCase().includes('grain') && 
                       !food.category.toLowerCase().includes('bread') && 
                       !food.category.toLowerCase().includes('legume') && 
                       !food.category.toLowerCase().includes('canned') && (
                        <span className="text-2xl">📦</span>
                      )}
                    </div>
                    <span className="font-medium text-sm">{food.name}</span>
                    <span className="text-xs block text-amber-700">{food.calories} kcal</span>
                  </div>
                  {selectedItems.includes(food.id) && (
                    <div className="absolute top-1 right-1 bg-amber-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <h2 className="text-center mt-3 text-xl font-bold text-amber-600 uppercase tracking-wider">PANTRY</h2>
      </div>
    );
  };
  
  // Función para renderizar el panel de cocina con recetas
  const renderCooking = () => {
    const recipeClass = "bg-orange-100 border-2 border-orange-300 rounded-2xl p-4 shadow-lg";
    
    return (
      <div className={`${recipeClass} max-h-[400px] overflow-auto`}>
        <h2 className="text-center text-2xl font-bold text-orange-700 mb-4">Spaghetti</h2>
        
        <div className="bg-orange-50 rounded-xl p-3 mb-4">
          <img src="https://placehold.co/300x150/orange/white?text=Spaghetti" alt="Recipe" className="rounded-lg mx-auto mb-4" />
          
          <h3 className="font-bold text-orange-800 mb-2">Ingredients:</h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {["Pasta", "Tomato", "Cheese"].map((ing, i) => (
              <div key={i} className="bg-white rounded-lg p-2 text-center">
                <div className="w-8 h-8 bg-orange-200 rounded-full mx-auto mb-1 flex items-center justify-center">
                  {i === 0 && <span>🍝</span>}
                  {i === 1 && <span>🍅</span>}
                  {i === 2 && <span>🧀</span>}
                </div>
                <span className="text-sm">{ing}</span>
              </div>
            ))}
          </div>
          
          <h3 className="font-bold text-orange-800 mb-2">Steps:</h3>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li className="text-orange-700">Boil water in a large pot</li>
            <li className="text-orange-700">Cook pasta until al dente</li>
            <li className="text-orange-700">Add sauce and other ingredients</li>
          </ol>
          
          <div className="flex justify-between text-sm bg-orange-200 rounded-lg p-2">
            <div>
              <span className="block font-bold">Calories</span>
              <span>350 kcal</span>
            </div>
            <div>
              <span className="block font-bold">Protein</span>
              <span>12g</span>
            </div>
            <div>
              <span className="block font-bold">Carbs</span>
              <span>45g</span>
            </div>
            <div>
              <span className="block font-bold">Fat</span>
              <span>8g</span>
            </div>
          </div>
        </div>
        
        <button 
          className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
          onClick={() => {
            toast.info("Recipe selected! Choose your ingredients and cook.");
            setActiveTab("free");
          }}
        >
          COOK THIS RECIPE
        </button>
      </div>
    );
  };
  
  // Función para renderizar el panel de creación libre
  const renderFreeCreation = () => {
    return (
      <div className="bg-yellow-100 border-2 border-yellow-300 rounded-2xl p-4 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-yellow-700 mb-4">Free Creation</h2>
        
        <div className="bg-white rounded-xl p-4 mb-4">
          <h3 className="font-bold text-yellow-800 mb-3">Selected Ingredients:</h3>
          
          {selectedItems.length === 0 ? (
            <p className="text-gray-500 my-2 text-center">No ingredients selected</p>
          ) : (
            <div className="grid grid-cols-4 gap-2 mb-4">
              {selectedItems.map(itemId => {
                // Buscar el alimento en refrigerador, despensa o compras
                const item = 
                  refrigeratorFood.find(f => f.id === itemId) || 
                  pantryFood.find(f => f.id === itemId) || 
                  purchasedFood.find(f => f.id === itemId);
                
                return item ? (
                  <div key={itemId} className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-center">
                    <div className="w-8 h-8 bg-yellow-200 rounded-full mx-auto mb-1 flex items-center justify-center">
                      {item.category.toLowerCase().includes('fruit') && <span>🍎</span>}
                      {item.category.toLowerCase().includes('vegetable') && <span>🥦</span>}
                      {item.category.toLowerCase().includes('grain') && <span>🌾</span>}
                      {item.category.toLowerCase().includes('dairy') && <span>🥛</span>}
                      {item.category.toLowerCase().includes('meat') && <span>🥩</span>}
                      {!item.category.toLowerCase().includes('fruit') && 
                       !item.category.toLowerCase().includes('vegetable') && 
                       !item.category.toLowerCase().includes('grain') && 
                       !item.category.toLowerCase().includes('dairy') && 
                       !item.category.toLowerCase().includes('meat') && <span>🍽️</span>}
                    </div>
                    <span className="text-xs">{item.name}</span>
                  </div>
                ) : null;
              })}
            </div>
          )}
          
          <h3 className="font-bold text-yellow-800 mb-2">Nutritional Information:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-50 p-3 rounded-lg text-center">
              <span className="block text-lg text-yellow-700 font-bold">{totals.calories.toFixed(0)}</span>
              <span className="text-sm text-yellow-600">kcal</span>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg text-center">
              <span className="block text-lg text-yellow-700 font-bold">{totals.protein.toFixed(0)}g</span>
              <span className="text-sm text-yellow-600">Protein</span>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg text-center">
              <span className="block text-lg text-yellow-700 font-bold">{totals.carbs.toFixed(0)}g</span>
              <span className="text-sm text-yellow-600">Carbs</span>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg text-center">
              <span className="block text-lg text-yellow-700 font-bold">{totals.fat.toFixed(0)}g</span>
              <span className="text-sm text-yellow-600">Fat</span>
            </div>
          </div>
        </div>
        
        <button 
          className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={selectedItems.length === 0}
          onClick={cookMeal}
        >
          COOK & EAT
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-auto" style={{
      backgroundImage: "url('https://img.freepik.com/free-vector/kitchen-interior-cooking-room-with-furniture-utensil_107791-2023.jpg?w=1380&t=st=1747410129~exp=1747410729~hmac=79a7d2a1c5fe9fc60aafd5f6073afe4f60fb1dd18c13292ea02fb0c31f5e7f60')",
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}>
      <div className="w-full max-w-5xl">
        {/* Header con botón de salida */}
        <div className="flex justify-between items-center mb-4">
          <div className="bg-amber-800/90 text-white px-6 py-3 rounded-lg shadow-lg border-2 border-amber-600">
            <span className="font-semibold">Calories: </span>
            <span className="font-bold">{playerData?.caloriesConsumed?.toFixed(0) || 0} / {playerData?.dailyCalories?.toFixed(0) || 0}</span>
          </div>
          
          <div className="bg-amber-700/90 rounded-2xl p-2 px-8 shadow-xl">
            <h1 className="text-4xl font-bold text-amber-50 tracking-wider">KITCHEN</h1>
          </div>
          
          <button
            onClick={onExit}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg border-2 border-red-500 shadow-lg text-xl transition-all hover:scale-105"
          >
            EXIT
          </button>
        </div>
        
        {/* Contenido principal con pestañas */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {/* Tab buttons */}
          <div 
            className={`${activeTab === 'pantry' ? 'ring-4 ring-amber-400' : ''} cursor-pointer transition-all hover:scale-105`}
            onClick={() => setActiveTab('pantry')}
          >
            {renderPantry()}
          </div>
          
          <div 
            className={`${activeTab === 'refrigerator' ? 'ring-4 ring-sky-400' : ''} cursor-pointer transition-all hover:scale-105`}
            onClick={() => setActiveTab('refrigerator')}
          >
            {renderRefrigerator()}
          </div>
          
          <div 
            className={`${activeTab === 'cooking' ? 'ring-4 ring-orange-400' : ''} cursor-pointer transition-all hover:scale-105`}
            onClick={() => setActiveTab('cooking')}
          >
            {renderCooking()}
          </div>
          
          <div 
            className={`${activeTab === 'free' ? 'ring-4 ring-yellow-400' : ''} cursor-pointer transition-all hover:scale-105`}
            onClick={() => setActiveTab('free')}
          >
            {renderFreeCreation()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kitchen;
