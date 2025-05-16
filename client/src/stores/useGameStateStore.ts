import { create } from "zustand";

export type GameState = "ready" | "playing" | "market" | "kitchen" | "activities";

interface GameStateStore {
  gameState: GameState;
  isRegistered: boolean;
  
  // Actions
  setGameState: (state: GameState) => void;
  setIsRegistered: (registered: boolean) => void;
  enterBuilding: (building: "market" | "kitchen") => void;
  exitBuilding: () => void;
  logout: () => void; // Función para cerrar sesión
}

export const useGameStateStore = create<GameStateStore>((set) => ({
  // Initial state
  gameState: "ready",
  isRegistered: false,
  
  // Actions
  setGameState: (state: GameState) => {
    set({ gameState: state });
  },
  
  setIsRegistered: (registered: boolean) => {
    set({ isRegistered: registered });
  },
  
  enterBuilding: (building: "market" | "kitchen") => {
    set({ gameState: building });
  },
  
  exitBuilding: () => {
    set({ gameState: "playing" });
  },
  
  // Función para cerrar sesión y volver a la pantalla de inicio
  logout: () => {
    // Restablece el estado del juego a su valor inicial
    set({ 
      gameState: "ready",
      isRegistered: false
    });
  }
}));
