// Funciones auxiliares para la salida segura de edificios
import { usePlayerStore } from "../stores/usePlayerStore";
import { useGameStateStore } from "../stores/useGameStateStore";

// Posiciones de salida seguras (colocadas a una distancia mucho mayor para evitar el área de colisión)
// Estas posiciones aseguran que el jugador no quede atrapado en el área de colisión de las puertas
export const SAFE_EXIT_POSITIONS = {
  market: { x: -5, y: 0, z: 7 },    // Posición segura lejos del mercado
  kitchen: { x: 5, y: 0, z: 7 },    // Posición segura lejos de la cocina
  garden: { x: 0, y: 0, z: -7 },    // Posición segura lejos del huerto
  default: { x: 0, y: 0, z: -5 }    // Posición central del mapa
};

/**
 * Función segura para salir de cualquier edificio
 * Esta función:
 * 1. Coloca al jugador en una posición segura lejos de las puertas
 * 2. Cambia el estado del juego a "playing"
 * 3. Limpia cualquier estado específico del edificio
 * 
 * @param buildingType Tipo de edificio del que estamos saliendo
 */
export function safeExit(buildingType: string) {
  // Obtener las funciones del store global
  const { setGameState } = useGameStateStore.getState();
  const { setPlayerPosition, updatePlayer, playerData } = usePlayerStore.getState();
  
  console.log(`🚪 Saliendo de ${buildingType} usando el método de salida segura`);
  
  // Seleccionar la posición segura según el edificio
  const safePosition = SAFE_EXIT_POSITIONS[buildingType as keyof typeof SAFE_EXIT_POSITIONS] || 
                      SAFE_EXIT_POSITIONS.default;
  
  // Establecer la posición del jugador
  setPlayerPosition(safePosition);
  
  // Limpiar cualquier estado del edificio anterior
  if (playerData) {
    updatePlayer({
      ...playerData,
      lastGardenAction: undefined
      // Aquí podemos añadir más limpiezas de estado si son necesarias
    });
  }
  
  // Cambiar el estado del juego a "playing"
  setGameState("playing");
  
  console.log(`✅ Jugador reposicionado en posición segura:`, safePosition);
}