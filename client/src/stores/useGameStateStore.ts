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
  }
}));
