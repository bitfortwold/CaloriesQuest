import { create } from "zustand";
import { Position, FoodItem } from "./usePlayerStore";

interface FoodState {
  marketPosition: Position;
  kitchenPosition: Position;
  purchasedFood: FoodItem[];
  
  // Actions
  setMarketPosition: (position: Position) => void;
  setKitchenPosition: (position: Position) => void;
  addPurchasedFood: (food: FoodItem) => void;
  removePurchasedFood: (foodId: string) => void;
}

export const useFoodStore = create<FoodState>((set) => ({
  // Initial state
  marketPosition: { x: -8, y: 0, z: 0 },
  kitchenPosition: { x: 8, y: 0, z: 0 },
  purchasedFood: [],
  
  // Actions
  setMarketPosition: (position: Position) => {
    set({ marketPosition: position });
  },
  
  setKitchenPosition: (position: Position) => {
    set({ kitchenPosition: position });
  },
  
  addPurchasedFood: (food: FoodItem) => {
    set((state) => ({
      purchasedFood: [...state.purchasedFood, food]
    }));
  },
  
  removePurchasedFood: (foodId: string) => {
    set((state) => ({
      purchasedFood: state.purchasedFood.filter(food => food.id !== foodId)
    }));
  }
}));
