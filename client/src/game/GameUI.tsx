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
          <div className="fixed top-0 left-0 p-4 z-10 w-full">
            <div className="flex justify-between items-start w-full">
              {/* Left side - Player info panel */}
              <div className="bg-white/90 p-4 rounded-lg shadow-md max-w-xs">
                <h2 className="text-xl font-bold mb-2">
                  {playerData?.name || "Player"}
                </h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Age: {playerData?.age || 0}</div>
                  <div>Height: {playerData?.height || 0} cm</div>
                  <div>Weight: {playerData?.weight || 0} kg</div>
                  <div>Activity: {playerData?.activityLevel || "Low"}</div>
                </div>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between">
                    <span>Daily Calories:</span>
                    <span className="font-medium">{playerData?.dailyCalories?.toFixed(0) || 0}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-green-500 rounded-full" 
                      style={{ 
                        width: `${Math.min((playerData?.caloriesConsumed || 0) / 
                          (playerData?.dailyCalories || 2000) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div className="mt-3 flex justify-between">
                  <span>iHumancoins:</span>
                  <span className="font-medium">{playerData?.coins?.toFixed(0) || 0}</span>
                </div>
              </div>
              
              {/* Right side - Tabs */}
              <div className="bg-white/90 p-2 rounded-lg shadow-md">
                <div className="flex space-x-2">
                  <button 
                    className={`px-3 py-1 rounded ${activeTab === 'profile' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    Profile
                  </button>
                  <button 
                    className={`px-3 py-1 rounded ${activeTab === 'activities' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('activities')}
                  >
                    Activities
                  </button>
                </div>
                
                {activeTab === 'profile' && <ProfilePanel />}
                {activeTab === 'activities' && <Activities />}
              </div>
            </div>
            
            {/* Controls hint */}
            <div className="fixed bottom-4 left-4 bg-black/70 text-white p-2 rounded text-sm">
              <p>WASD or Arrow Keys: Move</p>
              <p>E or Space: Interact</p>
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
