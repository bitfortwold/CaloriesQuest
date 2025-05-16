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
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex justify-between items-center">
            <span>Market</span>
            <div>
              <span className="text-lg mr-3">iHumancoins: {playerData?.coins?.toFixed(0) || 0}</span>
              <Button variant="outline" onClick={onExit}>Exit</Button>
            </div>
          </CardTitle>
          <CardDescription>
            Purchase food items with your iHumancoins. Pay attention to nutritional values and sustainability.
          </CardDescription>
          
          {/* Category tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2 mt-2">
            {categories.map(category => (
              <Button 
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFoodItems.map((food) => (
              <Card key={food.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">{food.name}</h3>
                    <span className="font-bold text-amber-600">{food.price} IHC</span>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <div>Calories: <span className="font-medium">{food.calories} kcal</span></div>
                    <div>Protein: <span className="font-medium">{food.nutritionalValue.protein}g</span></div>
                    <div>Carbs: <span className="font-medium">{food.nutritionalValue.carbs}g</span></div>
                    <div>Fat: <span className="font-medium">{food.nutritionalValue.fat}g</span></div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="text-sm flex items-center">
                      <span className="mr-2">Sustainability:</span>
                      <div className="h-2 flex-1 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${
                            food.sustainabilityScore > 7 
                              ? 'bg-green-500' 
                              : food.sustainabilityScore > 4 
                              ? 'bg-yellow-500' 
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${food.sustainabilityScore * 10}%` }}
                        ></div>
                      </div>
                      <span className="ml-2">{food.sustainabilityScore}/10</span>
                    </div>
                  </div>
                  
                  <p className="mt-2 text-sm text-gray-600">{food.description}</p>
                  
                  <div className="mt-3 flex justify-end">
                    <Button 
                      variant="default" 
                      onClick={() => handlePurchase(food)}
                      disabled={(playerData?.coins || 0) < food.price}
                    >
                      Buy
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Market;
