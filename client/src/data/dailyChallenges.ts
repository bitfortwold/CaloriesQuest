// Lista de desafíos diarios posibles
import { FoodItem } from "../stores/usePlayerStore";

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: "nutrition" | "activity" | "sustainability";
  requirement: {
    type: "calories_burned" | "food_category" | "sustainability_score" | "protein_intake" | "balanced_meal";
    target: number;
    foodCategory?: string;
    count?: number;
  };
  reward: {
    coins: number;
    healthBoost?: number;
    lifespan?: number;
  };
  completed: boolean;
  progress: number;
}

// Generar un desafío aleatorio del conjunto de desafíos posibles
export function generateRandomChallenges(): DailyChallenge[] {
  // Seleccionar 3 desafíos aleatorios (uno de cada tipo)
  const nutritionChallenge = nutritionChallenges[Math.floor(Math.random() * nutritionChallenges.length)];
  const activityChallenge = activityChallenges[Math.floor(Math.random() * activityChallenges.length)];
  const sustainabilityChallenge = sustainabilityChallenges[Math.floor(Math.random() * sustainabilityChallenges.length)];
  
  return [
    { ...nutritionChallenge, completed: false, progress: 0 },
    { ...activityChallenge, completed: false, progress: 0 },
    { ...sustainabilityChallenge, completed: false, progress: 0 }
  ];
}

// Verificar progreso del desafío según la acción realizada
export function updateChallengeProgress(
  challenge: DailyChallenge, 
  action: {
    type: "food_consumed" | "activity_performed";
    food?: FoodItem;
    caloriesBurned?: number;
  }
): DailyChallenge {
  let updatedProgress = challenge.progress;
  
  // Actualizar progreso según el tipo de desafío
  if (challenge.requirement.type === "calories_burned" && action.type === "activity_performed") {
    updatedProgress += action.caloriesBurned || 0;
  } 
  else if (challenge.requirement.type === "food_category" && action.type === "food_consumed" && action.food) {
    if (action.food.category === challenge.requirement.foodCategory) {
      updatedProgress += 1;
    }
  }
  else if (challenge.requirement.type === "sustainability_score" && action.type === "food_consumed" && action.food) {
    if (action.food.sustainabilityScore >= 4) { // Consideramos 4+ como alta sostenibilidad
      updatedProgress += 1;
    }
  }
  else if (challenge.requirement.type === "protein_intake" && action.type === "food_consumed" && action.food) {
    updatedProgress += action.food.nutritionalValue.protein;
  }
  
  // Determinar si el desafío se ha completado
  const completed = updatedProgress >= challenge.requirement.target;
  
  return {
    ...challenge,
    progress: updatedProgress,
    completed
  };
}

// Desafíos de nutrición
const nutritionChallenges: DailyChallenge[] = [
  {
    id: "nutrition-1",
    title: "Proteína Potenciada",
    description: "Consume 3 alimentos ricos en proteínas",
    type: "nutrition",
    requirement: {
      type: "food_category",
      target: 3,
      foodCategory: "protein"
    },
    reward: {
      coins: 150,
      healthBoost: 5
    },
    completed: false,
    progress: 0
  },
  {
    id: "nutrition-2",
    title: "Equilibrio Perfecto",
    description: "Consume una dieta equilibrada (al menos 50g de proteínas)",
    type: "nutrition",
    requirement: {
      type: "protein_intake",
      target: 50
    },
    reward: {
      coins: 200,
      healthBoost: 10
    },
    completed: false,
    progress: 0
  },
  {
    id: "nutrition-3",
    title: "Frutas y Verduras",
    description: "Consume 5 frutas o verduras diferentes",
    type: "nutrition",
    requirement: {
      type: "food_category",
      target: 5,
      foodCategory: "vegetables"
    },
    reward: {
      coins: 180,
      lifespan: 1
    },
    completed: false,
    progress: 0
  }
];

// Desafíos de actividad física
const activityChallenges: DailyChallenge[] = [
  {
    id: "activity-1",
    title: "Quemador de Calorías",
    description: "Quema 300 calorías realizando actividades físicas",
    type: "activity",
    requirement: {
      type: "calories_burned",
      target: 300
    },
    reward: {
      coins: 300,
      healthBoost: 15
    },
    completed: false,
    progress: 0
  },
  {
    id: "activity-2",
    title: "Super Activo",
    description: "Quema 500 calorías realizando actividades físicas",
    type: "activity",
    requirement: {
      type: "calories_burned",
      target: 500
    },
    reward: {
      coins: 500,
      lifespan: 2
    },
    completed: false,
    progress: 0
  },
  {
    id: "activity-3",
    title: "Maratón Mini",
    description: "Quema 200 calorías realizando actividades físicas",
    type: "activity",
    requirement: {
      type: "calories_burned",
      target: 200
    },
    reward: {
      coins: 200,
      healthBoost: 8
    },
    completed: false,
    progress: 0
  }
];

// Desafíos de sostenibilidad
const sustainabilityChallenges: DailyChallenge[] = [
  {
    id: "sustainability-1",
    title: "Amigo del Planeta",
    description: "Consume 3 alimentos con alta puntuación de sostenibilidad",
    type: "sustainability",
    requirement: {
      type: "sustainability_score",
      target: 3
    },
    reward: {
      coins: 250,
      healthBoost: 5
    },
    completed: false,
    progress: 0
  },
  {
    id: "sustainability-2",
    title: "Sostenibilidad Superior",
    description: "Consume 5 alimentos con alta puntuación de sostenibilidad",
    type: "sustainability",
    requirement: {
      type: "sustainability_score",
      target: 5
    },
    reward: {
      coins: 350,
      lifespan: 1
    },
    completed: false,
    progress: 0
  },
  {
    id: "sustainability-3",
    title: "Defensor Ecológico",
    description: "Consume 4 alimentos de producción local con alta sostenibilidad",
    type: "sustainability",
    requirement: {
      type: "sustainability_score",
      target: 4
    },
    reward: {
      coins: 300,
      healthBoost: 10
    },
    completed: false,
    progress: 0
  }
];