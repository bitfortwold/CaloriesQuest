import { useState, useEffect } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { Plant, GardenPlot, calculateGrowthProgress, updatePlantState, waterPlant, plantSeed, harvestPlant } from "../data/gardenItems";
import { useLanguage } from "../i18n/LanguageContext";
import { toast } from "sonner";

interface GardenProps {
  onExit: () => void;
}

const Garden = ({ onExit }: GardenProps) => {
  const { playerData, updatePlayer } = usePlayerStore();
  const { t } = useLanguage();
  const [selectedPlot, setSelectedPlot] = useState<GardenPlot | null>(null);
  const [selectedSeed, setSelectedSeed] = useState<Plant | null>(null);
  const [activeTab, setActiveTab] = useState<"garden" | "seeds">("garden");

  // Actualizar el estado de las plantas cada segundo
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!playerData || !playerData.garden) return;
      
      const updatedGarden = playerData.garden.map(plot => updatePlantState(plot));
      
      // Solo actualizar si hay cambios
      if (JSON.stringify(updatedGarden) !== JSON.stringify(playerData.garden)) {
        updatePlayer({
          ...playerData,
          garden: updatedGarden
        });
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [playerData, updatePlayer]);

  // Manejar el riego de una planta
  const handleWaterPlant = (plotIndex: number) => {
    if (!playerData || !playerData.garden) return;
    
    const updatedGarden = [...playerData.garden];
    updatedGarden[plotIndex] = waterPlant(playerData.garden[plotIndex]);
    
    updatePlayer({
      ...playerData,
      garden: updatedGarden
    });
  };

  // Manejar la cosecha de una planta
  const handleHarvestPlant = (plotIndex: number) => {
    if (!playerData || !playerData.garden) return;
    
    const plot = playerData.garden[plotIndex];
    if (plot.state !== "harvestable" || !plot.plant) return;
    
    // Añadir la planta cosechada al inventario
    const updatedInventory = [...playerData.inventory];
    const itemIndex = updatedInventory.findIndex(item => 
      item.id === `harvested_${plot.plant?.id}`
    );
    
    if (itemIndex >= 0 && updatedInventory[itemIndex].quantity) {
      updatedInventory[itemIndex].quantity += plot.plant.harvestYield;
    } else {
      updatedInventory.push({
        id: `harvested_${plot.plant.id}`,
        name: plot.plant.name,
        description: plot.plant.description,
        quantity: plot.plant.harvestYield,
        type: "food",
        calories: plot.plant.nutritionalValue.calories, // Añadimos las calorías que son requeridas
        nutritionalValue: plot.plant.nutritionalValue,
        sustainabilityScore: plot.plant.sustainabilityScore
      });
    }
    
    // Reiniciar la parcela
    const updatedGarden = [...playerData.garden];
    updatedGarden[plotIndex] = harvestPlant(plot);
    
    // Recompensa de monedas por cosechar
    const harvestReward = Math.floor(plot.plant.sustainabilityScore * 10);
    
    updatePlayer({
      ...playerData,
      garden: updatedGarden,
      inventory: updatedInventory,
      coins: playerData.coins + harvestReward
    });
    
    // Notificar al usuario
    toast.success(`Has cosechado ${plot.plant.name} y ganado ${harvestReward} IHC`);
  };

  // Plantar una semilla
  const handlePlantSeed = (seed: Plant) => {
    if (!playerData || !selectedPlot) return;
    
    // Comprobar si tenemos suficientes semillas
    const selectedSeedInInventory = playerData.seeds.find(s => s.id === seed.id);
    if (!selectedSeedInInventory || !selectedSeedInInventory.quantity || selectedSeedInInventory.quantity <= 0) {
      toast.error("No tienes semillas de este tipo");
      return;
    }
    
    // Actualizar el huerto
    const plotIndex = playerData.garden.findIndex(p => p.id === selectedPlot.id);
    const updatedGarden = [...playerData.garden];
    updatedGarden[plotIndex] = plantSeed(selectedPlot, seed);
    
    // Actualizar el inventario de semillas
    const updatedSeeds = [...playerData.seeds];
    const seedIndex = updatedSeeds.findIndex(s => s.id === seed.id);
    updatedSeeds[seedIndex].quantity = (updatedSeeds[seedIndex].quantity || 0) - 1;
    
    updatePlayer({
      ...playerData,
      garden: updatedGarden,
      seeds: updatedSeeds
    });
    
    // Notificar al usuario
    toast.success(`Has plantado ${seed.name}`);
    
    // Resetear selecciones
    setSelectedPlot(null);
    setActiveTab("garden");
  };

  // Comprar una semilla
  const buySeed = (plant: Plant) => {
    if (!playerData) return;
    
    // Comprobar si tenemos suficientes monedas
    if (playerData.coins < plant.price) {
      toast.error("No tienes suficientes IHC");
      return;
    }
    
    // Actualizar el inventario de semillas
    const updatedSeeds = [...playerData.seeds];
    const seedIndex = updatedSeeds.findIndex(seed => seed.id === plant.id);
    
    if (seedIndex >= 0) {
      updatedSeeds[seedIndex].quantity = (updatedSeeds[seedIndex].quantity || 0) + 1;
    } else {
      updatedSeeds.push({
        ...plant,
        quantity: 1
      });
    }
    
    updatePlayer({
      ...playerData,
      seeds: updatedSeeds,
      coins: playerData.coins - plant.price
    });
    
    // Notificar al usuario
    toast.success(`Has comprado semillas de ${plant.name}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center overflow-hidden">
      <div className="relative bg-gradient-to-b from-amber-700 to-amber-600 rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
        {/* Header con título central y botones en los extremos */}
        <div className="flex justify-between items-center p-4 bg-amber-800 text-white">
          <div className="flex-1">
            {/* Espacio para botón futuro */}
          </div>
          
          {/* Título central */}
          <h2 className="text-2xl font-bold text-center flex-1">Huerto Virtual</h2>
          
          {/* Botón de salir en esquina superior derecha */}
          <div className="flex-1 flex justify-end">
            <button 
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold shadow-md"
              onClick={() => {
                console.log("SOLUCIÓN FINAL: Salida directa del huerto");
                onExit();
                
                // Usando teleportación después para asegurar que la salida es limpia
                setTimeout(() => {
                  console.log("Teleportación ejecutada correctamente");
                }, 100);
              }}
            >
              Salir
            </button>
          </div>
        </div>
        
        {/* Saldo de monedas */}
        <div className="text-center p-2 bg-amber-700 text-white">
          <span className="font-semibold">iHumanCoins: </span>
          <span className="text-yellow-300 font-bold">{playerData?.coins || 0}</span>
        </div>
        
        {/* Pestañas */}
        <div className="bg-amber-400 mb-0">
          <div className="flex">
            <button
              className={`px-5 py-3 font-semibold transition-colors ${activeTab === "garden" 
                ? "bg-amber-300 text-amber-900 border-b-4 border-amber-500" 
                : "bg-amber-400 text-amber-800 hover:bg-amber-300"}`}
              onClick={() => setActiveTab("garden")}
            >
              Huerto
            </button>
            <button
              className={`px-5 py-3 font-semibold transition-colors ${activeTab === "seeds" 
                ? "bg-amber-300 text-amber-900 border-b-4 border-amber-500" 
                : "bg-amber-400 text-amber-800 hover:bg-amber-300"}`}
              onClick={() => setActiveTab("seeds")}
            >
              Semillas
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="bg-amber-200 p-4">
          {activeTab === "garden" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {playerData?.garden.map((plot, index) => (
                <div 
                  key={plot.id} 
                  className={`bg-amber-100 rounded-md border ${
                    selectedPlot?.id === plot.id ? 'border-amber-600 shadow-lg' : 'border-amber-300'
                  } transition-all hover:shadow-md cursor-pointer overflow-hidden`}
                  onClick={() => setSelectedPlot(plot)}
                >
                  {/* Encabezado de la parcela */}
                  <div className={`py-2 px-3 ${plot.plant ? 'bg-amber-500 text-white' : 'bg-amber-300'}`}>
                    <h3 className="font-bold">
                      {plot.plant ? plot.plant.name : 'Parcela vacía'}
                    </h3>
                  </div>
                  
                  <div className="p-3">
                    {plot.plant ? (
                      <>
                        {/* Barra de progreso de crecimiento */}
                        <div className="my-2">
                          <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
                            <div 
                              className="bg-green-500 h-4" 
                              style={{ width: `${calculateGrowthProgress(plot)}%` }}
                            ></div>
                          </div>
                          <div className="text-sm text-amber-800 mt-1 flex justify-between">
                            <span>Estado: {plot.state}</span>
                            <span>{calculateGrowthProgress(plot).toFixed(0)}%</span>
                          </div>
                        </div>
                        
                        {/* Información nutricional */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-amber-800 my-2">
                          <div>Calorías: <span className="font-semibold">{plot.plant.nutritionalValue.calories} kcal</span></div>
                          <div>Proteínas: <span className="font-semibold">{plot.plant.nutritionalValue.protein}g</span></div>
                          <div>Sostenibilidad: <span className="font-semibold">{plot.plant.sustainabilityScore}/5</span></div>
                          <div>Dificultad: <span className="font-semibold">{plot.plant.difficulty}</span></div>
                        </div>
                        
                        {/* Botones de acción */}
                        <div className="flex gap-2 mt-3">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWaterPlant(index);
                              toast.success("Planta regada correctamente");
                            }}
                          >
                            💧 Regar
                          </button>
                          {plot.state === "harvestable" && (
                            <button
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleHarvestPlant(index);
                              }}
                            >
                              🌾 Cosechar
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6">
                        <p className="text-amber-700 mb-3">Parcela disponible para plantar</p>
                        {playerData?.seeds.filter(seed => seed.quantity && seed.quantity > 0).length > 0 && (
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTab("seeds");
                              setSelectedPlot(plot);
                              toast.info("Selecciona una semilla para plantar");
                            }}
                          >
                            🌱 Plantar
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2">
              {/* Subtítulo de la sección */}
              <h2 className="text-xl font-semibold mb-4 text-amber-900">Tus semillas disponibles</h2>
              
              {/* Filtros de semillas (opcional, similar al mercado) */}
              <div className="bg-amber-300 rounded-md mb-4 p-2 flex space-x-2">
                <button className="bg-amber-50 text-amber-800 px-3 py-1 rounded-md hover:bg-amber-100">
                  Todas
                </button>
                <button className="bg-amber-400 text-amber-900 px-3 py-1 rounded-md hover:bg-amber-100">
                  Verduras
                </button>
                <button className="bg-amber-400 text-amber-900 px-3 py-1 rounded-md hover:bg-amber-100">
                  Frutas
                </button>
                <button className="bg-amber-400 text-amber-900 px-3 py-1 rounded-md hover:bg-amber-100">
                  Hierbas
                </button>
              </div>
              
              {/* Grid de semillas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {playerData?.seeds
                  .filter(seed => seed.quantity && seed.quantity > 0)
                  .map(seed => (
                    <div 
                      key={seed.id}
                      className={`bg-amber-50 rounded-md border ${
                        selectedSeed?.id === seed.id ? 'border-amber-600 shadow-lg' : 'border-amber-200'
                      } overflow-hidden transition-all hover:shadow-md cursor-pointer`}
                      onClick={() => {
                        if (selectedPlot && !selectedPlot.plant) {
                          handlePlantSeed(seed);
                        } else {
                          setSelectedSeed(seed);
                        }
                      }}
                    >
                      {/* Cabecera con nombre y precio */}
                      <div className="bg-amber-500 p-2 flex justify-between items-center">
                        <h3 className="font-bold text-white">{seed.name}</h3>
                        <span className="bg-amber-700 text-amber-100 px-2 py-1 rounded-md text-xs font-bold">
                          {seed.quantity} uds
                        </span>
                      </div>
                      
                      {/* Detalles de la semilla */}
                      <div className="p-3">
                        <div className="grid grid-cols-2 text-xs gap-y-1 text-amber-800">
                          <div>Tiempo: <span className="font-semibold">{seed.growthTime} min</span></div>
                          <div>Dificultad: <span className="font-semibold">{seed.difficulty}</span></div>
                          <div>Temporada: <span className="font-semibold">{seed.season}</span></div>
                          <div>Producción: <span className="font-semibold">{seed.harvestYield} uds</span></div>
                        </div>
                        
                        {/* Botón para plantar si hay parcela seleccionada */}
                        {selectedPlot && !selectedPlot.plant && (
                          <button
                            className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlantSeed(seed);
                            }}
                          >
                            Plantar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
              
              {/* Mensaje si no hay semillas */}
              {(!playerData?.seeds || playerData.seeds.filter(seed => seed.quantity && seed.quantity > 0).length === 0) && (
                <div className="text-center p-8 bg-amber-100 rounded-lg">
                  <p className="text-amber-800">No tienes semillas disponibles.</p>
                  <p className="mt-2">Visita el mercado para comprar algunas.</p>
                  <button
                    className="mt-4 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded font-semibold"
                    onClick={() => {
                      onExit();
                    }}
                  >
                    Ir al mercado
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Garden;