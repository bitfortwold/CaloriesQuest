import { usePlayerStore } from "../stores/usePlayerStore";
import { useGameStateStore } from "../stores/useGameStateStore";

/**
 * SISTEMA UNIFICADO DE SALIDA PARA TODOS LOS EDIFICIOS (v3.0)
 * 
 * Este sistema garantiza que:
 * 1. El jugador aparece FRENTE AL EDIFICIO pero a distancia segura
 * 2. La posición es suficientemente lejana para evitar interacción con la puerta
 * 3. Se detiene cualquier movimiento automático para prevenir reentradas
 * 4. Se ejecuta con una secuencia específica para mayor fiabilidad
 */

// Tipo para los edificios soportados
export type BuildingType = 'market' | 'kitchen' | 'garden';

/**
 * Las nuevas posiciones de salida son:
 * - Para el mercado: frente al mercado (x negativo) pero lejos (z positivo grande)
 * - Para la cocina: frente a la cocina (x positivo) pero lejos (z positivo grande)
 * - Para el huerto: frente al huerto (z negativo) pero MUCHO más lejos
 */
export const SAFE_EXIT_POSITIONS = {
  // Posiciones frente a cada edificio pero con distancia de seguridad
  market: { x: -8, y: 0, z: 15 },    // Frente al mercado pero muy alejado
  kitchen: { x: 8, y: 0, z: 15 },    // Frente a la cocina pero muy alejado
  garden: { x: 0, y: 0, z: -25 },    // Frente al huerto pero extremadamente lejos
  default: { x: 0, y: 0, z: -15 }    // Posición segura por defecto
};

/**
 * Sistema unificado mejorado para la salida de edificios
 * @returns Funciones para salir de edificios de forma segura
 */
export const useUnifiedExitSystem = () => {
  /**
   * Sale del edificio actual y posiciona al jugador en un lugar seguro
   * @param buildingType Tipo de edificio ('market', 'kitchen', 'garden')
   * @param onComplete Función opcional a ejecutar después de la salida
   */
  const exitFromBuilding = (buildingType: BuildingType, onComplete?: () => void) => {
    console.log(`🚪 SISTEMA UNIFICADO DE SALIDA v3.0: Saliendo del ${buildingType}`);
    
    // SECUENCIA CRÍTICA DE SALIDA (NO MODIFICAR EL ORDEN)
    
    // 1. DETENER CUALQUIER MOVIMIENTO AUTOMÁTICO
    const { setIsMovingToTarget, setTargetPosition, setPlayerPosition } = usePlayerStore.getState();
    setTargetPosition(null);
    setIsMovingToTarget(false);
    
    // 2. OBTENER POSICIÓN DE SALIDA SEGÚN EL EDIFICIO
    const exitPosition = SAFE_EXIT_POSITIONS[buildingType] || SAFE_EXIT_POSITIONS.default;
    
    // 3. CAMBIAR EL ESTADO DEL JUEGO CON DELAY (esto es crucial)
    setTimeout(() => {
      const { setGameState } = useGameStateStore.getState();
      setGameState("playing");
      
      // 4. MOVER AL JUGADOR DESPUÉS DE CAMBIAR ESTADO (esto evita interacciones indeseadas)
      setTimeout(() => {
        // Posicionar al jugador en lugar seguro DESPUÉS de salir del edificio
        setPlayerPosition(exitPosition);
        console.log(`✅ SISTEMA UNIFICADO: Jugador reposicionado frente a ${buildingType} en (${exitPosition.x}, ${exitPosition.y}, ${exitPosition.z})`);
        
        // 5. EJECUTAR CALLBACK SI EXISTE
        if (onComplete) {
          onComplete();
        }
      }, 100);
    }, 50);
  };
  
  // Devolver las funciones del sistema
  return {
    exitFromBuilding
  };
};