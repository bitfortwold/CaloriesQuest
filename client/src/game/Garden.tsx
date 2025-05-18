import { useState, useEffect } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { Plant, GardenPlot, calculateGrowthProgress, updatePlantState, waterPlant, plantSeed, harvestPlant } from "../data/gardenItems";
import { useLanguage } from "../i18n/LanguageContext";
import { toast } from "sonner";

interface GardenProps {
  onExit: () => void;
  // Añadir cualquier propiedad adicional si es necesaria
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
      garden: updatedGarden,
      // No definimos lastGardenAction aquí para evitar interferencias con el sistema unificado
    });
    
    console.log("Planta regada exitosamente");
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
      coins: playerData.coins + harvestReward,
      // Marcar que se cosechó, pero será ignorada en la salida unificada
      lastGardenAction: "harvest"
    });
    
    // Notificar al usuario
    toast.success(`Has cosechado ${plot.plant.name} y ganado ${harvestReward} IHC`);
    console.log("Planta cosechada exitosamente");
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
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center overflow-hidden p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#FFF8E9] rounded-3xl shadow-2xl border-8 border-[#CD8E3E]">

        {/* Header de madera estilizado */}
        <div className="bg-gradient-to-r from-[#C68642] to-[#A05F2C] p-4 rounded-t-2xl relative overflow-hidden">
          {/* Textura de madera */}
          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+CjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB4PSIxNSIgeT0iMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSIjZjNmNGY2Ij48L3JlY3Q+CjxyZWN0IHg9IjAiIHk9IjE1IiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9IiNmM2Y0ZjYiPjwvcmVjdD4KPC9zdmc+')]"></div>
          
          {/* Botones superiores */}
          <div className="flex justify-between items-center mb-2">
            {/* Botón de Tienda de Semillas a la izquierda */}
            <button
              onClick={() => {
                console.log("Cambiando a sección de semillas desde botón superior");
                setActiveTab("seeds");
              }}
              className="bg-gradient-to-r from-[#E67E22] to-[#F39C12] text-white px-6 py-2 rounded-lg font-bold shadow-md border-2 border-[#D35400] hover:from-[#D35400] hover:to-[#E67E22] transition duration-300"
            >
              Tienda de Semillas
            </button>

            {/* Título con aspecto de cartel de madera (centrado) */}
            <div className="bg-[#BA7D45] px-12 py-3 rounded-2xl shadow-lg border-4 border-[#8B5E34] transform rotate-0 relative">
              <div className="absolute inset-0 rounded-xl opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+CjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI2ZmZiI+PC9yZWN0Pgo8cmVjdCB4PSIxNSIgeT0iMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSIjZjNmNGY2Ij48L3JlY3Q+CjxyZWN0IHg9IjAiIHk9IjE1IiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9IiNmM2Y0ZjYiPjwvcmVjdD4KPC9zdmc+')]"></div>
              <h2 className="text-3xl font-bold text-white drop-shadow-lg tracking-wide uppercase">Huerto Virtual</h2>
            </div>

            {/* Botón Salir a la derecha */}
            <button
              onClick={() => {
                console.log("Saliendo del huerto con botón superior");
                // Obtener estado actual
                const { updatePlayer, playerData } = usePlayerStore.getState();
                
                // Guardar información de salida (igual que en el sistema unificado)
                if (playerData) {
                  updatePlayer({
                    ...playerData,
                    // Limpiar cualquier estado anterior específico de edificios
                    lastGardenAction: undefined
                  });
                }
                onExit();
              }}
              className="bg-gradient-to-r from-[#E74C3C] to-[#C0392B] text-white px-6 py-2 rounded-lg font-bold shadow-md border-2 border-[#A93226] hover:from-[#C0392B] hover:to-[#E74C3C] transition duration-300"
            >
              Salir
            </button>
          </div>
          
          {/* Contador de monedas estilizado */}
          <div className="flex justify-center items-center">
            <div className="bg-gradient-to-r from-[#F9D423] to-[#F5AB1B] px-6 py-3 rounded-xl text-[#7E4E1B] border-2 border-[#EDA617] shadow-lg">
              <span className="font-bold">iHumanCoins: </span>
              <span className="text-[#7E4E1B] font-bold text-xl ml-1">{playerData?.coins || 0}</span>
            </div>
          </div>
        </div>
        
        {/* Pestañas principales */}
        <div className="bg-[#FFD166] px-6 pt-3 flex space-x-6 border-b-4 border-[#CD8E3E]">
          <button 
            onClick={() => setActiveTab("garden")}
            className={`font-bold py-3 px-8 rounded-t-xl transition-all text-lg transform ${
              activeTab === "garden" 
                ? 'bg-[#FFF8E9] text-[#8B5E34] border-4 border-b-0 border-[#CD8E3E] shadow-md scale-105' 
                : 'bg-[#FFBD3E] text-[#7E4E1B] hover:bg-[#FFC154] shadow-inner'
            }`}
          >
            Huerto
          </button>
          <button 
            onClick={() => setActiveTab("seeds")}
            className={`font-bold py-3 px-8 rounded-t-xl transition-all text-lg transform ${
              activeTab === "seeds" 
                ? 'bg-[#FFF8E9] text-[#8B5E34] border-4 border-b-0 border-[#CD8E3E] shadow-md scale-105' 
                : 'bg-[#FFBD3E] text-[#7E4E1B] hover:bg-[#FFC154] shadow-inner'
            }`}
          >
            Semillas
          </button>
        </div>

        {/* Contenido principal */}
        <div className="bg-[#FFF8E9] p-6">
          {activeTab === "garden" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {playerData?.garden.map((plot, index) => (
                <div 
                  key={plot.id} 
                  className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] cursor-pointer"
                  onClick={() => setSelectedPlot(plot)}
                >
                  {/* Encabezado de la parcela con estilo mejorado */}
                  <div className="bg-gradient-to-r from-[#F9A826] to-[#FFB938] py-3 px-4 rounded-t-xl border-b-4 border-[#F48E11]">
                    <h3 className="font-bold text-[#7E4E1B] text-lg">
                      Parcela {plot.plant ? plot.plant.name : "vacía"}
                    </h3>
                  </div>
                  
                  <div className="p-5 bg-[#FFFAF0] border-4 border-t-0 border-[#F5D6A4] rounded-b-xl">
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
                        <p className="text-amber-700">Parcela disponible para plantar</p>
                        {playerData?.seeds.filter(seed => seed.quantity && seed.quantity > 0).length > 0 && (
                          <button
                            className="mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold"
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
              
              {/* Filtros de semillas (similar al mercado) */}
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
              
              {/* Mensaje si no hay semillas - Igual que en la captura de pantalla */}
              {(!playerData?.seeds || playerData.seeds.filter(seed => seed.quantity && seed.quantity > 0).length === 0) && (
                <div className="text-center p-8 bg-amber-50 rounded-lg">
                  <p className="text-amber-800 font-medium">No tienes semillas disponibles.</p>
                  <p className="mt-2 text-amber-700">Visita el mercado para comprar algunas.</p>
                  <button
                    className="mt-4 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded font-semibold"
                    onClick={() => {
                      // Usar la función unificada a través de onExit
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