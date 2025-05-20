import { usePlayerStore } from "../stores/usePlayerStore";
import { useGameStateStore } from "../stores/useGameStateStore";

/**
 * SISTEMA UNIFICADO DE SALIDA DE EDIFICIOS (v2.0)
 * 
 * Este sistema garantiza que:
 * 1. El jugador siempre aparece a una distancia segura frente al edificio
 * 2. La posición es suficientemente lejana para no interactuar con la puerta
 * 3. Se detiene cualquier movimiento automático para evitar reentradas
 * 4. Se usa una secuencia específica de operaciones para prevenir bucles
 */
export const useExitHelper = () => {
  // POSICIONES DE SALIDA SEGURAS (más lejos que la versión anterior)
  // Estas posiciones son LATERALES o bien muy lejanas para evitar cualquier interacción
  const safeExitPositions = {
    market: { x: -10, y: 0, z: 10 },    // Lejos del mercado, en diagonal
    kitchen: { x: 10, y: 0, z: 10 },    // Lejos de la cocina, en diagonal
    garden: { x: 0, y: 0, z: -20 },     // Muy lejos del huerto
    gym: { x: 0, y: 0, z: 10 },         // Lejos del gimnasio
    default: { x: 0, y: 0, z: -15 }     // Posición segura por defecto
  };
  
  /**
   * Función mejorada para salir de un edificio de forma segura
   * Implementa una secuencia específica de pasos para garantizar la salida limpia
   */
  const exitBuilding = (buildingType: 'market' | 'kitchen' | 'garden' | 'gym') => {
    console.log(`🚪 SISTEMA UNIFICADO DE SALIDA v2.0: Saliendo del ${buildingType}`);
    
    // 1. DETENER CUALQUIER MOVIMIENTO AUTOMÁTICO
    // Esto es crucial para evitar que el sistema de movimiento vuelva a entrar al edificio
    const { setIsMovingToTarget, setTargetPosition, setPlayerPosition } = usePlayerStore.getState();
    setTargetPosition(null);
    setIsMovingToTarget(false);
    
    // 2. SELECCIONAR POSICIÓN DE SALIDA SEGURA
    const exitPosition = safeExitPositions[buildingType] || safeExitPositions.default;
    
    // 3. REPOSICIONAR AL JUGADOR (PASO CRÍTICO)
    // Colocamos al jugador en la posición segura
    setPlayerPosition(exitPosition);
    
    // 4. LIMPIAR CUALQUIER ESTADO ESPECÍFICO
    const { updatePlayer, playerData } = usePlayerStore.getState();
    if (playerData) {
      updatePlayer({
        ...playerData,
        lastGardenAction: undefined,
        // Cualquier otro estado específico a limpiar
      });
    }
    
    // 5. CAMBIAR EL ESTADO DEL JUEGO CON UN PEQUEÑO RETRASO
    // Esto permite que la posición se actualice antes del cambio de estado
    setTimeout(() => {
      const { setGameState } = useGameStateStore.getState();
      setGameState("playing");
      console.log(`✅ Jugador reposicionado con éxito en (${exitPosition.x}, ${exitPosition.y}, ${exitPosition.z})`);
    }, 50);
  };
  
  // Exponer las funciones del helper
  return {
    exitBuilding
  };
};