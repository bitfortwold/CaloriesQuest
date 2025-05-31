import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FoodItem } from "../stores/usePlayerStore";
import { useLanguage } from "../i18n/LanguageContext";
import { toast } from "sonner";

interface DiningTabProps {
  refrigeratorFood: FoodItem[];
  pantryFood: FoodItem[];
  selectedItems: string[];
  handleSelectFoodItem: (foodId: string) => void;
  handleConsume: () => void;
  playerDailyCalories: number;
  renderFoodStorage: (type: "refrigerator" | "pantry") => React.ReactNode;
}

const DiningTab = ({
  refrigeratorFood,
  pantryFood,
  selectedItems,
  handleSelectFoodItem,
  handleConsume,
  playerDailyCalories,
  renderFoodStorage
}: DiningTabProps) => {
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <Tabs defaultValue="refrigerator" className="w-full">
          <TabsList className="w-full grid grid-cols-2 rounded-xl bg-[#EDDBAF]">
            <TabsTrigger 
              value="refrigerator"
              className="text-[#8B5E34] data-[state=active]:bg-[#F9D59C] data-[state=active]:text-[#8B5E34]"
            >
              {language === 'en' ? 'Refrigerator' : language === 'ca' ? 'Refrigerador' : 'Refrigerador'}
            </TabsTrigger>
            <TabsTrigger 
              value="pantry"
              className="text-[#8B5E34] data-[state=active]:bg-[#F9D59C] data-[state=active]:text-[#8B5E34]"
            >
              {language === 'en' ? 'Pantry' : language === 'ca' ? 'Rebost' : 'Despensa'}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="refrigerator" className="mt-3">
            {renderFoodStorage("refrigerator")}
          </TabsContent>
          <TabsContent value="pantry" className="mt-3">
            {renderFoodStorage("pantry")}
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="bg-[#FFF8E9] p-4 rounded-2xl border-4 border-[#F5D6A4] shadow-lg h-full">
        <h3 className="text-xl font-bold text-[#8B5E34] mb-3 pb-2 border-b-2 border-[#F5D6A4] flex items-center">
          <span className="mr-2 text-2xl">🍽️</span>
          {language === 'en' ? 'Ready to Eat' : language === 'ca' ? 'Llest per Menjar' : 'Listo para Comer'}
          <span className="ml-2 bg-[#F9CC6A] text-[#8B5E34] text-sm py-1 px-2 rounded-lg">
            {selectedItems.length}
          </span>
        </h3>
        
        {selectedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px]">
            <div className="bg-[#FFF8E9] p-6 rounded-xl border-2 border-[#F5D6A4] shadow-inner text-center max-w-xs">
              <div className="text-5xl mb-4">🍲</div>
              <p className="text-[#C68642] mb-2">
                {language === 'en' 
                  ? "Select foods from your refrigerator and pantry to consume." 
                  : language === 'ca'
                  ? "Selecciona aliments del teu refrigerador i rebost per consumir." 
                  : "Selecciona alimentos de tu refrigerador y despensa para consumir."}
              </p>
              <p className="text-sm text-[#C68642] italic">
                {language === 'en' 
                  ? "Consumed calories will count towards your daily intake!" 
                  : language === 'ca'
                  ? "Les calories consumides comptaran cap al teu consum diari!" 
                  : "¡Las calorías consumidas contarán hacia tu consumo diario!"}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 mt-2 mb-4 max-h-[200px] overflow-y-auto pr-2">
              {selectedItems.map(itemId => {
                const item = [...refrigeratorFood, ...pantryFood].find(food => food.id === itemId);
                if (!item) return null;
                
                return (
                  <div 
                    key={item.id} 
                    className="flex justify-between items-center bg-white p-2 rounded-lg border border-[#F5D6A4]"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-[#8B5E34]">{item.name}</div>
                      <div className="text-xs text-[#C68642]">{item.calories} kcal</div>
                    </div>
                    <Button
                      onClick={() => handleSelectFoodItem(item.id)}
                      variant="ghost"
                      className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <span className="text-lg">✕</span>
                    </Button>
                  </div>
                );
              })}
            </div>
            
            <div className="bg-[#FFFCF5] p-3 border-2 border-[#EECA81] rounded-xl mb-4">
              <h4 className="font-bold text-[#8B5E34] mb-2 flex items-center">
                <span className="mr-2">📊</span>
                {language === 'en' ? 'Nutritional Value' : language === 'ca' ? 'Valor Nutricional' : 'Valor Nutricional'}:
              </h4>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {(() => {
                  // Calcular totales nutricionales
                  let totalCalories = 0;
                  let totalProtein = 0;
                  let totalCarbs = 0;
                  let totalFat = 0;
                  
                  selectedItems.forEach(itemId => {
                    const item = [...refrigeratorFood, ...pantryFood].find(food => food.id === itemId);
                    if (item) {
                      totalCalories += item.calories;
                      totalProtein += item.nutritionalValue.protein;
                      totalCarbs += item.nutritionalValue.carbs;
                      totalFat += item.nutritionalValue.fat;
                    }
                  });
                  
                  return (
                    <>
                      <div className="bg-[#FFE0A3] text-[#8B5E34] p-2 rounded-lg text-center">
                        <div className="font-bold">{totalCalories}</div>
                        <div className="text-xs">{language === 'en' ? 'Calories' : language === 'ca' ? 'Calories' : 'Calorías'}</div>
                      </div>
                      <div className="bg-[#FFE0A3] text-[#8B5E34] p-2 rounded-lg text-center">
                        <div className="font-bold">{totalProtein}g</div>
                        <div className="text-xs">{language === 'en' ? 'Protein' : language === 'ca' ? 'Proteïna' : 'Proteína'}</div>
                      </div>
                      <div className="bg-[#FFE0A3] text-[#8B5E34] p-2 rounded-lg text-center">
                        <div className="font-bold">{totalCarbs || "~"}g</div>
                        <div className="text-xs">{language === 'en' ? 'Carbs' : language === 'ca' ? 'Carbohidrats' : 'Carbohidratos'}</div>
                      </div>
                      <div className="bg-[#FFE0A3] text-[#8B5E34] p-2 rounded-lg text-center">
                        <div className="font-bold">{totalFat || "~"}g</div>
                        <div className="text-xs">{language === 'en' ? 'Fat' : language === 'ca' ? 'Greix' : 'Grasa'}</div>
                      </div>
                    </>
                  );
                })()}
              </div>
              
              {/* Contribución a la ingesta diaria */}
              <div className="mt-3 flex items-center">
                <div className="text-xs font-bold text-[#8B5E34] mr-2">
                  {language === 'en' ? 'Daily Intake:' : language === 'ca' ? 'Ingesta Diària:' : 'Ingesta Diaria:'}
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                  {(() => {
                    // Calcular calorías totales
                    let totalCalories = 0;
                    
                    selectedItems.forEach(itemId => {
                      const item = [...refrigeratorFood, ...pantryFood].find(food => food.id === itemId);
                      if (item) {
                        totalCalories += item.calories;
                      }
                    });
                    
                    const dailyCalories = playerDailyCalories || 2500;
                    const percentage = Math.min((totalCalories / dailyCalories) * 100, 100);
                    
                    // Color basado en el porcentaje
                    let color = "bg-green-500"; // Bajo
                    
                    if (percentage > 50) {
                      color = "bg-orange-500"; // Alto
                    } else if (percentage > 25) {
                      color = "bg-yellow-500"; // Medio
                    }
                    
                    return (
                      <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                    );
                  })()}
                </div>
                <div className="ml-2 text-xs font-bold text-[#8B5E34]">
                  {(() => {
                    let totalCalories = 0;
                    selectedItems.forEach(itemId => {
                      const item = [...refrigeratorFood, ...pantryFood].find(food => food.id === itemId);
                      if (item) totalCalories += item.calories;
                    });
                    const percentage = Math.round((totalCalories / (playerDailyCalories || 2500)) * 100);
                    return `${percentage}%`;
                  })()}
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleConsume}
              className="w-full bg-gradient-to-r from-[#FF9800] to-[#F57C00] hover:brightness-110 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md border-2 border-[#E65100] flex items-center justify-center"
            >
              <span className="mr-2 text-xl">🍽️</span>
              {language === 'en' ? 'Consume Selected Foods' : language === 'ca' ? 'Consumir Aliments Seleccionats' : 'Consumir Alimentos Seleccionados'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default DiningTab;