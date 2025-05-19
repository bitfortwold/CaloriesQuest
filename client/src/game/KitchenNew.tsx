import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFoodStore } from "../stores/useFoodStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useLanguage } from "../i18n/LanguageContext";
import { toast } from "sonner";
import { useKeyboardExit } from "../hooks/useKeyboardExit";
import AlertSound from "../components/AlertSound";

interface KitchenProps {
  onExit: () => void;
}

const Kitchen = ({ onExit }: KitchenProps) => {
  // Asegurar que la función onExit está correctamente enlazada
  const handleExit = () => {
    console.log("Saliendo de la cocina...");
    if (onExit) onExit();
  };
  const { refrigeratorFood, pantryFood, removeFromKitchen } = useFoodStore();
  const { playerData, consumeFood } = usePlayerStore();
  const { language } = useLanguage();
  
  // Estado para la navegación y contenido
  const [activeTab, setActiveTab] = useState<'free-cooking' | 'guided-recipes' | 'dining-room'>('free-cooking');
  const [activeContainer, setActiveContainer] = useState<'fridge' | 'pantry'>('fridge');
  const [selectedFoods, setSelectedFoods] = useState<any[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [cookedMeals, setCookedMeals] = useState<any[]>([]);
  
  // Estado para sonidos
  const [playSound, setPlaySound] = useState<boolean>(false);
  const [soundType, setSoundType] = useState<"success" | "error" | "notification">("notification");
  
  // Activar salida con tecla ESC
  useKeyboardExit("kitchen", handleExit);
  
  // Cargar alimentos de muestra si la nevera y despensa están vacías
  useEffect(() => {
    if (refrigeratorFood.length === 0 && pantryFood.length === 0) {
      console.log("🥕 Cargando alimentos de muestra en la cocina");
      useFoodStore.getState().addSampleFoods();
    }
  }, [refrigeratorFood.length, pantryFood.length]);
  
  // Gestión de sonidos
  const handleSoundComplete = () => {
    setPlaySound(false);
  };
  
  // Filtrar alimentos del refrigerador y despensa
  const fridgeItems = refrigeratorFood.filter(item => !selectedFoods.find(food => food.id === item.id));
  const pantryItems = pantryFood.filter(item => !selectedFoods.find(food => food.id === item.id));
  
  // Seleccionar un alimento
  const handleSelectFood = (food: any) => {
    setSelectedFoods([...selectedFoods, food]);
    
    // Sonido de confirmación
    setSoundType("notification");
    setPlaySound(true);
  };
  
  // Quitar un alimento de la selección
  const handleRemoveFood = (index: number) => {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index));
  };
  
  // Limpiar la selección
  const handleClearSelection = () => {
    setSelectedFoods([]);
  };
  
  // Calcular nutrición total
  const totalNutrition = selectedFoods.reduce((acc, food) => {
    return {
      calories: acc.calories + food.calories,
      protein: acc.protein + (food.protein || 0),
      carbs: acc.carbs + (food.carbs || 0),
      fat: acc.fat + (food.fat || 0)
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  
  // Calcular puntuación de sostenibilidad (simulada)
  const sustainabilityScore = selectedFoods.length > 0
    ? Math.min(Math.max(selectedFoods.reduce((sum, food) => sum + (food.sustainability || 0), 0) / selectedFoods.length, 0), 10)
    : 0;
  
  // Color de sostenibilidad basado en puntuación
  const getSustainabilityColor = (score: number) => {
    if (score < 3) return "bg-red-500";
    if (score < 6) return "bg-yellow-500";
    if (score < 8) return "bg-lime-500";
    return "bg-green-500";
  };
  
  // Cocinar comida seleccionada
  const handleCookMeal = () => {
    if (selectedFoods.length === 0) {
      toast.error(language === 'en' ? "Select ingredients first!" : 
                  language === 'ca' ? "Selecciona ingredients primer!" : 
                  "¡Selecciona ingredientes primero!");
      return;
    }
    
    const newMeal = {
      id: `meal-${Date.now()}`,
      name: language === 'en' ? "Custom Meal" : 
            language === 'ca' ? "Àpat Personalitzat" : 
            "Comida Personalizada",
      foods: [...selectedFoods],
      totalCalories: totalNutrition.calories,
      protein: totalNutrition.protein,
      carbs: totalNutrition.carbs,
      fat: totalNutrition.fat,
      sustainabilityScore,
      timestamp: new Date()
    };
    
    setCookedMeals([newMeal, ...cookedMeals]);
    
    // Quitar alimentos usados del inventario
    selectedFoods.forEach(food => {
      removeFromKitchen(food.id);
    });
    
    // Mostrar mensaje y limpiar selección
    toast.success(language === 'en' ? "Meal cooked successfully!" : 
                 language === 'ca' ? "Àpat cuinat amb èxit!" : 
                 "¡Comida cocinada con éxito!");
    
    setSoundType("success");
    setPlaySound(true);
    setSelectedFoods([]);
    
    // Cambiar a la pestaña comedor
    setActiveTab('dining-room');
  };
  
  // Datos de recetas
  const recipes = [
    {
      id: "1",
      name: language === 'en' ? "Balanced Breakfast" : 
            language === 'ca' ? "Esmorzar Equilibrat" : 
            "Desayuno Equilibrado",
      description: language === 'en' ? "A nutritious breakfast with eggs, bread and fruit" : 
                  language === 'ca' ? "Un esmorzar nutritiu amb ous, pa i fruita" : 
                  "Un desayuno nutritivo con huevos, pan y fruta",
      ingredients: [
        language === 'en' ? "Eggs" : language === 'ca' ? "Ous" : "Huevos",
        language === 'en' ? "Bread" : language === 'ca' ? "Pa" : "Pan",
        language === 'en' ? "Apple" : language === 'ca' ? "Poma" : "Manzana"
      ],
      steps: [
        language === 'en' ? "Beat the eggs in a bowl" : 
        language === 'ca' ? "Bat els ous en un bol" : 
        "Bate los huevos en un tazón",
        
        language === 'en' ? "Cook the eggs on a medium heat" : 
        language === 'ca' ? "Cuina els ous a foc mitjà" : 
        "Cocina los huevos a fuego medio",
        
        language === 'en' ? "Toast the bread" : 
        language === 'ca' ? "Torra el pa" : 
        "Tuesta el pan",
        
        language === 'en' ? "Serve the eggs with toast and fruit" : 
        language === 'ca' ? "Serveix els ous amb pa torrat i fruita" : 
        "Sirve los huevos con pan tostado y fruta"
      ],
      totalCalories: 385,
      protein: 15,
      carbs: 56,
      fat: 12,
      sustainabilityScore: 7
    },
    {
      id: "2",
      name: language === 'en' ? "Vegetable Stir-Fry" : 
            language === 'ca' ? "Saltat de Verdures" : 
            "Salteado de Verduras",
      description: language === 'en' ? "Colorful and nutritious vegetable stir-fry with tofu" : 
                  language === 'ca' ? "Saltat de verdures colorit i nutritiu amb tofu" : 
                  "Salteado de verduras colorido y nutritivo con tofu",
      ingredients: [
        language === 'en' ? "Tofu" : language === 'ca' ? "Tofu" : "Tofu",
        language === 'en' ? "Bell Pepper" : language === 'ca' ? "Pebrot" : "Pimiento",
        language === 'en' ? "Broccoli" : language === 'ca' ? "Bròquil" : "Brócoli",
        language === 'en' ? "Carrots" : language === 'ca' ? "Pastanagues" : "Zanahorias",
        language === 'en' ? "Soy Sauce" : language === 'ca' ? "Salsa de Soja" : "Salsa de Soya"
      ],
      steps: [
        language === 'en' ? "Dice the tofu and vegetables" : 
        language === 'ca' ? "Talla a daus el tofu i les verdures" : 
        "Corta en dados el tofu y las verduras",
        
        language === 'en' ? "Heat a wok or large pan" : 
        language === 'ca' ? "Escalfa un wok o una paella gran" : 
        "Calienta un wok o sartén grande",
        
        language === 'en' ? "Add tofu and cook until golden" : 
        language === 'ca' ? "Afegeix el tofu i cuina'l fins que es dauri" : 
        "Añade el tofu y cocina hasta que esté dorado",
        
        language === 'en' ? "Add vegetables and stir-fry until tender-crisp" : 
        language === 'ca' ? "Afegeix les verdures i salteja-les fins que estiguin tendres però cruixents" : 
        "Añade las verduras y saltea hasta que estén tiernas pero crujientes",
        
        language === 'en' ? "Season with soy sauce and serve" : 
        language === 'ca' ? "Assaona amb salsa de soja i serveix" : 
        "Sazona con salsa de soya y sirve"
      ],
      totalCalories: 320,
      protein: 22,
      carbs: 28,
      fat: 14,
      sustainabilityScore: 9
    }
  ];
  
  // Cocinar una receta
  const handleCookRecipe = (recipe: any) => {
    const newMeal = {
      id: `recipe-${Date.now()}`,
      name: recipe.name,
      totalCalories: recipe.totalCalories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      sustainabilityScore: recipe.sustainabilityScore,
      timestamp: new Date()
    };
    
    setCookedMeals([newMeal, ...cookedMeals]);
    
    toast.success(
      language === 'en' ? `${recipe.name} cooked successfully!` : 
      language === 'ca' ? `${recipe.name} cuinat amb èxit!` : 
      `¡${recipe.name} cocinado con éxito!`
    );
    
    setSoundType("success");
    setPlaySound(true);
    
    // Cambiar a la pestaña comedor
    setActiveTab('dining-room');
  };
  
  // Consumir comida
  const handleConsumeMeal = (meal: any, index: number) => {
    // Actualizar calorías consumidas
    consumeFood(meal.totalCalories);
    
    // Eliminar de la lista de comidas cocinadas
    setCookedMeals(cookedMeals.filter((_, i) => i !== index));
    
    // Mostrar mensaje
    toast.success(
      language === 'en' ? "Food consumed successfully!" : 
      language === 'ca' ? "Aliment consumit amb èxit!" : 
      "¡Alimento consumido con éxito!"
    );
    
    setSoundType("success");
    setPlaySound(true);
  };
  
  // Renderizar elementos de comida
  const renderFoodItems = (items: any[]) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-4 text-[#8B5E34] italic">
          {language === 'en' ? "No items available" : 
           language === 'ca' ? "No hi ha elements disponibles" : 
           "No hay elementos disponibles"}
        </div>
      );
    }
    
    return items.map((food) => (
      <div 
        key={food.id}
        className="bg-[#FFF3CD] rounded-lg p-3 border border-[#FFEEBA] hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">{food.emoji || "🍽️"}</span>
            <div>
              <h4 className="font-bold text-[#8B5E34]">{food.name}</h4>
              <span className="text-sm text-[#FF9800]">{food.calories} kcal</span>
            </div>
          </div>
          <Button
            onClick={() => handleSelectFood(food)}
            className="bg-[#F9A825] hover:bg-[#F57F17] text-white rounded-full h-8 w-8 p-0 shadow-sm"
          >
            +
          </Button>
        </div>
        
        <div className="mt-2 grid grid-cols-3 gap-1 text-center text-xs">
          <div className="bg-[#E8F5E9] rounded p-1">
            <span className="font-medium text-[#2E7D32]">P: {food.protein || 0}g</span>
          </div>
          <div className="bg-[#E3F2FD] rounded p-1">
            <span className="font-medium text-[#1565C0]">C: {food.carbs || 0}g</span>
          </div>
          <div className="bg-[#FAFAFA] rounded p-1">
            <span className="font-medium text-[#9E9E9E]">G: {food.fat || 0}g</span>
          </div>
        </div>
        
        {food.sustainability !== undefined && (
          <div className="mt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#8B5E34]">
                {language === 'en' ? "Sustainability:" : 
                 language === 'ca' ? "Sostenibilitat:" : 
                 "Sostenibilidad:"}
              </span>
              <span className="font-medium">{food.sustainability}/10</span>
            </div>
            <div className="w-full bg-[#ECEFF1] rounded-full h-1.5 overflow-hidden mt-1">
              <div 
                className={`h-full rounded-full ${getSustainabilityColor(food.sustainability || 0)}`}
                style={{ width: `${(food.sustainability || 0) * 10}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    ));
  };
  
  // Renderizar el comedor
  const renderDiningRoom = () => (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-[#8B5E34] mb-2 flex items-center justify-center">
          <span className="mr-2 text-2xl">🍽️</span>
          {language === 'en' ? "Dining Room" : language === 'ca' ? "Menjador" : "Comedor"}
        </h3>
        <p className="text-[#8D6E63] max-w-2xl mx-auto">
          {language === 'en' 
            ? "Here you can consume the meals you've prepared and manage your daily caloric intake." 
            : language === 'ca' 
              ? "Aquí pots consumir els àpats que has preparat i gestionar la teva ingesta calòrica diària." 
              : "Aquí puedes consumir las comidas que has preparado y gestionar tu ingesta calórica diaria."}
        </p>
      </div>
      
      <div className="bg-[#FFF8E9] rounded-xl p-4 border-2 border-[#EDBB76]">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🍳</span>
          <h3 className="text-xl font-bold text-[#8B5E34]">
            {language === 'en' ? "Prepared Meals" : language === 'ca' ? "Àpats Preparats" : "Comidas Preparadas"}
          </h3>
        </div>
        
        {cookedMeals.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {cookedMeals.map((meal, index) => (
              <div 
                key={meal.id}
                className="bg-white rounded-lg p-4 border-2 border-[#FFE0B2] hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#5D4037] text-xl mb-1">{meal.name}</h4>
                    <p className="text-sm text-[#8D6E63]">
                      {language === 'en' ? "Prepared" : language === 'ca' ? "Preparat" : "Preparado"}: {' '}
                      {new Date(meal.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#FF9800] text-xl">{meal.totalCalories} kcal</p>
                    <div className="flex items-center mt-2 justify-end gap-2">
                      <span className="text-xs bg-[#E8F5E9] text-[#2E7D32] px-2 py-1 rounded-full">
                        P: {meal.protein}g
                      </span>
                      <span className="text-xs bg-[#E3F2FD] text-[#1565C0] px-2 py-1 rounded-full">
                        C: {meal.carbs}g
                      </span>
                      <span className="text-xs bg-[#FAFAFA] text-[#9E9E9E] px-2 py-1 rounded-full">
                        G: {meal.fat}g
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-[#8B5E34]">
                      {language === 'en' ? "Sustainability:" : language === 'ca' ? "Sostenibilitat:" : "Sostenibilidad:"}
                    </span>
                    <span className="font-medium">{meal.sustainabilityScore.toFixed(1)}/10</span>
                  </div>
                  <div className="w-full bg-[#ECEFF1] rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${getSustainabilityColor(meal.sustainabilityScore)}`}
                      style={{ width: `${meal.sustainabilityScore * 10}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center">
                    <span className="text-[#8D6E63] mr-1">
                      {language === 'en' ? "Daily calories:" : 
                      language === 'ca' ? "Calories diàries:" : 
                      "Calorías diarias:"}
                    </span>
                    <span className="font-bold text-[#E91E63]">{playerData?.caloriesConsumed || 0}</span>
                    <span className="mx-1">/</span>
                    <span className="font-bold text-[#4CAF50]">{playerData?.dailyCalories || 2500}</span>
                  </div>
                  
                  <Button
                    onClick={() => handleConsumeMeal(meal, index)}
                    className="bg-[#F57C00] hover:bg-[#E65100] text-white rounded-lg px-4 py-2 shadow-sm"
                  >
                    {language === 'en' ? "Consume" : language === 'ca' ? "Consumir" : "Consumir"}
                  </Button>
                </div>
                
                {/* Porcentaje de consumo diario */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-[#8D6E63] mb-1">
                    <span>
                      {language === 'en' ? "% of daily intake:" : 
                      language === 'ca' ? "% d'ingesta diària:" : 
                      "% de ingesta diaria:"}
                    </span>
                    <span className="font-medium">
                      {Math.round((meal.totalCalories / (playerData?.dailyCalories || 2500)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-[#ECEFF1] rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-[#FF9800]`}
                      style={{ 
                        width: `${Math.min(100, Math.round((meal.totalCalories / (playerData?.dailyCalories || 2500)) * 100))}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <img src="/images/empty-plate.svg" alt="Empty plate" className="w-24 h-24 mx-auto mb-4 opacity-60" />
            <p className="text-[#8D6E63] mb-2">
              {language === 'en' 
                ? "You haven't prepared any meals yet." 
                : language === 'ca' 
                  ? "Encara no has preparat cap àpat." 
                  : "Aún no has preparado ninguna comida."}
            </p>
            <p className="text-[#8D6E63]">
              {language === 'en' 
                ? "Go to Free Cooking or Guided Recipes to make something delicious!" 
                : language === 'ca' 
                  ? "Ves a Cuina Lliure o Receptes Guiades per fer alguna cosa deliciosa!" 
                  : "¡Ve a Cocina Libre o Recetas Guiadas para preparar algo delicioso!"}
            </p>
            <div className="mt-4">
              <Button
                onClick={() => setActiveTab('free-cooking')}
                className="bg-[#FF9800] hover:bg-[#F57C00] text-white mr-2"
              >
                {language === 'en' ? "Free Cooking" : language === 'ca' ? "Cuina Lliure" : "Cocina Libre"}
              </Button>
              <Button
                onClick={() => setActiveTab('guided-recipes')}
                className="bg-[#66BB6A] hover:bg-[#4CAF50] text-white"
              >
                {language === 'en' ? "Guided Recipes" : language === 'ca' ? "Receptes Guiades" : "Recetas Guiadas"}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-[#FFF8E9] rounded-xl p-4 border-2 border-[#EDBB76]">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📊</span>
          <h3 className="text-xl font-bold text-[#8B5E34]">
            {language === 'en' ? "Daily Caloric Intake" : language === 'ca' ? "Ingesta Calòrica Diària" : "Ingesta Calórica Diaria"}
          </h3>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-[#8D6E63] font-medium">
              {language === 'en' ? "Consumed:" : language === 'ca' ? "Consumit:" : "Consumido:"}
            </span>
            <span className="font-bold text-[#E91E63]">{playerData?.caloriesConsumed || 0} kcal</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-[#8D6E63] font-medium">
              {language === 'en' ? "Recommended:" : language === 'ca' ? "Recomanat:" : "Recomendado:"}
            </span>
            <span className="font-bold text-[#4CAF50]">{playerData?.dailyCalories || 2500} kcal</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-[#8D6E63] font-medium">
              {language === 'en' ? "Remaining:" : language === 'ca' ? "Restant:" : "Restante:"}
            </span>
            <span className="font-bold text-[#2196F3]">
              {Math.max(0, (playerData?.dailyCalories || 2500) - (playerData?.caloriesConsumed || 0))} kcal
            </span>
          </div>
        </div>
        
        <div className="w-full bg-[#ECEFF1] rounded-full h-4 overflow-hidden mb-2">
          <div 
            className={`h-full rounded-full ${
              (playerData?.caloriesConsumed || 0) > (playerData?.dailyCalories || 2500)
                ? "bg-red-500"
                : (playerData?.caloriesConsumed || 0) > (playerData?.dailyCalories || 2500) * 0.8
                  ? "bg-yellow-500"
                  : "bg-green-500"
            }`}
            style={{ 
              width: `${Math.min(100, ((playerData?.caloriesConsumed || 0) / (playerData?.dailyCalories || 2500)) * 100)}%` 
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-[#8D6E63]">
          <span>0%</span>
          <span>
            {Math.round(((playerData?.caloriesConsumed || 0) / (playerData?.dailyCalories || 2500)) * 100)}%
          </span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
  
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
        {/* Header de madera estilizado */}
        <div className="bg-gradient-to-r from-[#C68642] to-[#A05F2C] p-4 rounded-t-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+CjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB4PSIxNSIgeT0iMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSIjZjNmNGY2Ij48L3JlY3Q+CjxyZWN0IHg9IjAiIHk9IjE1IiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9IiNmM2Y0ZjYiPjwvcmVjdD4KPC9zdmc+')]"></div>
          
          <div className="flex justify-between items-center mb-2">
            {/* Título con aspecto de cartel de madera */}
            <div className="bg-[#BA7D45] px-12 py-3 rounded-2xl shadow-lg border-4 border-[#8B5E34] transform rotate-0 relative">
              <div className="absolute inset-0 rounded-xl opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+CjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB4PSIxNSIgeT0iMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSIjZjNmNGY2Ij48L3JlY3Q+CjxyZWN0IHg9IjAiIHk9IjE1IiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9IiNmM2Y0ZjYiPjwvcmVjdD4KPC9zdmc+')]"></div>
              <h1 className="text-4xl font-bold text-white drop-shadow-lg tracking-wide uppercase">{language === 'en' ? 'Kitchen' : language === 'ca' ? 'Cuina' : 'Cocina'}</h1>
            </div>
            
            {/* Botón de salir */}
            <button 
              type="button"
              onClick={handleExit}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-xl shadow-md border-2 border-red-600 transition-all"
            >
              {language === 'en' ? 'Exit' : language === 'ca' ? 'Sortir' : 'Salir'}
            </button>
          </div>
          
          {/* Panel de calorías */}
          <div className="mx-auto bg-[#FFF8E1] rounded-full px-6 py-2 text-center mt-2 mb-1 shadow-md border-2 border-[#EED8A7]">
            <span className="text-[#8B5E34] font-bold">
              {language === 'en' ? 'Calories: ' : language === 'ca' ? 'Calories: ' : 'Calorías: '}
              <span className="text-[#E91E63]">{playerData?.caloriesConsumed || 0}</span> / <span className="text-[#4CAF50]">{playerData?.dailyCalories || 2500}</span>
            </span>
          </div>
        </div>
        
        {/* Navegación principal en la parte superior */}
        <div className="mb-4 px-4 mt-4">
          <div className="bg-[#FFD8A8] rounded-xl overflow-hidden border-2 border-[#EDBB76]">
            <div className="grid grid-cols-3 w-full">
              <button 
                onClick={() => setActiveTab('free-cooking')}
                className={`flex items-center justify-center py-4 text-[#8B5E34] font-bold text-base sm:text-lg transition-colors ${
                  activeTab === 'free-cooking' 
                    ? 'bg-[#FF9800] text-white border-b-4 border-[#F57C00]' 
                    : 'hover:bg-[#FFE0B2]'
                }`}
              >
                <span className="mr-2 text-xl">🍳</span>
                {language === 'en' ? 'Free Cooking' : language === 'ca' ? 'Cuina Lliure' : 'Cocina Libre'}
              </button>
              <button 
                onClick={() => setActiveTab('guided-recipes')}
                className={`flex items-center justify-center py-4 text-[#8B5E34] font-bold text-base sm:text-lg transition-colors ${
                  activeTab === 'guided-recipes' 
                    ? 'bg-[#66BB6A] text-white border-b-4 border-[#4CAF50]' 
                    : 'hover:bg-[#FFE0B2]'
                }`}
              >
                <span className="mr-2 text-xl">👨‍🍳</span>
                {language === 'en' ? 'Guided Recipes' : language === 'ca' ? 'Receptes Guiades' : 'Recetas Guiadas'}
              </button>
              <button 
                onClick={() => setActiveTab('dining-room')}
                className={`flex items-center justify-center py-4 text-[#8B5E34] font-bold text-base sm:text-lg transition-colors ${
                  activeTab === 'dining-room' 
                    ? 'bg-[#F57C00] text-white border-b-4 border-[#E65100]' 
                    : 'hover:bg-[#FFE0B2]'
                }`}
              >
                <span className="mr-2 text-xl">🍽️</span>
                {language === 'en' ? 'Dining Room' : language === 'ca' ? 'Menjador' : 'Comedor'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Contenido principal basado en la pestaña activa */}
        <div className="p-4">
          
          {/* Contenido de Cocina Libre */}
          {activeTab === 'free-cooking' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Columna Izquierda: Refrigerador y Despensa */}
              <div className="space-y-4">
                {/* Navegación entre Refrigerador y Despensa */}
                <div className="grid grid-cols-2 gap-0 rounded-lg overflow-hidden bg-[#E0E0E0]">
                  <button 
                    onClick={() => setActiveContainer('fridge')}
                    className={`py-3 font-medium text-center transition-colors ${
                      activeContainer === 'fridge' 
                        ? 'bg-[#E3B04B] text-white font-bold shadow-inner' 
                        : 'bg-[#F5F5DC] text-[#8B5E34] hover:bg-[#E9DFC4]'
                    }`}
                  >
                    {language === 'en' ? 'Refrigerator' : language === 'ca' ? 'Refrigerador' : 'Refrigerador'}
                  </button>
                  <button 
                    onClick={() => setActiveContainer('pantry')}
                    className={`py-3 font-medium text-center transition-colors ${
                      activeContainer === 'pantry' 
                        ? 'bg-[#E3B04B] text-white font-bold shadow-inner' 
                        : 'bg-[#F5F5DC] text-[#8B5E34] hover:bg-[#E9DFC4]'
                    }`}
                  >
                    {language === 'en' ? 'Pantry' : language === 'ca' ? 'Rebost' : 'Despensa'}
                  </button>
                </div>
                
                {/* Contenido del Refrigerador o Despensa */}
                <div className="bg-[#FFF8E9] rounded-xl p-4 border-2 border-[#EDBB76] min-h-[400px]">
                  {activeContainer === 'fridge' ? (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">🧊</span>
                        <h3 className="text-xl font-bold text-[#8B5E34]">
                          {language === 'en' ? 'Refrigerator' : language === 'ca' ? 'Refrigerador' : 'Refrigerador'}
                        </h3>
                      </div>
                      <p className="text-[#6B4226] italic mb-4">
                        {language === 'en' 
                          ? 'Perishable foods that require refrigeration.' 
                          : language === 'ca' 
                            ? 'Aliments peribles que requereixen refrigeració.' 
                            : 'Alimentos perecederos que requieren refrigeración.'}
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        {renderFoodItems(fridgeItems)}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">🥫</span>
                        <h3 className="text-xl font-bold text-[#8B5E34]">
                          {language === 'en' ? 'Pantry' : language === 'ca' ? 'Rebost' : 'Despensa'}
                        </h3>
                      </div>
                      <p className="text-[#6B4226] italic mb-4">
                        {language === 'en' 
                          ? 'Non-perishable and dry goods.' 
                          : language === 'ca' 
                            ? 'Aliments no peribles i secs.' 
                            : 'Alimentos no perecederos y secos.'}
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        {renderFoodItems(pantryItems)}
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Columna Derecha: Elementos Seleccionados e Información Nutricional */}
              <div className="space-y-4">
                {/* Alimentos Seleccionados */}
                <div className="bg-[#FFF8E9] rounded-xl p-4 border-2 border-[#EDBB76]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🔍</span>
                    <h3 className="text-xl font-bold text-[#8B5E34] flex items-center">
                      {language === 'en' ? 'Selected Items' : language === 'ca' ? 'Elements Seleccionats' : 'Elementos Seleccionados'}
                      <span className="ml-2 bg-[#F5A623] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                        {selectedFoods.length}
                      </span>
                    </h3>
                  </div>
                  
                  {selectedFoods.length > 0 ? (
                    <div className="space-y-3">
                      {selectedFoods.map((food, index) => (
                        <div key={`${food.id}-${index}`} className="flex justify-between items-center bg-white p-2 rounded-lg border border-[#FFE0B2]">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{food.emoji}</span>
                            <span className="font-medium text-[#5D4037]">{food.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-[#FF9800] font-medium">{food.calories} kcal</span>
                            <button 
                              onClick={() => handleRemoveFood(index)}
                              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                            >
                              ✖
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        onClick={handleClearSelection}
                        className="w-full mt-2 bg-[#F0F0F0] text-[#B71C1C] border border-[#E0E0E0] rounded-lg py-1 text-sm font-medium hover:bg-[#FFEBEE] transition-colors"
                      >
                        {language === 'en' ? 'Clear All' : language === 'ca' ? 'Esborrar-ho tot' : 'Borrar Todo'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <img src="/images/empty-plate.svg" alt="Empty plate" className="w-20 h-20 mb-4 opacity-60" />
                      <p className="text-[#8D6E63]">
                        {language === 'en' 
                          ? 'Select ingredients from your refrigerator and pantry to cook.' 
                          : language === 'ca' 
                            ? 'Selecciona ingredients del teu refrigerador i rebost per cuinar.' 
                            : 'Selecciona ingredientes de tu refrigerador y despensa para cocinar.'}
                      </p>
                      <p className="text-[#8D6E63] mt-2 italic">
                        {language === 'en' 
                          ? 'Create your own balanced meals and see their nutritional values!' 
                          : language === 'ca' 
                            ? 'Crea els teus propis plats equilibrats i observa els seus valors nutricionals!' 
                            : '¡Crea tus propias comidas equilibradas y ve sus valores nutricionales!'}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Información Nutricional */}
                {selectedFoods.length > 0 && (
                  <div className="bg-[#FFF8E9] rounded-xl p-4 border-2 border-[#EDBB76]">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">📊</span>
                      <h3 className="text-xl font-bold text-[#8B5E34]">
                        {language === 'en' ? 'Nutritional Information' : language === 'ca' ? 'Informació Nutricional' : 'Información Nutricional'}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-[#FFF3CD] p-3 rounded-lg border border-[#FFEEBA]">
                        <div className="text-center mb-1 font-bold text-[#8B5E34]">
                          {language === 'en' ? 'Calories' : language === 'ca' ? 'Calories' : 'Calorías'}
                        </div>
                        <div className="text-center text-2xl font-bold text-[#E65100]">
                          {totalNutrition.calories} <span className="text-sm font-normal">kcal</span>
                        </div>
                      </div>
                      
                      <div className="bg-[#E8F5E9] p-3 rounded-lg border border-[#C8E6C9]">
                        <div className="text-center mb-1 font-bold text-[#8B5E34]">
                          {language === 'en' ? 'Protein' : language === 'ca' ? 'Proteïna' : 'Proteína'}
                        </div>
                        <div className="text-center text-2xl font-bold text-[#2E7D32]">
                          {totalNutrition.protein} <span className="text-sm font-normal">g</span>
                        </div>
                      </div>
                      
                      <div className="bg-[#E3F2FD] p-3 rounded-lg border border-[#BBDEFB]">
                        <div className="text-center mb-1 font-bold text-[#8B5E34]">
                          {language === 'en' ? 'Carbs' : language === 'ca' ? 'Carbohidrats' : 'Carbohidratos'}
                        </div>
                        <div className="text-center text-2xl font-bold text-[#1565C0]">
                          {totalNutrition.carbs} <span className="text-sm font-normal">g</span>
                        </div>
                      </div>
                      
                      <div className="bg-[#FAFAFA] p-3 rounded-lg border border-[#E0E0E0]">
                        <div className="text-center mb-1 font-bold text-[#8B5E34]">
                          {language === 'en' ? 'Fat' : language === 'ca' ? 'Greix' : 'Grasa'}
                        </div>
                        <div className="text-center text-2xl font-bold text-[#9E9E9E]">
                          {totalNutrition.fat} <span className="text-sm font-normal">g</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="text-sm font-bold text-[#8B5E34] mb-1">
                        {language === 'en' ? 'Sustainability Score' : language === 'ca' ? 'Puntuació de Sostenibilitat' : 'Puntuación de Sostenibilidad'}
                      </h4>
                      <div className="w-full bg-[#ECEFF1] rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${getSustainabilityColor(sustainabilityScore)}`}
                          style={{ width: `${sustainabilityScore * 10}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs mt-1 text-[#78909C]">
                        <span>0</span>
                        <span>{sustainabilityScore.toFixed(1)}/10</span>
                        <span>10</span>
                      </div>
                    </div>
                    
                    <div className="text-center mt-4">
                      <button
                        onClick={handleCookMeal}
                        className="bg-[#FF9800] hover:bg-[#F57C00] text-white py-3 px-6 rounded-xl font-bold shadow-md border-b-4 border-[#E65100] active:border-b-0 active:translate-y-1 active:shadow-none transition-all"
                      >
                        {language === 'en' ? 'Cook Meal' : language === 'ca' ? 'Cuinar Àpat' : 'Cocinar Comida'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Contenido de Recetas Guiadas */}
          {activeTab === 'guided-recipes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Columna izquierda - Lista de recetas */}
              <div className="bg-[#F5F5DC] rounded-xl p-4 border-2 border-[#EDBB76] overflow-y-auto max-h-[600px]">
                <h3 className="text-2xl font-bold text-[#8B5E34] mb-4 flex items-center">
                  <span className="mr-2 text-2xl">📖</span>
                  {language === 'en' ? 'Recipe Book' : language === 'ca' ? 'Llibre de Receptes' : 'Libro de Recetas'}
                </h3>
                
                <div className="space-y-3">
                  {recipes.map((recipe) => (
                    <div 
                      key={recipe.id}
                      onClick={() => setSelectedRecipe(recipe)}
                      className={`bg-white p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                        selectedRecipe?.id === recipe.id ? 'border-[#4CAF50] shadow-md' : 'border-[#E0E0E0]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-[#5D4037]">{recipe.name}</h4>
                        <span className="text-sm text-[#FF9800] font-medium">{recipe.totalCalories} kcal</span>
                      </div>
                      <p className="text-sm text-[#8D6E63] mt-1">{recipe.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {recipe.ingredients.map((ingredient, idx) => (
                          <span 
                            key={idx}
                            className="text-xs bg-[#F1F8E9] text-[#558B2F] px-2 py-1 rounded-full"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Columna derecha - Detalles e instrucciones de la receta seleccionada */}
              <div className="bg-[#FFF8E9] rounded-xl p-4 border-2 border-[#EDBB76] overflow-y-auto max-h-[600px]">
                {selectedRecipe ? (
                  <>
                    <h3 className="text-2xl font-bold text-[#5D4037] mb-2">{selectedRecipe.name}</h3>
                    <p className="text-[#8D6E63] italic mb-4">{selectedRecipe.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="font-bold text-[#5D4037] mb-2 flex items-center">
                        <span className="mr-2 text-xl">🧾</span>
                        {language === 'en' ? 'Ingredients' : language === 'ca' ? 'Ingredients' : 'Ingredientes'}
                      </h4>
                      <ul className="list-disc pl-6 space-y-1 text-[#5D4037]">
                        {selectedRecipe.ingredients.map((ingredient, idx) => (
                          <li key={idx}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-bold text-[#5D4037] mb-2 flex items-center">
                        <span className="mr-2 text-xl">👨‍🍳</span>
                        {language === 'en' ? 'Instructions' : language === 'ca' ? 'Instruccions' : 'Instrucciones'}
                      </h4>
                      <ol className="list-decimal pl-6 space-y-2 text-[#5D4037]">
                        {selectedRecipe.steps.map((step, idx) => (
                          <li key={idx} className="pb-2">{step}</li>
                        ))}
                      </ol>
                    </div>
                    
                    <div className="bg-[#FFF3CD] p-4 rounded-lg border border-[#FFEEBA] mb-6">
                      <h4 className="font-bold text-[#5D4037] mb-2 flex items-center">
                        <span className="mr-2 text-xl">📊</span>
                        {language === 'en' ? 'Nutritional Information' : language === 'ca' ? 'Informació Nutricional' : 'Información Nutricional'}
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-[#8D6E63]">
                            {language === 'en' ? 'Calories' : language === 'ca' ? 'Calories' : 'Calorías'}
                          </p>
                          <p className="font-bold text-lg text-[#E65100]">{selectedRecipe.totalCalories} kcal</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-[#8D6E63]">
                            {language === 'en' ? 'Protein' : language === 'ca' ? 'Proteïna' : 'Proteína'}
                          </p>
                          <p className="font-bold text-lg text-[#2E7D32]">{selectedRecipe.protein} g</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-[#8D6E63]">
                            {language === 'en' ? 'Carbs' : language === 'ca' ? 'Carbohidrats' : 'Carbohidratos'}
                          </p>
                          <p className="font-bold text-lg text-[#1565C0]">{selectedRecipe.carbs} g</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-[#8D6E63]">
                            {language === 'en' ? 'Fat' : language === 'ca' ? 'Greix' : 'Grasa'}
                          </p>
                          <p className="font-bold text-lg text-[#9E9E9E]">{selectedRecipe.fat} g</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-[#8D6E63] mb-1">
                          {language === 'en' ? 'Sustainability Score' : language === 'ca' ? 'Puntuació de Sostenibilitat' : 'Puntuación de Sostenibilidad'}
                        </p>
                        <div className="w-full bg-[#ECEFF1] rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${getSustainabilityColor(selectedRecipe.sustainabilityScore)}`}
                            style={{ width: `${selectedRecipe.sustainabilityScore * 10}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1 text-[#78909C]">
                          <span>0</span>
                          <span>{selectedRecipe.sustainabilityScore.toFixed(1)}/10</span>
                          <span>10</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <button
                        onClick={() => handleCookRecipe(selectedRecipe)}
                        className="bg-[#66BB6A] hover:bg-[#4CAF50] text-white py-3 px-6 rounded-xl font-bold shadow-md border-b-4 border-[#2E7D32] active:border-b-0 active:translate-y-1 active:shadow-none transition-all"
                      >
                        {language === 'en' ? 'Cook This Recipe' : language === 'ca' ? 'Cuinar Aquesta Recepta' : 'Cocinar Esta Receta'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <img src="/images/chef-hat.svg" alt="Chef hat" className="w-24 h-24 mb-6 opacity-60" />
                    <h3 className="text-xl font-bold text-[#8B5E34] mb-2">
                      {language === 'en' ? 'Let\'s Cook!' : language === 'ca' ? 'Cuinem!' : '¡Cocinemos!'}
                    </h3>
                    <p className="text-[#8D6E63] max-w-md">
                      {language === 'en' 
                        ? 'Select a recipe from the list to see ingredients, instructions, and nutritional information.' 
                        : language === 'ca' 
                          ? 'Selecciona una recepta de la llista per veure ingredients, instruccions i informació nutricional.' 
                          : 'Selecciona una receta de la lista para ver ingredientes, instrucciones e información nutricional.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Contenido del Comedor */}
          {activeTab === 'dining-room' && renderDiningRoom()}
        </div>
      </div>
    </div>
  );
};

export default Kitchen;