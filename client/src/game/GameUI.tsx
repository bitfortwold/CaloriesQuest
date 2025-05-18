import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useGameStateStore } from "../stores/useGameStateStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useCameraStore } from "../lib/stores/useCameraStore";
import { SoundButton } from "../components/ui/SoundButton";
import { LanguageSelector } from "../components/ui/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";
import Market from "./Market";
import Kitchen from "./Kitchen";
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
  
  // Set up portal target
  useEffect(() => {
    setDomReady(true);
  }, []);
  
  // Don't render anything if DOM is not ready
  if (!domReady) return null;
  
  // SISTEMA UNIFICADO PARA LA SALIDA DE EDIFICIOS
  const handleBuildingExit = (buildingType: string) => {
    console.log(`Saliendo de ${buildingType} con sistema unificado`);
    
    // Obtener el estado actual del jugador
    const { updatePlayer, playerData } = usePlayerStore.getState();
    
    // Guardar información de salida para todos los edificios de la misma manera
    if (playerData) {
      updatePlayer({
        ...playerData,
        // Limpiar cualquier estado anterior específico de edificios
        lastGardenAction: undefined
      });
    }
    
    // Devolver control al juego - mismo comportamiento para los tres edificios
    exitBuilding();
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
            
            {/* Botones flotantes para sonido y selección de idioma */}
            <div className="fixed bottom-4 right-4 flex flex-col gap-2">
              <SoundButton />
              <LanguageSelector />
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return renderGameUI();
};

export default GameUI;