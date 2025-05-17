import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useLanguage } from "../i18n/LanguageContext";
import { plants, GardenPlot, Plant } from "../data/gardenItems";

interface GardenProps {
  onExit: () => void;
}

const Garden = ({ onExit }: GardenProps) => {
  const { language } = useLanguage();
  const { playerData, updateGarden, waterPlot, harvestPlot, plantSeed, addSeed } = usePlayerStore();
  const [selectedPlot, setSelectedPlot] = useState<GardenPlot | null>(null);
  const [availableSeeds, setAvailableSeeds] = useState<Plant[]>([]);
  const [showSeedShop, setShowSeedShop] = useState<boolean>(false);
  
  // Actualizar el estado del huerto cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      updateGarden();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [updateGarden]);
  
  // Efecto para actualizar semillas disponibles cuando cambie el playerData
  useEffect(() => {
    if (playerData) {
      setAvailableSeeds(playerData.seeds);
    }
  }, [playerData]);
  
  // Función para comprar semillas
  const buySeed = (plant: Plant) => {
    if (!playerData) return;
    
    if (playerData.coins >= plant.price) {
      addSeed(plant);
      usePlayerStore.getState().updateCoins(-plant.price);
    } else {
      // No hay suficientes monedas
      alert(language === 'es' ? 
        "No tienes suficientes iHumanCoins para comprar esta semilla." : 
        language === 'ca' ? 
        "No tens suficients iHumanCoins per comprar aquesta llavor." :
        "You don't have enough iHumanCoins to buy this seed.");
    }
  };
  
  // Función para plantar una semilla en una parcela
  const handlePlantSeed = (seedId: string) => {
    if (selectedPlot && selectedPlot.id) {
      plantSeed(selectedPlot.id, seedId);
      setSelectedPlot(null);
    }
  };
  
  // Función para cuidar una planta (regar)
  const handleWaterPlant = (plotId: string) => {
    waterPlot(plotId);
  };
  
  // Función para cosechar una planta
  const handleHarvestPlant = (plotId: string) => {
    harvestPlot(plotId);
  };
  
  // Textos según idioma
  const texts = {
    title: language === 'es' ? 'Huerto' : language === 'ca' ? 'Hort' : 'Garden',
    description: language === 'es' ? 
      'Cultiva tus propios alimentos de manera sostenible y saludable.' : 
      language === 'ca' ? 
      'Cultiva els teus propis aliments de manera sostenible i saludable.' : 
      'Grow your own food in a sustainable and healthy way.',
    exit: language === 'es' ? 'Salir' : language === 'ca' ? 'Sortir' : 'Exit',
    plots: language === 'es' ? 'Parcelas' : language === 'ca' ? 'Parcel·les' : 'Plots',
    seeds: language === 'es' ? 'Semillas' : language === 'ca' ? 'Llavors' : 'Seeds',
    seedShop: language === 'es' ? 'Tienda de Semillas' : language === 'ca' ? 'Botiga de Llavors' : 'Seed Shop',
    plant: language === 'es' ? 'Plantar' : language === 'ca' ? 'Plantar' : 'Plant',
    water: language === 'es' ? 'Regar' : language === 'ca' ? 'Regar' : 'Water',
    harvest: language === 'es' ? 'Cosechar' : language === 'ca' ? 'Collir' : 'Harvest',
    empty: language === 'es' ? 'Vacío' : language === 'ca' ? 'Buit' : 'Empty',
    growth: language === 'es' ? 'Crecimiento' : language === 'ca' ? 'Creixement' : 'Growth',
    buy: language === 'es' ? 'Comprar' : language === 'ca' ? 'Comprar' : 'Buy',
    price: language === 'es' ? 'Precio' : language === 'ca' ? 'Preu' : 'Price',
    back: language === 'es' ? 'Volver' : language === 'ca' ? 'Tornar' : 'Back',
    waterLevel: language === 'es' ? 'Nivel de Agua' : language === 'ca' ? 'Nivell d\'Aigua' : 'Water Level',
    health: language === 'es' ? 'Salud' : language === 'ca' ? 'Salut' : 'Health',
    select: language === 'es' ? 'Seleccionar' : language === 'ca' ? 'Seleccionar' : 'Select',
    plantSeed: language === 'es' ? 'Plantar Semilla' : language === 'ca' ? 'Plantar Llavor' : 'Plant Seed',
    noSeeds: language === 'es' ? 'No tienes semillas' : language === 'ca' ? 'No tens llavors' : 'No seeds',
    yourSeeds: language === 'es' ? 'Tus Semillas' : language === 'ca' ? 'Les teves Llavors' : 'Your Seeds',
    availableSeeds: language === 'es' ? 'Semillas Disponibles' : language === 'ca' ? 'Llavors Disponibles' : 'Available Seeds',
  };
  
  if (!playerData) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-[95%] max-w-3xl h-[90vh] overflow-y-auto bg-black text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-green-400">{texts.title}</CardTitle>
          <CardDescription className="text-gray-400">{texts.description}</CardDescription>
        </CardHeader>
        
        <CardContent>
          {!showSeedShop ? (
            // Vista principal del huerto
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl text-green-300">{texts.plots}</h3>
                <Button variant="outline" onClick={() => setShowSeedShop(true)} className="bg-green-800 hover:bg-green-700">
                  {texts.seedShop}
                </Button>
              </div>
              
              {/* Parcelas del huerto */}
              <div className="grid grid-cols-3 gap-4">
                {playerData.garden.map((plot) => (
                  <div 
                    key={plot.id} 
                    className={`p-3 border-2 ${
                      selectedPlot?.id === plot.id 
                        ? 'border-yellow-400' 
                        : plot.state === 'empty' 
                          ? 'border-gray-700'
                          : plot.state === 'seedling'
                            ? 'border-green-700'
                            : plot.state === 'growing'
                              ? 'border-green-500'
                              : plot.state === 'mature'
                                ? 'border-green-300'
                                : 'border-yellow-300'
                    } rounded-lg cursor-pointer transition-all`}
                    onClick={() => setSelectedPlot(plot)}
                  >
                    <div className="text-center mb-2">
                      {plot.plant ? (
                        <div>
                          <p className="font-bold text-green-300">{plot.plant.name}</p>
                          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                            <div 
                              className="bg-green-400 h-2 rounded-full" 
                              style={{ width: `${plot.growthPercentage}%` }}
                            ></div>
                          </div>
                          <p className="text-xs mt-1 text-gray-400">{texts.growth}: {Math.round(plot.growthPercentage)}%</p>
                          
                          <div className="flex justify-between text-xs mt-2">
                            <span>{texts.waterLevel}:</span>
                            <span className={plot.waterLevel < 30 ? 'text-red-400' : 'text-blue-400'}>
                              {plot.waterLevel}%
                            </span>
                          </div>
                          
                          <div className="flex justify-center mt-2 space-x-2">
                            {plot.state !== 'harvestable' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="bg-blue-800 hover:bg-blue-700 text-xs px-2 py-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWaterPlant(plot.id);
                                }}
                              >
                                {texts.water}
                              </Button>
                            )}
                            
                            {plot.state === 'harvestable' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="bg-yellow-800 hover:bg-yellow-700 text-xs px-2 py-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleHarvestPlant(plot.id);
                                }}
                              >
                                {texts.harvest}
                              </Button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p>{texts.empty}</p>
                          {playerData.seeds.length > 0 && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="mt-2 bg-green-800 hover:bg-green-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPlot(plot);
                              }}
                            >
                              {texts.plant}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Panel de información y acciones */}
              {selectedPlot && (
                <div className="mt-4 p-4 border border-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">
                    {selectedPlot.plant ? selectedPlot.plant.name : texts.select}
                  </h3>
                  
                  {selectedPlot.plant ? (
                    <div className="space-y-2">
                      <p>{selectedPlot.plant.description}</p>
                      <p>{texts.growth}: {Math.round(selectedPlot.growthPercentage)}%</p>
                      <div className="flex justify-between">
                        <span>{texts.waterLevel}: {selectedPlot.waterLevel}%</span>
                        <span>{texts.health}: {selectedPlot.healthLevel}%</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Semillas disponibles para plantar */}
                      <h4 className="text-md font-semibold mt-4 mb-2">{texts.yourSeeds}</h4>
                      {playerData.seeds.length === 0 ? (
                        <p className="text-gray-500">{texts.noSeeds}</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {playerData.seeds.map((seed) => (
                            <Button 
                              key={seed.id} 
                              variant="outline" 
                              className="bg-green-900 hover:bg-green-800 text-left p-2"
                              onClick={() => handlePlantSeed(seed.id)}
                            >
                              <div>
                                <p className="font-semibold">{seed.name}</p>
                                <p className="text-xs text-gray-400">
                                  {texts.growth}: {seed.growthTime} min
                                </p>
                              </div>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Tienda de semillas
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl text-green-300">{texts.seedShop}</h3>
                <Button variant="outline" onClick={() => setShowSeedShop(false)} className="bg-gray-800 hover:bg-gray-700">
                  {texts.back}
                </Button>
              </div>
              
              <p className="text-yellow-400">IHC: {playerData.coins}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plants.map((plant) => (
                  <div key={plant.id} className="border border-gray-700 rounded-lg p-3">
                    <h4 className="font-semibold text-green-300">{plant.name}</h4>
                    <p className="text-sm my-2">{plant.description}</p>
                    <div className="flex justify-between text-sm">
                      <span>
                        {texts.price}: <span className="text-yellow-400">{plant.price} IHC</span>
                      </span>
                      <span>
                        {texts.growth}: {plant.growthTime} min
                      </span>
                    </div>
                    <Button 
                      className="w-full mt-3 bg-green-800 hover:bg-green-700 disabled:bg-gray-800"
                      disabled={playerData.coins < plant.price}
                      onClick={() => buySeed(plant)}
                    >
                      {texts.buy}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-center">
            <Button onClick={onExit} className="bg-red-900 hover:bg-red-800">
              {texts.exit}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Garden;