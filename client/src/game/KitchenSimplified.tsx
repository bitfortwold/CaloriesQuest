import React, { useState, useEffect } from "react";
import { useFoodStore } from "../stores/useFoodStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useGameStateStore } from "../stores/useGameStateStore";
import { useLanguage } from "../i18n/LanguageContext";
import { toast } from "sonner";
import AlertSound from "../components/AlertSound";

interface KitchenProps {
  onExit: () => void;
}

const KitchenSimplified = ({ onExit }: KitchenProps) => {
  const [activeTab, setActiveTab] = useState('free-cooking');
  const [activeContainer, setActiveContainer] = useState('fridge');
  const [selectedFoods, setSelectedFoods] = useState<any[]>([]);
  const [cookedMeals, setCookedMeals] = useState<any[]>([]);
  const [playSound, setPlaySound] = useState(false);
  const [soundType, setSoundType] = useState<"success" | "error" | "notification">("notification");
  
  const { refrigeratorFood, pantryFood, removeFromKitchen } = useFoodStore();
  const { playerData, consumeFood } = usePlayerStore();
  const { language } = useLanguage();
  
  // Cargar alimentos de muestra
  useEffect(() => {
    if (refrigeratorFood.length === 0 && pantryFood.length === 0) {
      console.log("🥕 Cargando alimentos de muestra en la cocina");
      useFoodStore.getState().addSampleFoods();
    }
  }, [refrigeratorFood.length, pantryFood.length]);
  
  // Manejar sonidos
  const handleSoundComplete = () => {
    setPlaySound(false);
  };
  
  // Calcular totales nutricionales
  const totalNutrition = selectedFoods.reduce((acc, food) => {
    return {
      calories: acc.calories + food.calories,
      protein: acc.protein + (food.protein || 0),
      carbs: acc.carbs + (food.carbs || 0),
      fat: acc.fat + (food.fat || 0)
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  
  // Seleccionar comida
  const handleSelectFood = (food: any) => {
    setSelectedFoods([...selectedFoods, food]);
    setSoundType("notification");
    setPlaySound(true);
  };
  
  // Quitar comida seleccionada
  const handleRemoveFood = (index: number) => {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index));
  };
  
  // Limpiar selección
  const handleClearSelection = () => {
    setSelectedFoods([]);
  };
  
  // Cocinar comida
  const handleCookMeal = () => {
    if (selectedFoods.length === 0) {
      toast.error(
        language === 'en' ? "Select ingredients first!" : 
        language === 'ca' ? "Selecciona ingredients primer!" : 
        "¡Selecciona ingredientes primero!"
      );
      return;
    }
    
    const newMeal = {
      id: `meal-${Date.now()}`,
      name: language === 'en' ? "Custom Meal" : 
            language === 'ca' ? "Àpat Personalitzat" : 
            "Comida Personalizada",
      foods: [...selectedFoods],
      totalCalories: totalNutrition.calories,
      timestamp: new Date()
    };
    
    setCookedMeals([newMeal, ...cookedMeals]);
    
    selectedFoods.forEach(food => {
      removeFromKitchen(food.id);
    });
    
    toast.success(
      language === 'en' ? "Meal cooked successfully!" : 
      language === 'ca' ? "Àpat cuinat amb èxit!" : 
      "¡Comida cocinada con éxito!"
    );
    
    setSoundType("success");
    setPlaySound(true);
    setSelectedFoods([]);
    setActiveTab('dining');
  };
  
  // Consumir comida
  const handleConsumeMeal = (meal: any, index: number) => {
    consumeFood(meal.totalCalories);
    setCookedMeals(cookedMeals.filter((_, i) => i !== index));
    
    toast.success(
      language === 'en' ? "Food consumed successfully!" : 
      language === 'ca' ? "Aliment consumit amb èxit!" : 
      "¡Alimento consumido con éxito!"
    );
    
    setSoundType("success");
    setPlaySound(true);
  };
  
  // Filtrar alimentos
  const fridgeItems = refrigeratorFood.filter(item => 
    !selectedFoods.find(food => food.id === item.id)
  );
  
  const pantryItems = pantryFood.filter(item => 
    !selectedFoods.find(food => food.id === item.id)
  );
  
  // Renderizar items de comida
  const renderFoodItems = (items: any[]) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          {language === 'en' ? "No items available" : 
           language === 'ca' ? "No hi ha elements disponibles" : 
           "No hay elementos disponibles"}
        </div>
      );
    }
    
    return items.map(food => (
      <div key={food.id} className="bg-amber-100 p-3 rounded-lg border border-amber-200 flex justify-between">
        <div>
          <span className="text-xl mr-2">{food.emoji || "🍽️"}</span>
          <span className="font-medium">{food.name}</span>
          <div className="text-sm text-amber-700">{food.calories} kcal</div>
        </div>
        <button 
          onClick={() => handleSelectFood(food)}
          className="bg-amber-500 text-white rounded-full h-8 w-8 flex items-center justify-center"
        >
          +
        </button>
      </div>
    ));
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-auto">
      {playSound && (
        <AlertSound 
          playSound={playSound} 
          soundType={soundType} 
          onPlayComplete={handleSoundComplete} 
        />
      )}
      
      <div className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-[#FFF8E9] rounded-3xl shadow-2xl border-8 border-[#CD8E3E]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#C68642] to-[#A05F2C] p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">{language === 'en' ? 'Kitchen' : language === 'ca' ? 'Cuina' : 'Cocina'}</h1>
            
            <button 
              onClick={() => {
                console.log("Salida directa de la cocina");
                
                // Detener cualquier movimiento
                const { setIsMovingToTarget, setTargetPosition } = usePlayerStore.getState();
                setTargetPosition(null);
                setIsMovingToTarget(false);
                
                // Cambiar estado
                const { setGameState } = useGameStateStore.getState();
                setGameState("playing");
                
                // Posicionar jugador frente a la cocina a distancia segura
                const { setPlayerPosition } = usePlayerStore.getState();
                setPlayerPosition({ x: 8, y: 0, z: 16 });
                
                // Ejecutar callback
                if (onExit) onExit();
              }}
              className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold"
            >
              {language === 'en' ? 'Exit' : language === 'ca' ? 'Sortir' : 'Salir'}
            </button>
          </div>
          
          <div className="bg-[#FFF8E1] rounded-full px-6 py-2 text-center mt-3">
            <span className="font-bold">
              {language === 'en' ? 'Calories: ' : language === 'ca' ? 'Calories: ' : 'Calorías: '}
              <span className="text-red-500">{playerData?.caloriesConsumed || 0}</span> / 
              <span className="text-green-500"> {playerData?.dailyCalories || 2500}</span>
            </span>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-amber-200 p-2">
          <div className="flex">
            <button 
              onClick={() => setActiveTab('free-cooking')} 
              className={`flex-1 py-3 font-medium text-center rounded-t-lg ${
                activeTab === 'free-cooking'
                  ? 'bg-amber-500 text-white'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              <span className="mr-2">🍳</span>
              {language === 'en' ? 'Free Cooking' : language === 'ca' ? 'Cuina Lliure' : 'Cocina Libre'}
            </button>
            
            <button 
              onClick={() => setActiveTab('recipes')} 
              className={`flex-1 py-3 font-medium text-center rounded-t-lg ${
                activeTab === 'recipes'
                  ? 'bg-green-500 text-white'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              <span className="mr-2">👨‍🍳</span>
              {language === 'en' ? 'Guided Recipes' : language === 'ca' ? 'Receptes Guiades' : 'Recetas Guiadas'}
            </button>
            
            <button 
              onClick={() => setActiveTab('dining')} 
              className={`flex-1 py-3 font-medium text-center rounded-t-lg ${
                activeTab === 'dining'
                  ? 'bg-orange-500 text-white'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              <span className="mr-2">🍽️</span>
              {language === 'en' ? 'Dining Room' : language === 'ca' ? 'Menjador' : 'Comedor'}
            </button>
          </div>
        </div>
        
        <div className="p-4">
          {/* Free Cooking Tab */}
          {activeTab === 'free-cooking' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                <div className="flex mb-3 border rounded overflow-hidden">
                  <button
                    onClick={() => setActiveContainer('fridge')}
                    className={`flex-1 py-2 ${activeContainer === 'fridge' ? 'bg-amber-500 text-white' : 'bg-amber-100'}`}
                  >
                    {language === 'en' ? 'Refrigerator' : language === 'ca' ? 'Refrigerador' : 'Refrigerador'}
                  </button>
                  <button
                    onClick={() => setActiveContainer('pantry')}
                    className={`flex-1 py-2 ${activeContainer === 'pantry' ? 'bg-amber-500 text-white' : 'bg-amber-100'}`}
                  >
                    {language === 'en' ? 'Pantry' : language === 'ca' ? 'Rebost' : 'Despensa'}
                  </button>
                </div>
                
                <div className="bg-white p-4 rounded-xl border-2 border-amber-200 min-h-[400px]">
                  <h3 className="font-bold mb-3 flex items-center">
                    <span className="text-xl mr-2">{activeContainer === 'fridge' ? '🧊' : '🥫'}</span>
                    {activeContainer === 'fridge' 
                      ? (language === 'en' ? 'Refrigerator' : language === 'ca' ? 'Refrigerador' : 'Refrigerador')
                      : (language === 'en' ? 'Pantry' : language === 'ca' ? 'Rebost' : 'Despensa')
                    }
                  </h3>
                  
                  <div className="space-y-3">
                    {renderFoodItems(activeContainer === 'fridge' ? fridgeItems : pantryItems)}
                  </div>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border-2 border-amber-200">
                  <h3 className="font-bold mb-3 flex items-center">
                    <span className="text-xl mr-2">🔍</span>
                    {language === 'en' ? 'Selected Items' : language === 'ca' ? 'Elements Seleccionats' : 'Elementos Seleccionados'}
                    <span className="ml-2 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      {selectedFoods.length}
                    </span>
                  </h3>
                  
                  {selectedFoods.length > 0 ? (
                    <div className="space-y-2">
                      {selectedFoods.map((food, index) => (
                        <div key={index} className="flex justify-between items-center bg-amber-50 p-2 rounded border border-amber-100">
                          <div>
                            <span className="text-xl mr-2">{food.emoji}</span>
                            <span>{food.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-amber-700 mr-3">{food.calories} kcal</span>
                            <button 
                              onClick={() => handleRemoveFood(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✖
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        onClick={handleClearSelection}
                        className="w-full mt-2 text-red-600 bg-red-50 p-1 rounded text-sm"
                      >
                        {language === 'en' ? 'Clear All' : language === 'ca' ? 'Esborrar Tot' : 'Borrar Todo'}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {language === 'en' 
                        ? 'Select ingredients from your refrigerator and pantry to cook.' 
                        : language === 'ca' 
                          ? 'Selecciona ingredients del refrigerador i rebost per cuinar.' 
                          : 'Selecciona ingredientes de tu refrigerador y despensa para cocinar.'}
                    </div>
                  )}
                </div>
                
                {selectedFoods.length > 0 && (
                  <div className="bg-white p-4 rounded-xl border-2 border-amber-200">
                    <h3 className="font-bold mb-3 flex items-center">
                      <span className="text-xl mr-2">📊</span>
                      {language === 'en' ? 'Nutritional Information' : language === 'ca' ? 'Informació Nutricional' : 'Información Nutricional'}
                    </h3>
                    
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-amber-600">
                        {totalNutrition.calories} <span className="text-lg font-normal">kcal</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={handleCookMeal}
                        className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-8 rounded-lg font-bold"
                      >
                        {language === 'en' ? 'Cook Meal' : language === 'ca' ? 'Cuinar Àpat' : 'Cocinar Comida'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Guided Recipes Tab */}
          {activeTab === 'recipes' && (
            <div className="text-center py-8">
              <h3 className="text-xl font-bold mb-4">
                {language === 'en' ? 'Guided Recipes' : language === 'ca' ? 'Receptes Guiades' : 'Recetas Guiadas'}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {language === 'en' 
                  ? 'Follow step-by-step instructions to create delicious and nutritious meals!'
                  : language === 'ca' 
                    ? 'Segueix les instruccions pas a pas per crear àpats deliciosos i nutritius!'
                    : '¡Sigue las instrucciones paso a paso para crear comidas deliciosas y nutritivas!'}
              </p>
            </div>
          )}
          
          {/* Dining Room Tab */}
          {activeTab === 'dining' && (
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center justify-center">
                <span className="text-2xl mr-2">🍽️</span>
                {language === 'en' ? 'Dining Room' : language === 'ca' ? 'Menjador' : 'Comedor'}
              </h3>
              
              {cookedMeals.length > 0 ? (
                <div className="space-y-4">
                  {cookedMeals.map((meal, index) => (
                    <div key={meal.id} className="bg-white p-4 rounded-lg border-2 border-amber-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg">{meal.name}</h4>
                        <span className="text-amber-600 font-bold">{meal.totalCalories} kcal</span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-gray-600">
                          {language === 'en' ? 'Daily intake:' : language === 'ca' ? 'Ingesta diària:' : 'Ingesta diaria:'} 
                          <span className="font-bold text-red-500 ml-1">
                            {Math.round((meal.totalCalories / (playerData?.dailyCalories || 2500)) * 100)}%
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handleConsumeMeal(meal, index)}
                          className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded"
                        >
                          {language === 'en' ? 'Consume' : language === 'ca' ? 'Consumir' : 'Consumir'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">
                    {language === 'en' 
                      ? "You haven't prepared any meals yet."
                      : language === 'ca' 
                        ? "Encara no has preparat cap àpat."
                        : "Aún no has preparado ninguna comida."}
                  </p>
                  
                  <button
                    onClick={() => setActiveTab('free-cooking')}
                    className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded"
                  >
                    {language === 'en' ? 'Go to Cooking' : language === 'ca' ? 'Anar a Cuinar' : 'Ir a Cocinar'}
                  </button>
                </div>
              )}
              
              <div className="bg-white p-4 rounded-lg border-2 border-amber-200 mt-6">
                <h4 className="font-bold mb-3">
                  {language === 'en' ? 'Daily Caloric Intake' : language === 'ca' ? 'Ingesta Calòrica Diària' : 'Ingesta Calórica Diaria'}
                </h4>
                
                <div className="flex justify-between mb-2">
                  <span>{language === 'en' ? 'Consumed:' : language === 'ca' ? 'Consumit:' : 'Consumido:'}</span>
                  <span className="font-bold text-red-500">{playerData?.caloriesConsumed || 0} kcal</span>
                </div>
                
                <div className="flex justify-between mb-2">
                  <span>{language === 'en' ? 'Recommended:' : language === 'ca' ? 'Recomanat:' : 'Recomendado:'}</span>
                  <span className="font-bold text-green-500">{playerData?.dailyCalories || 2500} kcal</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${Math.min(100, ((playerData?.caloriesConsumed || 0) / (playerData?.dailyCalories || 2500)) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KitchenSimplified;