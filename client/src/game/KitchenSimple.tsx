import { useEffect, useState } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useGameStateStore } from "../stores/useGameStateStore";
import { toast } from "sonner";

interface KitchenProps {
  onExit: () => void;
}

const KitchenSimple = ({ onExit }: KitchenProps) => {
  const [activeTab, setActiveTab] = useState("guided-recipes");
  const { playerData, consumeFood } = usePlayerStore();
  const { exitBuilding } = useGameStateStore();

  // Manejar la tecla Escape para salir
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleExit();
      }
    };
    
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, []);

  // Función para salir
  const handleExit = () => {
    // Primero llamamos a onExit para cerrar la interfaz de la cocina
    onExit();
    
    // Luego usamos setTimeout para dar tiempo a que se cierre la interfaz
    // antes de actualizar el estado del juego
    setTimeout(() => {
      exitBuilding();
      console.log("Saliendo de la cocina exitosamente");
    }, 100);
  };

  // Estado para las comidas preparadas
  const [preparedMeals, setPreparedMeals] = useState<{ name: string; calories: number; id: string }[]>([]);
  
  // Verificar si el jugador tiene todos los ingredientes necesarios para una receta
  const hasIngredients = (ingredients: string[]): boolean => {
    if (!playerData || !playerData.inventory) return false;
    
    // Verificar cada ingrediente
    for (const ingredient of ingredients) {
      // Buscar el ingrediente en el inventario (comparación case-insensitive)
      const found = playerData.inventory.some(item => 
        item.name.toLowerCase().includes(ingredient.toLowerCase())
      );
      
      if (!found) return false; // Si falta un ingrediente, retornar false
    }
    
    return true; // Si tiene todos los ingredientes, retornar true
  };
  
  // Función para cocinar
  const prepareMeal = (name: string, calories: number, ingredients: string[]) => {
    // Verificar si el jugador tiene todos los ingredientes
    if (!hasIngredients(ingredients)) {
      toast.error(`No tienes todos los ingredientes para preparar ${name}. Necesitas: ${ingredients.join(', ')}`);
      return;
    }
    
    // Crear un ID único para la comida preparada
    const mealId = `meal-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Añadir la comida preparada al estado
    setPreparedMeals(prev => [...prev, { name, calories, id: mealId }]);
    
    // Mostrar mensaje de éxito
    toast.success(`¡Has preparado: ${name}! La comida está lista en el comedor.`);
    
    // Cambiar automáticamente a la pestaña del comedor
    setActiveTab("dining");
  };
  
  // Función para consumir una comida preparada
  const consumePreparedMeal = (mealId: string, name: string, calories: number) => {
    // Contabilizar calorías consumidas
    consumeFood(calories);
    
    // Eliminar la comida de la lista de preparadas
    setPreparedMeals(prev => prev.filter(meal => meal.id !== mealId));
    
    // Mostrar mensaje de éxito
    toast.success(`¡Has comido: ${name}! (+${calories} calorías)`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-11/12 max-w-4xl bg-amber-200 rounded-xl overflow-hidden shadow-xl">
        {/* Cabecera */}
        <div className="bg-amber-700 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Cocina</h1>
          <button 
            onClick={handleExit}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Salir
          </button>
        </div>
        
        {/* Barra de calorías */}
        <div className="bg-amber-100 p-3 text-center border-b border-amber-300">
          <p className="font-medium">
            Calorías: {playerData?.caloriesConsumed || 0} / {playerData?.dailyCalories || 2620}
          </p>
        </div>
        
        {/* Pestañas */}
        <div className="flex border-b border-amber-300">
          <button 
            className={`flex-1 py-3 px-4 font-medium ${activeTab === 'guided-recipes' ? 'bg-green-600 text-white' : 'bg-amber-100'}`}
            onClick={() => setActiveTab('guided-recipes')}
          >
            🍳 Recetas Guiadas
          </button>
          <button 
            className={`flex-1 py-3 px-4 font-medium ${activeTab === 'free-cooking' ? 'bg-green-600 text-white' : 'bg-amber-100'}`}
            onClick={() => setActiveTab('free-cooking')}
          >
            🍎 Cocina Libre
          </button>
          <button 
            className={`flex-1 py-3 px-4 font-medium ${activeTab === 'dining' ? 'bg-green-600 text-white' : 'bg-amber-100'}`}
            onClick={() => setActiveTab('dining')}
          >
            🍽️ Comedor
          </button>
        </div>
        
        {/* Contenido */}
        <div className="p-6 bg-amber-50 max-h-[70vh] overflow-y-auto">
          {activeTab === 'guided-recipes' && (
            <div>
              <h2 className="text-xl text-amber-900 font-bold text-center mb-6">Las Tres Recetas Básicas</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Desayuno */}
                <div className="bg-yellow-100 p-5 rounded-lg border border-yellow-400">
                  <h3 className="text-lg font-bold text-yellow-800 mb-3">Desayuno Equilibrado</h3>
                  <p className="mb-3">Un desayuno nutritivo con huevos, pan y fruta fresca</p>
                  <p className="mb-1"><strong>Ingredientes:</strong> Huevos, Pan, Manzana</p>
                  <p className="mb-3"><strong>Calorías:</strong> 350 kcal</p>
                  <button 
                    className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition"
                    onClick={() => prepareMeal("Desayuno Equilibrado", 350, ["Huevos", "Pan", "Manzana"])}
                  >
                    Preparar Receta
                  </button>
                </div>
                
                {/* Almuerzo */}
                <div className="bg-green-100 p-5 rounded-lg border border-green-400">
                  <h3 className="text-lg font-bold text-green-800 mb-3">Almuerzo Vegetariano</h3>
                  <p className="mb-3">Un almuerzo a base de plantas con frijoles, arroz y verduras</p>
                  <p className="mb-1"><strong>Ingredientes:</strong> Frijoles, Arroz, Brócoli</p>
                  <p className="mb-3"><strong>Calorías:</strong> 420 kcal</p>
                  <button 
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
                    onClick={() => prepareMeal("Almuerzo Vegetariano", 420, ["Frijoles", "Arroz", "Brócoli"])}
                  >
                    Preparar Receta
                  </button>
                </div>
                
                {/* Cena */}
                <div className="bg-blue-100 p-5 rounded-lg border border-blue-400">
                  <h3 className="text-lg font-bold text-blue-800 mb-3">Cena Proteica</h3>
                  <p className="mb-3">Una cena rica en proteínas con pollo, patatas y verduras</p>
                  <p className="mb-1"><strong>Ingredientes:</strong> Pollo, Patata, Espinaca</p>
                  <p className="mb-3"><strong>Calorías:</strong> 480 kcal</p>
                  <button 
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                    onClick={() => prepareMeal("Cena Proteica", 480, ["Pollo", "Patata", "Espinaca"])}
                  >
                    Preparar Receta
                  </button>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <h3 className="font-bold text-lg mb-2">Instrucciones Generales:</h3>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Selecciona una receta según tus necesidades nutricionales</li>
                  <li>Asegúrate de tener todos los ingredientes en tu inventario</li>
                  <li>Sigue cada paso para preparar una comida nutritiva</li>
                  <li>¡Disfruta de tu comida y aprende sobre nutrición!</li>
                </ol>
              </div>
              
              <div className="text-center">
                <button className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition">
                  Guía Nutricional Completa
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'free-cooking' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Despensa */}
                <div className="bg-amber-50 p-5 rounded-lg border border-amber-300">
                  <h2 className="text-xl text-amber-900 font-bold mb-4">Despensa</h2>
                  
                  {playerData?.inventory && playerData.inventory.some(food => !food.name.toLowerCase().includes("leche") && !food.name.toLowerCase().includes("queso") && !food.name.toLowerCase().includes("yogur")) ? (
                    <div className="grid grid-cols-2 gap-3">
                      {playerData.inventory
                        .filter(food => !food.name.toLowerCase().includes("leche") && !food.name.toLowerCase().includes("queso") && !food.name.toLowerCase().includes("yogur"))
                        .map((food, index) => (
                          <div key={index} className="bg-white p-3 rounded-lg shadow-sm text-center">
                            <div className="font-bold mb-1">{food.name}</div>
                            <div className="text-gray-600">{food.calories} kcal</div>
                            <button 
                              className="mt-2 text-sm px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700"
                              onClick={() => prepareMeal(food.name, food.calories, [food.name])}
                            >
                              Consumir
                            </button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="bg-white p-4 rounded-lg text-center">
                      <p className="text-gray-500">No hay alimentos en la despensa.</p>
                    </div>
                  )}
                </div>
                
                {/* Refrigerador */}
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-300">
                  <h2 className="text-xl text-blue-900 font-bold mb-4">Refrigerador</h2>
                  
                  {playerData?.inventory && playerData.inventory.some(food => food.name.toLowerCase().includes("leche") || food.name.toLowerCase().includes("queso") || food.name.toLowerCase().includes("yogur")) ? (
                    <div className="grid grid-cols-2 gap-3">
                      {playerData.inventory
                        .filter(food => food.name.toLowerCase().includes("leche") || food.name.toLowerCase().includes("queso") || food.name.toLowerCase().includes("yogur"))
                        .map((food, index) => (
                          <div key={index} className="bg-white p-3 rounded-lg shadow-sm text-center">
                            <div className="font-bold mb-1">{food.name}</div>
                            <div className="text-gray-600">{food.calories} kcal</div>
                            <button 
                              className="mt-2 text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                              onClick={() => prepareMeal(food.name, food.calories, [food.name])}
                            >
                              Consumir
                            </button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="bg-white p-4 rounded-lg text-center">
                      <p className="text-gray-500">No hay alimentos refrigerados.</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <h3 className="font-bold text-lg mb-2">Todos los Ingredientes</h3>
                
                {playerData?.inventory && playerData.inventory.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {playerData.inventory.map((food, index) => (
                      <div key={index} className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-center">
                        <div className="font-bold mb-1">{food.name}</div>
                        <div className="text-gray-600">{food.calories} kcal</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p className="mb-2">No tienes ingredientes en tu inventario.</p>
                    <p>Visita el Mercado para comprar algunos.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'dining' && (
            <div className="p-4">
              <h2 className="text-xl text-amber-900 font-bold mb-4 text-center">Área del Comedor</h2>
              <p className="text-center mb-6">
                Este es un espacio para disfrutar de tus comidas preparadas.
                Puedes sentarte y comer aquí para obtener los beneficios nutricionales.
              </p>
              
              {preparedMeals.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">Comidas Preparadas:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {preparedMeals.map((meal) => (
                      <div 
                        key={meal.id} 
                        className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200"
                      >
                        <div className="bg-amber-100 p-3">
                          <h4 className="font-bold text-amber-900">{meal.name}</h4>
                          <p className="text-sm text-gray-600">{meal.calories} calorías</p>
                        </div>
                        <div className="p-3 flex justify-between items-center">
                          <span className="text-sm text-gray-500">Listo para consumir</span>
                          <button
                            onClick={() => consumePreparedMeal(meal.id, meal.name, meal.calories)}
                            className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md text-sm transition-colors"
                          >
                            Consumir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                  <p className="text-amber-800 mb-2">No tienes comidas preparadas en este momento.</p>
                  <p className="text-gray-600">Prepara una receta en la sección "Recetas Guiadas" y aparecerá aquí.</p>
                </div>
              )}
              
              <div className="mt-8 bg-amber-100 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-800 mb-2">Tip Nutricional:</h3>
                <p className="text-sm text-gray-700">
                  Mantener un horario regular para las comidas ayuda a tu metabolismo y contribuye a mantener niveles
                  estables de energía a lo largo del día.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KitchenSimple;