import { useGameStateStore } from "../stores/useGameStateStore";
import { usePlayerStore } from "../stores/usePlayerStore";
import { getMarketExitPosition, getKitchenExitPosition, getGardenExitPosition } from "./Buildings";
import { useCameraStore } from "../lib/stores/useCameraStore";
import * as THREE from "three";
import { getGardenPosition, getMarketPosition, getKitchenPosition } from "./Buildings";

/**
 * ExitHelper - Componente de ayuda para salir de los edificios
 * 
 * Esta función manipula directamente el estado del juego y la posición del jugador
 * para asegurar que al salir de un edificio, el jugador aparezca lejos de las puertas
 * y así evitar el ciclo de reentrar automáticamente.
 */
export const useExitHelper = () => {
  const exitBuilding = (building: "market" | "kitchen" | "garden") => {
    // 1. Obtener posiciones relevantes
    let exitPosition;
    
    // Ajustamos diferentes distancias para cada edificio para que la vista funcione bien
    if (building === "market") {
      const basePosition = getMarketExitPosition();
      exitPosition = {
        x: basePosition.x,
        y: basePosition.y,
        z: basePosition.z + 4 // Alejándose bastante de la puerta
      };
    } 
    else if (building === "kitchen") {
      const basePosition = getKitchenExitPosition();
      exitPosition = {
        x: basePosition.x,
        y: basePosition.y,
        z: basePosition.z + 4 // Alejándose bastante de la puerta
      };
    }
    else if (building === "garden") {
      const basePosition = getGardenExitPosition();
      // Para el huerto, usamos una posición más retrasada para que se vea el personaje completo
      exitPosition = {
        x: basePosition.x,
        y: basePosition.y,
        z: -5 // Posición fija que mejora la vista de la cámara
      };
    }
    
    // 2. Cambiar estado del juego a "playing"
    useGameStateStore.setState({ gameState: "playing" });
    
    // 3. Mover al jugador a una posición segura lejos de las puertas
    if (exitPosition) {
      const { setPlayerPosition } = usePlayerStore.getState();
      setPlayerPosition(exitPosition);
      
      // 4. Ajustar la cámara para obtener una mejor vista
      adjustCameraAfterExit(building, exitPosition);
      
      console.log(`🚪 Saliendo de ${building} con posición segura:`, exitPosition);
    }
  };
  
  // Función auxiliar para ajustar la cámara después de salir
  const adjustCameraAfterExit = (building: string, exitPosition: {x: number, y: number, z: number}) => {
    const { requestReset } = useCameraStore.getState();
    requestReset(); // Reset cámara para evitar acumulación de cambios
    
    // Solo para el huerto, aplicamos un ajuste más dramático para ver mejor al personaje
    if (building === "garden") {
      const camera = useCameraStore.getState().camera;
      if (camera) {
        const gardenPos = getGardenPosition();
        
        // Posicionamos la cámara más atrás y más alta para ver mejor al personaje
        camera.position.set(0, 10, 0); // Posición alta, mirando desde arriba
        camera.lookAt(new THREE.Vector3(0, 0, -10)); // Mirar hacia el norte donde está el huerto
        camera.updateProjectionMatrix();
      }
    }
  };
  
  return { exitBuilding };
};