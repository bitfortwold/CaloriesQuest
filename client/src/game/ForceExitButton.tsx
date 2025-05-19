import React from "react";
import { useGameStateStore } from "../stores/useGameStateStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useExitHelper } from "./ExitHelper";

// Botón de emergencia para forzar la salida de cualquier edificio
// Este componente usa la técnica más directa posible para salir
export const ForceExitButton = () => {
  const handleExit = () => {
    console.log("🔴 FORZANDO SALIDA DE EMERGENCIA");
    
    // 1. Forzamos directamente el cambio de estado a "playing"
    useGameStateStore.setState({ gameState: "playing" });
    
    // 2. Movemos al jugador para evitar reentrada
    const { setPlayerPosition } = usePlayerStore.getState();
    // Posición segura
    setPlayerPosition({
      x: 0,
      y: 0,
      z: -10 // Alejado de cualquier edificio
    });
  };

  return (
    <button
      onClick={handleExit}
      className="fixed top-4 right-4 z-[9999] bg-red-600 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-red-700 transition duration-300"
    >
      ⚠️ SALIR DE EMERGENCIA ⚠️
    </button>
  );
};