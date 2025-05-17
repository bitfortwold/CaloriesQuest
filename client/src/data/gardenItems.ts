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

export const plants: Plant[] = [
  {
    id: "tomato",
    name: "Tomate",
    description: "Un vegetal versátil rico en licopeno y vitamina C, excelente para ensaladas y salsas.",
    growthTime: 5, // 5 minutos para la demo
    waterNeeded: 3,
    sustainabilityScore: 4,
    nutritionalValue: {
      calories: 20,
      protein: 1,
      carbs: 4,
      fat: 0.2,
      vitamins: ["Vitamina C", "Vitamina A", "Potasio"]
    },
    harvestYield: 5,
    price: 10,
    difficulty: 'beginner',
    season: 'summer',
    image: '/textures/ground.jpg' // Usar una textura existente temporalmente
  },
  {
    id: "lettuce",
    name: "Lechuga",
    description: "Una verdura de hoja verde baja en calorías, perfecta para ensaladas y rica en folato.",
    growthTime: 3, // 3 minutos para la demo
    waterNeeded: 4,
    sustainabilityScore: 5,
    nutritionalValue: {
      calories: 5,
      protein: 0.5,
      carbs: 1,
      fat: 0.1,
      vitamins: ["Vitamina K", "Vitamina A", "Folato"]
    },
    harvestYield: 3,
    price: 8,
    difficulty: 'beginner',
    season: 'spring',
    image: '/textures/ground.jpg' // Usar una textura existente temporalmente
  },
  {
    id: "carrot",
    name: "Zanahoria",
    description: "Raíz vegetal crujiente rica en beta-caroteno, buena para la visión y la inmunidad.",
    growthTime: 4, // 4 minutos para la demo
    waterNeeded: 2,
    sustainabilityScore: 4,
    nutritionalValue: {
      calories: 25,
      protein: 0.6,
      carbs: 6,
      fat: 0.1,
      vitamins: ["Vitamina A", "Vitamina K", "Potasio"]
    },
    harvestYield: 4,
    price: 12,
    difficulty: 'beginner',
    season: 'autumn',
    image: "/textures/ground.jpg" // Textura temporal
  },
  {
    id: "cucumber",
    name: "Pepino",
    description: "Vegetal fresco y crujiente con alto contenido de agua, perfecto para refrescarse.",
    growthTime: 4, // 4 minutos para la demo
    waterNeeded: 5,
    sustainabilityScore: 3,
    nutritionalValue: {
      calories: 15,
      protein: 0.7,
      carbs: 3.6,
      fat: 0.1,
      vitamins: ["Vitamina K", "Vitamina C", "Magnesio"]
    },
    harvestYield: 4,
    price: 15,
    difficulty: 'intermediate',
    season: 'summer',
    image: "/textures/ground.jpg" // Textura temporal
  },
  {
    id: "spinach",
    name: "Espinaca",
    description: "Verdura de hoja verde nutricionalmente densa, rica en hierro y antioxidantes.",
    growthTime: 3, // 3 minutos para la demo
    waterNeeded: 3,
    sustainabilityScore: 5,
    nutritionalValue: {
      calories: 7,
      protein: 0.9,
      carbs: 1.1,
      fat: 0.1,
      vitamins: ["Hierro", "Vitamina K", "Vitamina A", "Calcio"]
    },
    harvestYield: 3,
    price: 14,
    difficulty: 'beginner',
    season: 'spring',
    image: "/textures/ground.jpg" // Textura temporal
  },
  {
    id: "bellpepper",
    name: "Pimiento",
    description: "Vegetal colorido rico en vitamina C, aporta sabor y color a tus platos.",
    growthTime: 5, // 5 minutos para la demo
    waterNeeded: 4,
    sustainabilityScore: 4,
    nutritionalValue: {
      calories: 30,
      protein: 1,
      carbs: 6,
      fat: 0.3,
      vitamins: ["Vitamina C", "Vitamina B6", "Folato"]
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
    waterNeeded: 4,
    sustainabilityScore: 3,
    nutritionalValue: {
      calories: 32,
      protein: 0.7,
      carbs: 7.7,
      fat: 0.3,
      vitamins: ["Vitamina C", "Manganeso", "Folato"]
    },
    harvestYield: 8,
    price: 20,
    difficulty: 'advanced',
    season: 'spring',
    image: "/textures/ground.jpg" // Textura temporal
  }
];

// Función para crear un nuevo huerto con parcelas vacías
export function createNewGarden(plotCount: number = 9): GardenPlot[] {
  const plots: GardenPlot[] = [];
  
  for (let i = 0; i < plotCount; i++) {
    plots.push({
      id: `plot-${i}`,
      plant: null,
      state: 'empty',
      plantedAt: null,
      waterLevel: 100,
      healthLevel: 100,
      lastWatered: null,
      growthPercentage: 0
    });
  }
  
  return plots;
}

// Función para calcular el progreso de crecimiento de una planta
export function calculateGrowthProgress(plot: GardenPlot): number {
  if (!plot.plant || !plot.plantedAt) return 0;
  
  const currentTime = Date.now();
  const elapsedTime = (currentTime - plot.plantedAt) / 1000 / 60; // Minutos transcurridos
  const growthTime = plot.plant.growthTime;
  
  // Calcular progreso base basado en el tiempo
  let progress = Math.min(100, (elapsedTime / growthTime) * 100);
  
  // Ajustar por nivel de agua y salud
  const waterFactor = plot.waterLevel / 100;
  const healthFactor = plot.healthLevel / 100;
  
  progress = progress * waterFactor * healthFactor;
  
  return Math.min(100, progress);
}

// Función para actualizar el estado de una planta según su progreso
export function updatePlantState(plot: GardenPlot): GardenPlot {
  if (!plot.plant) return plot;
  
  const progress = calculateGrowthProgress(plot);
  
  // Actualizar el estado según el progreso
  let newState = plot.state;
  
  if (progress < 25) {
    newState = 'seedling';
  } else if (progress < 75) {
    newState = 'growing';
  } else if (progress < 100) {
    newState = 'mature';
  } else {
    newState = 'harvestable';
  }
  
  return {
    ...plot,
    state: newState,
    growthPercentage: progress
  };
}

// Función para cosechar una planta
export function harvestPlant(plot: GardenPlot) {
  if (!plot.plant || plot.state !== 'harvestable') {
    return { plot, yield: 0 };
  }
  
  const harvestYield = plot.plant.harvestYield;
  
  // Resetear la parcela
  const newPlot: GardenPlot = {
    ...plot,
    plant: null,
    state: 'empty',
    plantedAt: null,
    waterLevel: 100,
    growthPercentage: 0
  };
  
  return {
    plot: newPlot,
    yield: harvestYield
  };
}

// Función para regar una planta
export function waterPlant(plot: GardenPlot): GardenPlot {
  if (!plot.plant) return plot;
  
  return {
    ...plot,
    waterLevel: 100,
    lastWatered: Date.now()
  };
}

// Función para plantar una semilla
export function plantSeed(plot: GardenPlot, plant: Plant): GardenPlot {
  if (plot.plant) return plot; // No se puede plantar si ya hay una planta
  
  return {
    ...plot,
    plant,
    state: 'seedling',
    plantedAt: Date.now(),
    waterLevel: 100,
    healthLevel: 100,
    lastWatered: Date.now(),
    growthPercentage: 0
  };
}