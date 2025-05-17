import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useGameStateStore } from "../stores/useGameStateStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { SoundButton } from "../components/ui/SoundButton";
import { LanguageSelector } from "../components/ui/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";
import Market from "./Market";
import Kitchen from "./Kitchen";
import Activities from "./Activities";
import ProfilePanel from "./ProfilePanel";
import DailyChallenges from "./DailyChallenges";
import Garden from "./Garden";

const GameUI = () => {
  // Access game state and translations
  const { gameState, exitBuilding } = useGameStateStore();
  const { playerData } = usePlayerStore();
  const { t, language } = useLanguage(); // Hook para acceder a las traducciones y el idioma actual
  
  // Track whether DOM is ready for portals
  const [domReady, setDomReady] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  
  // Set up portal target
  useEffect(() => {
    setDomReady(true);
  }, []);
  
  // Don't render anything if DOM is not ready
  if (!domReady) return null;
  
  // Render UI based on game state
  const renderGameUI = () => {
    switch (gameState) {
      case "market":
        return (
          <>
            {/* Botones flotantes para controlar el mercado - independientes de la interfaz */}
            <div className="fixed top-4 right-4 z-[1000]">
              <button
                onClick={() => {
                  console.log("Force exiting market via floating button");
                  exitBuilding();
                }}
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
                setActiveTab(null);
                exitBuilding();
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
                onClick={() => {
                  console.log("Force exiting kitchen via floating button");
                  exitBuilding();
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg border-2 border-red-500 shadow-lg text-xl transition-all hover:scale-105"
              >
                {t.exit}
              </button>
            </div>
            
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <Kitchen onExit={() => {
                console.log("GameUI attempting to exit kitchen");
                setActiveTab(null);
                exitBuilding();
              }} />
            </div>
          </>
        );
        
      case "garden":
        return (
          <>
            {/* Botón flotante para salir del huerto */}
            <div className="fixed top-4 right-4 z-[1000]">
              <button
                onClick={() => {
                  console.log("Force exiting garden via floating button");
                  exitBuilding();
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg border-2 border-red-500 shadow-lg text-xl transition-all hover:scale-105"
              >
                {t.exit}
              </button>
            </div>
            
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <Garden onExit={() => {
                console.log("GameUI attempting to exit garden");
                setActiveTab(null);
                // Pequeño retraso para evitar conflictos de estado
                setTimeout(() => {
                  console.log("Executing exitBuilding from Garden component");
                  exitBuilding();
                }, 50);
              }} />
            </div>
          </>
        );
      case "playing":
        return (
          <div className="z-10">
            {/* Botón de estadísticas colapsable */}
            <div className="fixed top-2 left-2 z-[1000]">
              <div className="flex flex-col items-start">
                {/* Botón de estadísticas atractivo */}
                <button
                  onClick={() => setShowProfilePanel(!showProfilePanel)}
                  className={`bg-gradient-to-r from-blue-700 to-indigo-900 text-white font-bold py-3 px-6 rounded-lg shadow-lg 
                           border-2 border-blue-600 transition-all duration-300 hover:scale-105 flex items-center ${showProfilePanel ? 'mb-2' : ''}`}
                >
                  <div className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xl">{t.playerStats}</span>
                  <div className="ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showProfilePanel ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {/* Panel desplegable que contiene las estadísticas */}
                {showProfilePanel && (
                  <div className="bg-gray-900/90 p-4 rounded-lg shadow-md text-white animate-fadeIn w-64">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-3">
                      <div className="flex gap-2 w-full">
                        <button 
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded flex-1 transition-colors"
                          onClick={() => setActiveTab('profile')}
                        >
                          {t.profile}
                        </button>
                        <button 
                          className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-3 py-1 rounded flex-1 transition-colors"
                          onClick={() => {
                            // Mostrar/ocultar panel de instrucciones
                            const statsInstructions = document.getElementById('stats-instructions');
                            if (statsInstructions) {
                              const isVisible = statsInstructions.style.display !== 'none';
                              statsInstructions.style.display = isVisible ? 'none' : 'block';
                            }
                          }}
                          title="Ver instrucciones"
                        >
                          {t.help}
                        </button>
                        <button 
                          className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded flex-1 transition-colors"
                          onClick={() => {
                            // Usar la función de logout que existe en el store para cerrar sesión correctamente
                            // Esta función ya establece gameState = "ready" e isRegistered = false
                            useGameStateStore.getState().logout();
                            setShowProfilePanel(false);
                          }}
                        >
                          {t.exit}
                        </button>
                      </div>
                    </div>
                    
                    {/* Panel de instrucciones oculto por defecto dentro del panel de estadísticas */}
                    <div 
                      id="stats-instructions" 
                      className="bg-black/95 text-white p-3 rounded-lg shadow-lg w-full mb-3"
                      style={{ display: 'none' }}
                    >
                      <h3 className="text-center font-bold mb-2 text-blue-300 text-xs">{t.controls}</h3>
                      <div className="space-y-1 text-xs">
                        <p>{t.moveKeys}</p>
                        <p>{t.clickToMove}</p>
                        <p>{t.interactKey}</p>
                        <p>{t.rotateCamera}</p>
                        <p>{t.zoomCamera}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-1 mb-3 rounded font-bold">
                      {playerData?.name || "Player"}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-yellow-400 font-semibold">{t.health}:</span>
                          <span className="text-yellow-400 font-bold">
                            {playerData ? Math.min(100, Math.max(0, 100 - Math.abs((playerData.caloriesConsumed / playerData.dailyCalories - 1) * 100))).toFixed(0) : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-3 rounded-full ${
                              !playerData ? 'bg-gradient-to-r from-yellow-500 to-yellow-300' :
                              playerData.caloriesConsumed / playerData.dailyCalories > 1.5 || playerData.caloriesConsumed / playerData.dailyCalories < 0.5
                                ? 'bg-gradient-to-r from-red-600 to-red-400' 
                                : playerData.caloriesConsumed / playerData.dailyCalories > 1.2 || playerData.caloriesConsumed / playerData.dailyCalories < 0.8
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-300'
                                : 'bg-gradient-to-r from-green-500 to-green-300'
                            }`} 
                            style={{ 
                              width: playerData
                                ? `${Math.min(100, Math.max(0, 100 - Math.abs((playerData.caloriesConsumed / playerData.dailyCalories - 1) * 100)))}%` 
                                : "50%" 
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-blue-400 font-semibold">{t.calories}:</span>
                          <span className="text-white">{playerData?.caloriesConsumed || 0}/{playerData?.dailyCalories?.toFixed(0) || 0}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                          <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-3 rounded-full" style={{ 
                            width: `${Math.min((playerData?.caloriesConsumed || 0) / (playerData?.dailyCalories || 2000) * 100, 100)}%` 
                          }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-yellow-400 font-semibold flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {t.coins}:
                          </span>
                          <span className="text-yellow-400 font-bold">{playerData?.coins?.toFixed(0) || 0}/{playerData?.dailyCalories?.toFixed(0) || 0} IHC</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                          <div className="bg-gradient-to-r from-yellow-500 to-amber-300 h-3 rounded-full" style={{ 
                            width: `${Math.min((playerData?.coins || 0) / (playerData?.dailyCalories || 2000) * 100, 100)}%` 
                          }}></div>
                        </div>
                        <div className="text-xs text-gray-400 text-center mt-1">1 Kcal = 1 IHC</div>
                      </div>
                      

                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Profile panel that appears only when user clicks on "Perfil" */}
            {showProfilePanel && (
              <div className="fixed top-2 right-2 bg-white/90 p-2 rounded-lg shadow-md" style={{ maxWidth: "300px", maxHeight: "80vh", overflow: "auto" }}>
                <div className="flex space-x-2 mb-2">
                  <button 
                    className={`px-3 py-1 text-sm rounded ${activeTab === 'profile' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    {t.profile}
                  </button>
                  <button 
                    className={`px-3 py-1 text-sm rounded ${activeTab === 'activities' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('activities')}
                  >
                    {t.activities}
                  </button>
                  <button 
                    className={`px-3 py-1 text-sm rounded ${activeTab === 'challenges' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('challenges')}
                  >
                    Desafíos
                  </button>
                  <button 
                    className="px-3 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700"
                    onClick={() => {
                      console.log("Entering garden");
                      useGameStateStore.getState().setGameState('garden');
                    }}
                  >
                    {language === 'es' ? 'Huerto' : language === 'ca' ? 'Hort' : 'Garden'}
                  </button>
                </div>
                
                <div className="max-h-[60vh] overflow-auto">
                  {activeTab === 'profile' && <ProfilePanel />}
                  {activeTab === 'activities' && <Activities />}
                  {activeTab === 'challenges' && <DailyChallenges />}
                </div>
                
                {/* Close button */}
                <button 
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowProfilePanel(false)}
                >
                  ✕
                </button>
              </div>
            )}
            
            {/* Botón de instrucciones que muestra los controles en un tooltip */}
            <div className="fixed bottom-4 right-4 z-10">
              <button 
                className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all"
                onClick={() => {
                  // Mostrar/ocultar panel de instrucciones
                  const instructionsPanel = document.getElementById('game-instructions');
                  if (instructionsPanel) {
                    const isVisible = instructionsPanel.style.display !== 'none';
                    instructionsPanel.style.display = isVisible ? 'none' : 'block';
                  }
                }}
                title="Ver instrucciones"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              {/* Panel de instrucciones oculto por defecto */}
              <div 
                id="game-instructions" 
                className="absolute bottom-14 right-0 bg-black/90 text-white p-3 rounded-lg shadow-lg w-64"
                style={{ display: 'none' }}
              >
                <h3 className="text-center font-bold mb-2 text-blue-300">{t.controls}</h3>
                <div className="space-y-1 text-sm">
                  <p>{t.moveKeys}</p>
                  <p>{t.clickToMove}</p>
                  <p>{t.interactKey}</p>
                  <p>{t.rotateCamera}</p>
                  <p>{t.zoomCamera}</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Use portal to render UI outside of Canvas
  return createPortal(
    <>
      {/* Botón de sonido visible en todos los estados */}
      <SoundButton />
      {renderGameUI()}
    </>,
    document.body
  );
};

export default GameUI;
