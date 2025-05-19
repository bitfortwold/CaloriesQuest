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
    
    // 2. Movemos al jugador para evitar reentrada - posición MUY lejos
    const { setPlayerPosition } = usePlayerStore.getState();
    setPlayerPosition({
      x: 0,
      y: 0,
      z: -20 // Extremadamente alejado de cualquier edificio
    });
    
    // 3. Mensaje para notificar al usuario
    setTimeout(() => {
      if (document.visibilityState === 'visible') {
        alert("¡Salida de emergencia exitosa! Has salido del edificio.");
      }
    }, 100);
  };

  return (
    <button
      onClick={handleExit}
      className="fixed bottom-4 right-4 z-[9999] bg-red-600 text-white px-8 py-3 rounded-lg font-bold text-xl shadow-xl hover:bg-red-700 transition duration-300 animate-pulse border-4 border-yellow-300"
    >
      🚨 SALIR DE EMERGENCIA 🚨
    </button>
  );
};