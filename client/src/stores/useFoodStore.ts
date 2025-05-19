import { create } from 'zustand';

// Definición del tipo de nutrientes
interface NutritionalValue {
  protein: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  vitamins?: {
    a?: number;
    c?: number;
    d?: number;
    e?: number;
  };
  minerals?: {
    calcium?: number;
    iron?: number;
    potassium?: number;
  };
}

// Definición del tipo de alimento
export interface FoodItem {
  id: string;
  name: string;
  nameEn?: string;
  category: string;
  categoryEn?: string;
  calories: number;
  nutritionalValue: NutritionalValue;
  sustainabilityScore: number; // 0-10
  price: number;
  description: string;
  descriptionEn?: string;
  storageType: 'refrigerator' | 'pantry';
  image?: string;
}

// Interface del estado del almacén
interface FoodStore {
  refrigeratorFood: FoodItem[];
  pantryFood: FoodItem[];
  addToRefrigerator: (food: Omit<FoodItem, 'id' | 'storageType'>) => void;
  addToPantry: (food: Omit<FoodItem, 'id' | 'storageType'>) => void;
  removeFromKitchen: (id: string) => void;
  moveToRefrigerator: (id: string) => void;
  moveToPantry: (id: string) => void;
  addSampleFoods: () => void;
  clearAll: () => void;
}

