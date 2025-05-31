// Definición de las plantas que se pueden cultivar en el huerto virtual
export interface Plant {
  id: string;
  name: string;
  description: string;
  growthTime: number; // Tiempo en minutos (para la demo, en un juego real serían horas o días)
  waterNeeded: number; // Número de veces que necesita agua durante su ciclo
  sustainabilityScore: number; // Puntuación de sostenibilidad (1-5)
  nutritionalValue: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    vitamins: string[];
  };
  harvestYield: number; // Número de unidades que produce al cosechar
  price: number; // Precio de venta/compra de semillas
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
  image: string; // Ruta a la imagen de la planta
  quantity?: number; // Cantidad de esta semilla que tiene el jugador
}

export interface GardenPlot {
  id: string;
  plant: Plant | null;
  state: 'empty' | 'seedling' | 'growing' | 'mature' | 'harvestable';
  plantedAt: number | null; // Timestamp de cuándo se plantó
  waterLevel: number; // 0-100
  healthLevel: number; // 0-100
  lastWatered: number | null; // Timestamp de la última vez que se regó
  growthPercentage: number; // 0-100
}

// Catálogo de plantas disponibles
export const plants: Plant[] = [
  {
    id: "tomato",
    name: "Tomate",
    description: "Fruto versátil y nutritivo, rico en licopeno y vitamina C.",
    growthTime: 3, // 3 minutos para la demo
    waterNeeded: 3,
    sustainabilityScore: 4,
    nutritionalValue: {
      calories: 22,
      protein: 1.1,
      carbs: 4.8,
      fat: 0.2,
      vitamins: ["A", "C", "K", "Potasio"]
    },
    harvestYield: 4,
    price: 10,
    difficulty: 'beginner',
    season: 'summer',
    image: "/textures/ground.jpg" // Textura temporal
  },
  {
    id: "lettuce",
    name: "Lechuga",
    description: "Hortaliza fresca y crujiente, baja en calorías y rica en fibra y antioxidantes.",
    growthTime: 2, // 2 minutos para la demo
    waterNeeded: 2,
    sustainabilityScore: 3,
    nutritionalValue: {
      calories: 15,
      protein: 1.4,
      carbs: 2.9,
      fat: 0.2,
      vitamins: ["A", "K", "Folato", "Hierro"]
    },
    harvestYield: 3,
    price: 8,
    difficulty: 'beginner',
    season: 'spring',
    image: "/textures/ground.jpg" // Textura temporal
  },
  {
    id: "carrot",
    name: "Zanahoria",
    description: "Raíz nutritiva rica en beta-caroteno y fibra, excelente para la salud ocular.",
    growthTime: 3, // 3 minutos para la demo
    waterNeeded: 2,
    sustainabilityScore: 4,
    nutritionalValue: {
      calories: 41,
      protein: 0.9,
      carbs: 9.6,
      fat: 0.2,
      vitamins: ["A", "K", "C", "Potasio"]
    },
    harvestYield: 3,
    price: 12,
    difficulty: 'beginner',
    season: 'autumn',
    image: "/textures/ground.jpg" // Textura temporal
  },
  {
    id: "potato",
    name: "Patata",
    description: "Tubérculo versátil rico en carbohidratos complejos y potasio.",
    growthTime: 5, // 5 minutos para la demo
    waterNeeded: 2,
    sustainabilityScore: 3,
    nutritionalValue: {
      calories: 77,
      protein: 2,
      carbs: 17,
      fat: 0.1,
      vitamins: ["C", "B6", "Potasio", "Magnesio"]
    },
    harvestYield: 2,
    price: 15,
    difficulty: 'intermediate',
    season: 'all',
    image: "/textures/ground.jpg" // Textura temporal
  },
  {
    id: "cucumber",
    name: "Pepino",
    description: "Fruto refrescante con alto contenido de agua, fibra y minerales.",
    growthTime: 4, // 4 minutos para la demo
    waterNeeded: 3,
    sustainabilityScore: 3,
    nutritionalValue: {
      calories: 16,
      protein: 0.7,
      carbs: 3.6,
      fat: 0.1,
      vitamins: ["K", "C", "Magnesio", "Potasio"]
    },
    harvestYield: 3,
    price: 18,
    difficulty: 'intermediate',
    season: 'summer',
    image: "/textures/ground.jpg" // Textura temporal
  },
  {
    id: "beans",
    name: "Judías",
    description: "Legumbre rica en proteínas vegetales y fibra, ideal para dietas sostenibles.",
    growthTime: 4, // 4 minutos para la demo
    waterNeeded: 2,
    sustainabilityScore: 5,
    nutritionalValue: {
      calories: 35,
      protein: 2,
      carbs: 6,
      fat: 0.1,
      vitamins: ["Hierro", "Folato", "Potasio", "Magnesio"]
    },
    harvestYield: 6,
    price: 15,
    difficulty: 'intermediate',
    season: 'autumn',
    image: "/textures/ground.jpg" // Textura temporal
  },
  {
    id: "strawberry",
    name: "Fresa",
    description: "Fruta dulce y aromática rica en vitamina C y antioxidantes.",
    growthTime: 6, // 6 minutos para la demo
    waterNeeded: 3,
    sustainabilityScore: 3,
    nutritionalValue: {
      calories: 32,
      protein: 0.7,
      carbs: 7.7,
      fat: 0.3,
      vitamins: ["C", "Folato", "Manganeso", "Potasio"]
    },
    harvestYield: 8,
    price: 25,
    difficulty: 'advanced',
    season: 'spring',
    image: "/textures/ground.jpg" // Textura temporal
  }
];

