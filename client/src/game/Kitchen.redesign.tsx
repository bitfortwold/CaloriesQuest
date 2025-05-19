import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFoodStore } from "../stores/useFoodStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useLanguage } from "../i18n/LanguageContext";
import { toast } from "sonner";
import { useKeyboardExit } from "../hooks/useKeyboardExit";

interface KitchenProps {
  onExit: () => void;
}

const Kitchen = ({ onExit }: KitchenProps) => {
  const { refrigeratorFood, pantryFood, removeFromKitchen } = useFoodStore();
  const { playerData } = usePlayerStore();
  const { language } = useLanguage();
  
  // Activar salida con tecla ESC
  useKeyboardExit("kitchen", onExit);
  
  // Estado para gestionar elementos seleccionados y modo de cocina
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [cookingMode, setCookingMode] = useState<"guided" | "free">("free");
  
  // Registrar cambios en el estado para debug
  useEffect(() => {
    console.log("Nevera:", refrigeratorFood);
    console.log("Despensa:", pantryFood);
    console.log("Estado actual - Modo:", cookingMode);
  }, [refrigeratorFood, pantryFood, cookingMode]);
  
  // Función para traducir nombres de elementos
  const getTranslation = (key: string): string => {
    return key; // Placeholder - se implementaría un sistema de traducciones real
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
    let totalCarbs = 0;
    let totalFat = 0;
    let totalSustainability = 0;
    
    itemsToConsume.forEach(food => {
      totalCalories += food.calories;
      totalProtein += food.nutritionalValue.protein;
      // Simular otros nutrientes que tendrías en una implementación completa
      totalCarbs += food.nutritionalValue.carbs || 0;
      totalFat += food.nutritionalValue.fat || 0;
      totalSustainability += food.sustainabilityScore;
      
      // Eliminar el alimento de la cocina
      removeFromKitchen(food.id);
    });
    
    // Calcular promedio de sostenibilidad
    const avgSustainability = itemsToConsume.length > 0 
      ? Math.round(totalSustainability / itemsToConsume.length) 
      : 0;
    
    // Determinar la calidad de la comida en base a los nutrientes
    let mealQuality = "regular";
    const hasProtein = totalProtein >= 15;
    const hasBalance = totalCarbs >= 20 && totalFat >= 5;
    
    if (hasProtein && hasBalance && avgSustainability >= 7) {
      mealQuality = "excelente";
    } else if (hasProtein || hasBalance) {
      mealQuality = "buena";
    }
    
    // Actualizar calorías del jugador (simulado)
    if (playerData) {
      console.log(`Comida consumida: ${totalCalories} calorías, ${totalProtein}g proteína, calidad: ${mealQuality}`);
    }
    
    // Mensaje personalizado basado en la calidad
    let message = "";
    if (language === 'en') {
      message = mealQuality === "excelente" 
        ? "Excellent meal! Perfect nutritional balance." 
        : mealQuality === "buena"
        ? "Good meal! Decent nutritional content."
        : "Basic meal prepared. Try to include more variety next time.";
    } else if (language === 'ca') {
      message = mealQuality === "excelente" 
        ? "Àpat excel·lent! Equilibri nutricional perfecte." 
        : mealQuality === "buena"
        ? "Bon àpat! Contingut nutricional decent."
        : "Àpat bàsic preparat. Intenta incloure més varietat la propera vegada.";
    } else {
      message = mealQuality === "excelente" 
        ? "¡Comida excelente! Equilibrio nutricional perfecto." 
        : mealQuality === "buena"
        ? "¡Buena comida! Contenido nutricional decente."
        : "Comida básica preparada. Intenta incluir más variedad la próxima vez.";
    }
    
    // Notificar al usuario
    toast.success(message);
    
    // Resetear selección
    setSelectedItems([]);
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
          calories: 420,
          protein: "22g",
          carbs: "45g",
          fat: "14g"
        },
        sustainabilityScore: 8
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
          calories: 520,
          protein: "18g",
          carbs: "80g",
          fat: "8g"
        },
        sustainabilityScore: 9
      },
      {
        id: "dinner",
        name: language === 'en' ? "Mediterranean Dinner" : 
              language === 'ca' ? "Sopar Mediterrani" : 
              "Cena Mediterránea",
        description: language === 'en' ? "A balanced dinner with fish, vegetables and olive oil" : 
                     language === 'ca' ? "Un sopar equilibrat amb peix, verdures i oli d'oliva" : 
                     "Una cena equilibrada con pescado, verduras y aceite de oliva",
        ingredients: language === 'en' ? ["Fish", "Tomato", "Olive Oil", "Zucchini"] : 
                     language === 'ca' ? ["Peix", "Tomàquet", "Oli d'oliva", "Carbassó"] : 
                     ["Pescado", "Tomate", "Aceite de oliva", "Calabacín"],
        benefits: language === 'en' ? "Contains omega-3 fatty acids and antioxidants" : 
                  language === 'ca' ? "Conté àcids grassos omega-3 i antioxidants" : 
                  "Contiene ácidos grasos omega-3 y antioxidantes",
        nutritionalInfo: {
          calories: 480,
          protein: "32g",
          carbs: "30g",
          fat: "22g"
        },
        sustainabilityScore: 7
      }
    ];
    
    return (
      <div className="grid grid-cols-1 gap-6">
        {recipes.map(recipe => (
          <Card key={recipe.id} className="bg-[#FFFAF0] border-4 border-[#F5D6A4] shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#F9A826] to-[#F48E11] pb-2 border-b-4 border-[#E47F0E]">
              <CardTitle className="text-white text-xl drop-shadow-md">{recipe.name}</CardTitle>
              <p className="text-white text-opacity-90 text-sm">{recipe.description}</p>
            </CardHeader>
            <CardContent className="p-4">
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
              
              <div className="mb-3">
                <h4 className="font-bold text-[#8B5E34] mb-1">{language === 'en' ? 'Nutritional Information' : language === 'ca' ? 'Informació Nutricional' : 'Información Nutricional'}:</h4>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="bg-[#FFE0A3] text-[#8B5E34] p-2 rounded-lg text-center">
                    <div className="font-bold">{recipe.nutritionalInfo.calories}</div>
                    <div>{language === 'en' ? 'Calories' : language === 'ca' ? 'Calories' : 'Calorías'}</div>
                  </div>
                  <div className="bg-[#FFE0A3] text-[#8B5E34] p-2 rounded-lg text-center">
                    <div className="font-bold">{recipe.nutritionalInfo.protein}</div>
                    <div>{language === 'en' ? 'Protein' : language === 'ca' ? 'Proteïna' : 'Proteína'}</div>
                  </div>
                  <div className="bg-[#FFE0A3] text-[#8B5E34] p-2 rounded-lg text-center">
                    <div className="font-bold">{recipe.nutritionalInfo.carbs}</div>
                    <div>{language === 'en' ? 'Carbs' : language === 'ca' ? 'Carbohidrats' : 'Carbohidratos'}</div>
                  </div>
                  <div className="bg-[#FFE0A3] text-[#8B5E34] p-2 rounded-lg text-center">
                    <div className="font-bold">{recipe.nutritionalInfo.fat}</div>
                    <div>{language === 'en' ? 'Fat' : language === 'ca' ? 'Greix' : 'Grasa'}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-[#8B5E34] mb-1">{language === 'en' ? 'Benefits' : language === 'ca' ? 'Beneficis' : 'Beneficios'}:</h4>
                <p className="text-[#7E4E1B] text-sm">{recipe.benefits}</p>
              </div>
              
              <div className="mt-2 flex items-center">
                <span className="text-[#7E4E1B] text-sm font-bold mr-2">
                  {language === 'en' ? 'Sustainability Score:' : 
                   language === 'ca' ? 'Puntuació de Sostenibilitat:' : 
                   'Puntuación de Sostenibilidad:'}
                </span>
                <div className="flex items-center">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span 
                      key={i} 
                      className={`h-2 w-4 rounded-full mx-0.5 ${
                        i < recipe.sustainabilityScore 
                          ? 'bg-green-500' 
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-[#7E4E1B] text-sm">{recipe.sustainabilityScore}/10</span>
              </div>
              
              <Button 
                className="w-full mt-4 bg-gradient-to-r from-[#F9A826] to-[#F48E11] hover:brightness-110 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md border-2 border-[#E47F0E]"
              >
                {language === 'en' ? 'Follow Recipe' : language === 'ca' ? 'Seguir Recepta' : 'Seguir Receta'}
              </Button>
            </CardContent>
          </Card>
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
        
        <div className="bg-[#FFE9D1] p-4 rounded-xl border-2 border-[#F5D6A4] mt-4">
          <h4 className="text-xl font-bold text-[#8B5E34] mb-2">
            {language === 'en' ? 'Nutritional Balance' : language === 'ca' ? 'Equilibri Nutricional' : 'Equilibrio Nutricional'}
          </h4>
          <p className="text-[#7E4E1B] mb-2">
            {language === 'en'
              ? 'A balanced meal should include:'
              : language === 'ca'
              ? 'Un àpat equilibrat hauria d\'incloure:'
              : 'Una comida equilibrada debe incluir:'}
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-bold text-[#8B5E34]">
                {language === 'en' ? 'Proteins' : language === 'ca' ? 'Proteïnes' : 'Proteínas'}:
              </span> 
              {language === 'en'
                ? ' 15-30g per meal (meat, fish, eggs, legumes)'
                : language === 'ca'
                ? ' 15-30g per àpat (carn, peix, ous, llegums)'
                : ' 15-30g por comida (carne, pescado, huevos, legumbres)'}
            </li>
            <li>
              <span className="font-bold text-[#8B5E34]">
                {language === 'en' ? 'Carbohydrates' : language === 'ca' ? 'Carbohidrats' : 'Carbohidratos'}:
              </span> 
              {language === 'en'
                ? ' 45-60g per meal (grains, fruits, vegetables)'
                : language === 'ca'
                ? ' 45-60g per àpat (cereals, fruites, verdures)'
                : ' 45-60g por comida (cereales, frutas, verduras)'}
            </li>
            <li>
              <span className="font-bold text-[#8B5E34]">
                {language === 'en' ? 'Healthy Fats' : language === 'ca' ? 'Greixos Saludables' : 'Grasas Saludables'}:
              </span> 
              {language === 'en'
                ? ' 10-15g per meal (olive oil, nuts, avocado)'
                : language === 'ca'
                ? ' 10-15g per àpat (oli d\'oliva, fruits secs, alvocat)'
                : ' 10-15g por comida (aceite de oliva, frutos secos, aguacate)'}
            </li>
          </ul>
        </div>
        
        <div className="bg-[#E8F5E9] p-4 rounded-xl border-2 border-[#A5D6A7] mt-4">
          <h4 className="text-xl font-bold text-[#2E7D32] mb-2">
            {language === 'en' ? 'Sustainability Score' : language === 'ca' ? 'Puntuació de Sostenibilitat' : 'Puntuación de Sostenibilidad'}
          </h4>
          <p className="text-[#2E7D32] mb-2">
            {language === 'en'
              ? 'The sustainability score indicates the environmental impact of your ingredients. Higher scores mean lower environmental impact.'
              : language === 'ca'
              ? 'La puntuació de sostenibilitat indica l\'impacte ambiental dels teus ingredients. Puntuacions més altes signifiquen un menor impacte ambiental.'
              : 'La puntuación de sostenibilidad indica el impacto ambiental de tus ingredientes. Puntuaciones más altas significan un menor impacto ambiental.'}
          </p>
          <div className="flex items-center mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
            </div>
            <span className="ml-2 text-green-700 font-bold">7/10</span>
          </div>
          <p className="text-sm text-[#2E7D32] mt-2 italic">
            {language === 'en'
              ? 'Aim for a score of 7 or higher for environmentally friendly meals.'
              : language === 'ca'
              ? 'Intenta aconseguir una puntuació de 7 o superior per a àpats respectuosos amb el medi ambient.'
              : 'Intenta conseguir una puntuación de 7 o superior para comidas respetuosas con el medio ambiente.'}
          </p>
        </div>
      </div>
    </div>
  );
  
  // Función para renderizar el contenido de la nevera
  const renderRefrigerator = () => (
    <div className="bg-[#FFF8E9] p-4 rounded-2xl border-4 border-[#F5D6A4] shadow-lg mb-4">
      <h3 className="text-xl font-bold text-[#8B5E34] mb-3 pb-2 border-b-2 border-[#F5D6A4] flex items-center">
        <span className="mr-2 text-2xl">🧊</span> 
        {language === 'en' ? 'Refrigerator' : language === 'ca' ? 'Refrigerador' : 'Refrigerador'}
      </h3>
      <p className="text-[#7E4E1B] mb-3 text-sm italic">
        {language === 'en' 
          ? 'Perishable items that need to be kept cool.'
          : language === 'ca'
          ? 'Articles peribles que necessiten mantenir-se frescos.'
          : 'Artículos perecederos que necesitan mantenerse frescos.'}
      </p>
      <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
        {refrigeratorFood.length === 0 ? (
          <p className="text-[#C68642] py-6 text-center col-span-2 bg-[#FFF8E9] rounded-xl border-2 border-[#F5D6A4] shadow-inner">
            {language === 'en' 
              ? "Your refrigerator is empty. Visit the market to buy fresh food!" 
              : language === 'ca'
              ? "La teva nevera està buida. Visita el mercat per comprar aliments frescos!" 
              : "Tu refrigerador está vacío. ¡Visita el mercado para comprar alimentos frescos!"}
          </p>
        ) : (
          refrigeratorFood.map((food) => (
            <div 
              key={food.id} 
              className={`rounded-xl overflow-hidden border-3 transition-all shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.02] ${
                selectedItems.includes(food.id) 
                  ? 'border-[#4CAF50] bg-[#E8F5E9]' 
                  : 'border-[#F5D6A4] bg-[#FFFAF0] hover:border-[#F9A826]'
              }`}
              onClick={() => handleSelectFoodItem(food.id)}
            >
              <div className="bg-gradient-to-r from-[#A0D9F6] to-[#88C8F7] p-2 border-b-3 border-[#7AB7E8] flex justify-between items-center">
                <span className="font-bold text-white drop-shadow-sm truncate">{getTranslation(food.name)}</span>
                <span className="bg-[#7AB7E8] text-white text-sm py-1 px-2 rounded-lg font-semibold shadow-inner">{food.calories} kcal</span>
              </div>
              <div className="p-2">
                <div className="flex justify-between text-[#7E4E1B] text-xs mb-1">
                  <span>{language === 'en' ? 'Protein' : language === 'ca' ? 'Proteïna' : 'Proteína'}: <b>{food.nutritionalValue.protein}g</b></span>
                  <span>{language === 'en' ? 'Sustainability' : language === 'ca' ? 'Sostenibilitat' : 'Sostenibilidad'}: <b>{food.sustainabilityScore}/10</b></span>
                </div>
                {selectedItems.includes(food.id) && (
                  <div className="bg-[#4CAF50] text-white text-xs py-1 px-2 rounded-lg text-center mt-1">
                    {language === 'en' ? 'Selected' : language === 'ca' ? 'Seleccionat' : 'Seleccionado'}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
  
  // Función para renderizar la despensa
  const renderPantry = () => (
    <div className="bg-[#FFF8E9] p-4 rounded-2xl border-4 border-[#F5D6A4] shadow-lg">
      <h3 className="text-xl font-bold text-[#8B5E34] mb-3 pb-2 border-b-2 border-[#F5D6A4] flex items-center">
        <span className="mr-2 text-2xl">🍯</span> 
        {language === 'en' ? 'Pantry' : language === 'ca' ? 'Rebost' : 'Despensa'}
      </h3>
      <p className="text-[#7E4E1B] mb-3 text-sm italic">
        {language === 'en' 
          ? 'Non-perishable items stored at room temperature.'
          : language === 'ca'
          ? 'Articles no peribles emmagatzemats a temperatura ambient.'
          : 'Artículos no perecederos almacenados a temperatura ambiente.'}
      </p>
      <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
        {pantryFood.length === 0 ? (
          <p className="text-[#C68642] py-6 text-center col-span-2 bg-[#FFF8E9] rounded-xl border-2 border-[#F5D6A4] shadow-inner">
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
              className={`rounded-xl overflow-hidden border-3 transition-all shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.02] ${
                selectedItems.includes(food.id) 
                  ? 'border-[#4CAF50] bg-[#E8F5E9]' 
                  : 'border-[#F5D6A4] bg-[#FFFAF0] hover:border-[#F9A826]'
              }`}
              onClick={() => handleSelectFoodItem(food.id)}
            >
              <div className="bg-gradient-to-r from-[#EDBF69] to-[#D9A84A] p-2 border-b-3 border-[#CD9F3C] flex justify-between items-center">
                <span className="font-bold text-white drop-shadow-sm truncate">{getTranslation(food.name)}</span>
                <span className="bg-[#CD9F3C] text-white text-sm py-1 px-2 rounded-lg font-semibold shadow-inner">{food.calories} kcal</span>
              </div>
              <div className="p-2">
                <div className="flex justify-between text-[#7E4E1B] text-xs mb-1">
                  <span>{language === 'en' ? 'Protein' : language === 'ca' ? 'Proteïna' : 'Proteína'}: <b>{food.nutritionalValue.protein}g</b></span>
                  <span>{language === 'en' ? 'Sustainability' : language === 'ca' ? 'Sostenibilitat' : 'Sostenibilidad'}: <b>{food.sustainabilityScore}/10</b></span>
                </div>
                {selectedItems.includes(food.id) && (
                  <div className="bg-[#4CAF50] text-white text-xs py-1 px-2 rounded-lg text-center mt-1">
                    {language === 'en' ? 'Selected' : language === 'ca' ? 'Seleccionat' : 'Seleccionado'}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
  
  // Función para renderizar los elementos seleccionados
  const renderSelectedItems = () => (
    <div className="bg-[#FFF8E9] p-4 rounded-2xl border-4 border-[#F5D6A4] shadow-lg h-full">
      <h3 className="text-xl font-bold text-[#8B5E34] mb-3 pb-2 border-b-2 border-[#F5D6A4] flex items-center">
        <span className="mr-2 text-2xl">🍳</span>
        {language === 'en' ? 'Selected Items' : language === 'ca' ? 'Elements Seleccionats' : 'Elementos Seleccionados'}
        <span className="ml-2 bg-[#F9CC6A] text-[#8B5E34] text-sm py-1 px-2 rounded-full font-bold">
          {selectedItems.length}
        </span>
      </h3>
      
      {selectedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[200px]">
          <div className="bg-[#FFF8E9] p-6 rounded-xl border-2 border-[#F5D6A4] shadow-inner text-center max-w-xs mx-auto">
            <div className="text-5xl mb-4">🥗</div>
            <p className="text-[#C68642]">
              {language === 'en' 
                ? "Select ingredients from your refrigerator and pantry to cook a meal." 
                : language === 'ca'
                ? "Selecciona ingredients del teu refrigerador i rebost per cuinar un àpat." 
                : "Selecciona ingredientes de tu refrigerador y despensa para cocinar una comida."}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[240px] overflow-y-auto pr-2 mb-4">
            {selectedItems.map(itemId => {
              const item = [...refrigeratorFood, ...pantryFood].find(food => food.id === itemId);
              if (!item) return null;
              
              return (
                <div 
                  key={itemId}
                  className="bg-white rounded-lg shadow p-2 border-2 border-[#F5D6A4] flex flex-col"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="truncate text-sm text-[#8B5E34] font-medium">{getTranslation(item.name)}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectFoodItem(itemId);
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#C68642]">{item.calories} kcal</span>
                    <span className="text-green-600">{item.nutritionalValue.protein}g prot</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Panel de Análisis Nutricional */}
          <div className="bg-[#FFFAF0] p-3 rounded-xl border-2 border-[#F5D6A4] mb-4">
            <h4 className="text-sm font-bold text-[#8B5E34] mb-2">
              {language === 'en' ? 'Nutritional Analysis' : language === 'ca' ? 'Anàlisi Nutricional' : 'Análisis Nutricional'}:
            </h4>
            
            <div className="grid grid-cols-3 gap-2">
              {/* Calcular valores de nutrientes para mostrar */}
              {(() => {
                let totalCalories = 0;
                let totalProtein = 0;
                let totalSustainability = 0;
                
                selectedItems.forEach(itemId => {
                  const item = [...refrigeratorFood, ...pantryFood].find(food => food.id === itemId);
                  if (item) {
                    totalCalories += item.calories;
                    totalProtein += item.nutritionalValue.protein;
                    totalSustainability += item.sustainabilityScore;
                  }
                });
                
                const avgSustainability = selectedItems.length > 0 
                  ? Math.round(totalSustainability / selectedItems.length) 
                  : 0;
                
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
                      <div className="font-bold">{avgSustainability}/10</div>
                      <div className="text-xs">{language === 'en' ? 'Sustainability' : language === 'ca' ? 'Sostenibilitat' : 'Sostenibilidad'}</div>
                    </div>
                  </>
                );
              })()}
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
      <div className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-[#FFF8E9] rounded-3xl shadow-2xl border-8 border-[#CD8E3E]">
        {/* Header de madera estilizado */}
        <div className="bg-gradient-to-r from-[#C68642] to-[#A05F2C] p-4 rounded-t-2xl relative overflow-hidden">
          {/* Textura de madera */}
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+CjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB4PSIxNSIgeT0iMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSIjZjNmNGY2Ij48L3JlY3Q+CjxyZWN0IHg9IjAiIHk9IjE1IiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9IiNmM2Y0ZjYiPjwvcmVjdD4KPC9zdmc+')]"></div>
          
          {/* Botones superiores */}
          <div className="flex justify-between items-center mb-2">
            {/* Botón para cambiar entre guía de cocina y cocina libre */}
            <Button 
              variant={cookingMode === "guided" ? "success" : "default"} 
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                cookingMode === "guided" 
                  ? 'bg-green-500 text-white border-2 border-green-700 hover:bg-green-600' 
                  : 'bg-orange-500 text-white border-2 border-orange-700 hover:bg-orange-600'
              }`}
              onClick={() => {
                console.log("BOTÓN DE MODO CLICADO");
                const newMode = cookingMode === "free" ? "guided" : "free";
                setCookingMode(newMode);
                
                if (newMode === "guided") {
                  toast.success(language === 'en' 
                    ? "Recipe Guide Mode Activated" 
                    : language === 'ca' 
                    ? "Mode de Guia de Receptes Activat" 
                    : "Modo Guía de Recetas Activado");
                } else {
                  toast.info(language === 'en' 
                    ? "Free Cooking Mode" 
                    : language === 'ca' 
                    ? "Mode de Cuina Lliure" 
                    : "Modo Cocina Libre");
                }
              }}
            >
              <div className="flex items-center">
                <span className="mr-2 text-xl">👨‍🍳</span>
                <span>{language === 'en' ? 'Cooking Guide' : language === 'ca' ? 'Guia de Cuina' : 'Guía de Cocina'}</span>
              </div>
            </Button>

            {/* Título con aspecto de cartel de madera (centrado) */}
            <div className="bg-[#BA7D45] px-12 py-3 rounded-2xl shadow-lg border-4 border-[#8B5E34] transform rotate-0 relative">
              <div className="absolute inset-0 rounded-xl opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+CjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB4PSIxNSIgeT0iMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSIjZjNmNGY2Ij48L3JlY3Q+CjxyZWN0IHg9IjAiIHk9IjE1IiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9IiNmM2Y0ZjYiPjwvcmVjdD4KPC9zdmc+')]"></div>
              <h1 className="text-4xl font-bold text-white drop-shadow-lg tracking-wide uppercase">{language === 'en' ? 'Kitchen' : language === 'ca' ? 'Cuina' : 'Cocina'}</h1>
            </div>
            
            {/* Botón de salir (a la derecha) */}
            <button 
              onClick={() => {
                console.log("BOTÓN SALIR PRESIONADO");
                // Disparar evento de teclado Escape para complementar la salida
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
                // Llamar a la función de salida directamente
                onExit();
              }}
              className="bg-gradient-to-r from-[#EF5350] to-[#F44336] hover:from-[#D32F2F] hover:to-[#EF5350] text-white font-bold px-6 py-3 rounded-xl shadow-md border-2 border-[#D32F2F] transform transition-all hover:scale-105"
            >
              {language === 'en' ? 'Exit' : language === 'ca' ? 'Sortir' : 'Salir'}
            </button>
          </div>
          
          {/* Panel de Calorías */}
          <div className="bg-[#FFE9A3] px-6 py-2 rounded-full shadow-md mx-auto w-fit mt-2 border-2 border-[#DFC280]">
            <p className="text-[#8B5E34] font-bold">
              {language === 'en' ? 'Calories' : language === 'ca' ? 'Calories' : 'Calorías'}: 
              <span className="text-[#D35400] ml-2 font-mono">0 / 2620</span>
            </p>
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="p-4">
          {cookingMode === "guided" ? (
            // Mostrar contenido del modo guiado con recetas
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                {renderGuidedRecipes()}
              </div>
              <div>
                {renderCookingGuide()}
              </div>
            </div>
          ) : (
            // Modo de cocina libre (con refrigerador y despensa)
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    {renderRefrigerator()}
                  </TabsContent>
                  
                  <TabsContent value="pantry" className="bg-white p-4 rounded-b-xl border-2 border-[#F9CC6A]">
                    {renderPantry()}
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Panel derecho - Elementos seleccionados */}
              <div>
                {renderSelectedItems()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Kitchen;