import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFoodStore, StoredFoodItem } from "../stores/useFoodStore";
import { usePlayerStore, FoodItem } from "../stores/usePlayerStore";
import { useGameStateStore } from "../stores/useGameStateStore";
import { useLanguage } from "../i18n/LanguageContext";
import { toast } from "sonner";
import { useExitHelper } from "./ExitHelper";

interface KitchenProps {
  onExit: () => void;
}

const Kitchen = ({ onExit }: KitchenProps) => {
  const { refrigeratorFood, pantryFood, removeFromKitchen } = useFoodStore();
  const { playerData, consumeFood } = usePlayerStore();
  const { t, language } = useLanguage();
  
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [cookingMode, setCookingMode] = useState<"guided" | "free">("guided");
  const [showGuide, setShowGuide] = useState<boolean>(false);
  
  // Función para traducir nombres de elementos
  const getTranslation = (key: string): string => {
    // Implementar lógica de traducción según el idioma actual
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
      console.log(`Comida consumida: ${totalCalories} calorías, ${totalProtein}g proteína`);
    }
    
    // Notificar al usuario
    toast.success(language === 'en' ? "Meal prepared successfully!" : 
                 language === 'ca' ? "Àpat preparat amb èxit!" : 
                 "¡Comida preparada con éxito!");
    
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
                  "Alto en proteínas y carbohidratos complejos para energía sostenida"
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
                  "Rico en fibra y proporciona vitaminas y minerales esenciales"
      }
    ];
    
    return (
      <div className="grid grid-cols-1 gap-4">
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
              <div>
                <h4 className="font-bold text-[#8B5E34] mb-1">{language === 'en' ? 'Benefits' : language === 'ca' ? 'Beneficis' : 'Beneficios'}:</h4>
                <p className="text-[#7E4E1B] text-sm">{recipe.benefits}</p>
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
        
        <h4 className="text-xl font-bold text-[#8B5E34] mt-6 mb-2">
          {language === 'en' ? 'Refrigerator and Pantry Organization' : language === 'ca' ? 'Organització del Refrigerador i Rebost' : 'Organización del Refrigerador y Despensa'}:
        </h4>
        
        <ul className="list-disc pl-6 space-y-2">
          <li>
            {language === 'en' 
              ? 'Refrigerator: Store perishable items that need cooling to stay fresh, like dairy, fruits, vegetables, and proteins.'
              : language === 'ca'
              ? 'Refrigerador: Emmagatzema articles peribles que necessiten refrigeració per mantenir-se frescos, com làctics, fruites, verdures i proteïnes.'
              : 'Refrigerador: Almacena artículos perecederos que necesitan refrigeración para mantenerse frescos, como lácteos, frutas, verduras y proteínas.'}
          </li>
          <li>
            {language === 'en' 
              ? 'Pantry: Store non-perishable items like grains, canned goods, spices, and oils at room temperature.'
              : language === 'ca'
              ? 'Rebost: Emmagatzema articles no peribles com cereals, conserves, espècies i olis a temperatura ambient.'
              : 'Despensa: Almacena artículos no perecederos como cereales, conservas, especias y aceites a temperatura ambiente.'}
          </li>
        </ul>
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
                  <span>{language === 'en' ? 'Sustainability' : language === 'ca' ? 'Sostenibilitat' : 'Sostenibilidad'}: <b>{food.sustainabilityScore}/5</b></span>
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
              <div className="bg-gradient-to-r from-[#E6C88D] to-[#D4AD6A] p-2 border-b-3 border-[#C69C5B] flex justify-between items-center">
                <span className="font-bold text-white drop-shadow-sm truncate">{getTranslation(food.name)}</span>
                <span className="bg-[#C69C5B] text-white text-sm py-1 px-2 rounded-lg font-semibold shadow-inner">{food.calories} kcal</span>
              </div>
              <div className="p-2">
                <div className="flex justify-between text-[#7E4E1B] text-xs mb-1">
                  <span>{language === 'en' ? 'Protein' : language === 'ca' ? 'Proteïna' : 'Proteína'}: <b>{food.nutritionalValue.protein}g</b></span>
                  <span>{language === 'en' ? 'Sustainability' : language === 'ca' ? 'Sostenibilitat' : 'Sostenibilidad'}: <b>{food.sustainabilityScore}/5</b></span>
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

  // Añadir un efecto para ver los valores de refrigeratorFood y pantryFood y estado de botones
  useEffect(() => {
    console.log("Nevera:", refrigeratorFood);
    console.log("Despensa:", pantryFood);
    console.log("Estado actual - Modo:", cookingMode, "- Guía:", showGuide);
  }, [refrigeratorFood, pantryFood, cookingMode, showGuide]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-[#FFF8E9] rounded-3xl shadow-2xl border-8 border-[#CD8E3E]">
        {/* Header de madera estilizado */}
        <div className="bg-gradient-to-r from-[#C68642] to-[#A05F2C] p-4 rounded-t-2xl relative overflow-hidden">
          {/* Textura de madera */}
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+CjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB4PSIxNSIgeT0iMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSIjZjNmNGY2Ij48L3JlY3Q+CjxyZWN0IHg9IjAiIHk9IjE1IiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9IiNmM2Y0ZjYiPjwvcmVjdD4KPC9zdmc+')]"></div>
          
          {/* Botones superiores */}
          <div className="flex justify-between items-center mb-2">
            {/* Botón de Funciones (a la izquierda) */}
            <button
              onClick={() => {
                if (cookingMode === "guided") {
                  setCookingMode("free");
                  setShowGuide(false);
                } else {
                  setShowGuide(!showGuide);
                }
                console.log("Cambiando modo de cocina desde botón superior");
              }}
              className="bg-gradient-to-r from-[#E67E22] to-[#F39C12] text-white px-6 py-2 rounded-lg font-bold shadow-md border-2 border-[#D35400] hover:from-[#D35400] hover:to-[#E67E22] transition duration-300"
            >
              {cookingMode === "guided" ? 
                (language === 'en' ? 'Free Cooking' : language === 'ca' ? 'Cuina Lliure' : 'Cocina Libre') : 
                (language === 'en' ? 'Cooking Guide' : language === 'ca' ? 'Guia de Cuina' : 'Guía de Cocina')}
            </button>

            {/* Título con aspecto de cartel de madera (centrado) */}
            <div className="bg-[#BA7D45] px-12 py-3 rounded-2xl shadow-lg border-4 border-[#8B5E34] transform rotate-0 relative">
              <div className="absolute inset-0 rounded-xl opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+CjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB4PSIxNSIgeT0iMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSIjZjNmNGY2Ij48L3JlY3Q+CjxyZWN0IHg9IjAiIHk9IjE1IiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9IiNmM2Y0ZjYiPjwvcmVjdD4KPC9zdmc+')]"></div>
              <h1 className="text-4xl font-bold text-white drop-shadow-lg tracking-wide uppercase">{language === 'en' ? 'Kitchen' : language === 'ca' ? 'Cuina' : 'Cocina'}</h1>
            </div>

            {/* Botón Salir estilo sencillo con ExitHelper */}
            <div className="relative">
              <button
                onClick={() => {
                  console.log("Saliendo de la cocina con posición segura");
                  // Usamos helper para salir correctamente
                  const { exitBuilding } = useExitHelper();
                  exitBuilding("kitchen");
                  
                  // Llamamos a onExit para limpieza de componente
                  onExit();
                }}
                className="bg-[#E57373] hover:bg-[#EF5350] py-3 px-12 rounded-full shadow-md border-2 border-[#C62828] transition duration-300"
              >
                <span className="text-white font-bold text-xl">
                  {language === 'en' ? 'Exit' : language === 'ca' ? 'Sortir' : 'Salir'}
                </span>
              </button>
            </div>
          </div>
          
          {/* Contador de calorías */}
          <div className="flex justify-center mt-2">
            <div className="bg-gradient-to-r from-[#F9D423] to-[#F5AB1B] px-6 py-3 rounded-xl text-[#7E4E1B] border-2 border-[#EDA617] shadow-lg">
              <span className="font-bold">{language === 'en' ? 'Calories' : language === 'ca' ? 'Calories' : 'Calorías'}: </span>
              <span className="text-[#7E4E1B] font-bold text-xl ml-1">
                {playerData?.caloriesConsumed?.toFixed(0) || 0} / {playerData?.dailyCalories?.toFixed(0) || 0}
              </span>
            </div>
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="p-4">
          {/* Modo de cocina (guiada o libre) */}
          <div className="mb-4 flex justify-center">
            <div className="grid grid-cols-2 gap-4 w-full max-w-xl">
              <Button 
                onClick={() => {
                  console.log("Seleccionando Cocina Libre desde botones centrales");
                  setCookingMode("free");
                  setShowGuide(false);
                }}
                className={`py-3 px-8 rounded-xl font-bold transition-all shadow-md 
                  ${cookingMode === "free" 
                  ? 'bg-gradient-to-r from-[#F48E11] to-[#F9A826] text-white border-3 border-[#E47F0E]' 
                  : 'bg-gradient-to-r from-[#FFD166] to-[#FFBD3E] text-[#7E4E1B] border-2 border-[#FFBD3E]'}
                `}
              >
                {language === 'en' ? 'Free Cooking' : language === 'ca' ? 'Cuina Lliure' : 'Cocina Libre'}
              </Button>
              
              <Button 
                onClick={() => {
                  console.log("Seleccionando Guía de Cocina desde botones centrales");
                  setShowGuide(true);
                }}
                className={`py-3 px-8 rounded-xl font-bold transition-all shadow-md 
                  ${showGuide 
                  ? 'bg-gradient-to-r from-[#F48E11] to-[#F9A826] text-white border-3 border-[#E47F0E]' 
                  : 'bg-gradient-to-r from-[#FFD166] to-[#FFBD3E] text-[#7E4E1B] border-2 border-[#FFBD3E]'}
                `}
              >
                {language === 'en' ? 'Cooking Guide' : language === 'ca' ? 'Guia de Cuina' : 'Guía de Cocina'}
              </Button>
            </div>
          </div>
          
          {showGuide ? (
            // Guía de Cocina
            renderCookingGuide()
          ) : cookingMode === "free" ? (
            // Modo de Cocina Libre
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Panel izquierdo - Ingredientes disponibles */}
              <div>
                <Tabs defaultValue="refrigerator" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-4 bg-[#FFD166] px-4 pt-3 flex space-x-2 overflow-x-auto border-b-4 border-[#CD8E3E] rounded-t-lg">
                    <TabsTrigger 
                      value="refrigerator" 
                      className="text-[#8B5E34] font-bold transition-all px-4 py-3 data-[state=active]:bg-white rounded-t-lg data-[state=active]:border-2 data-[state=active]:border-b-0 data-[state=active]:border-[#CD8E3E]"
                    >
                      {language === 'en' ? 'Refrigerator' : language === 'ca' ? 'Refrigerador' : 'Refrigerador'}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="pantry" 
                      className="text-[#8B5E34] font-bold transition-all px-4 py-3 data-[state=active]:bg-white rounded-t-lg data-[state=active]:border-2 data-[state=active]:border-b-0 data-[state=active]:border-[#CD8E3E]"
                    >
                      {language === 'en' ? 'Pantry' : language === 'ca' ? 'Rebost' : 'Despensa'}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="refrigerator" className="mt-0">
                    {renderRefrigerator()}
                  </TabsContent>
                  
                  <TabsContent value="pantry" className="mt-0">
                    {renderPantry()}
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Panel derecho - Elementos seleccionados y botón de cocinar */}
              <div className="bg-[#FFF8E9] p-4 rounded-2xl border-4 border-[#F5D6A4] shadow-lg">
                <h3 className="text-xl font-bold text-[#8B5E34] mb-3 pb-2 border-b-2 border-[#F5D6A4] flex items-center">
                  <span className="mr-2 text-2xl">👨‍🍳</span> 
                  {language === 'en' ? 'Selected Items' : language === 'ca' ? 'Elements Seleccionats' : 'Elementos Seleccionados'}
                </h3>
                
                <div className="max-h-[400px] overflow-y-auto pr-2 mb-4">
                  {selectedItems.length === 0 ? (
                    <p className="text-[#C68642] py-6 text-center bg-[#FFF8E9] rounded-xl border-2 border-[#F5D6A4] shadow-inner">
                      {language === 'en' 
                        ? "Select ingredients from your refrigerator and pantry to start cooking!" 
                        : language === 'ca'
                        ? "Selecciona ingredients del teu refrigerador i rebost per començar a cuinar!" 
                        : "¡Selecciona ingredientes de tu refrigerador y despensa para empezar a cocinar!"}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {[...refrigeratorFood, ...pantryFood]
                        .filter(item => selectedItems.includes(item.id))
                        .map(food => (
                          <div 
                            key={food.id} 
                            className="bg-[#FFFAF0] rounded-xl p-3 border-2 border-[#4CAF50] flex justify-between items-center"
                          >
                            <div>
                              <span className="font-bold text-[#8B5E34]">{getTranslation(food.name)}</span>
                              <div className="text-[#7E4E1B] text-xs">
                                <span>{food.calories} kcal</span>
                                <span className="mx-1">•</span>
                                <span>{food.nutritionalValue.protein}g {language === 'en' ? 'protein' : language === 'ca' ? 'proteïna' : 'proteína'}</span>
                              </div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation(); // Evitar que se propague al div padre
                                handleSelectFoodItem(food.id);
                              }}
                              className="bg-[#E74C3C] text-white rounded-full p-1 hover:bg-[#C0392B] transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-4">
                  {selectedItems.length > 0 && (
                    <div>
                      <h4 className="font-bold text-[#8B5E34] mb-2">
                        {language === 'en' ? 'Nutritional Summary' : language === 'ca' ? 'Resum Nutricional' : 'Resumen Nutricional'}:
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#E8F5E9] p-3 rounded-lg border border-[#4CAF50]">
                          <p className="text-sm text-[#2E7D32] font-bold">{language === 'en' ? 'Total Calories' : language === 'ca' ? 'Calories Totals' : 'Calorías Totales'}</p>
                          <p className="text-xl font-bold text-[#1B5E20]">
                            {[...refrigeratorFood, ...pantryFood]
                              .filter(item => selectedItems.includes(item.id))
                              .reduce((sum, item) => sum + item.calories, 0)
                              .toFixed(0)} kcal
                          </p>
                        </div>
                        <div className="bg-[#E3F2FD] p-3 rounded-lg border border-[#2196F3]">
                          <p className="text-sm text-[#1565C0] font-bold">{language === 'en' ? 'Total Protein' : language === 'ca' ? 'Proteïna Total' : 'Proteína Total'}</p>
                          <p className="text-xl font-bold text-[#0D47A1]">
                            {[...refrigeratorFood, ...pantryFood]
                              .filter(item => selectedItems.includes(item.id))
                              .reduce((sum, item) => sum + item.nutritionalValue.protein, 0)
                              .toFixed(1)}g
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleCook}
                    disabled={selectedItems.length === 0}
                    className="w-full bg-gradient-to-r from-[#4CAF50] to-[#3F9142] hover:brightness-110 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md border-2 border-[#2E7D32] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {language === 'en' ? 'Cook Meal' : language === 'ca' ? 'Cuinar Àpat' : 'Cocinar Comida'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Modo guiado (sin mostrar la guía)
            renderGuidedRecipes()
          )}
        </div>
      </div>
    </div>
  );
};

export default Kitchen;