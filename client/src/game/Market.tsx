import { useState } from "react";
import { foodItems } from "../data/foodItems";
import { plants, Plant } from "../data/gardenItems";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useFoodStore } from "../stores/useFoodStore";
import { useGameStateStore } from "../stores/useGameStateStore";
import { useLanguage } from "../i18n/LanguageContext";
import { toast } from "sonner";

interface MarketProps {
  onExit: () => void;
}

const Market = ({ onExit }: MarketProps) => {
  const { playerData, addFood, updateCoins, addSeed } = usePlayerStore();
  const { purchasedFood, addPurchasedFood, transferToKitchen } = useFoodStore();
  const { exitBuilding } = useGameStateStore();
  const { t } = useLanguage();
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"food" | "seeds">("food");
  const [cart, setCart] = useState<{item: any, quantity: number, type: "food" | "seed"}[]>([]);
  const [showCart, setShowCart] = useState(false);
  
  // Log state for debugging purposes
  console.log("Market component rendering, showCart =", showCart);
  
  // Get all categories and translate them if needed
  const { language } = useLanguage();
  
  // Traducciones y textos
  const uiTexts = {
    calories: language === 'en' ? "Calories:" : language === 'ca' ? "Calories:" : "Calorías:",
    carbs: language === 'en' ? "Carbs:" : language === 'ca' ? "Carbohidrats:" : "Carbohidratos:",
    proteins: language === 'en' ? "Proteins:" : language === 'ca' ? "Proteïnes:" : "Proteínas:",
    fats: language === 'en' ? "Fats:" : language === 'ca' ? "Greixos:" : "Grasas:",
    sustainability: language === 'en' ? "Sustainability:" : language === 'ca' ? "Sostenibilitat:" : "Sostenibilidad:",
    foodTab: language === 'en' ? "Food" : language === 'ca' ? "Aliments" : "Alimentos",
    seedsTab: language === 'en' ? "Seeds" : language === 'ca' ? "Llavors" : "Semillas",
    growthTime: language === 'en' ? "Growth time:" : language === 'ca' ? "Temps de creixement:" : "Tiempo de crecimiento:",
    difficulty: language === 'en' ? "Difficulty:" : language === 'ca' ? "Dificultat:" : "Dificultad:",
    season: language === 'en' ? "Season:" : language === 'ca' ? "Temporada:" : "Temporada:",
    minutes: language === 'en' ? "minutes" : language === 'ca' ? "minuts" : "minutos",
    add: language === 'en' ? "Add" : language === 'ca' ? "Afegir" : "Añadir",
    buy: language === 'en' ? "Buy" : language === 'ca' ? "Comprar" : "Comprar",
    back: language === 'en' ? "Back" : language === 'ca' ? "Tornar" : "Volver",
    checkout: language === 'en' ? "Checkout" : language === 'ca' ? "Finalitzar compra" : "Finalizar compra",
    notEnoughCoins: language === 'en' ? "You don't have enough iHumancoins!" : language === 'ca' ? "No tens prou iHumancoins!" : "¡No tienes suficientes iHumancoins!",
    purchaseSuccess: language === 'en' ? "Purchase completed successfully!" : language === 'ca' ? "Compra completada amb èxit!" : "¡Compra completada con éxito!",
    foodDelivered: language === 'en' ? "Your food has been delivered to your kitchen." : language === 'ca' ? "Els teus aliments han estat lliurats a la teva cuina." : "Tus alimentos han sido entregados en tu cocina.",
    seedDelivered: language === 'en' ? "Your seeds have been added to your inventory." : language === 'ca' ? "Les teves llavors han estat afegides al teu inventari." : "Tus semillas han sido añadidas a tu inventario."
  };
  
  // Filtrar alimentos por categoría
  const filteredFoodItems = selectedCategory === "all" 
    ? foodItems 
    : foodItems.filter(item => item.category === selectedCategory);
  
  // Obtener todas las categorías
  const allCategories = ["all", ...Array.from(new Set(foodItems.map(item => item.category)))];
  const categories = allCategories;
  
  // Traducir nombres de categorías
  const translateCategory = (category: string): string => {
    if (language === 'en') {
      const translations: Record<string, string> = {
        'all': 'All',
        'fruits': 'Fruits',
        'vegetables': 'Vegetables',
        'proteins': 'Proteins',
        'grains': 'Grains',
        'dairy': 'Dairy'
      };
      return translations[category] || category;
    } else if (language === 'ca') {
      const translations: Record<string, string> = {
        'all': 'Tots',
        'fruits': 'Fruites',
        'vegetables': 'Verdures',
        'proteins': 'Proteïnes',
        'grains': 'Cereals',
        'dairy': 'Làctics'
      };
      return translations[category] || category;
    }
    // Español por defecto
    const translations: Record<string, string> = {
      'all': 'Todos',
      'fruits': 'Frutas',
      'vegetables': 'Verduras',
      'proteins': 'Proteínas',
      'grains': 'Cereales',
      'dairy': 'Lácteos'
    };
    return translations[category] || category;
  };
  
  // Función para traducir los nombres de alimentos
  const translateFoodName = (foodName: string): string => {
    if (language === 'en') {
      const translations: Record<string, string> = {
        'Manzana': 'Apple',
        'Plátano': 'Banana',
        'Brócoli': 'Broccoli',
        'Zanahoria': 'Carrot',
        'Pechuga de Pollo': 'Chicken Breast',
        'Bistec de Ternera': 'Beef Steak',
        'Pescado Sostenible': 'Sustainable Fish',
        'Arroz Integral': 'Brown Rice',
        'Pan Integral': 'Whole Wheat Bread',
        'Patata': 'Potato',
        'Leche': 'Milk',
        'Queso': 'Cheese',
        'Huevos': 'Eggs',
        'Frijoles': 'Beans',
        'Espinaca': 'Spinach',
        'Tomate': 'Tomato',
        'Lechuga': 'Lettuce'
      };
      return translations[foodName] || foodName;
    } else if (language === 'ca') {
      const translations: Record<string, string> = {
        'Manzana': 'Poma',
        'Plátano': 'Plàtan',
        'Brócoli': 'Bròquil',
        'Zanahoria': 'Pastanaga',
        'Pechuga de Pollo': 'Pit de Pollastre',
        'Bistec de Ternera': 'Bistec de Vedella',
        'Pescado Sostenible': 'Peix Sostenible',
        'Arroz Integral': 'Arròs Integral',
        'Pan Integral': 'Pa Integral',
        'Patata': 'Patata',
        'Leche': 'Llet',
        'Queso': 'Formatge',
        'Huevos': 'Ous',
        'Frijoles': 'Mongetes',
        'Espinaca': 'Espinacs',
        'Tomate': 'Tomàquet',
        'Lechuga': 'Enciam'
      };
      return translations[foodName] || foodName;
    }
    return foodName; // Español por defecto
  };
  
  // Traducción de dificultad
  const translateDifficulty = (difficulty: string): string => {
    if (language === 'en') {
      const translations: Record<string, string> = {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced'
      };
      return translations[difficulty] || difficulty;
    } else if (language === 'ca') {
      const translations: Record<string, string> = {
        'beginner': 'Principiant',
        'intermediate': 'Intermedi',
        'advanced': 'Avançat'
      };
      return translations[difficulty] || difficulty;
    }
    // Español por defecto
    const translations: Record<string, string> = {
      'beginner': 'Principiante',
      'intermediate': 'Intermedio',
      'advanced': 'Avanzado'
    };
    return translations[difficulty] || difficulty;
  };
  
  // Traducción de temporada
  const translateSeason = (season: string): string => {
    if (language === 'en') {
      const translations: Record<string, string> = {
        'spring': 'Spring',
        'summer': 'Summer',
        'autumn': 'Autumn',
        'winter': 'Winter',
        'all': 'All seasons'
      };
      return translations[season] || season;
    } else if (language === 'ca') {
      const translations: Record<string, string> = {
        'spring': 'Primavera',
        'summer': 'Estiu',
        'autumn': 'Tardor',
        'winter': 'Hivern',
        'all': 'Totes les estacions'
      };
      return translations[season] || season;
    }
    // Español por defecto
    const translations: Record<string, string> = {
      'spring': 'Primavera',
      'summer': 'Verano',
      'autumn': 'Otoño',
      'winter': 'Invierno',
      'all': 'Todas las estaciones'
    };
    return translations[season] || season;
  };
  
  // Añadir alimento al carrito
  const addFoodToCart = (food: typeof foodItems[0]) => {
    const existingItemIndex = cart.findIndex(
      item => item.item.id === food.id && item.type === "food"
    );
    
    if (existingItemIndex >= 0) {
      // Actualizar cantidad si ya existe
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Añadir nuevo item
      setCart(prev => [...prev, { item: food, quantity: 1, type: "food" }]);
    }
    
    toast.success(`${translateFoodName(food.name)} ${language === 'en' ? 'added to cart' : language === 'ca' ? 'afegit al cistell' : 'añadido al carrito'}`);
  };
  
  // Añadir semilla al carrito
  const addSeedToCart = (seed: Plant) => {
    const existingItemIndex = cart.findIndex(
      item => item.item.id === seed.id && item.type === "seed"
    );
    
    if (existingItemIndex >= 0) {
      // Actualizar cantidad si ya existe
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // Añadir nueva semilla
      setCart(prev => [...prev, { item: seed, quantity: 1, type: "seed" }]);
    }
    
    toast.success(`${translateFoodName(seed.name)} ${language === 'en' ? 'seed added to cart' : language === 'ca' ? 'llavor afegida al cistell' : 'semilla añadida al carrito'}`);
  };
  
  // Actualizar cantidad en el carrito
  const updateCartQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Eliminar el item si la cantidad es 0 o menor
      const updatedCart = [...cart];
      updatedCart.splice(index, 1);
      setCart(updatedCart);
    } else {
      // Actualizar cantidad
      const updatedCart = [...cart];
      updatedCart[index].quantity = newQuantity;
      setCart(updatedCart);
    }
  };
  
  // Calcular total del carrito
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.item.price * item.quantity), 0);
  };
  
  // Procesar compra
  const handleCheckout = () => {
    const total = calculateTotal();
    
    // Verificar fondos suficientes
    if ((playerData?.coins || 0) < total) {
      toast.error(uiTexts.notEnoughCoins);
      return;
    }
    
    // Variables para seguimiento
    const foodItems: string[] = [];
    let hasFoodItems = false;
    let hasSeedItems = false;
    
    // Procesar cada item en el carrito
    cart.forEach(item => {
      if (item.type === "food") {
        hasFoodItems = true;
        // Procesar alimentos
        for (let i = 0; i < item.quantity; i++) {
          const uniqueId = `${item.item.id}-${Date.now()}-${i}`;
          const foodWithId = {
            ...item.item,
            id: uniqueId
          };
          
          addPurchasedFood(foodWithId);
          addFood(foodWithId);
          foodItems.push(uniqueId);
        }
      } else if (item.type === "seed") {
        hasSeedItems = true;
        // Procesar semillas
        for (let i = 0; i < item.quantity; i++) {
          console.log("Añadiendo semilla al inventario:", item.item.name);
          const { addSeed } = usePlayerStore.getState();
          addSeed(item.item);
        }
      }
    });
    
    // Transferir alimentos a la cocina si hay alguno
    if (foodItems.length > 0) {
      transferToKitchen(foodItems);
    }
    
    // Actualizar monedas
    updateCoins(-total);
    
    // Vaciar carrito
    setCart([]);
    
    // Mostrar mensaje de éxito
    if (hasFoodItems && hasSeedItems) {
      toast.success(`${uiTexts.purchaseSuccess} ${uiTexts.foodDelivered} ${uiTexts.seedDelivered}`);
    } else if (hasFoodItems) {
      toast.success(`${uiTexts.purchaseSuccess} ${uiTexts.foodDelivered}`);
    } else if (hasSeedItems) {
      toast.success(`${uiTexts.purchaseSuccess} ${uiTexts.seedDelivered}`);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-gradient-to-b from-amber-50 to-amber-100 rounded-lg shadow-xl border-4 border-amber-800">
        {/* Header con estilo de madera */}
        <div className="bg-amber-800 text-amber-50 p-3 rounded-t-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+CjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB4PSIxNSIgeT0iMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSIjZjNmNGY2Ij48L3JlY3Q+CjxyZWN0IHg9IjAiIHk9IjE1IiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9IiNmM2Y0ZjYiPjwvcmVjdD4KPC9zdmc+')]"></div>
          
          <div className="flex items-center justify-between">
            {/* Botón de carrito en la parte superior izquierda */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg border-2 border-amber-500 transition-all hover:scale-105 relative"
            >
              <div className="flex items-center">
                <span className="mr-2">🛒</span>
                {language === 'en' ? 'CART' : language === 'ca' ? 'CISTELL' : 'CARRITO'}
                <span className="ml-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-red-300 transition-all">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </div>
            </button>
            
            <div className="flex-1 text-center">
              <h1 className="text-4xl font-bold text-amber-50 drop-shadow-md tracking-wide">{t.market}</h1>
            </div>
            
            {/* Botón Salir en la esquina superior derecha */}
            <button
              onClick={onExit}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg border-2 border-red-500 transition-all hover:scale-105"
            >
              {t.exit}
            </button>
          </div>
          
          <div className="flex justify-center items-center mt-2">
            <div className="bg-amber-700 px-4 py-2 rounded-lg text-amber-50 border-2 border-amber-600 shadow-inner">
              <span className="font-semibold">iHumanCoins: </span>
              <span className="text-yellow-300 font-bold text-xl ml-1">{playerData?.coins?.toFixed(0) || 0}</span>
            </div>
          </div>
        </div>
        
        {/* Pestañas principales: Alimentos y Semillas */}
        <div className="bg-amber-300 px-4 pt-2 flex space-x-4 border-b-2 border-amber-700">
          <button 
            onClick={() => setActiveTab('food')}
            className={`font-bold py-3 px-6 rounded-t-lg transition-all text-lg ${
              activeTab === 'food' 
                ? 'bg-amber-50 text-amber-900 border-2 border-b-0 border-amber-700' 
                : 'bg-amber-400 text-amber-800 hover:bg-amber-300'
            }`}
          >
            {uiTexts.foodTab}
          </button>
          <button 
            onClick={() => {
              setActiveTab('seeds');
              setSelectedCategory('all'); // Reset category filter when switching tabs
            }}
            className={`font-bold py-3 px-6 rounded-t-lg transition-all text-lg ${
              activeTab === 'seeds' 
                ? 'bg-amber-50 text-amber-900 border-2 border-b-0 border-amber-700' 
                : 'bg-amber-400 text-amber-800 hover:bg-amber-300'
            }`}
          >
            {uiTexts.seedsTab}
          </button>
        </div>
        
        {/* Tabs de categoría con estilo de pestañas - Solo visible cuando activeTab es 'food' */}
        {activeTab === 'food' && (
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
                {translateCategory(category)}
              </button>
            ))}
          </div>
        )}
        
        {/* Contenido principal: alimentos o semillas */}
        <div className="p-4">
          {activeTab === 'food' ? (
            // Mostrar alimentos
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredFoodItems.map((food) => (
                <div 
                  key={food.id} 
                  className="bg-amber-50 rounded-lg shadow-md border-2 border-amber-300 overflow-hidden hover:border-amber-500 transition-all hover:shadow-lg"
                >
                  {/* Cabecera del item */}
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-3 flex justify-between items-center border-b-2 border-amber-400">
                    <h3 className="text-lg font-bold text-white truncate">
                      {translateFoodName(food.name)}
                    </h3>
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
                          <span className="w-24 text-xs text-amber-800">{uiTexts.calories}</span>
                          <span className="font-bold text-amber-900">{food.calories} kcal</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 text-xs text-amber-800">{uiTexts.carbs}</span>
                          <span className="font-bold text-amber-900">{food.nutritionalValue.carbs}g</span>
                        </div>
                      </div>
                      
                      {/* Columna derecha */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center">
                          <span className="w-24 text-xs text-amber-800">{uiTexts.proteins}</span>
                          <span className="font-bold text-amber-900">{food.nutritionalValue.protein}g</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-24 text-xs text-amber-800">{uiTexts.fats}</span>
                          <span className="font-bold text-amber-900">{food.nutritionalValue.fat}g</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Sostenibilidad */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-amber-800">{uiTexts.sustainability}</span>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < food.sustainabilityScore ? "text-green-500" : "text-gray-300"}>
                            ♻️
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Botón de añadir al carrito */}
                    <button 
                      onClick={() => addFoodToCart(food)}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg transition-all transform hover:scale-105 shadow-md"
                    >
                      {uiTexts.add} +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Mostrar semillas
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {plants.map((plant) => (
                <div 
                  key={plant.id} 
                  className="bg-amber-50 rounded-lg shadow-md border-2 border-green-300 overflow-hidden hover:border-green-500 transition-all hover:shadow-lg"
                >
                  {/* Cabecera del item */}
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 flex justify-between items-center border-b-2 border-green-400">
                    <h3 className="text-lg font-bold text-white truncate">
                      {plant.name}
                    </h3>
                    <span className="font-bold text-yellow-100 bg-green-700 px-2 py-1 rounded-full text-sm border border-green-800">
                      {plant.price} IHC
                    </span>
                  </div>
                  
                  <div className="p-3">
                    {/* Detalles de la semilla */}
                    <div className="flex flex-col gap-1 mb-3">
                      <div className="flex items-center">
                        <span className="w-32 text-xs text-green-800">{uiTexts.growthTime}</span>
                        <span className="font-bold text-green-900">{plant.growthTime} {uiTexts.minutes}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-xs text-green-800">{uiTexts.difficulty}</span>
                        <span className="font-bold text-green-900">{translateDifficulty(plant.difficulty)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-xs text-green-800">{uiTexts.season}</span>
                        <span className="font-bold text-green-900">{translateSeason(plant.season)}</span>
                      </div>
                    </div>
                    
                    {/* Sostenibilidad */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-green-800">{uiTexts.sustainability}</span>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < plant.sustainabilityScore ? "text-green-500" : "text-gray-300"}>
                            ♻️
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Botón de añadir al carrito */}
                    <button 
                      onClick={() => addSeedToCart(plant)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-all transform hover:scale-105 shadow-md"
                    >
                      {uiTexts.add} +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Solo mantenemos el botón flotante de salir en la esquina superior derecha */}
        
        {/* Panel de carrito */}
        {showCart && (
          <div className="fixed right-4 bottom-32 w-96 bg-white rounded-lg shadow-xl border-2 border-amber-600 overflow-hidden max-h-[70vh]">
            <div className="bg-amber-600 text-white font-bold p-3 sticky top-0">
              {language === 'en' ? 'YOUR CART' : language === 'ca' ? 'EL TEU CISTELL' : 'TU CARRITO'}
              <span className="ml-2 opacity-80">
                ({cart.reduce((total, item) => total + item.quantity, 0)} {language === 'en' ? 'Items' : language === 'ca' ? 'Articles' : 'Artículos'})
              </span>
            </div>
            
            <div className="p-3 overflow-auto max-h-[40vh]">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-2">
                  {language === 'en' ? 'Your cart is empty' : language === 'ca' ? 'El teu cistell està buit' : 'Tu carrito está vacío'}
                </p>
              ) : (
                <div className="space-y-2">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <div>
                        <div className="font-medium">
                          {item.type === "food" 
                            ? translateFoodName(item.item.name) 
                            : `${translateFoodName(item.item.name)} (${language === 'en' ? 'Seed' : language === 'ca' ? 'Llavor' : 'Semilla'})`}
                        </div>
                        <div className="text-xs text-gray-500">{item.quantity} x {item.item.price} IHC</div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="font-bold text-amber-700">{item.item.price * item.quantity} IHC</div>
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => updateCartQuantity(index, item.quantity - 1)}
                            className="w-5 h-5 bg-red-100 text-red-600 rounded flex items-center justify-center hover:bg-red-200"
                          >
                            -
                          </button>
                          <span className="text-sm w-5 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(index, item.quantity + 1)}
                            className="w-5 h-5 bg-green-100 text-green-600 rounded flex items-center justify-center hover:bg-green-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-gray-100 p-3 sticky bottom-0 border-t border-gray-200">
              <div className="flex justify-between mb-2">
                <span className="font-bold">{language === 'en' ? 'Total:' : language === 'ca' ? 'Total:' : 'Total:'}</span>
                <span className="font-bold text-amber-700">{calculateTotal()} IHC</span>
              </div>
              <div className="flex justify-between gap-2">
                <button 
                  onClick={() => setShowCart(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded font-bold hover:bg-gray-400 flex-1"
                >
                  {uiTexts.back}
                </button>
                <button 
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || (playerData?.coins || 0) < calculateTotal()}
                  className={`py-2 px-4 rounded font-bold flex-1 ${
                    cart.length === 0 || (playerData?.coins || 0) < calculateTotal()
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {uiTexts.checkout}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Market;