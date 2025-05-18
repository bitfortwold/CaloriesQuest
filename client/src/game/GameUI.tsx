import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useGameStateStore } from "../stores/useGameStateStore";
import { usePlayerStore } from "../stores/usePlayerStore";
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
  
  // SISTEMA UNIFICADO PARA LA SALIDA DE EDIFICIOS - VERSIÓN MEJORADA
  const handleBuildingExit = (buildingType: string) => {
    console.log(`Saliendo de ${buildingType} mediante sistema unificado - VERSIÓN FINAL`);
    
    // Obtener el store del jugador para actualizaciones y posicionamiento
    const { updatePlayer, playerData } = usePlayerStore.getState();
    
    // IMPORTANTE: Avisar a la cámara para resetear posición
    const { requestReset } = useCameraStore.getState();
    requestReset();
    
    // Guardar qué edificio estamos abandonando para coordinar la posición
    if (playerData) {
      // PASO CLAVE: Guardar info de salida para TODOS los edificios igual
      // Esto es crucial para que el jugador se posicione correctamente
      updatePlayer({
        ...playerData,
        // IMPORTANTE: este valor "unified_exit" es detectado por el sistema unificado
        lastGardenAction: "unified_exit"
      });
    }
    
    // Añadir un pequeño retardo para asegurar que todas las actualizaciones
    // de estado se completen correctamente antes de cambiar el game state
    setTimeout(() => {
      // PASO FINAL: Devolver el control al juego (cambia el estado a "playing")
      // Esto activará el useEffect en Player.tsx que detecta el cambio de estado
      exitBuilding();
    }, 50);
  };
  
  // Render UI based on game state
  const renderGameUI = () => {
    switch (gameState) {
      case "market":
        return (
          <>
            {/* Botones flotantes para controlar el mercado - independientes de la interfaz */}
            <div className="fixed top-4 right-4 z-[1000]">
              <button
                onClick={() => handleBuildingExit("market")}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg border-2 border-red-500 shadow-lg text-xl transition-all hover:scale-105"
              >
                {t.exit}
              </button>
            </div>
            
            {/* Botón flotante para el carrito en la esquina izquierda */}
            <div className="fixed top-4 left-4 z-[1000]">
              <button
                id="floating-cart-button"
                onClick={() => {
                  console.log("Toggle cart from floating button");
                  // En el mercado, activar el showCart del componente Market
                  if (gameState === "market") {
                    // Comunicamos con el componente Market a través de un evento personalizado
                    const marketCartEvent = new CustomEvent('toggleMarketCart');
                    document.dispatchEvent(marketCartEvent);
                  } else {
                    // Comportamiento normal para otros casos
                    const cartPanel = document.getElementById('cart-panel');
                    if (cartPanel) {
                      cartPanel.style.display = cartPanel.style.display === 'none' ? 'block' : 'none';
                    }
                  }
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg border-2 border-amber-500 shadow-lg text-xl transition-all hover:scale-105 flex items-center justify-center relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {t.cart}
                <span id="cart-counter" className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-amber-500">
                  0
                </span>
              </button>
            </div>
            
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
            {/* Botón flotante para salir de la cocina - independiente de la interfaz */}
            <div className="fixed top-4 right-4 z-[1000]">
              <button
                onClick={() => handleBuildingExit("kitchen")}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg border-2 border-red-500 shadow-lg text-xl transition-all hover:scale-105"
              >
                {t.exit}
              </button>
            </div>
            
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
            {/* Botón flotante para salir del huerto - IMPLEMENTACIÓN FINAL */}
            <div className="fixed top-4 right-4 z-[1000]">
              <button
                onClick={() => handleBuildingExit("garden")}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg border-2 border-red-500 shadow-lg text-xl transition-all hover:scale-105"
              >
                {t.exit}
              </button>
            </div>
            
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <Garden onExit={() => {
                console.log("GameUI attempting to exit garden");
                handleBuildingExit("garden");
              }} />
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