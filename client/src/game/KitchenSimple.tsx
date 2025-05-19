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
    exitBuilding();
    onExit();
  };

  // Función para cocinar
  const prepareMeal = (name: string, calories: number) => {
    toast.success(`¡Has preparado: ${name}! (+${calories} calorías)`);
    consumeFood(calories);
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
                    onClick={() => prepareMeal("Desayuno Equilibrado", 350)}
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
                    onClick={() => prepareMeal("Almuerzo Vegetariano", 420)}
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
                    onClick={() => prepareMeal("Cena Proteica", 480)}
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
              <h2 className="text-xl text-amber-900 font-bold mb-6">Ingredientes Disponibles</h2>
              
              {playerData?.inventory && playerData.inventory.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {playerData.inventory.map((food, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg shadow-sm text-center">
                      <div className="font-bold mb-1">{food.name}</div>
                      <div className="text-gray-600">{food.calories} kcal</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg text-center">
                  <p className="mb-2">No tienes ingredientes en tu inventario.</p>
                  <p>Visita el Mercado para comprar algunos.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'dining' && (
            <div className="text-center p-4">
              <h2 className="text-xl text-amber-900 font-bold mb-4">Área del Comedor</h2>
              <p className="mb-6">
                Este es un espacio para disfrutar de tus comidas preparadas.
                Puedes sentarte y comer aquí para obtener los beneficios nutricionales.
              </p>
              <div className="bg-amber-100 p-4 rounded-lg inline-block">
                <p>¡Próximamente más funcionalidades!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KitchenSimple;