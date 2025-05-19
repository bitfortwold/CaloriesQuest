import { useGameStateStore } from "../stores/useGameStateStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useCameraStore } from "../lib/stores/useCameraStore";
import * as THREE from "three";
import { getBuildingConfig } from "./BuildingConfig";

/**
 * ExitHelper - Componente de ayuda para salir de los edificios
 * 
 * Esta función manipula directamente el estado del juego y la posición del jugador
 * para asegurar que al salir de un edificio, el jugador aparezca lejos de las puertas
 * y así evitar el ciclo de reentrar automáticamente.
 */
export const useExitHelper = () => {
  const exitBuilding = (building: "market" | "kitchen" | "garden") => {
    // 1. Obtener configuración del edificio seleccionado
    const config = getBuildingConfig(building);
    
    if (!config) {
      console.error(`⚠️ Error: No se encontró configuración para el edificio ${building}`);
      return;
    }
    
    // 2. Cambiar estado del juego a "playing"
    useGameStateStore.setState({ gameState: "playing" });
    
    // 3. Mover al jugador a una posición segura según la configuración
    const { setPlayerPosition, setRotationY } = usePlayerStore.getState();
    setPlayerPosition(config.exitPosition);
    setRotationY(config.exitRotation);
    
    // 4. Avisar al sistema de cámara que debe actualizarse
    // El componente Player detectará este cambio y aplicará los ajustes
    const { requestReset } = useCameraStore.getState();
    requestReset(); 
    
    // 5. Registrar la acción para depuración
    console.log(`🚪 Saliendo de ${building} con configuración centralizada:`, {
      position: config.exitPosition,
      rotation: config.exitRotation
    });
  };
  
  return { exitBuilding };
};