import { create } from 'zustand';

// Store dedicado para controlar la posición y estado de la cámara
interface CameraStoreState {
  // Estado de reseteo
  resetPending: boolean;
  lastResetTimestamp: number;
  
  // Posición de cámara fijada para el huerto
  gardenExitCameraPosition: {x: number, y: number, z: number};
  gardenExitCameraTarget: {x: number, y: number, z: number};
  
  // Acciones
  requestReset: () => void;
  clearReset: () => void;
  wasResetRecently: () => boolean;
}

// CONSTANTES GLOBALES PARA POSICIONAMIENTO INVARIABLE Y ABSOLUTO
// Valores fijos e inmutables que no cambiarán bajo ninguna circunstancia
// Estos valores están alineados con los usados en todos los demás componentes
const FIXED_GARDEN_CAMERA_POSITION = {x: 0, y: 10, z: 10}; // Posición elevada y alejada
const FIXED_GARDEN_CAMERA_TARGET = {x: 0, y: 0, z: -15}; // Mirando directamente al huerto

// Crear store con valores predeterminados calibrados según la captura de referencia
export const useCameraStore = create<CameraStoreState>()((set, get) => ({
  // Estado inicial
  resetPending: false,
  lastResetTimestamp: 0,
  
  // Posición EXACTA según la captura proporcionada - VALORES FIJOS ABSOLUTOS
  gardenExitCameraPosition: FIXED_GARDEN_CAMERA_POSITION,
  gardenExitCameraTarget: FIXED_GARDEN_CAMERA_TARGET,
  
  // Solicita un reseteo de cámara
  requestReset: () => {
    set({
      resetPending: true,
      lastResetTimestamp: Date.now()
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
  }
}));