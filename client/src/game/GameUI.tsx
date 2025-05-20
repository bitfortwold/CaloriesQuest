import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useGameStateStore } from "../stores/useGameStateStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useCameraStore } from "../lib/stores/useCameraStore";
import { SoundButton } from "../components/ui/SoundButton";
import { useLanguage } from "../i18n/LanguageContext";
import Market from "./Market";
import Kitchen from "./KitchenSimple";
import Garden from "./Garden";
import StatsPanel from "./StatsPanel";

const GameUI = () => {
  // Access game state and translations
  const { gameState, exitBuilding } = useGameStateStore();
  const { playerData } = usePlayerStore();
  const { t } = useLanguage();
  
  // Track whether DOM is ready for portals
  const [domReady, setDomReady] = useState(false);
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  // Set up portal target
  useEffect(() => {
    setDomReady(true);
  }, []);
  
  // Don't render anything if DOM is not ready
  if (!domReady) return null;
  
  // SISTEMA DE SALIDA MEJORADO
  // Este sistema actualiza el estado del juego y reposiciona al jugador
  const handleBuildingExit = (buildingType: string) => {
    console.log(`Salida de edificio: ${buildingType} - Iniciando secuencia de salida`);
    
    // Primero limpiamos información específica del jugador
    const { updatePlayer, playerData, setPlayerPosition, setIsMovingToTarget, setTargetPosition } = usePlayerStore.getState();
    const { setGameState } = useGameStateStore.getState();
    
    if (playerData) {
      updatePlayer({
        ...playerData,
        lastGardenAction: undefined
      });
    }
    
    // Posiciones de salida seguras
    const safeExitPositions = {
      market: { x: -10, y: 0, z: 10 },    // Lejos del mercado, en diagonal
      kitchen: { x: 10, y: 0, z: 10 },    // Lejos de la cocina, en diagonal
      garden: { x: 0, y: 0, z: -20 },     // Muy lejos del huerto
      default: { x: 0, y: 0, z: -15 }     // Posición segura por defecto
    };
    
    // Reposicionamos al jugador lejos del edificio
    const exitPosition = safeExitPositions[buildingType as keyof typeof safeExitPositions] || safeExitPositions.default;
    
    // Detenemos cualquier movimiento automático
    setTargetPosition(null);
    setIsMovingToTarget(false);
    
    // Establecemos la nueva posición y cambiamos el estado
    setPlayerPosition(exitPosition);
    console.log(`✅ Jugador reposicionado en (${exitPosition.x}, ${exitPosition.y}, ${exitPosition.z})`);
    
    // Cambiamos el estado con un ligero retraso para asegurar que el componente se desmonte primero
    setTimeout(() => {
      setGameState("playing");
    }, 100);
  };
  
  // Render UI based on game state
  const renderGameUI = () => {
    switch (gameState) {
      case "market":
        return (
          <>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <Market onExit={() => {
                console.log("GameUI attempting to exit market");
                handleBuildingExit("market");
              }} />
            </div>
          </>
        );
      case "kitchen":
        return (
          <>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <Kitchen onExit={() => {
                console.log("GameUI attempting to exit kitchen");
                handleBuildingExit("kitchen");
              }} />
            </div>
          </>
        );
        
      case "garden":
        return (
          <>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <Garden onExit={() => handleBuildingExit("garden")} />
            </div>
          </>
        );
      
      // El gimnasio ha sido eliminado
      case "playing":
        return (
          <div className="z-10">
            {/* Panel de Estadísticas del Jugador */}
            <div className="fixed top-2 left-2 z-[1000]">
              {/* Botón reducido para mostrar/ocultar estadísticas */}
              <button
                onClick={() => setShowStatsPanel(!showStatsPanel)}
                className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white font-bold p-2 rounded-lg shadow-lg border-2 border-blue-600 transition-all duration-300 hover:scale-105 flex items-center justify-center"
                title={t.playerStats}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              
              {/* Panel desplegable de estadísticas */}
              {showStatsPanel && (
                <div className="absolute top-full left-0 mt-2">
                  <StatsPanel />
                </div>
              )}
            </div>
            
            {/* Botones flotantes: sonido e información */}
            <div className="fixed bottom-4 right-4 flex flex-col gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Evitar que el clic se propague al juego
                  setShowInfoModal(true);
                }}
                className="bg-gradient-to-r from-amber-500 to-amber-700 text-white p-3 rounded-full shadow-lg border-2 border-amber-600 hover:scale-105 transition-transform flex items-center justify-center"
                title="Información"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <SoundButton />
            </div>
            
            {/* Modal de información */}
            {showInfoModal && (
              <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-70">
                <div className="bg-gray-800 rounded-xl max-w-2xl w-full mx-4 p-6 text-white border-2 border-amber-500 shadow-2xl">
                  <h2 className="text-2xl font-bold mb-4 text-amber-400">Instrucciones del Juego</h2>
                  
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 mb-4">
                    <div className="border-b border-gray-700 pb-3">
                      <h3 className="font-bold text-amber-300 mb-2">Controles Básicos</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start">
                          <span className="bg-gray-700 text-amber-400 px-2 py-0.5 rounded mr-2 font-mono">WASD</span>
                          <span>o</span>
                          <span className="bg-gray-700 text-amber-400 px-2 py-0.5 rounded mx-2 font-mono">↑←↓→</span>
                          <span>Movimiento del personaje</span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-gray-700 text-amber-400 px-2 py-0.5 rounded mr-2">Clic</span>
                          <span>Moverte a un punto del mapa</span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-gray-700 text-amber-400 px-2 py-0.5 rounded mr-2 font-mono">ESC</span>
                          <span>Salir de edificios o ventanas</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border-b border-gray-700 pb-3">
                      <h3 className="font-bold text-amber-300 mb-2">Controles para Ratón Mac</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start">
                          <span className="bg-gray-700 text-amber-400 px-2 py-0.5 rounded mr-2">Arrastrar</span>
                          <span>Rotar la cámara</span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-gray-700 text-amber-400 px-2 py-0.5 rounded mr-2">Desplazar</span>
                          <span>Zoom de cámara</span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-gray-700 text-amber-400 px-2 py-0.5 rounded mr-2">Gesto de pellizco</span>
                          <span>Zoom de cámara (trackpad)</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border-b border-gray-700 pb-3">
                      <h3 className="font-bold text-amber-300 mb-2">Edificios</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li><span className="text-amber-400 font-bold">Mercado:</span> Compra alimentos con tus monedas IHC.</li>
                        <li><span className="text-amber-400 font-bold">Cocina:</span> Prepara comidas combinando ingredientes.</li>
                        <li><span className="text-amber-400 font-bold">Huerto:</span> Cultiva tus propios alimentos para ahorrar.</li>
                      </ul>
                      
                      {/* Mapa simple de ubicación de edificios */}
                      <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                        <h4 className="text-amber-300 text-center mb-3">Mapa de Ubicaciones</h4>
                        <div className="relative w-full h-44 bg-green-800 rounded-lg overflow-hidden border border-amber-600">
                          {/* Jugador (centro) */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full z-10" title="Tu posición"></div>
                          
                          {/* Mercado (izquierda) */}
                          <div className="absolute top-1/2 left-[20%] transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-10 h-10 bg-amber-700 border-2 border-amber-500" title="Mercado"></div>
                            <p className="text-xs text-white text-center mt-1">Mercado</p>
                          </div>
                          
                          {/* Cocina (derecha) */}
                          <div className="absolute top-1/2 right-[20%] transform translate-x-1/2 -translate-y-1/2">
                            <div className="w-10 h-10 bg-red-900 border-2 border-red-500" title="Cocina"></div>
                            <p className="text-xs text-white text-center mt-1">Cocina</p>
                          </div>
                          
                          {/* Huerto (abajo) */}
                          <div className="absolute bottom-[15%] left-1/2 transform -translate-x-1/2">
                            <div className="w-12 h-8 bg-green-900 border-2 border-green-500" title="Huerto Virtual"></div>
                            <p className="text-xs text-white text-center mt-1">Huerto</p>
                          </div>
                          
                          {/* Caminos */}
                          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300"></div>
                          <div className="absolute top-1/2 left-1/2 bottom-0 w-1 bg-gray-300 transform -translate-x-1/2"></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">El punto azul representa tu posición inicial.</p>
                      </div>
                    </div>
                    
                    <div className="border-b border-gray-700 pb-3">
                      <h3 className="font-bold text-amber-300 mb-2">Monedas y Calorías</h3>
                      <p className="text-gray-300 mb-2">
                        En este juego, 1 Kcal = 1 IHC (iHumanCoin). 
                        Puedes obtener monedas completando desafíos, realizando actividades
                        y haciendo elecciones nutricionales saludables.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-amber-300 mb-2">Interacción con Edificios</h3>
                      <ol className="list-decimal pl-5 space-y-2 text-gray-300">
                        <li>Haz clic en la <span className="text-amber-400">puerta</span> de un edificio para acercarte a él</li>
                        <li>Cuando llegues cerca de la entrada, entrarás automáticamente</li>
                        <li>Dentro del edificio, usa sus funciones específicas</li>
                        <li>Para salir, pulsa <span className="bg-gray-700 text-amber-400 px-2 py-0.5 rounded mr-2 font-mono">ESC</span> o el botón rojo</li>
                      </ol>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      onClick={() => setShowInfoModal(false)}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors"
                    >
                      Entendido
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };
  
  return renderGameUI();
};

export default GameUI;