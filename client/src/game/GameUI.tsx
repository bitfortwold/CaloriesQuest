import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useGameStateStore } from "../stores/useGameStateStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import Market from "./Market";
import Kitchen from "./Kitchen";
import Activities from "./Activities";
import ProfilePanel from "./ProfilePanel";

const GameUI = () => {
  // Access game state
  const { gameState, exitBuilding } = useGameStateStore();
  const { playerData } = usePlayerStore();
  
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
                EXIT
              </button>
            </div>
            
            {/* Botón flotante para el carrito en la esquina izquierda */}
            <div className="fixed top-4 left-4 z-[1000]">
              <button
                id="floating-cart-button"
                onClick={() => {
                  console.log("Toggle cart from floating button");
                  // Manipulación directa del DOM para mostrar/ocultar el panel del carrito
                  const cartPanel = document.getElementById('cart-panel');
                  if (cartPanel) {
                    cartPanel.style.display = cartPanel.style.display === 'none' ? 'block' : 'none';
                  }
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg border-2 border-amber-500 shadow-lg text-xl transition-all hover:scale-105 flex items-center justify-center relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                CART
                <span id="cart-counter" className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-amber-500">0</span>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <Kitchen onExit={() => {
              console.log("GameUI attempting to exit kitchen");
              setActiveTab(null);
              exitBuilding();
            }} />
          </div>
        );
      case "playing":
        return (
          <div className="z-10">
            {/* Player stats panel similar to the reference design */}
            <div className="fixed top-2 left-2 bg-gray-900/90 p-3 rounded-lg shadow-md text-white" style={{ maxWidth: "240px" }}>
              <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-2">
                <h2 className="text-lg font-bold uppercase tracking-wide">PLAYER STATS</h2>
                <div className="flex gap-2">
                  <button 
                    className="text-blue-400 text-sm"
                    onClick={() => {
                      setShowProfilePanel(!showProfilePanel);
                      setActiveTab('profile');
                    }}
                  >
                    Perfil
                  </button>
                  <button 
                    className="text-red-400 text-sm"
                    onClick={() => useGameStateStore.getState().logout()}
                  >
                    Salir
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-500 text-white text-center py-1 mb-3 w-1/3 mx-auto">
                {playerData?.name || "Player"}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400">Health:</span>
                  <span className="text-yellow-400 font-bold">50%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div className="bg-yellow-400 h-3 rounded-full" style={{ width: "50%" }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-blue-400">Calories:</span>
                  <span className="text-white">{playerData?.caloriesConsumed || 0}/{playerData?.dailyCalories?.toFixed(0) || 0}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div className="bg-blue-400 h-3 rounded-full" style={{ 
                    width: `${Math.min((playerData?.caloriesConsumed || 0) / (playerData?.dailyCalories || 2000) * 100, 100)}%` 
                  }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400">iHumanCoins:</span>
                  <span className="text-yellow-400 font-bold">{playerData?.coins?.toFixed(0) || 0}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-purple-400">Inventory:</span>
                  <span className="text-purple-400">{playerData?.inventory?.length || 0} items</span>
                </div>
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
                    Profile
                  </button>
                  <button 
                    className={`px-3 py-1 text-sm rounded ${activeTab === 'activities' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('activities')}
                  >
                    Activities
                  </button>
                </div>
                
                <div className="max-h-[60vh] overflow-auto">
                  {activeTab === 'profile' && <ProfilePanel />}
                  {activeTab === 'activities' && <Activities />}
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
            
            {/* Controls hint with mouse controls */}
            <div className="fixed bottom-4 left-4 bg-black/70 text-white p-2 rounded text-xs">
              <p>WASD o Flechas: Moverse</p>
              <p>Click del ratón: Moverse o interactuar con edificios</p>
              <p>E o Espacio: Interactuar</p>
              <p>Botón izquierdo + arrastrar: Rotar cámara</p>
              <p>Rueda del ratón: Acercar/alejar</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Use portal to render UI outside of Canvas
  return createPortal(
    renderGameUI(),
    document.body
  );
};

export default GameUI;
