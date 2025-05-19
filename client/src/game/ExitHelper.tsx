import { usePlayerStore } from "../stores/usePlayerStore";
import { useGameStateStore } from "../stores/useGameStateStore";

/**
 * Helper para manejar de forma segura la salida de edificios
 * Permite:
 * 1. Reposicionar al jugador en un lugar seguro al salir
 * 2. Evitar que el jugador quede atrapado en bucles de entrada/salida
 */
export const useExitHelper = () => {
  // Posiciones seguras de salida para cada edificio
  const safeExitPositions = {
    market: { x: -5, y: 0, z: 7 },    // Lejos del mercado
    kitchen: { x: 5, y: 0, z: 7 },    // Lejos de la cocina
    garden: { x: 0, y: 0, z: -7 },    // Lejos del huerto
    default: { x: 0, y: 0, z: -5 }    // Centro del mapa
  };
  
  /**
   * Función para salir de un edificio de forma segura
   */
  const exitBuilding = (buildingType: 'market' | 'kitchen' | 'garden') => {
    // Accedemos directamente a los stores
    const { setPlayerPosition, updatePlayer, playerData } = usePlayerStore.getState();
    const { setGameState } = useGameStateStore.getState();
    
    console.log(`🚪 Saliendo del ${buildingType} de forma segura`);
    
    // Seleccionar posición de salida basada en el edificio
    const exitPosition = safeExitPositions[buildingType] || safeExitPositions.default;
    
    // Reposicionar al jugador en un lugar seguro
    setPlayerPosition(exitPosition);
    
    // Limpiar cualquier estado específico del edificio
    if (playerData) {
      updatePlayer({
        ...playerData,
        lastGardenAction: undefined
        // Se pueden añadir más estados a limpiar aquí
      });
    }
    
    // Cambiar directamente el estado del juego a "playing"
    setGameState("playing");
    
    console.log(`✅ Jugador reposicionado en (${exitPosition.x}, ${exitPosition.y}, ${exitPosition.z})`);
  };
  
  // Exponer las funciones del helper
  return {
    exitBuilding
  };
};