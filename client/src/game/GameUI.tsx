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
  const [activeTab, setActiveTab] = useState<string>("profile");
  
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
        return <Market onExit={() => exitBuilding()} />;
      case "kitchen":
        return <Kitchen onExit={() => exitBuilding()} />;
      case "playing":
        return (
          <div className="z-10">
            {/* Small player info panel at top left */}
            <div className="fixed top-2 left-2 bg-white/90 p-2 rounded-lg shadow-md" style={{ maxWidth: "180px" }}>
              <h2 className="text-base font-bold truncate">
                {playerData?.name || "Player"}
              </h2>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div>Edad: {playerData?.age || 0}</div>
                <div>Cal: {playerData?.dailyCalories?.toFixed(0) || 0}</div>
              </div>
              <div className="mt-1 flex justify-between text-xs">
                <span>IHC:</span>
                <span className="font-medium">{playerData?.coins?.toFixed(0) || 0}</span>
              </div>
            </div>
            
            {/* Tabs at top right - smaller and compacted */}
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
            </div>
            
            {/* Controls hint */}
            <div className="fixed bottom-4 left-4 bg-black/70 text-white p-2 rounded text-xs">
              <p>WASD o Flechas: Moverse</p>
              <p>E o Espacio: Interactuar</p>
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
