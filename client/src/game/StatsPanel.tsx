import { useState } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useGameStateStore } from "../stores/useGameStateStore";
import { useLanguage } from "../i18n/LanguageContext";
import ProfilePanel from "./ProfilePanel";
import Activities from "./Activities";
import DailyChallenges from "./DailyChallenges";

const StatsPanel = () => {
  const playerStore = usePlayerStore();
  const { playerData } = playerStore;
  const gameStore = useGameStateStore();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Función para cerrar sesión y volver a la pantalla de inicio
  const handleLogout = () => {
    // Utilizamos la función predefinida de logout del store
    gameStore.logout();
  };

  return (
    <div className="bg-blue-950/95 p-3 rounded-lg shadow-lg border-2 border-blue-700 w-[300px] text-white max-h-[80vh] overflow-y-auto">
      {/* Título del panel */}
      <div className="bg-blue-800 text-white font-bold py-2 px-4 rounded-md mb-3 text-center">
        ESTADÍSTICAS DEL JUGADOR
      </div>
      
      {/* Pestañas de navegación */}
      <div className="flex gap-2 mb-3">
        <button
          className={`py-2 text-sm rounded-md flex-1 transition-colors ${activeTab === 'profile' ? 'bg-blue-700 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
          onClick={() => setActiveTab(activeTab === 'profile' ? null : 'profile')}
        >
          Perfil
        </button>
        <button
          className={`py-2 text-sm rounded-md flex-1 transition-colors ${activeTab === 'activities' ? 'bg-blue-700 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
          onClick={() => setActiveTab(activeTab === 'activities' ? null : 'activities')}
        >
          Actividades
        </button>
        <button
          className={`py-2 text-sm rounded-md flex-1 transition-colors ${activeTab === 'challenges' ? 'bg-blue-700 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
          onClick={() => setActiveTab(activeTab === 'challenges' ? null : 'challenges')}
        >
          Desafíos
        </button>
      </div>
      
      {/* Botón de cerrar sesión */}
      <div className="mb-3">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md w-full transition-colors text-sm font-medium flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar Sesión
        </button>
      </div>
      
      {/* Información básica (cuando no hay pestaña activa o como resumen) */}
      {!activeTab && (
        <div className="space-y-3">
          {/* Encabezado del jugador */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-2 mb-2 rounded-md font-bold text-lg">
            {playerData?.name || "Player"}
          </div>
          
          {/* Salud */}
          <div className="bg-slate-800/70 rounded-md p-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-yellow-300 font-medium">Salud:</span>
              <span className="text-yellow-100 font-bold">{playerData ? Math.min(100, Math.max(0, 100 - Math.abs((playerData.caloriesConsumed / playerData.dailyCalories - 1) * 100))).toFixed(0) : 0}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div className="bg-yellow-400 h-2.5 rounded-full" 
                  style={{width: `${playerData ? Math.min(100, Math.max(0, 100 - Math.abs((playerData.caloriesConsumed / playerData.dailyCalories - 1) * 100))) : 0}%`}}></div>
            </div>
          </div>
          
          {/* Calorías */}
          <div className="bg-slate-800/70 rounded-md p-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-blue-300 font-medium">Calorías:</span>
              <span className="text-blue-100 font-bold">{playerData?.caloriesConsumed || 0}/{playerData?.dailyCalories?.toFixed(0) || 0}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div className="bg-blue-400 h-2.5 rounded-full" 
                  style={{width: `${Math.min((playerData?.caloriesConsumed || 0) / (playerData?.dailyCalories || 2000) * 100, 100)}%`}}></div>
            </div>
          </div>
          
          {/* iHumanCoins */}
          <div className="bg-slate-800/70 rounded-md p-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-amber-300 font-medium">iHumanCoins:</span>
              <span className="text-amber-100 font-bold">{playerData?.coins?.toFixed(0) || 0} IHC</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div className="bg-amber-400 h-2.5 rounded-full" 
                  style={{width: `${Math.min((playerData?.coins || 0) / (playerData?.dailyCalories || 2000) * 100, 100)}%`}}></div>
            </div>
            <div className="text-xs text-gray-400 mt-1 text-right">1 Kcal = 1 IHC</div>
          </div>
        </div>
      )}
      
      {/* Contenido de las pestañas - Estilo corregido */}
      <div className="mt-2">
        {activeTab === 'profile' && (
          <div className="bg-slate-800/70 rounded-md">
            {/* Forzamos estilos para evitar problemas con el componente hijo */}
            <div className="text-white">
              <ProfilePanel />
            </div>
          </div>
        )}
        {activeTab === 'activities' && (
          <div className="bg-slate-800/70 rounded-md">
            {/* Forzamos estilos para evitar problemas con el componente hijo */}
            <div className="text-white p-2">
              <Activities />
            </div>
          </div>
        )}
        {activeTab === 'challenges' && (
          <div className="bg-slate-800/70 rounded-md">
            {/* Forzamos estilos para evitar problemas con el componente hijo */}
            <div className="text-white p-2">
              <DailyChallenges />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPanel;