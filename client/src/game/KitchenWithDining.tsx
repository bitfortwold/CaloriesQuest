import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const { refrigeratorFood, pantryFood, removeFromKitchen } = useFoodStore();
  const { playerData, consumeFood } = usePlayerStore();
  const { language } = useLanguage();
  
  // Activar salida con tecla ESC
  useKeyboardExit("kitchen", onExit);
  
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [playSound, setPlaySound] = useState<boolean>(false);
  const [soundType, setSoundType] = useState<"success" | "error" | "notification">("notification");
  
  // Cargar alimentos de muestra si la nevera y despensa están vacías
  useEffect(() => {
    if (refrigeratorFood.length === 0 && pantryFood.length === 0) {
      console.log("🥕 Cargando alimentos de muestra en la cocina");
      useFoodStore.getState().addSampleFoods();
    }
  }, [refrigeratorFood.length, pantryFood.length]);
  
  // Función para traducir nombres de elementos
  const getTranslation = (key: string): string => {
    return key; // Placeholder
  };
  
  // Gestionar la selección de alimentos
  const handleSelectFoodItem = (foodId: string) => {
    if (selectedItems.includes(foodId)) {
      setSelectedItems(selectedItems.filter(id => id !== foodId));
    } else {
      setSelectedItems([...selectedItems, foodId]);
    }
  };
  
  // Cocinar los elementos seleccionados
  const handleCook = () => {
    if (selectedItems.length === 0) {
      toast.error(language === 'en' ? "Select some items to cook first!" : 
                  language === 'ca' ? "Selecciona alguns elements per cuinar primer!" : 
                  "¡Selecciona algunos alimentos para cocinar primero!");
      return;
    }
    
    // Calcular total de nutrientes
    const itemsToConsume = [...refrigeratorFood, ...pantryFood]
      .filter(item => selectedItems.includes(item.id));
    
    // Calcular nutrientes y calorías totales
    let totalCalories = 0;
    let totalProtein = 0;
    
    itemsToConsume.forEach(food => {
      totalCalories += food.calories;
      totalProtein += food.nutritionalValue.protein;
      
      // Eliminar el alimento de la cocina
      removeFromKitchen(food.id);
    });
    
    // Actualizar calorías del jugador (simulado)
    if (playerData) {
      console.log(`Comida preparada: ${totalCalories} calorías, ${totalProtein}g proteína`);
    }
    
    // Notificar al usuario
    toast.success(language === 'en' ? "Meal prepared successfully!" : 
                 language === 'ca' ? "Àpat preparat amb èxit!" : 
                 "¡Comida preparada con éxito!");
    
    // Reproducir sonido
    setSoundType("success");
    setPlaySound(true);
    
    // Resetear selección
    setSelectedItems([]);
  };
  
  // Consumir los elementos seleccionados
  const handleConsume = () => {
    if (selectedItems.length === 0) {
      toast.error(language === 'en' ? "Select some items to consume first!" : 
                  language === 'ca' ? "Selecciona alguns elements per consumir primer!" : 
                  "¡Selecciona algunos alimentos para consumir primero!");
      return;
    }
    
    // Calcular total de nutrientes
    const itemsToConsume = [...refrigeratorFood, ...pantryFood]
      .filter(item => selectedItems.includes(item.id));
    
    // Calcular nutrientes y calorías totales
    let totalCalories = 0;
    let totalProtein = 0;
    
    itemsToConsume.forEach(food => {
      totalCalories += food.calories;
      totalProtein += food.nutritionalValue.protein;
      
      // Eliminar el alimento de la cocina
      removeFromKitchen(food.id);
    });
    
    // Actualizar calorías consumidas en el playerData
    if (playerData) {
      consumeFood(totalCalories);
      console.log(`Comida consumida: ${totalCalories} calorías, ${totalProtein}g proteína`);
    }
    
    // Notificar al usuario
    toast.success(language === 'en' ? "Food consumed successfully!" : 
                 language === 'ca' ? "Aliment consumit amb èxit!" : 
                 "¡Alimentos consumidos con éxito!");
    
    // Reproducir sonido
    setSoundType("success");
    setPlaySound(true);
    
    // Resetear selección
    setSelectedItems([]);
  };
  
  // Función para manejar la finalización de la reproducción del sonido
  const handleSoundComplete = () => {
    setPlaySound(false);
  };
  
  // Renderizado de recetas guiadas
  const renderGuidedRecipes = () => {
    const recipes = [
      {
        id: "breakfast",
        name: language === 'en' ? "Balanced Breakfast" : 
              language === 'ca' ? "Esmorzar Equilibrat" : 
              "Desayuno Equilibrado",
        description: language === 'en' ? "A nutritious breakfast with eggs, bread and fruit" : 
                     language === 'ca' ? "Un esmorzar nutritiu amb ous, pa i fruita" : 
                     "Un desayuno nutritivo con huevos, pan y fruta",
        ingredients: language === 'en' ? ["Eggs", "Bread", "Apple"] : 
                     language === 'ca' ? ["Ous", "Pa", "Poma"] : 
                     ["Huevos", "Pan", "Manzana"],
        benefits: language === 'en' ? "High in proteins and complex carbohydrates for sustained energy" : 
                  language === 'ca' ? "Alt en proteïnes i carbohidrats complexos per a energia sostinguda" : 
                  "Alto en proteínas y carbohidratos complejos para energía sostenida",
        nutritionalInfo: {
          calories: 385,
          protein: 15,
          carbs: 56,
          fat: 12,
          sustainabilityScore: 7
        }
      },
      {
        id: "lunch",
        name: language === 'en' ? "Vegetarian Lunch" : 
              language === 'ca' ? "Dinar Vegetarià" : 
              "Almuerzo Vegetariano",
        description: language === 'en' ? "A plant-based lunch with beans, rice and vegetables" : 
                     language === 'ca' ? "Un dinar a base de plantes amb mongetes, arròs i verdures" : 
                     "Un almuerzo a base de plantas con frijoles, arroz y verduras",
        ingredients: language === 'en' ? ["Beans", "Rice", "Broccoli", "Carrot"] : 
                     language === 'ca' ? ["Mongetes", "Arròs", "Bròquil", "Pastanaga"] : 
                     ["Frijoles", "Arroz", "Brócoli", "Zanahoria"],
        benefits: language === 'en' ? "Rich in fiber and provides essential vitamins and minerals" : 
                  language === 'ca' ? "Ric en fibra i proporciona vitamines i minerals essencials" : 
                  "Rico en fibra y proporciona vitaminas y minerales esenciales",
        nutritionalInfo: {
          calories: 320,
          protein: 12,
          carbs: 64,
          fat: 3,
          sustainabilityScore: 9
        }
      },
      {
        id: "dinner",
        name: language === 'en' ? "Balanced Dinner" : 
              language === 'ca' ? "Sopar Equilibrat" : 
              "Cena Equilibrada",
        description: language === 'en' ? "A balanced dinner with fish, vegetables and whole grains" : 
                     language === 'ca' ? "Un sopar equilibrat amb peix, verdures i cereals integrals" : 
                     "Una cena equilibrada con pescado, verduras y cereales integrales",
        ingredients: language === 'en' ? ["Fish", "Quinoa", "Spinach", "Cherry Tomatoes", "Olive Oil"] : 
                     language === 'ca' ? ["Peix", "Quinoa", "Espinacs", "Tomàquets Cherry", "Oli d'Oliva"] : 
                     ["Pescado", "Quinoa", "Espinacas", "Tomates Cherry", "Aceite de Oliva"],
        benefits: language === 'en' ? "Excellent source of omega-3, protein and antioxidants" : 
                  language === 'ca' ? "Excel·lent font d'omega-3, proteïnes i antioxidants" : 
                  "Excelente fuente de omega-3, proteínas y antioxidantes",
        nutritionalInfo: {
          calories: 450,
          protein: 32,
          carbs: 38,
          fat: 18,
          sustainabilityScore: 8
        }
      }
    ];
    
    return (
      <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2">
        {recipes.map(recipe => (
          <div key={recipe.id} className="bg-[#FFFAF0] border-4 border-[#F5D6A4] shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#F9A826] to-[#F48E11] pb-2 border-b-4 border-[#E47F0E] p-4">
              <h3 className="text-white text-xl drop-shadow-md font-bold">{recipe.name}</h3>
              <p className="text-white text-opacity-90 text-sm">{recipe.description}</p>
            </div>
            <div className="p-4">
              <div className="mb-3">
                <h4 className="font-bold text-[#8B5E34] mb-1">{language === 'en' ? 'Ingredients' : language === 'ca' ? 'Ingredients' : 'Ingredientes'}:</h4>
                <div className="flex flex-wrap gap-2">
                  {recipe.ingredients.map((ingredient, idx) => (
                    <div key={idx} className="bg-[#FFE0A3] text-[#8B5E34] px-3 py-1 rounded-lg border border-[#EECA81] font-medium">
                      {ingredient}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Información Nutricional */}
              <div className="my-3 bg-[#FFFCF5] p-3 border-2 border-[#EECA81] rounded-xl">
                <h4 className="font-bold text-[#8B5E34] mb-2 flex items-center">
                  <span className="mr-2">📊</span>
                  {language === 'en' ? 'Nutritional Information' : language === 'ca' ? 'Informació Nutricional' : 'Información Nutricional'}:
                </h4>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  <div className="bg-[#FFE0A3] text-[#8B5E34] p-2 rounded-lg text-center">
                    <div className="font-bold">{recipe.nutritionalInfo.calories}</div>
                    <div className="text-xs">{language === 'en' ? 'Calories' : language === 'ca' ? 'Calories' : 'Calorías'}</div>
                  </div>
                  <div className="bg-[#FFE0A3] text-[#8B5E34] p-2 rounded-lg text-center">
                    <div className="font-bold">{recipe.nutritionalInfo.protein}g</div>
                    <div className="text-xs">{language === 'en' ? 'Protein' : language === 'ca' ? 'Proteïna' : 'Proteína'}</div>
                  </div>
                  <div className="bg-[#FFE0A3] text-[#8B5E34] p-2 rounded-lg text-center">
                    <div className="font-bold">{recipe.nutritionalInfo.carbs}g</div>
                    <div className="text-xs">{language === 'en' ? 'Carbs' : language === 'ca' ? 'Carbohidrats' : 'Carbohidratos'}</div>
                  </div>
                  <div className="bg-[#FFE0A3] text-[#8B5E34] p-2 rounded-lg text-center">
                    <div className="font-bold">{recipe.nutritionalInfo.fat}g</div>
                    <div className="text-xs">{language === 'en' ? 'Fat' : language === 'ca' ? 'Greix' : 'Grasa'}</div>
                  </div>
                </div>
                
                {/* Indicador de Sostenibilidad */}
                <div className="flex items-center">
                  <div className="text-xs font-bold text-[#8B5E34] mr-2">
                    {language === 'en' ? 'Sustainability' : language === 'ca' ? 'Sostenibilitat' : 'Sostenibilidad'}:
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    {(() => {
                      const score = recipe.nutritionalInfo.sustainabilityScore;
                      const percentage = score * 10;
                      
                      let color = "bg-red-500";
                      if (score >= 7) {
                        color = "bg-green-500";
                      } else if (score >= 5) {
                        color = "bg-yellow-500";
                      } else if (score >= 3) {
                        color = "bg-orange-500";
                      }
                      
                      return (
                        <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                      );
                    })()}
                  </div>
                  <div className="ml-2 text-sm font-bold text-[#8B5E34]">
                    {recipe.nutritionalInfo.sustainabilityScore}/10
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-[#8B5E34] mb-1">{language === 'en' ? 'Benefits' : language === 'ca' ? 'Beneficis' : 'Beneficios'}:</h4>
                <p className="text-[#7E4E1B] text-sm">{recipe.benefits}</p>
              </div>
              <Button 
                className="w-full mt-4 bg-gradient-to-r from-[#F9A826] to-[#F48E11] hover:brightness-110 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md border-2 border-[#E47F0E]"
              >
                {language === 'en' ? 'Follow Recipe' : language === 'ca' ? 'Seguir Recepta' : 'Seguir Receta'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Contenido de la Guía de Cocina
  const renderCookingGuide = () => (
    <div className="bg-[#FFF8E9] p-5 rounded-2xl border-4 border-[#F5D6A4] shadow-lg">
      <h3 className="text-2xl font-bold text-[#8B5E34] mb-4 pb-2 border-b-2 border-[#F5D6A4]">
        {language === 'en' ? 'Cooking Guide' : language === 'ca' ? 'Guia de Cuina' : 'Guía de Cocina'}
      </h3>
      
      <div className="text-[#7E4E1B] space-y-4">
        <p>
          {language === 'en' 
            ? 'Select a guided recipe from the left panel to get step-by-step instructions on how to prepare the meal. Each recipe is designed to be nutritionally balanced and uses ingredients available in your refrigerator and pantry.'
            : language === 'ca'
            ? 'Selecciona una recepta guiada del panell esquerre per obtenir instruccions pas a pas sobre com preparar el menjar. Cada recepta està dissenyada per ser nutricionalment equilibrada i utilitza ingredients disponibles al teu refrigerador i rebost.'
            : 'Selecciona una receta guiada del panel izquierdo para obtener instrucciones paso a paso sobre cómo preparar la comida. Cada receta está diseñada para ser nutricionalmente equilibrada y utiliza ingredientes disponibles en tu refrigerador y despensa.'}
        </p>
        
        <h4 className="text-xl font-bold text-[#8B5E34] mt-6 mb-2">
          {language === 'en' ? 'Tips for Healthy Cooking' : language === 'ca' ? 'Consells per a una Cuina Saludable' : 'Consejos para una Cocina Saludable'}:
        </h4>
        
        <ul className="list-disc pl-6 space-y-2">
          <li>
            {language === 'en' 
              ? 'Balance your meals with proteins, carbohydrates, and healthy fats.'
              : language === 'ca'
              ? 'Equilibra els teus àpats amb proteïnes, carbohidrats i greixos saludables.'
              : 'Equilibra tus comidas con proteínas, carbohidratos y grasas saludables.'}
          </li>
          <li>
            {language === 'en' 
              ? 'Include a variety of colorful vegetables to get essential vitamins and minerals.'
              : language === 'ca'
              ? 'Inclou una varietat de verdures colorides per obtenir vitamines i minerals essencials.'
              : 'Incluye una variedad de verduras coloridas para obtener vitaminas y minerales esenciales.'}
          </li>
          <li>
            {language === 'en' 
              ? 'Pay attention to portion sizes to maintain a healthy caloric intake.'
              : language === 'ca'
              ? 'Presta atenció a les mides de les porcions per mantenir una ingesta calòrica saludable.'
              : 'Presta atención a los tamaños de las porciones para mantener una ingesta calórica saludable.'}
          </li>
          <li>
            {language === 'en' 
              ? 'Consider the sustainability score of your ingredients to make environmentally responsible decisions.'
              : language === 'ca'
              ? 'Considera la puntuació de sostenibilitat dels teus ingredients per prendre decisions respectuoses amb el medi ambient.'
              : 'Considera la puntuación de sostenibilidad de tus ingredientes para tomar decisiones respetuosas con el medio ambiente.'}
          </li>
        </ul>
      </div>
    </div>
  );
  
  // Render del elemento de almacenamiento de alimentos
  const renderFoodStorage = (type: "refrigerator" | "pantry") => {
    const foods = type === "refrigerator" ? refrigeratorFood : pantryFood;
    const title = type === "refrigerator" 
      ? (language === 'en' ? 'Refrigerator' : language === 'ca' ? 'Refrigerador' : 'Refrigerador')
      : (language === 'en' ? 'Pantry' : language === 'ca' ? 'Rebost' : 'Despensa');
    
    const icon = type === "refrigerator" ? "🧊" : "🥫";
    const description = type === "refrigerator"
      ? (language === 'en' ? 'Perishable food items that require cooling.' : language === 'ca' ? 'Aliments peribles que requereixen refrigeració.' : 'Alimentos perecederos que requieren refrigeración.')
      : (language === 'en' ? 'Non-perishable items stored at room temperature.' : language === 'ca' ? 'Articles no peribles emmagatzemats a temperatura ambient.' : 'Artículos no perecederos almacenados a temperatura ambiente.');
    
    return (
      <div className="bg-[#FFF8E9] p-4 rounded-2xl border-4 border-[#F5D6A4] shadow-lg">
        <h3 className="text-xl font-bold text-[#8B5E34] mb-3 pb-2 border-b-2 border-[#F5D6A4] flex items-center">
          <span className="mr-2 text-2xl">{icon}</span>
          {title}
        </h3>
        
        <p className="text-[#7E4E1B] text-sm mb-4 italic">
          {description}
        </p>
        
        {foods.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px]">
            <div className="bg-[#FFF8E9] p-6 rounded-xl border-2 border-[#F5D6A4] shadow-inner text-center max-w-xs">
              <div className="text-5xl mb-4">{type === "refrigerator" ? "🧊" : "🥫"}</div>
              <p className="text-[#C68642]">
                {language === 'en' 
                  ? `Your ${title.toLowerCase()} is empty. Visit the Market to buy some food.` 
                  : language === 'ca' 
                    ? `El teu ${title.toLowerCase()} és buit. Visita el Mercat per comprar menjar.` 
                    : `Tu ${title.toLowerCase()} está vacío. Visita el Mercado para comprar alimentos.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2">
            {foods.map(food => (
              <div 
                key={food.id} 
                className={`relative bg-[#FFFCF5] rounded-lg border-2 border-[#F5D6A4] overflow-hidden transition-all ${selectedItems.includes(food.id) ? 'border-green-500 shadow-md' : 'hover:border-[#EEC170]'}`}
                onClick={() => handleSelectFoodItem(food.id)}
              >
                <div className="bg-[#F9CC6A] px-3 py-2 flex justify-between items-center">
                  <h4 className="font-bold text-[#8B5E34] truncate">{food.name}</h4>
                  <span className="text-[#8B5E34] font-medium text-sm">{food.calories} kcal</span>
                </div>
                <div className="p-3">
                  <div className="flex justify-between mb-2">
                    <div className="text-xs text-[#8B5E34]">
                      {language === 'en' ? 'Protein' : language === 'ca' ? 'Proteïna' : 'Proteína'}: 
                      <span className="font-bold ml-1">{food.nutritionalValue.protein}g</span>
                    </div>
                    <div className="text-xs text-[#8B5E34]">
                      {language === 'en' ? 'Sustainability' : language === 'ca' ? 'Sostenibilitat' : 'Sostenibilidad'}: 
                      <span className="font-bold ml-1">{food.sustainabilityScore}/10</span>
                    </div>
                  </div>
                  
                  {selectedItems.includes(food.id) && (
                    <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Render del comedor (nuevo)
  const renderDiningRoom = () => (
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
                      if (item.nutritionalValue.carbs) totalCarbs += item.nutritionalValue.carbs;
                      if (item.nutritionalValue.fat) totalFat += item.nutritionalValue.fat;
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
                    
                    const dailyCalories = playerData?.dailyCalories || 2500;
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
                    const percentage = Math.round((totalCalories / (playerData?.dailyCalories || 2500)) * 100);
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
  
  // Render del panel de elementos seleccionados para cocina libre
  const renderSelectedItems = () => (
    <div className="bg-[#FFF8E9] p-4 rounded-2xl border-4 border-[#F5D6A4] shadow-lg h-full">
      <h3 className="text-xl font-bold text-[#8B5E34] mb-3 pb-2 border-b-2 border-[#F5D6A4] flex items-center">
        <span className="mr-2 text-2xl">🍳</span>
        {language === 'en' ? 'Selected Items' : language === 'ca' ? 'Elements Seleccionats' : 'Elementos Seleccionados'}
        <span className="ml-2 bg-[#F9CC6A] text-[#8B5E34] text-sm py-1 px-2 rounded-lg">
          {selectedItems.length}
        </span>
      </h3>
      
      {selectedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[300px]">
          <div className="bg-[#FFF8E9] p-6 rounded-xl border-2 border-[#F5D6A4] shadow-inner text-center max-w-xs">
            <div className="text-5xl mb-4">🥗</div>
            <p className="text-[#C68642] mb-2">
              {language === 'en' 
                ? "Select ingredients from your refrigerator and pantry to cook." 
                : language === 'ca'
                ? "Selecciona ingredients del teu refrigerador i rebost per cuinar." 
                : "Selecciona ingredientes de tu refrigerador y despensa para cocinar."}
            </p>
            <p className="text-sm text-[#C68642] italic">
              {language === 'en' 
                ? "Create your own balanced meals and see their nutritional values!" 
                : language === 'ca'
                ? "Crea els teus propis àpats equilibrats i veu els seus valors nutricionals!" 
                : "¡Crea tus propias comidas equilibradas y ve sus valores nutricionales!"}
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
              {language === 'en' ? 'Nutritional Analysis' : language === 'ca' ? 'Anàlisi Nutricional' : 'Análisis Nutricional'}:
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
                    if (item.nutritionalValue.carbs) totalCarbs += item.nutritionalValue.carbs;
                    if (item.nutritionalValue.fat) totalFat += item.nutritionalValue.fat;
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
            
            {/* Indicador de equilibrio nutricional */}
            <div className="mt-3 flex items-center">
              <div className="text-xs font-bold text-[#8B5E34] mr-2">
                {language === 'en' ? 'Balance:' : language === 'ca' ? 'Equilibri:' : 'Equilibrio:'}
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                {(() => {
                  // Calcular equilibrio nutricional básico basado en proporción de proteínas
                  let totalCalories = 0;
                  let totalProtein = 0;
                  
                  selectedItems.forEach(itemId => {
                    const item = [...refrigeratorFood, ...pantryFood].find(food => food.id === itemId);
                    if (item) {
                      totalCalories += item.calories;
                      totalProtein += item.nutritionalValue.protein;
                    }
                  });
                  
                  const proteinPercentage = totalCalories > 0 
                    ? (totalProtein * 4 / totalCalories) * 100 // 4 calorías por gramo de proteína
                    : 0;
                  
                  // Determinar color y porcentaje basado en proporción de proteínas
                  let color = "bg-gray-400"; // Neutral/bajo
                  let percentage = 30; // Porcentaje básico
                  
                  if (proteinPercentage >= 15 && proteinPercentage <= 30) {
                    color = "bg-green-500"; // Ideal
                    percentage = 100;
                  } else if (proteinPercentage > 10) {
                    color = "bg-yellow-500"; // Aceptable
                    percentage = 70;
                  } else if (proteinPercentage > 5) {
                    color = "bg-orange-400"; // Bajo
                    percentage = 40;
                  }
                  
                  return (
                    <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                  );
                })()}
              </div>
            </div>
            
            {/* Indicador de sostenibilidad */}
            <div className="mt-2 flex items-center">
              <div className="text-xs font-bold text-[#8B5E34] mr-2">
                {language === 'en' ? 'Sustainability:' : language === 'ca' ? 'Sostenibilitat:' : 'Sostenibilidad:'}
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                {(() => {
                  // Calcular sostenibilidad promedio
                  let totalSustainability = 0;
                  
                  selectedItems.forEach(itemId => {
                    const item = [...refrigeratorFood, ...pantryFood].find(food => food.id === itemId);
                    if (item) {
                      totalSustainability += item.sustainabilityScore;
                    }
                  });
                  
                  const avgSustainability = selectedItems.length > 0 
                    ? totalSustainability / selectedItems.length 
                    : 0;
                  
                  // Convertir puntuación de 0-10 a porcentaje
                  const percentage = avgSustainability * 10;
                  
                  // Color basado en sostenibilidad
                  let color = "bg-red-500"; // Muy bajo
                  
                  if (avgSustainability >= 7) {
                    color = "bg-green-500"; // Excelente
                  } else if (avgSustainability >= 5) {
                    color = "bg-yellow-500"; // Bueno
                  } else if (avgSustainability >= 3) {
                    color = "bg-orange-500"; // Regular
                  }
                  
                  return (
                    <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                  );
                })()}
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleCook}
            className="w-full bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] hover:brightness-110 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md border-2 border-[#1B5E20] flex items-center justify-center"
          >
            <span className="mr-2 text-xl">🔥</span>
            {language === 'en' ? 'Cook Selected Items' : language === 'ca' ? 'Cuinar Elements Seleccionats' : 'Cocinar Elementos Seleccionados'}
          </Button>
        </>
      )}
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
          {/* Textura de madera */}
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
              onClick={onExit}
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
        
        {/* Contenido de pestañas */}
        <div className="p-4">
          <Tabs defaultValue="free-cooking" className="w-full">
            <div className="mb-4">
              <TabsList className="grid grid-cols-3 w-full rounded-xl bg-[#FFD8A8] overflow-hidden border-2 border-[#EDBB76]">
                <TabsTrigger 
                  value="free-cooking" 
                  className="data-[state=active]:bg-[#FF9800] data-[state=active]:text-white data-[state=active]:border-b-4 data-[state=active]:border-[#F57C00] flex-1 py-4 text-[#8B5E34] font-bold text-base sm:text-lg"
                >
                  <span className="mr-2 text-xl">🍳</span>
                  {language === 'en' ? 'Free Cooking' : language === 'ca' ? 'Cuina Lliure' : 'Cocina Libre'}
                </TabsTrigger>
                <TabsTrigger 
                  value="guided-recipes" 
                  className="data-[state=active]:bg-[#66BB6A] data-[state=active]:text-white data-[state=active]:border-b-4 data-[state=active]:border-[#4CAF50] flex-1 py-4 text-[#8B5E34] font-bold text-base sm:text-lg"
                >
                  <span className="mr-2 text-xl">👨‍🍳</span>
                  {language === 'en' ? 'Guided Recipes' : language === 'ca' ? 'Receptes Guiades' : 'Recetas Guiadas'}
                </TabsTrigger>
                <TabsTrigger 
                  value="dining-room" 
                  className="data-[state=active]:bg-[#F57C00] data-[state=active]:text-white data-[state=active]:border-b-4 data-[state=active]:border-[#E65100] flex-1 py-4 text-[#8B5E34] font-bold text-base sm:text-lg"
                >
                  <span className="mr-2 text-xl">🍽️</span>
                  {language === 'en' ? 'Dining Room' : language === 'ca' ? 'Menjador' : 'Comedor'}
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Contenido de Cocina Libre */}
            <TabsContent value="free-cooking" className="px-1 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Panel izquierdo - Nevera y despensa */}
                <div>
                  <Tabs defaultValue="refrigerator" className="w-full">
                    <TabsList className="w-full bg-[#F9CC6A] p-0 rounded-t-xl overflow-hidden">
                      <TabsTrigger 
                        value="refrigerator" 
                        className="data-[state=active]:bg-white data-[state=active]:text-[#8B5E34] flex-1 py-3 text-[#8B5E34] font-bold text-sm sm:text-base"
                      >
                        {language === 'en' ? 'Refrigerator' : language === 'ca' ? 'Refrigerador' : 'Refrigerador'}
                      </TabsTrigger>
                      <TabsTrigger 
                        value="pantry" 
                        className="data-[state=active]:bg-white data-[state=active]:text-[#8B5E34] flex-1 py-3 text-[#8B5E34] font-bold text-sm sm:text-base"
                      >
                        {language === 'en' ? 'Pantry' : language === 'ca' ? 'Rebost' : 'Despensa'}
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="refrigerator" className="bg-white p-4 rounded-b-xl border-2 border-[#F9CC6A]">
                      {renderFoodStorage("refrigerator")}
                    </TabsContent>
                    
                    <TabsContent value="pantry" className="bg-white p-4 rounded-b-xl border-2 border-[#F9CC6A]">
                      {renderFoodStorage("pantry")}
                    </TabsContent>
                  </Tabs>
                </div>
                
                {/* Panel derecho - Elementos seleccionados */}
                <div>
                  {renderSelectedItems()}
                </div>
              </div>
            </TabsContent>
            
            {/* Contenido de Recetas Guiadas */}
            <TabsContent value="guided-recipes" className="px-1 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {renderGuidedRecipes()}
                </div>
                <div>
                  {renderCookingGuide()}
                </div>
              </div>
            </TabsContent>
            
            {/* Contenido del Comedor */}
            <TabsContent value="dining-room" className="px-1 pt-2">
              {renderDiningRoom()}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Kitchen;