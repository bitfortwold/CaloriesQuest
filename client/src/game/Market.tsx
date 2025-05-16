import { useState } from "react";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { foodItems } from "../data/foodItems";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useFoodStore } from "../stores/useFoodStore";
import { toast } from "sonner";

interface MarketProps {
  onExit: () => void;
}

const Market = ({ onExit }: MarketProps) => {
  const { playerData, addFood, updateCoins } = usePlayerStore();
  const { purchasedFood, addPurchasedFood } = useFoodStore();
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Filter food items by category
  const filteredFoodItems = selectedCategory === "all" 
    ? foodItems 
    : foodItems.filter(item => item.category === selectedCategory);
  
  // Get all categories
  const categories = ["all", ...Array.from(new Set(foodItems.map(item => item.category)))];
  
  // Handle food purchase
  const handlePurchase = (foodItem: typeof foodItems[0]) => {
    // Check if player has enough coins
    if ((playerData?.coins || 0) < foodItem.price) {
      toast.error("Not enough iHumancoins!");
      return;
    }
    
    // Update player coins
    updateCoins(-(foodItem.price));
    
    // Add food to inventory
    addPurchasedFood(foodItem);
    addFood(foodItem);
    
    // Show success message
    toast.success(`Purchased ${foodItem.name}`);
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-gradient-to-b from-amber-50 to-amber-100 rounded-lg shadow-xl border-4 border-amber-800">
        {/* Header con estilo de madera */}
        <div className="bg-amber-800 text-amber-50 p-3 rounded-t-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+CjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB4PSIxNSIgeT0iMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSIjZjNmNGY2Ij48L3JlY3Q+CjxyZWN0IHg9IjAiIHk9IjE1IiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9IiNmM2Y0ZjYiPjwvcmVjdD4KPC9zdmc+')]"></div>
          <h1 className="text-4xl font-bold text-center text-amber-50 mb-2 drop-shadow-md tracking-wide">MARKET</h1>
          
          <div className="flex justify-between items-center">
            <div className="bg-amber-700 px-4 py-2 rounded-lg text-amber-50 border-2 border-amber-600 shadow-inner">
              <span className="font-semibold">iHumancoins: </span>
              <span className="text-yellow-300 font-bold text-xl ml-1">{playerData?.coins?.toFixed(0) || 0}</span>
            </div>
            <button
              onClick={() => {
                console.log("Exiting market");
                onExit(); // Llamar explícitamente a la función onExit proporcionada por las props
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg border-2 border-red-500 shadow-md transition-all hover:scale-105"
            >
              Exit
            </button>
          </div>
        </div>
        
        {/* Tabs de categoría con estilo de pestañas */}
        <div className="bg-amber-200 px-2 pt-2 flex space-x-1 overflow-x-auto border-b-2 border-amber-700">
          {categories.map(category => (
            <button 
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`capitalize font-bold py-2 px-4 rounded-t-lg transition-all hover:brightness-110 ${
                selectedCategory === category 
                  ? 'bg-amber-50 text-amber-900 border-2 border-b-0 border-amber-700 shadow-inner-top' 
                  : 'bg-amber-300 text-amber-700 border border-amber-400 opacity-80 hover:opacity-100'
              }`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
        
        <div className="p-4">
          {/* Cuadrícula de comida con estilo de tarjetas de juego */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredFoodItems.map((food) => (
              <div 
                key={food.id} 
                className="bg-amber-50 rounded-lg shadow-md border-2 border-amber-300 overflow-hidden hover:border-amber-500 transition-all hover:shadow-lg"
              >
                {/* Cabecera del item */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-3 flex justify-between items-center border-b-2 border-amber-400">
                  <h3 className="text-lg font-bold text-white truncate">{food.name}</h3>
                  <span className="font-bold text-yellow-100 bg-amber-700 px-2 py-1 rounded-full text-sm border border-amber-800">
                    {food.price} IHC
                  </span>
                </div>
                
                <div className="p-3">
                  {/* Contenido visual, simulando imagen */}
                  <div className="flex gap-6 mb-3">
                    {/* Columna izquierda */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center">
                        <span className="w-24 text-xs text-amber-800">Calories:</span>
                        <span className="font-bold text-amber-900">{food.calories} kcal</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-24 text-xs text-amber-800">Carbs:</span>
                        <span className="font-bold text-amber-900">{food.nutritionalValue.carbs}g</span>
                      </div>
                    </div>
                    
                    {/* Columna derecha */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center">
                        <span className="w-24 text-xs text-amber-800">Protein:</span>
                        <span className="font-bold text-amber-900">{food.nutritionalValue.protein}g</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-24 text-xs text-amber-800">Fat:</span>
                        <span className="font-bold text-amber-900">{food.nutritionalValue.fat}g</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Barra de sostenibilidad */}
                  <div className="mb-3">
                    <div className="text-xs text-amber-800 mb-1">Sustainability:</div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 flex-1 bg-amber-200 rounded-full border border-amber-300 overflow-hidden">
                        <div 
                          className={`h-full ${
                            food.sustainabilityScore > 7 
                              ? 'bg-gradient-to-r from-green-400 to-green-600' 
                              : food.sustainabilityScore > 4 
                              ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
                              : 'bg-gradient-to-r from-red-400 to-red-600'
                          }`}
                          style={{ width: `${food.sustainabilityScore * 10}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold">{food.sustainabilityScore}/10</span>
                    </div>
                  </div>
                  
                  {/* Descripción */}
                  <p className="text-xs text-amber-700 mb-3 h-12 overflow-hidden">{food.description}</p>
                  
                  {/* Botón de compra */}
                  <button 
                    onClick={() => handlePurchase(food)}
                    disabled={(playerData?.coins || 0) < food.price}
                    className={`w-full py-2 rounded-lg font-bold text-center transition-all ${
                      (playerData?.coins || 0) >= food.price
                        ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-white border-2 border-amber-400 hover:from-amber-600 hover:to-amber-700 hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed border-2 border-gray-400'
                    }`}
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carrito de compra - opcional, se puede añadir más tarde */}
      </div>
    </div>
  );
};

export default Market;
