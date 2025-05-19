import React from "react";
import { useGameStateStore } from "../stores/useGameStateStore";

// Botón de emergencia para forzar la salida de cualquier edificio
// Este componente usa la técnica más directa posible para salir
export const ForceExitButton = () => {
  const handleExit = () => {
    console.log("🔴 FORZANDO SALIDA DE EMERGENCIA");
    
    // Forzamos directamente el cambio de estado a "playing"
    useGameStateStore.setState({ gameState: "playing" });
  };

  return (
    <button
      onClick={handleExit}
      className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-red-700 transition duration-300"
    >
      ⚠️ SALIR DE EMERGENCIA ⚠️
    </button>
  );
};