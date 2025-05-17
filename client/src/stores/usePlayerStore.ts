import { create } from "zustand";
import { generateRandomChallenges, updateChallengeProgress } from "../data/dailyChallenges";
import { toast } from "sonner";

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
import { GardenPlot, Plant } from "../data/gardenItems";

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
  garden: GardenPlot[]; // Huerto virtual con parcelas
  seeds: Plant[]; // Semillas disponibles para plantar
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
  
  // Huerto virtual
  initializeGarden: () => void; // Inicializa el huerto virtual
  plantSeed: (plotId: string, plantId: string) => void; // Planta una semilla en una parcela
  waterPlot: (plotId: string) => void; // Riega una parcela
  harvestPlot: (plotId: string) => void; // Cosecha una parcela
  updateGarden: () => void; // Actualiza el estado del huerto
  addSeed: (plant: Plant) => void; // Añade una semilla al inventario
  removeSeed: (plantId: string) => void; // Elimina una semilla del inventario
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  // Initial state
  playerPosition: { x: 0, y: 0, z: 0 },
  playerData: null,
  
  // Funciones para desafíos diarios
  updateChallenges: () => {
    if (!get().playerData) return;
    
    // Verificar si necesitamos resetear los desafíos (cada día)
    const now = Date.now();
    const lastReset = get().playerData?.lastChallengeReset || 0;
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (now - lastReset > oneDayMs) {
      get().resetDailyChallenges();
    }
  },
  
  // Marca un desafío como completado y otorga recompensas
  completeChallenge: (challengeId: string) => {
    if (!get().playerData) return;
    
    const challenge = get().playerData.dailyChallenges.find(c => c.id === challengeId);
    if (!challenge || challenge.completed) return;
    
    // Otorgar recompensas
    const { coins, healthBoost, lifespan } = challenge.reward;
    
    // Actualizar monedas
    get().updateCoins(coins);
    
    // Actualizar esperanza de vida si aplica
    if (lifespan && get().playerData) {
      set((state) => ({
        playerData: state.playerData 
          ? { 
              ...state.playerData, 
              estimatedLifespan: state.playerData.estimatedLifespan + lifespan
            }
          : null
      }));
    }
    
    // Marcar como completado
    set((state) => ({
      playerData: state.playerData 
        ? { 
            ...state.playerData, 
            dailyChallenges: state.playerData.dailyChallenges.map(c => 
              c.id === challengeId ? { ...c, completed: true } : c
            )
          }
        : null
    }));
    
    // Notificar al usuario
    toast.success(`¡Desafío completado! Recompensa: ${coins} iHumanCoins`, {
      description: challenge.title
    });
  },
  
  // Desbloquea un logro
  unlockAchievement: (achievementId: string) => {
    if (!get().playerData) return;
    
    // Verificar si ya tiene el logro
    if (get().playerData.achievements.includes(achievementId)) return;
    
    // Añadir a la lista de logros
    set((state) => ({
      playerData: state.playerData 
        ? { 
            ...state.playerData, 
            achievements: [...state.playerData.achievements, achievementId]
          }
        : null
    }));
    
    // Notificar al usuario
    toast.success("¡Nuevo logro desbloqueado!", {
      description: achievementId
    });
  },
  
  // Reinicia los desafíos diarios
  resetDailyChallenges: () => {
    if (!get().playerData) return;
    
    // Generar nuevos desafíos aleatorios
    const newChallenges = generateRandomChallenges();
    
    // Actualizar estado
    set((state) => ({
      playerData: state.playerData 
        ? { 
            ...state.playerData, 
            dailyChallenges: newChallenges,
            lastChallengeReset: Date.now()
          }
        : null
    }));
    
    // Notificar al usuario
    toast.info("¡Nuevos desafíos diarios disponibles!", {
      description: "Completa los desafíos para ganar recompensas"
    });
  },
  
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
    // Actualizar calorías quemadas
    set((state) => ({
      playerData: state.playerData 
        ? { 
            ...state.playerData, 
            caloriesBurned: (state.playerData.caloriesBurned || 0) + calories 
          }
        : null
    }));
    
    // Actualizar desafíos relacionados con actividad física
    if (get().playerData) {
      const action = {
        type: "activity_performed" as const,
        caloriesBurned: calories
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
