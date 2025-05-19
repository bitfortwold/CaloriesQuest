import * as THREE from "three";

// Configuración de edificios para posiciones, cámara y otras propiedades
export interface BuildingConfig {
  // Posición del edificio
  position: {
    x: number;
    y: number;
    z: number;
  };
  
  // Posición de salida del jugador
  exitPosition: {
    x: number;
    y: number;
    z: number;
  };
  
  // Configuración de cámara al salir
  exitCamera: {
    position: {
      x: number;
      y: number;
      z: number;
    };
    lookAt: {
      x: number;
      y: number;
      z: number;
    };
  };
  
  // Rotación del jugador al salir (en radianes)
  exitRotation: number;
}

// Configuración completa de todos los edificios
const buildingConfigs: Record<string, BuildingConfig> = {
  garden: {
    position: { x: 0, y: 0, z: -15 },
    exitPosition: { x: 0, y: 0, z: -3 }, // Posición ajustada para mejor visibilidad
    exitCamera: {
      position: { x: 0, y: 10, z: 10 }, // Posición ideal para ver al jugador completo
      lookAt: { x: 0, y: 1.5, z: -3 }   // Mirar hacia el jugador
    },
    exitRotation: Math.PI // Mirando hacia el norte (huerto)
  },
  
  market: {
    position: { x: -8, y: 0, z: 0 },
    exitPosition: { x: -8, y: 0, z: 3 },
    exitCamera: {
      position: { x: -13, y: 8, z: 3 }, // A la izquierda del jugador
      lookAt: { x: -8, y: 1, z: 0 }     // Mirando hacia el mercado
    },
    exitRotation: Math.PI / 2 // Mirando hacia el este
  },
  
  kitchen: {
    position: { x: 8, y: 0, z: 0 },
    exitPosition: { x: 8, y: 0, z: 3 },
    exitCamera: {
      position: { x: 13, y: 8, z: 3 }, // A la derecha del jugador
      lookAt: { x: 8, y: 1, z: 0 }     // Mirando hacia la cocina
    },
    exitRotation: -Math.PI / 2 // Mirando hacia el oeste
  }
};

// Funciones de acceso a la configuración
export const getBuildingConfig = (building: string): BuildingConfig | undefined => {
  return buildingConfigs[building];
};

// Funciones de acceso a posiciones específicas
export const getGardenPosition = () => buildingConfigs.garden.position;
export const getMarketPosition = () => buildingConfigs.market.position;
export const getKitchenPosition = () => buildingConfigs.kitchen.position;

// Funciones de acceso a posiciones de salida
export const getGardenExitPosition = () => buildingConfigs.garden.exitPosition;
export const getMarketExitPosition = () => buildingConfigs.market.exitPosition;
export const getKitchenExitPosition = () => buildingConfigs.kitchen.exitPosition;