import { create } from 'zustand';
import * as THREE from 'three';

// Store dedicado para controlar la posición y estado de la cámara
interface CameraStoreState {
  // Estado de reseteo
  resetPending: boolean;
  lastResetTimestamp: number;
  
  // Posición de cámara fijada para el huerto
  gardenExitCameraPosition: {x: number, y: number, z: number};
  gardenExitCameraTarget: {x: number, y: number, z: number};
  
  // Valores para control de cámara con ratón
  cameraRotation: { x: number, y: number };
  cameraDistance: number;
  cameraTarget: THREE.Vector3;
  
  // Acciones
  requestReset: () => void;
  clearReset: () => void;
  wasResetRecently: () => boolean;
  requestOrbitDelta: (deltaX: number, deltaY: number) => void;
  requestZoom: (delta: number) => void;
  setCameraTarget: (target: THREE.Vector3) => void;
}

// CONSTANTES GLOBALES PARA POSICIONAMIENTO INVARIABLE Y ABSOLUTO
// Valores fijos e inmutables que no cambiarán bajo ninguna circunstancia
// Estos valores están alineados con los usados en todos los demás componentes
const FIXED_GARDEN_CAMERA_POSITION = {x: 0, y: 10, z: 10}; // Posición elevada y alejada
const FIXED_GARDEN_CAMERA_TARGET = {x: 0, y: 0, z: -15}; // Mirando directamente al huerto

// CONSTANTES PARA CONTROL DE CÁMARA
const MIN_CAMERA_DISTANCE = 5;    // Distancia mínima (más cerca)
const MAX_CAMERA_DISTANCE = 20;   // Distancia máxima (más lejos)
const MIN_CAMERA_Y_ANGLE = 0.1;   // Ángulo vertical mínimo (en radianes)
const MAX_CAMERA_Y_ANGLE = Math.PI / 2 - 0.1;  // Ángulo vertical máximo

// Crear store con valores predeterminados calibrados según la captura de referencia
export const useCameraStore = create<CameraStoreState>()((set, get) => ({
  // Estado inicial
  resetPending: false,
  lastResetTimestamp: 0,
  
  // Posición EXACTA según la captura proporcionada - VALORES FIJOS ABSOLUTOS
  gardenExitCameraPosition: FIXED_GARDEN_CAMERA_POSITION,
  gardenExitCameraTarget: FIXED_GARDEN_CAMERA_TARGET,
  
  // Valores iniciales para control de cámara
  cameraRotation: { x: 0, y: Math.PI / 4 },  // PI/4 radianes = 45 grados en vertical
  cameraDistance: 10,
  cameraTarget: new THREE.Vector3(0, 0, 0),
  
  // Solicita un reseteo de cámara
  requestReset: () => {
    set({
      resetPending: true,
      lastResetTimestamp: Date.now(),
      // Reiniciar valores de órbita a predeterminados
      cameraRotation: { x: 0, y: Math.PI / 4 },
      cameraDistance: 10,
    });
    console.log("🎯 CÁMARA: Solicitado reseteo forzado");
  },
  
  // Limpia el estado de reseteo
  clearReset: () => {
    set({resetPending: false});
    console.log("🎯 CÁMARA: Reseteo completado");
  },
  
  // Comprueba si hubo un reseteo reciente (últimos 2 segundos)
  wasResetRecently: () => {
    const now = Date.now();
    const lastReset = get().lastResetTimestamp;
    return (now - lastReset) < 2000;
  },
  
  // Actualiza la rotación de la cámara (órbita)
  requestOrbitDelta: (deltaX: number, deltaY: number) => {
    set(state => {
      // Calcular nueva rotación horizontal (alrededor del eje Y)
      const newRotationX = state.cameraRotation.x + deltaX;
      
      // Calcular nueva rotación vertical (alrededor del eje X)
      // Limitar entre MIN_CAMERA_Y_ANGLE y MAX_CAMERA_Y_ANGLE
      const newRotationY = Math.max(
        MIN_CAMERA_Y_ANGLE, 
        Math.min(MAX_CAMERA_Y_ANGLE, state.cameraRotation.y + deltaY)
      );
      
      return {
        cameraRotation: {
          x: newRotationX,
          y: newRotationY
        }
      };
    });
  },
  
  // Actualiza la distancia de la cámara (zoom)
  requestZoom: (delta: number) => {
    set(state => {
      // Limitar entre MIN_CAMERA_DISTANCE y MAX_CAMERA_DISTANCE
      const newDistance = Math.max(
        MIN_CAMERA_DISTANCE, 
        Math.min(MAX_CAMERA_DISTANCE, state.cameraDistance + delta)
      );
      
      return { cameraDistance: newDistance };
    });
  },
  
  // Establece el punto objetivo de la cámara
  setCameraTarget: (target: THREE.Vector3) => {
    set({ cameraTarget: target });
  }
}));