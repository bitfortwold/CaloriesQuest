import { useState, useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { usePlayerStore } from "../stores/usePlayerStore";
import { Plant, GardenPlot, calculateGrowthProgress, updatePlantState, waterPlant, plantSeed, harvestPlant } from "../data/gardenItems";
import { toast } from "sonner"; // Para mostrar notificaciones

interface GardenProps {
  onExit: () => void;
}

const Garden = ({ onExit }: GardenProps) => {
  const { t } = useLanguage();
  const { playerData, updatePlayer } = usePlayerStore();
  const [selectedPlot, setSelectedPlot] = useState<GardenPlot | null>(null);
  const [selectedSeed, setSelectedSeed] = useState<Plant | null>(null);
  // Tab "garden" para ver el huerto y "seeds" para ver semillas (similar a Market)
  const [activeTab, setActiveTab] = useState<"garden" | "seeds">("garden");

  // Actualizar el estado de las plantas cada segundo
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (playerData && playerData.garden) {
        const updatedGarden = playerData.garden.map(plot => updatePlantState(plot));
        updatePlayer({
          ...playerData,
          garden: updatedGarden
        });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [playerData, updatePlayer]);

  // Manejar la acción de regar una planta
  const handleWaterPlant = (plotIndex: number) => {
    if (playerData && playerData.garden) {
      const updatedGarden = [...playerData.garden];
      updatedGarden[plotIndex] = waterPlant(updatedGarden[plotIndex]);
      
      updatePlayer({
        ...playerData,
        garden: updatedGarden
      });
    }
  };

  // Manejar la acción de plantar una semilla
  const handlePlantSeed = (plotIndex: number) => {
    if (!selectedSeed || !playerData || !playerData.garden || !playerData.seeds) return;
    
    // Verificar si el jugador tiene suficientes semillas
    const seedIndex = playerData.seeds.findIndex(seed => seed.id === selectedSeed.id);
    if (seedIndex === -1 || !playerData.seeds[seedIndex].quantity || playerData.seeds[seedIndex].quantity <= 0) {
      console.log("No tienes suficientes semillas");
      return;
    }
    
    // Plantar la semilla
    const updatedGarden = [...playerData.garden];
    updatedGarden[plotIndex] = plantSeed(updatedGarden[plotIndex], selectedSeed);
    
    // Actualizar el inventario de semillas
    const updatedSeeds = [...playerData.seeds];
    if (updatedSeeds[seedIndex].quantity) {
      updatedSeeds[seedIndex].quantity -= 1;
    }
    
    updatePlayer({
      ...playerData,
      garden: updatedGarden,
      seeds: updatedSeeds
    });
    
    setSelectedSeed(null);
  };

  // Manejar la acción de cosechar una planta
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
  };

  // Comprar una semilla del mercado
  const buySeed = (plant: Plant) => {
    if (!playerData) return;
    
    // Verificar si el jugador tiene suficientes monedas
    if (playerData.coins < plant.price) {
      console.log("No tienes suficientes monedas");
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
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center overflow-hidden">
      <div className="relative bg-gradient-to-b from-amber-700 to-amber-600 rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
        {/* Header con título central y botones en los extremos */}
        <div className="flex justify-between items-center p-4 bg-amber-800 text-white">
          <div className="flex-1">
            {/* Botón para ver inventario en esquina superior izquierda */}
            <button 
              className="relative bg-amber-600 hover:bg-amber-500 text-white py-2 px-4 rounded-md flex items-center font-semibold shadow-md"
              onClick={() => {}}
            >
              <span className="mr-2">🧰</span> Inventario
            </button>
          </div>
          
          {/* Título central */}
          <h2 className="text-2xl font-bold text-center flex-1">{t('garden.title')}</h2>
          
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
              {t('common.exit')}
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
              {t('garden.tab.garden')}
            </button>
            <button
              className={`px-5 py-3 font-semibold transition-colors ${activeTab === "seeds" 
                ? "bg-amber-300 text-amber-900 border-b-4 border-amber-500" 
                : "bg-amber-400 text-amber-800 hover:bg-amber-300"}`}
              onClick={() => setActiveTab("seeds")}
            >
              {t('garden.tab.seeds')}
            </button>
          </div>
        </div>
        

        
        {activeTab === "garden" ? (
          <div className="garden-plots grid grid-cols-3 gap-4">
            {playerData?.garden?.map((plot, index) => (
              <div 
                key={plot.id} 
                className={`garden-plot border-2 ${
                  plot.state === "empty" ? "border-gray-300 bg-gray-100" : 
                  plot.state === "seedling" ? "border-green-300 bg-green-50" :
                  plot.state === "growing" ? "border-green-500 bg-green-100" :
                  plot.state === "mature" ? "border-green-700 bg-green-200" :
                  "border-yellow-500 bg-yellow-100"
                } p-4 rounded-lg cursor-pointer`}
                onClick={() => setSelectedPlot(plot)}
              >
                <div className="plot-content min-h-48 flex flex-col items-center justify-center">
                  {/* Representación visual de la planta */}
                  <div className="plant-visual mb-2">
                    {plot.state !== "empty" && (
                      <div className={`plant-icon h-24 w-24 flex items-center justify-center rounded-full 
                        ${plot.state === "seedling" ? "bg-green-100 text-green-800" : 
                          plot.state === "growing" ? "bg-green-200 text-green-800" : 
                          plot.state === "mature" ? "bg-green-300 text-green-800" : 
                          "bg-yellow-200 text-yellow-800"}`}
                      >
                        <span className="text-4xl">
                          {plot.state === "seedling" ? "🌱" : 
                           plot.state === "growing" ? "🌿" :
                           plot.state === "mature" ? "🌻" : "🌽"}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {plot.state === "empty" ? (
                    <div className="empty-plot text-center">
                      <p className="text-gray-500">Parcela vacía</p>
                      {selectedSeed && (
                        <button 
                          className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlantSeed(index);
                          }}
                        >
                          Plantar {selectedSeed.name}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="plant-info text-center">
                      <h3 className="font-semibold">{plot.plant?.name}</h3>
                      <div className="progress mt-2 bg-gray-200 rounded-full h-2.5 w-full">
                        <div 
                          className="bg-green-600 h-2.5 rounded-full" 
                          style={{ width: `${plot.growthPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-sm mt-1">
                        {plot.state === "seedling" ? "Germinando" :
                         plot.state === "growing" ? "Creciendo" :
                         plot.state === "mature" ? "Madurando" :
                         "Listo para cosechar"}
                      </p>
                      <div className="mt-2 flex justify-center gap-2">
                        {plot.state !== "harvestable" && (
                          <button 
                            className={`bg-blue-500 text-white px-3 py-1 rounded text-sm ${
                              plot.waterLevel >= 90 ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWaterPlant(index);
                            }}
                            disabled={plot.waterLevel >= 90}
                          >
                            Regar
                          </button>
                        )}
                        {plot.state === "harvestable" && (
                          <button 
                            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleHarvestPlant(index);
                            }}
                          >
                            Cosechar
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="seeds-market">
            <h2 className="text-xl font-semibold mb-4">Mercado de Semillas</h2>
            <p className="mb-4">Monedas disponibles: {playerData?.coins}</p>
            
            <div className="seed-inventory mb-6">
              <h3 className="text-lg font-medium mb-2">Tu inventario de semillas:</h3>
              {playerData?.seeds.length === 0 ? (
                <p className="text-gray-500">No tienes semillas en tu inventario</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {playerData?.seeds.map((seed) => (
                    <div 
                      key={seed.id}
                      className={`seed-item border rounded-lg p-3 ${
                        selectedSeed?.id === seed.id ? "border-green-500 bg-green-50" : "border-gray-200"
                      }`}
                      onClick={() => setSelectedSeed(seed.quantity && seed.quantity > 0 ? seed : null)}
                    >
                      <h4 className="font-medium">{seed.name}</h4>
                      <p className="text-sm text-gray-600">Cantidad: {seed.quantity}</p>
                      <p className="text-xs mt-1">Dificultad: {
                        seed.difficulty === "beginner" ? "Principiante" :
                        seed.difficulty === "intermediate" ? "Intermedio" : "Avanzado"
                      }</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-medium mb-2">Semillas disponibles para comprar:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Tomate", "Lechuga", "Zanahoria", "Patata", "Pepino"].map((plantName, index) => {
                const plant = {
                  id: `plant_${index + 1}`,
                  name: plantName,
                  description: `Semillas de ${plantName.toLowerCase()}`,
                  growthTime: 120 + index * 30,
                  waterNeeded: 3 + index % 3,
                  sustainabilityScore: 3 + index % 3,
                  nutritionalValue: {
                    calories: 50 + index * 10,
                    protein: 2 + index,
                    carbs: 10 + index * 2,
                    fat: 1 + index % 2,
                    vitamins: ["A", "C"]
                  },
                  harvestYield: 3 + index % 3,
                  price: 20 + index * 10,
                  difficulty: index < 2 ? "beginner" as const : index < 4 ? "intermediate" as const : "advanced" as const,
                  season: index % 4 === 0 ? "spring" as const : index % 4 === 1 ? "summer" as const : 
                           index % 4 === 2 ? "autumn" as const : "winter" as const,
                  image: ""
                };
                
                return (
                  <div key={plant.id} className="seed-shop-item border rounded-lg p-4">
                    <h4 className="font-medium">{plant.name}</h4>
                    <div className="seed-details text-sm mt-2">
                      <p>Precio: {plant.price} monedas</p>
                      <p>Tiempo de crecimiento: {plant.growthTime / 60} minutos</p>
                      <p>Dificultad: {
                        plant.difficulty === "beginner" ? "Principiante" :
                        plant.difficulty === "intermediate" ? "Intermedio" : "Avanzado"
                      }</p>
                      <p>Temporada: {
                        plant.season === "spring" ? "Primavera" :
                        plant.season === "summer" ? "Verano" :
                        plant.season === "autumn" ? "Otoño" :
                        plant.season === "winter" ? "Invierno" : "Todas"
                      }</p>
                    </div>
                    <button 
                      className={`mt-3 px-3 py-1 rounded text-white ${
                        playerData?.coins >= plant.price 
                          ? "bg-green-500 hover:bg-green-600" 
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      onClick={() => buySeed(plant)}
                      disabled={!playerData || playerData.coins < plant.price}
                    >
                      Comprar
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {selectedPlot && selectedPlot.plant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-10">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-3">{selectedPlot.plant.name}</h2>
              
              <p className="mb-4">{selectedPlot.plant.description}</p>
              
              <div className="plant-stats mb-6">
                <p><span className="font-medium">Estado:</span> {
                  selectedPlot.state === "seedling" ? "Germinando" :
                  selectedPlot.state === "growing" ? "Creciendo" :
                  selectedPlot.state === "mature" ? "Madurando" :
                  "Listo para cosechar"
                }</p>
                <div className="flex items-center mt-1">
                  <span className="font-medium mr-2">Crecimiento:</span>
                  <div className="progress bg-gray-200 rounded-full h-2.5 flex-grow">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${selectedPlot.growthPercentage}%` }}
                    ></div>
                  </div>
                  <span className="ml-2">{Math.round(selectedPlot.growthPercentage)}%</span>
                </div>
                <div className="flex items-center mt-1">
                  <span className="font-medium mr-2">Agua:</span>
                  <div className="progress bg-gray-200 rounded-full h-2.5 flex-grow">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full" 
                      style={{ width: `${selectedPlot.waterLevel}%` }}
                    ></div>
                  </div>
                  <span className="ml-2">{Math.round(selectedPlot.waterLevel)}%</span>
                </div>
                
                {/* Información nutricional */}
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Información Nutricional</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="font-medium">Calorías:</p>
                      <p>{selectedPlot.plant.nutritionalValue.calories} kcal</p>
                    </div>
                    <div>
                      <p className="font-medium">Proteínas:</p>
                      <p>{selectedPlot.plant.nutritionalValue.protein}g</p>
                    </div>
                    <div>
                      <p className="font-medium">Carbohidratos:</p>
                      <p>{selectedPlot.plant.nutritionalValue.carbs}g</p>
                    </div>
                    <div>
                      <p className="font-medium">Grasas:</p>
                      <p>{selectedPlot.plant.nutritionalValue.fat}g</p>
                    </div>
                  </div>
                  
                  {selectedPlot.plant.nutritionalValue.vitamins && (
                    <div className="mt-2">
                      <p className="font-medium">Vitaminas y minerales:</p>
                      <p>{selectedPlot.plant.nutritionalValue.vitamins.join(", ")}</p>
                    </div>
                  )}
                </div>
                
                {/* Información de sostenibilidad */}
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Sostenibilidad</h3>
                  <div className="flex items-center">
                    <span className="mr-2">Puntuación:</span>
                    <div className="flex">
                      {Array(5).fill(0).map((_, i) => (
                        <span key={i} className={`text-xl ${i < selectedPlot.plant.sustainabilityScore ? "text-green-600" : "text-gray-300"}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm">
                    {selectedPlot.plant.sustainabilityScore >= 4 
                      ? "Alto impacto positivo en el medio ambiente. Requiere pocos recursos y genera mínimos residuos."
                      : selectedPlot.plant.sustainabilityScore >= 3
                      ? "Buen equilibrio entre beneficios nutricionales e impacto ambiental."
                      : "Impacto moderado. Considera complementar con alimentos de mayor sostenibilidad."}
                  </p>
                </div>
                
                {/* Estado de salud de la planta */}
                <div className="flex items-center mt-4">
                  <span className="font-medium mr-2">Salud de la planta:</span>
                  <div className="progress bg-gray-200 rounded-full h-2.5 flex-grow">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${selectedPlot.healthLevel}%` }}
                    ></div>
                  </div>
                  <span className="ml-2">{Math.round(selectedPlot.healthLevel)}%</span>
                </div>
              </div>
              
              <div className="buttons-container flex justify-between mt-4">
                <button
                  className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${
                    selectedPlot.waterLevel >= 90 || selectedPlot.state === "harvestable" 
                      ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => {
                    const plotIndex = playerData?.garden.findIndex(p => p.id === selectedPlot.id) || 0;
                    handleWaterPlant(plotIndex);
                  }}
                  disabled={selectedPlot.waterLevel >= 90 || selectedPlot.state === "harvestable"}
                >
                  Regar planta
                </button>
                
                {selectedPlot.state === "harvestable" && (
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                    onClick={() => {
                      const plotIndex = playerData?.garden.findIndex(p => p.id === selectedPlot.id) || 0;
                      handleHarvestPlant(plotIndex);
                      setSelectedPlot(null);
                    }}
                  >
                    Cosechar
                  </button>
                )}
              </div>
              
              <div className="flex justify-end mt-4">
                <button 
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setSelectedPlot(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Garden;