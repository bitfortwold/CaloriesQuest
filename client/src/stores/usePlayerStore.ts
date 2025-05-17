import { create } from "zustand";
import { generateRandomChallenges, updateChallengeProgress, DailyChallenge } from "../data/dailyChallenges";
import { toast } from "sonner";
import { createNewGarden, waterPlant, plantSeed, harvestPlant, updatePlantState, GardenPlot, Plant } from "../data/gardenItems";

// Define types
export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category?: string;
  type?: string;
  calories: number;
  nutritionalValue: {
    protein: number;
    carbs: number;
    fat: number;
    vitamins?: string[];
  };
  sustainabilityScore: number;
  price?: number;
  description: string;
  quantity?: number; // Cantidad del item que tiene el jugador
}

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
  updatePlayer: (data: PlayerData) => void; // Actualiza datos del jugador
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
  // Estado inicial
  playerPosition: { x: 0, y: 0, z: 0 },
  playerData: null,
  
  // Funciones para el huerto virtual
  initializeGarden: () => {
    if (!get().playerData) return;
    
    set(state => ({
      playerData: {
        ...state.playerData!,
        garden: createNewGarden(9) // Crear un huerto con 9 parcelas
      }
    }));
  },
  
  plantSeed: (plotId: string, plantId: string) => {
    if (!get().playerData) return;
    
    // Buscar la parcela y la semilla
    const plotIndex = get().playerData!.garden.findIndex(plot => plot.id === plotId);
    const seedIndex = get().playerData!.seeds.findIndex(seed => seed.id === plantId);
    
    if (plotIndex === -1 || seedIndex === -1) return;
    
    // Comprobar si la parcela está vacía
    const plot = get().playerData!.garden[plotIndex];
    const seed = get().playerData!.seeds[seedIndex];
    
    if (plot.plant !== null) return; // La parcela ya tiene una planta
    
    // Comprobar si el jugador tiene suficientes semillas
    if (!seed.quantity || seed.quantity <= 0) return;
    
    // Eliminar la semilla del inventario
    const updatedSeeds = [...get().playerData!.seeds];
    updatedSeeds[seedIndex] = {
      ...seed,
      quantity: seed.quantity - 1
    };
    
    if (updatedSeeds[seedIndex].quantity <= 0) {
      updatedSeeds.splice(seedIndex, 1);
    }
    
    // Plantar la semilla
    const updatedGarden = [...get().playerData!.garden];
    updatedGarden[plotIndex] = plantSeed(plot, seed);
    
    set(state => ({
      playerData: {
        ...state.playerData!,
        garden: updatedGarden,
        seeds: updatedSeeds
      }
    }));
  },
  
  waterPlot: (plotId: string) => {
    if (!get().playerData) return;
    
    // Buscar la parcela
    const plotIndex = get().playerData!.garden.findIndex(plot => plot.id === plotId);
    
    if (plotIndex === -1) return;
    
    // Regar la planta
    const plot = get().playerData!.garden[plotIndex];
    const updatedPlot = waterPlant(plot);
    
    // Actualizar el jardín
    const updatedGarden = [...get().playerData!.garden];
    updatedGarden[plotIndex] = updatedPlot;
    
    set(state => ({
      playerData: {
        ...state.playerData!,
        garden: updatedGarden
      }
    }));
  },
  
  harvestPlot: (plotId: string) => {
    if (!get().playerData) return;
    
    // Buscar la parcela
    const plotIndex = get().playerData!.garden.findIndex(plot => plot.id === plotId);
    if (plotIndex === -1) return;
    
    const plot = get().playerData!.garden[plotIndex];
    if (!plot.plant || plot.state !== 'harvestable') return; // No hay nada para cosechar
    
    // Guardar referencia a la planta antes de cosechar
    const harvestedPlant = {...plot.plant};
    const yieldAmount = harvestedPlant.harvestYield;
    
    // Cosechar la planta (devuelve parcela vacía)
    const updatedPlot = harvestPlant(plot);
    const updatedGarden = [...get().playerData!.garden];
    updatedGarden[plotIndex] = updatedPlot;
    
    // Añadir alimentos al inventario basados en la planta cosechada
    const foodFromPlant: FoodItem = {
      id: `harvested-${harvestedPlant.id}-${Date.now()}`,
      name: harvestedPlant.name,
      category: "Cultivado",
      calories: harvestedPlant.nutritionalValue.calories,
      nutritionalValue: {
        protein: harvestedPlant.nutritionalValue.protein,
        carbs: harvestedPlant.nutritionalValue.carbs,
        fat: harvestedPlant.nutritionalValue.fat,
        vitamins: harvestedPlant.nutritionalValue.vitamins
      },
      sustainabilityScore: harvestedPlant.sustainabilityScore,
      price: Math.round(harvestedPlant.price / 2), // Menor precio que comprar
      description: `${harvestedPlant.name} cultivado en tu huerto. Fresco y nutritivo.`,
      quantity: yieldAmount
    };
    
    // Actualizar inventario y cosecha
    const updatedInventory = [...get().playerData!.inventory];
    updatedInventory.push(foodFromPlant);
    
    set(state => ({
      playerData: {
        ...state.playerData!,
        garden: updatedGarden,
        inventory: updatedInventory,
        coins: state.playerData!.coins + Math.round(harvestedPlant.sustainabilityScore * 5) // Recompensa de monedas
      }
    }));
  },
  
  updateGarden: () => {
    if (!get().playerData) return;
    if (!get().playerData.garden) return;
    
    const updatedGarden = get().playerData.garden.map(plot => updatePlantState(plot));
    
    set(state => ({
      playerData: {
        ...state.playerData!,
        garden: updatedGarden
      }
    }));
  },
  
  addSeed: (plant: Plant) => {
    if (!get().playerData) return;
    
    // Comprobar si ya tenemos esta semilla
    const seedIndex = get().playerData!.seeds.findIndex(seed => seed.id === plant.id);
    const updatedSeeds = [...get().playerData!.seeds];
    
    if (seedIndex >= 0) {
      // Incrementar cantidad
      updatedSeeds[seedIndex] = {
        ...updatedSeeds[seedIndex],
        quantity: (updatedSeeds[seedIndex].quantity || 0) + 1
      };
    } else {
      // Añadir nueva semilla
      updatedSeeds.push({
        ...plant,
        quantity: 1
      });
    }
    
    set(state => ({
      playerData: {
        ...state.playerData!,
        seeds: updatedSeeds
      }
    }));
  },
  
  removeSeed: (plantId: string) => {
    if (!get().playerData) return;
    
    const seedIndex = get().playerData!.seeds.findIndex(seed => seed.id === plantId);
    if (seedIndex === -1) return;
    
    const updatedSeeds = [...get().playerData!.seeds];
    if (updatedSeeds[seedIndex].quantity && updatedSeeds[seedIndex].quantity! > 1) {
      // Decrementar cantidad
      updatedSeeds[seedIndex] = {
        ...updatedSeeds[seedIndex],
        quantity: updatedSeeds[seedIndex].quantity! - 1
      };
    } else {
      // Eliminar semilla
      updatedSeeds.splice(seedIndex, 1);
    }
    
    set(state => ({
      playerData: {
        ...state.playerData!,
        seeds: updatedSeeds
      }
    }));
  },
  
  // Basic actions
  setPlayerPosition: (position: Position) => {
    set({ playerPosition: position });
  },
  
  setPlayerData: (data: PlayerData) => {
    set({ playerData: data });
  },
  
  updatePlayer: (data: PlayerData) => {
    set({ playerData: data });
  },
  
  updateCoins: (amount: number) => {
    set((state) => ({
      playerData: state.playerData 
        ? { ...state.playerData, coins: state.playerData.coins + amount }
        : null
    }));
  },
  
  addFood: (food: FoodItem) => {
    set((state) => ({
      playerData: state.playerData 
        ? { ...state.playerData, inventory: [...state.playerData.inventory, food] }
        : null
    }));
  },
  
  removeFood: (foodId: string) => {
    set((state) => {
      if (!state.playerData) return { playerData: null };
      
      const updatedInventory = state.playerData.inventory.filter(
        item => item.id !== foodId
      );
      
      return {
        playerData: { ...state.playerData, inventory: updatedInventory }
      };
    });
  },
  
  consumeFood: (calories: number, food?: FoodItem) => {
    set((state) => {
      if (!state.playerData) return { playerData: null };
      
      // Actualizar calorías consumidas
      const updatedCaloriesConsumed = state.playerData.caloriesConsumed + calories;
      
      // Si se proporciona un alimento específico, eliminar del inventario
      let updatedInventory = state.playerData.inventory;
      if (food) {
        updatedInventory = updatedInventory.filter(item => item.id !== food.id);
      }
      
      // Actualizar desafíos relacionados con alimentación
      const updatedChallenges = state.playerData.dailyChallenges.map(challenge => {
        return updateChallengeProgress(challenge, {
          type: "food_consumed",
          food: food
        });
      });
      
      return {
        playerData: {
          ...state.playerData,
          caloriesConsumed: updatedCaloriesConsumed,
          inventory: updatedInventory,
          dailyChallenges: updatedChallenges
        }
      };
    });
  },
  
  increaseCaloriesBurned: (calories: number) => {
    set((state) => {
      if (!state.playerData) return { playerData: null };
      
      // Actualizar calorías quemadas
      const updatedCaloriesBurned = state.playerData.caloriesBurned + calories;
      
      // Actualizar desafíos relacionados con actividad física
      const updatedChallenges = state.playerData.dailyChallenges.map(challenge => {
        return updateChallengeProgress(challenge, {
          type: "activity_performed",
          caloriesBurned: calories
        });
      });
      
      return {
        playerData: {
          ...state.playerData,
          caloriesBurned: updatedCaloriesBurned,
          dailyChallenges: updatedChallenges
        }
      };
    });
  },
  
  calculateDailyCalories: (gender: string, age: number, weight: number, height: number, activityLevel: string) => {
    // Cálculo del BMR (Basal Metabolic Rate) usando la fórmula de Harris-Benedict
    let bmr = 0;
    if (gender === "male") {
      bmr = 66.5 + (13.75 * weight) + (5.003 * height) - (6.755 * age);
    } else {
      bmr = 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
    }
    
    // Factor de actividad
    const activityFactor = 
      activityLevel === "sedentary" ? 1.2 :
      activityLevel === "light" ? 1.375 :
      activityLevel === "moderate" ? 1.55 :
      activityLevel === "active" ? 1.725 : 1.9;
    
    // Calorías diarias requeridas
    return Math.round(bmr * activityFactor);
  },
  
  calculateEstimatedLifespan: () => {
    set((state) => {
      if (!state.playerData) return { playerData: null };
      
      // Factores base según género
      const baseLifespan = state.playerData.gender === "male" ? 76 : 81;
      
      // Factores de ajuste
      let adjustments = 0;
      
      // Ajuste por actividad física
      if (state.playerData.activityLevel === "sedentary") {
        adjustments -= 2;
      } else if (state.playerData.activityLevel === "active" || state.playerData.activityLevel === "very_active") {
        adjustments += 3;
      }
      
      // Ajuste por consumo calórico (balance)
      const calorieBalance = state.playerData.caloriesConsumed - state.playerData.caloriesBurned;
      const dailyCalories = state.playerData.dailyCalories;
      
      if (calorieBalance > dailyCalories * 1.5) { // Consumo excesivo
        adjustments -= 2;
      } else if (calorieBalance < dailyCalories * 0.5) { // Consumo insuficiente
        adjustments -= 1;
      } else if (calorieBalance >= dailyCalories * 0.8 && calorieBalance <= dailyCalories * 1.2) { // Balance óptimo
        adjustments += 2;
      }
      
      // Estimación final
      const estimatedLifespan = baseLifespan + adjustments;
      
      return {
        playerData: { ...state.playerData, estimatedLifespan }
      };
    });
  },
  
  // Métodos para desafíos diarios
  updateChallenges: () => {
    set((state) => {
      if (!state.playerData) return { playerData: null };
      
      // Comprobar si necesitamos reiniciar los desafíos diarios
      const currentTime = Date.now();
      const lastResetTime = state.playerData.lastChallengeReset;
      const oneDayMs = 24 * 60 * 60 * 1000;
      
      // Si ha pasado más de un día desde el último reinicio, generar nuevos desafíos
      if (currentTime - lastResetTime > oneDayMs) {
        const newChallenges = generateRandomChallenges();
        return {
          playerData: {
            ...state.playerData,
            dailyChallenges: newChallenges,
            lastChallengeReset: currentTime
          }
        };
      }
      
      return { playerData: state.playerData };
    });
  },
  
  completeChallenge: (challengeId: string) => {
    set((state) => {
      if (!state.playerData) return { playerData: null };
      
      // Buscar el desafío
      const challengeIndex = state.playerData.dailyChallenges.findIndex(
        challenge => challenge.id === challengeId
      );
      
      if (challengeIndex === -1) return { playerData: state.playerData };
      
      const challenge = state.playerData.dailyChallenges[challengeIndex];
      
      // Comprobar si ya está completado
      if (challenge.completed) return { playerData: state.playerData };
      
      // Marcar como completado
      const updatedChallenges = [...state.playerData.dailyChallenges];
      updatedChallenges[challengeIndex] = {
        ...challenge,
        completed: true
      };
      
      // Otorgar recompensas
      const updatedCoins = state.playerData.coins + challenge.reward.coins;
      
      // Mostrar notificación
      toast.success(`¡Desafío completado! +${challenge.reward.coins} iHumanCoins`);
      
      return {
        playerData: {
          ...state.playerData,
          dailyChallenges: updatedChallenges,
          coins: updatedCoins
        }
      };
    });
  },
  
  unlockAchievement: (achievementId: string) => {
    set((state) => {
      if (!state.playerData) return { playerData: null };
      
      // Comprobar si ya tiene el logro
      if (state.playerData.achievements.includes(achievementId)) {
        return { playerData: state.playerData };
      }
      
      // Añadir logro
      const updatedAchievements = [...state.playerData.achievements, achievementId];
      
      // Mostrar notificación
      toast.success(`¡Nuevo logro desbloqueado!`);
      
      return {
        playerData: {
          ...state.playerData,
          achievements: updatedAchievements
        }
      };
    });
  },
  
  resetDailyChallenges: () => {
    set((state) => {
      if (!state.playerData) return { playerData: null };
      
      const newChallenges = generateRandomChallenges();
      
      return {
        playerData: {
          ...state.playerData,
          dailyChallenges: newChallenges,
          lastChallengeReset: Date.now()
        }
      };
    });
  }
}));