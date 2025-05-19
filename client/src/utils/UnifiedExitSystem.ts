import { usePlayerStore } from "../stores/usePlayerStore";
import { useGameStateStore } from "../stores/useGameStateStore";

// Posiciones seguras de salida para cada edificio (a 2 cuerpos de distancia)
const exitPositions = {
  market: { x: -8, y: 0, z: 6 },  // Frente al mercado
  kitchen: { x: 8, y: 0, z: 6 },  // Frente a la cocina
  garden: { x: 0, y: 0, z: -14 }  // Frente al huerto
};

/**
 * Sistema unificado de salida para todos los edificios
 * Garantiza que el jugador quede estático y a distancia segura
 */
export const executeUnifiedExit = (buildingType: "market" | "kitchen" | "garden") => {
  console.log(`🚪 SALIDA UNIFICADA: ${buildingType}`);
  
  // 1. DETENER CUALQUIER MOVIMIENTO PRIMERO (CRÍTICO)
  const { 
    setPlayerPosition, 
    setTargetPosition, 
    setIsMovingToTarget, 
    setDestinationBuilding 
  } = usePlayerStore.getState();
  
  setTargetPosition(null);
  setIsMovingToTarget(false);
  setDestinationBuilding(null);
  
  // 2. CAMBIAR EL ESTADO DEL JUEGO
  const { setGameState } = useGameStateStore.getState();
  setGameState("playing");
  
  // 3. POSICIONAR AL JUGADOR FRENTE AL EDIFICIO (DISTANCIA SEGURA)
  const position = exitPositions[buildingType];
  setPlayerPosition(position);
  console.log(`✅ Jugador posicionado frente a ${buildingType} en (${position.x}, ${position.y}, ${position.z})`);
};