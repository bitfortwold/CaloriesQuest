import { create } from "zustand";
import { Position, FoodItem } from "./usePlayerStore";

// Categorías de almacenamiento para alimentos
export type StorageType = "refrigerator" | "pantry";

// Alimento con información de almacenamiento
export interface StoredFoodItem extends FoodItem {
  storageType: StorageType;
}

interface FoodState {
  marketPosition: Position;
  kitchenPosition: Position;
  purchasedFood: FoodItem[]; // Alimentos recién comprados en el mercado
  refrigeratorFood: StoredFoodItem[]; // Alimentos guardados en la nevera
  pantryFood: StoredFoodItem[]; // Alimentos guardados en la despensa
  
  // Actions
  setMarketPosition: (position: Position) => void;
  setKitchenPosition: (position: Position) => void;
  addPurchasedFood: (food: FoodItem) => void;
  removePurchasedFood: (foodId: string) => void;
  transferToKitchen: (foodIds: string[]) => void; // Trasladar del mercado a la cocina
  removeFromKitchen: (foodId: string, storageType: StorageType) => void; // Quitar de la cocina (al consumir)
}

// Determinar el tipo de almacenamiento basado en la categoría
const determineStorageType = (food: FoodItem): StorageType => {
  // Frutas, verduras, lácteos y carnes van a la nevera
  const refrigeratedCategories = ['fruits', 'vegetables', 'dairy', 'meat', 'fish'];
  
  // Convertir a minúsculas para comparación
  const category = food.category.toLowerCase();
  
  // Comprobar si pertenece a categorías que van a la nevera
  if (refrigeratedCategories.some(c => category.includes(c))) {
    return "refrigerator";
  }
  
  // Por defecto, todos los demás van a la despensa
  return "pantry";
};

export const useFoodStore = create<FoodState>((set) => ({
  // Initial state
  marketPosition: { x: -8, y: 0, z: 0 },
  kitchenPosition: { x: 8, y: 0, z: 0 },
  purchasedFood: [],
  refrigeratorFood: [],
  pantryFood: [],
  
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
  },
  
  // Transferir alimentos del mercado a la cocina (refrigerador o despensa)
  transferToKitchen: (foodIds: string[]) => {
    set((state) => {
      // Filtrar los alimentos seleccionados
      const selectedFoods = state.purchasedFood.filter(food => foodIds.includes(food.id));
      
      // Separar en nevera y despensa
      const newRefrigeratorItems: StoredFoodItem[] = [];
      const newPantryItems: StoredFoodItem[] = [];
      
      // Clasificar los alimentos
      selectedFoods.forEach(food => {
        const storageType = determineStorageType(food);
        const storedFood: StoredFoodItem = { ...food, storageType };
        
        if (storageType === "refrigerator") {
          newRefrigeratorItems.push(storedFood);
        } else {
          newPantryItems.push(storedFood);
        }
      });
      
      // Actualizar el estado
      return {
        // Quitar los alimentos transferidos de purchasedFood
        purchasedFood: state.purchasedFood.filter(food => !foodIds.includes(food.id)),
        // Añadir los nuevos alimentos a sus respectivos lugares
        refrigeratorFood: [...state.refrigeratorFood, ...newRefrigeratorItems],
        pantryFood: [...state.pantryFood, ...newPantryItems]
      };
    });
  },
  
  // Quitar un alimento de la cocina (al consumirlo)
  removeFromKitchen: (foodId: string) => {
    set((state) => {
      // Comprobar si está en la nevera
      const inRefrigerator = state.refrigeratorFood.some(food => food.id === foodId);
      
      if (inRefrigerator) {
        return {
          refrigeratorFood: state.refrigeratorFood.filter(food => food.id !== foodId)
        };
      } else {
        return {
          pantryFood: state.pantryFood.filter(food => food.id !== foodId)
        };
      }
    });
  }
}));
