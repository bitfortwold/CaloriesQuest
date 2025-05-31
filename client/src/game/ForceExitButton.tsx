import React from "react";
import { useGameStateStore } from "../stores/useGameStateStore";
import { usePlayerStore } from "../stores/usePlayerStore";

// Botón de emergencia para forzar la salida de cualquier edificio
// Este componente usa la técnica más directa posible para salir y evitar bucles
export const ForceExitButton = () => {
  const handleExit = () => {
    console.log("🔴 FORZANDO SALIDA DE EMERGENCIA");
    
    // Forzamos directamente el cambio de estado a "playing"
    useGameStateStore.setState({ gameState: "playing" });
    
    // Mover al jugador muy lejos de cualquier puerta para evitar entrar nuevamente
    const { setPlayerPosition } = usePlayerStore.getState();
    setPlayerPosition({ x: 0, y: 0, z: -15 });
  };

  return (
    <button
      onClick={handleExit}
      className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-red-700 transition duration-300"
    >
      ⚠️ SALIDA DE EMERGENCIA ⚠️
    </button>
  );
};