// Creación del almacén de alimentos
export const useFoodStore = create<FoodStore>((set, get) => ({
  refrigeratorFood: [],
  pantryFood: [],

  // Añadir alimento a la nevera
  addToRefrigerator: (food) => set((state) => ({
    refrigeratorFood: [...state.refrigeratorFood, {
      ...food,
      id: `${food.name.toLowerCase()}-${Date.now()}-${state.refrigeratorFood.length}`,
      storageType: 'refrigerator'
    }]
  })),

  // Añadir alimento a la despensa
  addToPantry: (food) => set((state) => ({
    pantryFood: [...state.pantryFood, {
      ...food,
      id: `${food.name.toLowerCase()}-${Date.now()}-${state.pantryFood.length}`,
      storageType: 'pantry'
    }]
  })),

  // Eliminar alimento de la cocina (nevera o despensa)
  removeFromKitchen: (id) => set((state) => ({
    refrigeratorFood: state.refrigeratorFood.filter(food => food.id !== id),
    pantryFood: state.pantryFood.filter(food => food.id !== id)
  })),

  // Mover alimento a la nevera
  moveToRefrigerator: (id) => {
    const { pantryFood } = get();
    const foodItem = pantryFood.find(food => food.id === id);
    
    if (foodItem) {
      set((state) => ({
        pantryFood: state.pantryFood.filter(food => food.id !== id),
        refrigeratorFood: [...state.refrigeratorFood, {
          ...foodItem,
          storageType: 'refrigerator'
        }]
      }));
    }
  },

  // Mover alimento a la despensa
  moveToPantry: (id) => {
    const { refrigeratorFood } = get();
    const foodItem = refrigeratorFood.find(food => food.id === id);
    
    if (foodItem) {
      set((state) => ({
        refrigeratorFood: state.refrigeratorFood.filter(food => food.id !== id),
        pantryFood: [...state.pantryFood, {
          ...foodItem,
          storageType: 'pantry'
        }]
      }));
    }
  },

  // Añadir alimentos de ejemplo para pruebas
  addSampleFoods: () => {
    // Frutas y verduras
    get().addToPantry({
      name: 'Manzana',
      nameEn: 'Apple',
      category: 'frutas',
      categoryEn: 'fruits',
      calories: 52,
      nutritionalValue: {
        protein: 0.3,
        carbs: 14,
        fat: 0.2
      },
      sustainabilityScore: 8,
      price: 10,
      description: 'Una manzana crujiente, rica en fibra y vitaminas. Bajo impacto ambiental.',
      descriptionEn: 'A crisp apple, rich in fiber and vitamins. Low environmental impact.'
    });

    get().addToPantry({
      name: 'Brócoli',
      category: 'verduras',
      calories: 34,
      nutritionalValue: {
        protein: 2.8,
        carbs: 7,
        fat: 0.4
      },
      sustainabilityScore: 9,
      price: 15,
      description: 'Brócoli denso en nutrientes, alto en fibra y vitaminas C y K. Bajo consumo de agua.'
    });

    get().addToPantry({
      name: 'Zanahoria',
      category: 'verduras',
      calories: 41,
      nutritionalValue: {
        protein: 0.9,
        carbs: 10,
        fat: 0.2
      },
      sustainabilityScore: 8,
      price: 8,
      description: 'Rica en betacarotenos y antioxidantes. Cultivo eficiente en agua.'
    });

    // Proteínas
    get().addToRefrigerator({
      name: 'Huevos',
      nameEn: 'Eggs',
      category: 'proteínas',
      categoryEn: 'proteins',
      calories: 155,
      nutritionalValue: {
        protein: 13,
        carbs: 1.1,
        fat: 11
      },
      sustainabilityScore: 6,
      price: 20,
      description: 'Huevos de gallinas camperas. Alto valor nutricional con impacto moderado.',
      descriptionEn: 'Free-range eggs. High nutritional value with moderate impact.'
    });

    get().addToRefrigerator({
      name: 'Tofu',
      category: 'proteínas',
      calories: 76,
      nutritionalValue: {
        protein: 8,
        carbs: 2,
        fat: 4.3
      },
      sustainabilityScore: 9,
      price: 18,
      description: 'Alternativa proteica vegetal de bajo impacto. Alto en proteínas completas.'
    });

    // Carbohidratos
    get().addToPantry({
      name: 'Arroz Integral',
      nameEn: 'Brown Rice',
      category: 'granos',
      categoryEn: 'grains',
      calories: 111,
      nutritionalValue: {
        protein: 2.6,
        carbs: 23,
        fat: 0.9
      },
      sustainabilityScore: 7,
      price: 12,
      description: 'Cereal integral con mayor contenido nutricional que el refinado. Moderado uso de agua.',
      descriptionEn: 'Whole grain cereal with higher nutritional content than refined grains. Moderate water usage.'
    });

    get().addToPantry({
      name: 'Quinoa',
      category: 'granos',
      calories: 120,
      nutritionalValue: {
        protein: 4.4,
        carbs: 21.3,
        fat: 1.9
      },
      sustainabilityScore: 8,
      price: 25,
      description: 'Pseudocereal con proteína completa. Cultivo adaptado a condiciones áridas.'
    });

    // Productos lácteos
    get().addToRefrigerator({
      name: 'Yogur Natural',
      nameEn: 'Plain Yogurt',
      category: 'lácteos',
      categoryEn: 'dairy',
      calories: 59,
      nutritionalValue: {
        protein: 3.5,
        carbs: 5,
        fat: 3.3
      },
      sustainabilityScore: 5,
      price: 15,
      description: 'Fermentado con probióticos beneficiosos. Impacto moderado por su origen animal.',
      descriptionEn: 'Fermented with beneficial probiotics. Moderate impact due to animal origin.'
    });

    // Grasas saludables
    get().addToPantry({
      name: 'Aceite de Oliva',
      nameEn: 'Olive Oil',
      category: 'aceites',
      categoryEn: 'oils',
      calories: 884,
      nutritionalValue: {
        protein: 0,
        carbs: 0,
        fat: 100
      },
      sustainabilityScore: 7,
      price: 30,
      description: 'Alto en grasas monoinsaturadas saludables. Cultivo tradicional mediterráneo.',
      descriptionEn: 'High in healthy monounsaturated fats. Traditional Mediterranean crop.'
    });

    get().addToPantry({
      name: 'Aguacate',
      nameEn: 'Avocado',
      category: 'frutas',
      categoryEn: 'fruits',
      calories: 160,
      nutritionalValue: {
        protein: 2,
        carbs: 8.5,
        fat: 14.7
      },
      sustainabilityScore: 4,
      price: 22,
      description: 'Rico en grasas saludables y potasio. Alto consumo de agua en su cultivo.',
      descriptionEn: 'Rich in healthy fats and potassium. High water consumption in cultivation.'
    });
  },

  // Limpiar todos los alimentos
  clearAll: () => set({ refrigeratorFood: [], pantryFood: [] })
}));