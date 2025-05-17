import { create } from "zustand";

// Define types
export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  calories: number;
  nutritionalValue: {
    protein: number;
    carbs: number;
    fat: number;
  };
  sustainabilityScore: number;
  price: number;
  description: string;
}

import { DailyChallenge } from "../data/dailyChallenges";

export interface PlayerData {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  activityLevel: string;
  coins: number;
  caloriesConsumed: number;
  caloriesBurned: number;
  dailyCalories: number;
  estimatedLifespan: number;
  inventory: FoodItem[];
  dailyChallenges: DailyChallenge[];
  lastChallengeReset: number; // Timestamp de la última vez que se resetearon los desafíos
  achievements: string[]; // Lista de logros obtenidos
}

// Define store state
interface PlayerState {
  playerPosition: Position;
  playerData: PlayerData | null;
  
  // Actions
  setPlayerPosition: (position: Position) => void;
  setPlayerData: (data: PlayerData) => void;
  updateCoins: (amount: number) => void;
  addFood: (food: FoodItem) => void;
  removeFood: (foodId: string) => void;
  consumeFood: (calories: number, food?: FoodItem) => void;
  increaseCaloriesBurned: (calories: number) => void;
  calculateDailyCalories: (gender: string, age: number, weight: number, height: number, activityLevel: string) => number;
  calculateEstimatedLifespan: () => void;
  
  // Desafíos y logros
  updateChallenges: () => void; // Verifica y actualiza los desafíos diarios
  completeChallenge: (challengeId: string) => void; // Marca un desafío como completado y otorga recompensa
  unlockAchievement: (achievementId: string) => void; // Desbloquea un logro
  resetDailyChallenges: () => void; // Reinicia los desafíos diarios
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  // Initial state
  playerPosition: { x: 0, y: 0, z: 0 },
  playerData: null,
  
  // Actions
  setPlayerPosition: (position: Position) => {
    set({ playerPosition: position });
  },
  
  setPlayerData: (data: PlayerData) => {
    set({ playerData: data });
  },
  
  updateCoins: (amount: number) => {
    set((state) => ({
      playerData: state.playerData 
        ? { 
            ...state.playerData, 
            coins: Math.max(0, (state.playerData.coins || 0) + amount) 
          }
        : null
    }));
  },
  
  addFood: (food: FoodItem) => {
    set((state) => ({
      playerData: state.playerData 
        ? { 
            ...state.playerData, 
            inventory: [...(state.playerData.inventory || []), food] 
          }
        : null
    }));
  },
  
  removeFood: (foodId: string) => {
    set((state) => ({
      playerData: state.playerData 
        ? { 
            ...state.playerData, 
            inventory: state.playerData.inventory.filter(item => item.id !== foodId) 
          }
        : null
    }));
  },
  
  consumeFood: (calories: number, food?: FoodItem) => {
    // Actualizar calorías consumidas
    set((state) => ({
      playerData: state.playerData 
        ? { 
            ...state.playerData, 
            caloriesConsumed: (state.playerData.caloriesConsumed || 0) + calories 
          }
        : null
    }));
    
    // Si se proporciona información del alimento, actualizar desafíos relacionados
    if (food && get().playerData) {
      // Actualizamos desafíos relacionados con alimentos
      const action = {
        type: "food_consumed" as const,
        food
      };
      
      // Actualizar progreso en desafíos
      const updatedChallenges = get().playerData!.dailyChallenges.map(challenge => 
        updateChallengeProgress(challenge, action)
      );
      
      // Actualizar estado con los desafíos actualizados
      set((state) => ({
        playerData: state.playerData 
          ? { 
              ...state.playerData, 
              dailyChallenges: updatedChallenges
            }
          : null
      }));
      
      // Verificar si algún desafío se completó y otorgar recompensas
      updatedChallenges.forEach(challenge => {
        if (challenge.completed && !get().playerData!.dailyChallenges.find(c => c.id === challenge.id)?.completed) {
          get().completeChallenge(challenge.id);
        }
      });
    }
  },
  
  increaseCaloriesBurned: (calories: number) => {
    set((state) => ({
      playerData: state.playerData 
        ? { 
            ...state.playerData, 
            caloriesBurned: (state.playerData.caloriesBurned || 0) + calories 
          }
        : null
    }));
  },
  
  // Harris-Benedict equation to estimate daily calorie needs
  calculateDailyCalories: (gender, age, weight, height, activityLevel) => {
    // Base Metabolic Rate calculation (Harris-Benedict equation)
    let bmr = 0;
    
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    // Activity multiplier
    let activityMultiplier = 1.2; // Default to sedentary
    
    switch (activityLevel) {
      case 'sedentary':
        activityMultiplier = 1.2;
        break;
      case 'light':
        activityMultiplier = 1.375;
        break;
      case 'moderate':
        activityMultiplier = 1.55;
        break;
      case 'active':
        activityMultiplier = 1.725;
        break;
      case 'veryActive':
        activityMultiplier = 1.9;
        break;
    }
    
    // Calculate total daily calories
    const dailyCalories = Math.round(bmr * activityMultiplier);
    
    // Sistema Económico Virtual: 1 Kcal = 1 IHC
    // Actualmente, el valor calculado es exactamente las calorías diarias recomendadas
    // basadas en criterios médicos (Harris-Benedict)
    return dailyCalories;
  },
  
  // Calculate estimated lifespan based on player habits
  calculateEstimatedLifespan: () => {
    const { playerData } = get();
    if (!playerData) return;
    
    // Base lifespan based on current scientific averages
    let baseLifespan = 75;
    
    // Adjust based on calorie management
    const calorieRatio = playerData.caloriesConsumed / playerData.dailyCalories;
    
    // Penalize for under or overeating
    let calorieImpact = 0;
    if (calorieRatio < 0.5) {
      calorieImpact = -2; // Undernourished
    } else if (calorieRatio > 1.5) {
      calorieImpact = -3; // Overeating
    } else if (calorieRatio >= 0.8 && calorieRatio <= 1.2) {
      calorieImpact = 2; // Balanced diet
    }
    
    // Impact of physical activity
    const activityImpact = playerData.caloriesBurned > 300 ? 2 : 0;
    
    // Calculate total lifespan
    const estimatedLifespan = baseLifespan + calorieImpact + activityImpact;
    
    // Update state
    set({
      playerData: {
        ...playerData,
        estimatedLifespan
      }
    });
  }
}));
