import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { foodItems } from "../data/foodItems";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useFoodStore } from "../stores/useFoodStore";
import { useGameStateStore } from "../stores/useGameStateStore";
import { useLanguage } from "../i18n/LanguageContext";
import { plants, Plant } from "../data/gardenItems";
import { toast } from "sonner";

interface MarketProps {
  onExit: () => void;
}

const Market = ({ onExit }: MarketProps) => {
  const { playerData, addFood, updateCoins } = usePlayerStore();
  const { purchasedFood, addPurchasedFood, transferToKitchen } = useFoodStore();
  const { exitBuilding, setGameState } = useGameStateStore();
  const { t } = useLanguage(); // Hook para acceder a las traducciones
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"food" | "seeds">("food");
  const [cart, setCart] = useState<{item: typeof foodItems[0], quantity: number}[]>([]);
  const [showCart, setShowCart] = useState(false);
  
  // Log state for debugging purposes
  console.log("Market component rendering, showCart =", showCart);
  
  // Get all categories and translate them if needed
  const { language } = useLanguage();
  
  // Textos de la interfaz según el idioma
  const uiTexts = (() => {
    if (language === 'en') {
      return {
        carbos: "Carbs",
        proteinas: "Proteins",
        grasas: "Fats",
        sostenibilidad: "Sustainability",
        comprar: "Buy",
        agregar: "Add",
        todoItems: "All",
        frutas: "Fruits",
        verduras: "Vegetables",
        proteínas: "Proteins",
        cereales: "Cereals",
        lácteos: "Dairy",
        all: "All",
        noSuficiente: "You don't have enough iHumancoins!",
        compraExitosa: "Purchase completed successfully! Your items have been delivered to your kitchen.",
        itemComprado: "purchased successfully",
        calories: "Calories:",
        carbs: "Carbs:",
        proteins: "Proteins:",
        fats: "Fats:",
        sustainability: "Sustainability:",
        foodTab: "Food",
        seedsTab: "Seeds",
        seedsPurchased: "Seeds purchased successfully! You can use them in your garden.",
        growthTime: "Growth time:",
        difficulty: "Difficulty:",
        season: "Season:",
        minutes: "minutes"
      };
    } else if (language === 'ca') {
      return {
        carbos: "Carbohidrats",
        proteinas: "Proteïnes",
        grasas: "Greixos",
        sostenibilidad: "Sostenibilitat",
        comprar: "Comprar",
        agregar: "Afegir",
        todoItems: "Tots",
        frutas: "Fruites",
        verduras: "Verdures",
        proteínas: "Proteïnes",
        cereales: "Cereals",
        lácteos: "Làctics",
        all: "Tots",
        noSuficiente: "No tens prou iHumancoins!",
        compraExitosa: "Compra completada amb èxit! Els teus articles han estat lliurats a la teva cuina.",
        itemComprado: "comprat correctament",
        calories: "Calories:",
        carbs: "Carbohidrats:",
        proteins: "Proteïnes:",
        fats: "Greixos:",
        sustainability: "Sostenibilitat:",
        foodTab: "Aliments",
        seedsTab: "Llavors",
        seedsPurchased: "Llavors comprades amb èxit! Pots utilitzar-les al teu hort.",
        growthTime: "Temps de creixement:",
        difficulty: "Dificultat:",
        season: "Temporada:",
        minutes: "minuts"
      };
    } else {
      return {
        carbos: "Carbos",
        proteinas: "Proteínas",
        grasas: "Grasas",
        sostenibilidad: "Sostenibilidad",
        comprar: "Comprar",
        agregar: "Agregar",
        todoItems: "Todos",
        frutas: "Frutas",
        verduras: "Verduras",
        proteínas: "Proteínas",
        cereales: "Cereales",
        lácteos: "Lácteos",
        all: "Todos",
        noSuficiente: "¡No tienes suficientes iHumancoins!",
        compraExitosa: "¡Compra completada con éxito! Tus artículos han sido entregados en tu cocina.",
        itemComprado: "comprado correctamente",
        calories: "Calorías:",
        carbs: "Carbos:",
        proteins: "Proteínas:",
        fats: "Grasas:",
        sustainability: "Sostenibilidad:",
        foodTab: "Alimentos",
        seedsTab: "Semillas",
        seedsPurchased: "¡Semillas compradas con éxito! Puedes utilizarlas en tu huerto.",
        growthTime: "Tiempo de crecimiento:",
        difficulty: "Dificultad:",
        season: "Temporada:",
        minutes: "minutos"
      };
    }
  })();
  
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
        'Espinaca': 'Spinach'
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
        'Espinaca': 'Espinacs'
      };
      return translations[foodName] || foodName;
    }
    return foodName; // Español por defecto
  };

  // Función para traducir las descripciones de alimentos
  const translateFoodDescription = (desc: string): string => {
    if (language === 'en') {
      const translations: Record<string, string> = {
        "Una manzana crujiente, rica en fibra y vitaminas. Bajo impacto ambiental.": 
          "A crisp apple, rich in fiber and vitamins. Low environmental impact.",
        "Plátano rico en potasio, excelente para la energía. Impacto moderado en transporte.":
          "Banana rich in potassium, excellent for energy. Moderate impact on transportation.",
        "Brócoli denso en nutrientes, alto en fibra y vitaminas C y K. Bajo consumo de agua.":
          "Broccoli dense in nutrients, high in fiber and vitamins C and K. Low water consumption.",
        "Zanahorias ricas en beta-caroteno. Bajo impacto ambiental en su cultivo.":
          "Carrots rich in beta-carotene. Low environmental impact in cultivation.",
        "Fuente de proteína magra. Impacto ambiental moderado comparado con la carne roja.":
          "Source of lean protein. Moderate environmental impact compared to red meat.",
        "Alto en hierro y proteínas. Alto impacto ambiental con uso significativo de agua.":
          "High in iron and protein. High environmental impact with significant water usage.",
        "Rico en ácidos grasos omega-3. Capturado de forma sostenible con mínimo impacto en el ecosistema.":
          "Rich in omega-3 fatty acids. Sustainably caught with minimal impact on the ecosystem.",
        "Arroz integral con fibra. Uso moderado de agua para su cultivo.":
          "Brown rice with fiber. Moderate water usage for cultivation.",
        "Carbohidratos complejos y fibra. Menor impacto ambiental que el pan refinado.":
          "Complex carbohydrates and fiber. Lower environmental impact than refined bread.",
        "Hortaliza de raíz versátil. Requisitos relativamente bajos de agua y tierra para su cultivo.":
          "Versatile root vegetable. Relatively low water and land requirements for cultivation.",
        "Buena fuente de calcio. Impacto ambiental moderado por la producción láctea.":
          "Good source of calcium. Moderate environmental impact from dairy production.",
        "Alto en calcio y proteínas. Mayor impacto ambiental debido al procesamiento lácteo.":
          "High in calcium and protein. Higher environmental impact due to dairy processing.",
        "Fuente de proteínas rica en nutrientes. Impacto ambiental moderado comparado con la carne.":
          "Nutrient-rich protein source. Moderate environmental impact compared to meat.",
        "Excelente fuente de proteína vegetal. Bajo impacto ambiental y fijación de nitrógeno para el suelo.":
          "Excellent source of plant protein. Low environmental impact and nitrogen fixation for soil.",
        "Rica en hierro y vitaminas. Baja huella ambiental en su cultivo.":
          "Rich in iron and vitamins. Low environmental footprint in cultivation."
      };
      return translations[desc] || desc;
    } else if (language === 'ca') {
      const translations: Record<string, string> = {
        "Una manzana crujiente, rica en fibra y vitaminas. Bajo impacto ambiental.": 
          "Una poma cruixent, rica en fibra i vitamines. Baix impacte ambiental.",
        "Plátano rico en potasio, excelente para la energía. Impacto moderado en transporte.":
          "Plàtan ric en potassi, excel·lent per a l'energia. Impacte moderat en transport.",
        "Brócoli denso en nutrientes, alto en fibra y vitaminas C y K. Bajo consumo de agua.":
          "Bròquil dens en nutrients, alt en fibra i vitamines C i K. Baix consum d'aigua.",
        "Zanahorias ricas en beta-caroteno. Bajo impacto ambiental en su cultivo.":
          "Pastanagues riques en beta-carotè. Baix impacte ambiental en el seu cultiu.",
        "Fuente de proteína magra. Impacto ambiental moderado comparado con la carne roja.":
          "Font de proteïna magra. Impacte ambiental moderat comparat amb la carn vermella.",
        "Alto en hierro y proteínas. Alto impacto ambiental con uso significativo de agua.":
          "Alt en ferro i proteïnes. Alt impacte ambiental amb ús significatiu d'aigua.",
        "Rico en ácidos grasos omega-3. Capturado de forma sostenible con mínimo impacto en el ecosistema.":
          "Ric en àcids grassos omega-3. Capturat de forma sostenible amb mínim impacte en l'ecosistema.",
        "Arroz integral con fibra. Uso moderado de agua para su cultivo.":
          "Arròs integral amb fibra. Ús moderat d'aigua pel seu cultiu.",
        "Carbohidratos complejos y fibra. Menor impacto ambiental que el pan refinado.":
          "Carbohidrats complexos i fibra. Menor impacte ambiental que el pa refinat.",
        "Hortaliza de raíz versátil. Requisitos relativamente bajos de agua y tierra para su cultivo.":
          "Hortalissa d'arrel versàtil. Requisits relativament baixos d'aigua i terra pel seu cultiu.",
        "Buena fuente de calcio. Impacto ambiental moderado por la producción láctea.":
          "Bona font de calci. Impacte ambiental moderat per la producció làctia.",
        "Alto en calcio y proteínas. Mayor impacto ambiental debido al procesamiento lácteo.":
          "Alt en calci i proteïnes. Major impacte ambiental a causa del processament làctic.",
        "Fuente de proteínas rica en nutrientes. Impacto ambiental moderado comparado con la carne.":
          "Font de proteïnes rica en nutrients. Impacte ambiental moderat comparat amb la carn.",
        "Excelente fuente de proteína vegetal. Bajo impacto ambiental y fijación de nitrógeno para el suelo.":
          "Excel·lent font de proteïna vegetal. Baix impacte ambiental i fixació de nitrogen pel sòl.",
        "Rica en hierro y vitaminas. Baja huella ambiental en su cultivo.":
          "Rica en ferro i vitamines. Baixa petjada ambiental en el seu cultiu."
      };
      return translations[desc] || desc;
    }
    return desc; // Español por defecto
  };
  
  // Filtrar alimentos por categoría
  const filteredFoodItems = selectedCategory === "all" 
    ? foodItems 
    : foodItems.filter(item => item.category === selectedCategory);
  
  // Obtener todas las categorías
  const allCategories = ["all", ...Array.from(new Set(foodItems.map(item => item.category)))];
  const categories = allCategories;
  
  // Add food item to cart
  const addToCart = (foodItem: typeof foodItems[0]) => {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.item.id === foodItem.id);
    
    if (existingItem) {
      // Update quantity if it exists
      setCart(prevCart => prevCart.map(item => 
        item.item.id === foodItem.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      // Add new item to cart
      setCart(prevCart => [...prevCart, { item: foodItem, quantity: 1 }]);
    }
    
    // Ya no mostramos automáticamente el panel, solo actualizamos el contador
    
    // Show notification
    toast.success(`${translateFoodName(foodItem.name)} ${language === 'en' ? 'added to cart' : language === 'ca' ? 'afegit al cistell' : 'añadido al carrito'}`);
    
    // Log para depuración
    console.log("Item added to cart:", foodItem.name, "- Cart now has", cart.length + (existingItem ? 0 : 1), "different items");
    
    // Actualizar el contador del carrito
    const updatedCart = existingItem 
      ? [...cart.filter(item => item.item.id !== foodItem.id), { ...existingItem, quantity: existingItem.quantity + 1 }]
      : [...cart, { item: foodItem, quantity: 1 }];
      
    const totalItems = updatedCart.reduce((total, item) => total + item.quantity, 0);
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
      cartCounter.textContent = totalItems.toString();
      
      // Efecto visual de "bounce" para el contador
      cartCounter.classList.add('scale-125');
      setTimeout(() => cartCounter.classList.remove('scale-125'), 300);
    }
  };
  
  // Convertir una planta a formato de item para el carrito
  const plantToCartItem = (plant: Plant) => {
    return {
      id: `seed-${plant.id}`,
      name: `${language === 'en' ? 'Seed: ' : language === 'ca' ? 'Llavor: ' : 'Semilla: '}${plant.name}`,
      category: 'seeds',
      calories: 0,
      nutritionalValue: {
        protein: 0,
        carbs: 0,
        fat: 0
      },
      sustainabilityScore: plant.sustainabilityScore,
      price: plant.price,
      description: plant.description,
      // Añadimos información extra para identificar que es una semilla
      meta: {
        isSeed: true,
        plantId: plant.id
      }
    };
  };
  
  // Añadir semilla al carrito
  const addSeedToCart = (plant: Plant) => {
    const seedItem = plantToCartItem(plant);
    
    // Check if seed already exists in cart
    const existingItem = cart.find(item => item.item.id === seedItem.id);
    
    if (existingItem) {
      // Update quantity if it exists
      setCart(prevCart => prevCart.map(item => 
        item.item.id === seedItem.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      // Add new seed to cart
      setCart(prevCart => [...prevCart, { item: seedItem, quantity: 1 }]);
    }
    
    // Show notification
    toast.success(`${seedItem.name} ${language === 'en' ? 'added to cart' : language === 'ca' ? 'afegit al cistell' : 'añadido al carrito'}`);
    
    // Log para depuración
    console.log("Seed added to cart:", seedItem.name);
    
    // Actualizar el contador del carrito
    const updatedCart = existingItem 
      ? [...cart.filter(item => item.item.id !== seedItem.id), { ...existingItem, quantity: existingItem.quantity + 1 }]
      : [...cart, { item: seedItem, quantity: 1 }];
      
    const totalItems = updatedCart.reduce((total, item) => total + item.quantity, 0);
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
      cartCounter.textContent = totalItems.toString();
      
      // Efecto visual de "bounce" para el contador
      cartCounter.classList.add('scale-125');
      setTimeout(() => cartCounter.classList.remove('scale-125'), 300);
    }
  };
  
  // Remove item from cart
  const removeFromCart = (foodId: string) => {
    setCart(prevCart => prevCart.filter(item => item.item.id !== foodId));
  };
  
  // Get total price of all items in cart
  const getTotalCartPrice = () => {
    return cart.reduce((total, item) => total + (item.item.price * item.quantity), 0);
  };
  
  // Handle checkout (purchase all items in cart)
  const handleCheckout = () => {
    const totalPrice = getTotalCartPrice();
    
    // Check if player has enough coins
    if ((playerData?.coins || 0) < totalPrice) {
      toast.error(uiTexts.noSuficiente);
      return;
    }
    
    // Array para guardar los IDs de los alimentos que se transferirán a la cocina
    const foodIdsToTransfer: string[] = [];
    // Contador de semillas compradas
    let seedsPurchased = false;
    
    // Purchase all items
    cart.forEach(cartItem => {
      // Verificar si es una semilla o un alimento
      const isSeed = cartItem.item.id.startsWith('seed-');
      
      // Repetir según la cantidad
      for (let i = 0; i < cartItem.quantity; i++) {
        if (isSeed) {
          // Es una semilla, extraer el ID de la planta
          const plantId = (cartItem.item as any).meta?.plantId;
          if (plantId) {
            // Buscar la planta correspondiente
            const plant = plants.find(p => p.id === plantId);
            if (plant) {
              // Añadir semilla al inventario del jugador
              const { addSeed } = usePlayerStore.getState();
              addSeed(plant);
              seedsPurchased = true;
            }
          }
        } else {
          // Es un alimento normal
          // Crear un ID único para cada elemento (incluso si son del mismo tipo)
          const uniqueId = `${cartItem.item.id}-${Date.now()}-${i}`;
          const itemWithUniqueId = {
            ...cartItem.item,
            id: uniqueId
          };
          
          // Añadir a la compra y al inventario del jugador
          addPurchasedFood(itemWithUniqueId);
          addFood(itemWithUniqueId);
          
          // Añadir a la lista para transferir a la cocina
          foodIdsToTransfer.push(uniqueId);
        }
      }
    });
    
    // Transferir alimentos a la cocina (refrigerador o despensa) si hay alguno
    if (foodIdsToTransfer.length > 0) {
      transferToKitchen(foodIdsToTransfer);
    }
    
    // Update player coins
    updateCoins(-totalPrice);
    
    // Clear cart
    setCart([]);
    
    // Show success message
    if (seedsPurchased && foodIdsToTransfer.length === 0) {
      toast.success(uiTexts.seedsPurchased);
    } else if (seedsPurchased && foodIdsToTransfer.length > 0) {
      toast.success(`${uiTexts.compraExitosa} ${uiTexts.seedsPurchased}`);
    } else {
      toast.success(uiTexts.compraExitosa);
    }
    
    // Ocultar el panel del carrito
    const cartPanel = document.getElementById('cart-panel');
    if (cartPanel) {
      cartPanel.style.display = 'none';
    }
    
    // Reset el contador del carrito
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
      cartCounter.textContent = "0";
    }
  };
  
  // Handle direct purchase (old method, kept for compatibility)
  const handlePurchase = (foodItem: typeof foodItems[0]) => {
    // Check if player has enough coins
    if ((playerData?.coins || 0) < foodItem.price) {
      toast.error(uiTexts.noSuficiente);
      return;
    }
    
    // Update player coins
    updateCoins(-(foodItem.price));
    
    // Add food to inventory
    addPurchasedFood(foodItem);
    addFood(foodItem);
    
    // Show success message
    toast.success(`${translateFoodName(foodItem.name)} ${uiTexts.itemComprado}`);
  };
  
  // Translate category name based on current language
  const translateCategory = (category: string): string => {
    if (category === 'all') return uiTexts.all;
    if (category === 'frutas') return language === 'en' ? 'Fruits' : language === 'ca' ? 'Fruites' : 'Frutas';
    if (category === 'verduras') return language === 'en' ? 'Vegetables' : language === 'ca' ? 'Verdures' : 'Verduras';
    if (category === 'proteínas') return language === 'en' ? 'Proteins' : language === 'ca' ? 'Proteïnes' : 'Proteínas';
    if (category === 'cereales') return language === 'en' ? 'Cereals' : language === 'ca' ? 'Cereals' : 'Cereales';
    if (category === 'lácteos') return language === 'en' ? 'Dairy' : language === 'ca' ? 'Làctics' : 'Lácteos';
    return category;
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-gradient-to-b from-amber-50 to-amber-100 rounded-lg shadow-xl border-4 border-amber-800">
        {/* Header con estilo de madera */}
        <div className="bg-amber-800 text-amber-50 p-3 rounded-t-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+CjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB4PSIxNSIgeT0iMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSIjZjNmNGY2Ij48L3JlY3Q+CjxyZWN0IHg9IjAiIHk9IjE1IiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9IiNmM2Y0ZjYiPjwvcmVjdD4KPC9zdmc+')]"></div>
          <div className="mb-2">
            <h1 className="text-4xl font-bold text-amber-50 drop-shadow-md tracking-wide text-center">{t.market}</h1>
          </div>
          
          <div className="flex justify-center items-center">
            <div className="bg-amber-700 px-4 py-2 rounded-lg text-amber-50 border-2 border-amber-600 shadow-inner">
              <span className="font-semibold">{t.coins}: </span>
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
                  
                  {/* Barra de sostenibilidad */}
                  <div className="mb-3">
                    <div className="text-xs text-amber-800 mb-1">{uiTexts.sustainability}</div>
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
                  <p className="text-xs text-amber-700 mb-3 h-12 overflow-hidden">
                    {translateFoodDescription(food.description)}
                  </p>
                  
                  {/* Botones de compra y añadir al carrito */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handlePurchase(food)}
                      disabled={(playerData?.coins || 0) < food.price}
                      className={`w-full py-2 rounded-lg font-bold text-center transition-all ${
                        (playerData?.coins || 0) >= food.price
                          ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-white border-2 border-amber-400 hover:from-amber-600 hover:to-amber-700 hover:scale-105'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed border-2 border-gray-400'
                      }`}
                    >
                      {t.buy}
                    </button>
                    
                    <button 
                      onClick={() => addToCart(food)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg border-2 border-green-500 transition-all hover:scale-105 flex-shrink-0"
                      title={t.add}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Botón flotante para mostrar/ocultar carrito */}
        <div className="fixed bottom-4 right-4 flex flex-col gap-4">
          <button
            onClick={onExit}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg border-2 border-red-500 transition-all hover:scale-105"
          >
            {t.exit}
          </button>
          
          <button
            onClick={() => {
              setShowCart(!showCart);
              const cartPanel = document.getElementById('cart-panel');
              if (cartPanel) {
                cartPanel.style.display = showCart ? 'none' : 'block';
              }
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-full shadow-lg border-2 border-amber-500 transition-all hover:scale-105 relative"
          >
            {language === 'en' ? 'CART' : language === 'ca' ? 'CISTELL' : 'CARRITO'}
            <span id="cart-counter" className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-red-300 transition-all">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </button>
        </div>
        
        {/* Panel de carrito (inicialmente oculto) */}
        <div id="cart-panel" className="fixed right-4 bottom-32 w-80 bg-white rounded-lg shadow-xl border-2 border-amber-600 overflow-hidden" style={{ display: 'none' }}>
          <div className="bg-amber-600 text-white font-bold p-3">
            {language === 'en' ? 'YOUR CART' : language === 'ca' ? 'EL TEU CISTELL' : 'TU CARRITO'}
            <span className="ml-2 opacity-80">({cart.reduce((total, item) => total + item.quantity, 0)} {language === 'en' ? 'Items' : language === 'ca' ? 'Articles' : 'Artículos'})</span>
          </div>
          
          <div className="p-3 max-h-72 overflow-auto">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-2">
                {language === 'en' ? 'Your cart is empty' : language === 'ca' ? 'El teu cistell està buit' : 'Tu carrito está vacío'}
              </p>
            ) : (
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.item.id} className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <div>
                      <div className="font-medium">{translateFoodName(item.item.name)}</div>
                      <div className="text-xs text-gray-500">{item.quantity} x {item.item.price} IHC</div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="font-bold text-amber-700">{item.item.price * item.quantity} IHC</div>
                      <button 
                        onClick={() => removeFromCart(item.item.id)}
                        className="text-xs bg-red-100 hover:bg-red-200 text-red-600 font-bold p-1 rounded"
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-gray-100 p-3 border-t border-gray-200">
            <div className="flex justify-between font-bold mb-3">
              <span>{language === 'en' ? 'Total Price:' : language === 'ca' ? 'Preu Total:' : 'Precio Total:'}</span>
              <span>{getTotalCartPrice()} IHC</span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || (playerData?.coins || 0) < getTotalCartPrice()}
                className={`w-full py-2 rounded-lg font-bold text-center transition-all ${
                  cart.length > 0 && (playerData?.coins || 0) >= getTotalCartPrice()
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {language === 'en' ? 'Checkout' : language === 'ca' ? 'Pagar' : 'Pagar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;