// Función para crear un nuevo huerto con N parcelas vacías
export function createNewGarden(plotCount: number = 9): GardenPlot[] {
  const garden: GardenPlot[] = [];
  
  for (let i = 0; i < plotCount; i++) {
    garden.push({
      id: `plot_${i + 1}`,
      plant: null,
      state: 'empty',
      plantedAt: null,
      waterLevel: 0,
      healthLevel: 0,
      lastWatered: null,
      growthPercentage: 0
    });
  }
  
  return garden;
}

// Función para calcular el progreso de crecimiento de una planta
export function calculateGrowthProgress(plot: GardenPlot): number {
  if (!plot.plant || !plot.plantedAt) return 0;
  
  const currentTime = Date.now();
  const elapsedTime = currentTime - plot.plantedAt;
  const growthTimeMs = plot.plant.growthTime * 60 * 1000; // Convertir minutos a ms
  
  // Calcular el progreso base (0-100)
  let progress = Math.min(100, (elapsedTime / growthTimeMs) * 100);
  
  // Ajustar el progreso según el nivel de agua
  if (plot.waterLevel < 30) {
    progress *= 0.5; // Crecimiento más lento si falta agua
  }
  
  return progress;
}

// Función para actualizar el estado de una planta según su progreso
export function updatePlantState(plot: GardenPlot): GardenPlot {
  if (!plot.plant) return plot;
  
  // Calcular el progreso actual
  const progress = calculateGrowthProgress(plot);
  
  // Reducir el nivel de agua con el tiempo (simulando evaporación)
  let waterLevel = plot.waterLevel;
  if (plot.lastWatered) {
    const currentTime = Date.now();
    const hoursSinceLastWatered = (currentTime - plot.lastWatered) / (60 * 60 * 1000);
    waterLevel = Math.max(0, waterLevel - (hoursSinceLastWatered * 2));
  }
  
  // Determinar el estado según el progreso
  let newState = plot.state;
  if (progress < 33) {
    newState = 'seedling';
  } else if (progress < 66) {
    newState = 'growing';
  } else if (progress < 100) {
    newState = 'mature';
  } else {
    newState = 'harvestable';
  }
  
  return {
    ...plot,
    state: newState,
    waterLevel,
    growthPercentage: progress
  };
}

// Función para cosechar una planta
export function harvestPlant(plot: GardenPlot): GardenPlot {
  if (!plot.plant || plot.state !== 'harvestable') return plot;
  
  // Devolver una parcela vacía
  return {
    ...plot,
    plant: null,
    state: 'empty',
    plantedAt: null,
    waterLevel: 0,
    healthLevel: 0,
    lastWatered: null,
    growthPercentage: 0
  };
}

// Función para regar una planta
export function waterPlant(plot: GardenPlot): GardenPlot {
  if (!plot.plant) return plot;
  
  const now = Date.now();
  
  // Si es la primera vez que se riega, iniciar el crecimiento
  const plantedAt = plot.plantedAt === null ? now : plot.plantedAt;
  
  return {
    ...plot,
    waterLevel: 100,
    plantedAt: plantedAt, // Iniciar el crecimiento si es el primer riego
    lastWatered: now,
    healthLevel: Math.min(100, plot.healthLevel + 10)
  };
}

// Función para plantar una semilla
export function plantSeed(plot: GardenPlot, plant: Plant): GardenPlot {
  if (plot.plant) return plot; // No se puede plantar si ya hay una planta
  
  return {
    ...plot,
    plant,
    state: 'seedling',
    plantedAt: null, // La planta no comienza a crecer hasta que se riega
    waterLevel: 0,   // Comienza sin agua, necesita ser regada manualmente
    healthLevel: 80, // Salud inicial moderada
    lastWatered: null, // No se ha regado aún
    growthPercentage: 0
  };
}