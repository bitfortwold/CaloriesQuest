import { useState } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useLanguage } from "../i18n/LanguageContext";
import ProfilePanel from "./ProfilePanel";
import Activities from "./Activities";
import DailyChallenges from "./DailyChallenges";

const StatsPanel = () => {
  const { playerData } = usePlayerStore();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  return (
    <div className="bg-black/90 p-3 rounded-lg shadow-lg border border-blue-500 w-64 text-white max-h-[80vh] overflow-y-auto">
      {/* Pestañas de navegación */}
      <div className="flex gap-1 mb-3">
        <button
          className={`px-2 py-1 text-xs rounded flex-1 ${activeTab === 'profile' ? 'bg-blue-600' : 'bg-gray-700'}`}
          onClick={() => setActiveTab(activeTab === 'profile' ? null : 'profile')}
        >
          Perfil
        </button>
        <button
          className={`px-2 py-1 text-xs rounded flex-1 ${activeTab === 'activities' ? 'bg-amber-600' : 'bg-gray-700'}`}
          onClick={() => setActiveTab(activeTab === 'activities' ? null : 'activities')}
        >
          Actividades
        </button>
        <button
          className={`px-2 py-1 text-xs rounded flex-1 ${activeTab === 'challenges' ? 'bg-green-600' : 'bg-gray-700'}`}
          onClick={() => setActiveTab(activeTab === 'challenges' ? null : 'challenges')}
        >
          Desafíos
        </button>
      </div>
      
      {/* Información básica (cuando no hay pestaña activa o como resumen) */}
      {!activeTab && (
        <div className="space-y-2">
          {/* Encabezado del jugador */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-1 mb-2 rounded font-bold">
            {playerData?.name || "Player"}
          </div>
          
          {/* Salud */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Salud:</span>
              <span>{playerData ? Math.min(100, Math.max(0, 100 - Math.abs((playerData.caloriesConsumed / playerData.dailyCalories - 1) * 100))).toFixed(0) : 0}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-yellow-400 h-2 rounded-full" 
                  style={{width: `${playerData ? Math.min(100, Math.max(0, 100 - Math.abs((playerData.caloriesConsumed / playerData.dailyCalories - 1) * 100))) : 0}%`}}></div>
            </div>
          </div>
          
          {/* Calorías */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Calorías:</span>
              <span>{playerData?.caloriesConsumed || 0}/{playerData?.dailyCalories?.toFixed(0) || 0}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-blue-400 h-2 rounded-full" 
                  style={{width: `${Math.min((playerData?.caloriesConsumed || 0) / (playerData?.dailyCalories || 2000) * 100, 100)}%`}}></div>
            </div>
          </div>
          
          {/* iHumanCoins */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>iHumanCoins:</span>
              <span>{playerData?.coins?.toFixed(0) || 0} IHC</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-amber-400 h-2 rounded-full" 
                  style={{width: `${Math.min((playerData?.coins || 0) / (playerData?.dailyCalories || 2000) * 100, 100)}%`}}></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Contenido de las pestañas */}
      <div className="mt-2">
        {activeTab === 'profile' && <ProfilePanel />}
        {activeTab === 'activities' && <Activities />}
        {activeTab === 'challenges' && <DailyChallenges />}
      </div>
    </div>
  );
};

export default StatsPanel;