import { useEffect } from 'react';
import { useGameStateStore } from '../stores/useGameStateStore';
import { useExitHelper } from '../game/ExitHelper';

/**
 * Hook para detectar la tecla ESC y salir de los edificios
 * @param building El edificio actual ('market', 'kitchen', 'garden', 'gym')
 * @param onExit Función opcional a llamar antes de salir
 */
export const useKeyboardExit = (
  building?: 'market' | 'kitchen' | 'garden' | 'gym',
  onExit?: () => void
) => {
  const { gameState } = useGameStateStore();
  const { exitBuilding } = useExitHelper();

  useEffect(() => {
    // Si no se proporciona un edificio, usar el estado de juego actual
    const currentBuilding = building || gameState;
    
    // Sólo activar el detector de teclas cuando estamos en un edificio
    if (gameState === 'playing' || gameState === 'ready') return;

    // Función para manejar la pulsación de teclas
    const handleKeyDown = (event: KeyboardEvent) => {
      // Si se pulsa la tecla Escape
      if (event.key === 'Escape') {
        console.log(`Tecla ESC detectada, saliendo de ${currentBuilding}`);
        
        // Si hay una función de salida personalizada, la llamamos
        if (onExit) {
          onExit();
        }
        
        // Salir del edificio
        exitBuilding(currentBuilding);
      }
    };

    // Añadir el event listener
    window.addEventListener('keydown', handleKeyDown);

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [building, gameState, exitBuilding, onExit]);
};