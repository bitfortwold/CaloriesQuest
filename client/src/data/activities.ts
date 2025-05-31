// Definición de tipos para actividades físicas
export interface PhysicalActivity {
  id: string;
  name: string;
  description: string;
  duration: number; // duración en minutos
  caloriesBurned: number; // calorías quemadas por la actividad
  intensity: 'low' | 'medium' | 'high';
  benefits: string[]; // beneficios para la salud
  icon: string; // Clase de icono para mostrar (usando iconos de lucide-react)
}

// Categorías de actividades
export type ActivityCategory = 'cardio' | 'strength' | 'flexibility' | 'recreational';

// Lista de actividades físicas disponibles
export const PHYSICAL_ACTIVITIES: Record<ActivityCategory, PhysicalActivity[]> = {
  cardio: [
    {
      id: 'running',
      name: 'Correr',
      description: 'Correr al aire libre o en cinta. Excelente para la salud cardiovascular.',
      duration: 30,
      caloriesBurned: 300,
      intensity: 'high',
      benefits: ['Mejora cardiovascular', 'Quema de grasa', 'Fortalece piernas'],
      icon: 'Activity'
    },
    {
      id: 'swimming',
      name: 'Nadar',
      description: 'Natación en piscina. Ejercicio de bajo impacto que trabaja todo el cuerpo.',
      duration: 30,
      caloriesBurned: 250,
      intensity: 'medium',
      benefits: ['Ejercicio de cuerpo completo', 'Bajo impacto', 'Mejora cardiovascular'],
      icon: 'Waves'
    },
    {
      id: 'cycling',
      name: 'Ciclismo',
      description: 'Ciclismo en bicicleta estática o al aire libre.',
      duration: 30,
      caloriesBurned: 280,
      intensity: 'medium',
      benefits: ['Fortalece piernas', 'Mejora resistencia', 'Bajo impacto en articulaciones'],
      icon: 'Bike'
    }
  ],
  
  strength: [
    {
      id: 'weightlifting',
      name: 'Levantamiento de pesas',
      description: 'Entrenamiento con pesas para fortalecer los músculos.',
      duration: 45,
      caloriesBurned: 200,
      intensity: 'high',
      benefits: ['Aumenta masa muscular', 'Fortalece huesos', 'Mejora metabolismo'],
      icon: 'Dumbbell'
    },
    {
      id: 'pushups',
      name: 'Flexiones',
      description: 'Ejercicio corporal que trabaja principalmente pecho, hombros y tríceps.',
      duration: 15,
      caloriesBurned: 100,
      intensity: 'medium',
      benefits: ['Fortalece pecho y brazos', 'No requiere equipo', 'Mejora estabilidad'],
      icon: 'ArrowDown'
    },
    {
      id: 'squats',
      name: 'Sentadillas',
      description: 'Ejercicio para fortalecer piernas y glúteos.',
      duration: 15,
      caloriesBurned: 120,
      intensity: 'medium',
      benefits: ['Fortalece piernas', 'Mejora estabilidad', 'Activa múltiples grupos musculares'],
      icon: 'ArrowDownAZ'
    }
  ],
  
  flexibility: [
    {
      id: 'yoga',
      name: 'Yoga',
      description: 'Práctica que combina posturas físicas, respiración y meditación.',
      duration: 60,
      caloriesBurned: 180,
      intensity: 'low',
      benefits: ['Mejora flexibilidad', 'Reduce estrés', 'Fortalece músculos profundos'],
      icon: 'Heart'
    },
    {
      id: 'stretching',
      name: 'Estiramientos',
      description: 'Rutina de estiramientos para mejorar la flexibilidad y prevenir lesiones.',
      duration: 15,
      caloriesBurned: 60,
      intensity: 'low',
      benefits: ['Previene lesiones', 'Mejora rango de movimiento', 'Reduce tensión muscular'],
      icon: 'Zap'
    },
    {
      id: 'pilates',
      name: 'Pilates',
      description: 'Sistema de entrenamiento físico y mental que fortalece el núcleo.',
      duration: 45,
      caloriesBurned: 160,
      intensity: 'medium',
      benefits: ['Fortalece core', 'Mejora postura', 'Aumenta flexibilidad'],
      icon: 'Grid'
    }
  ],
  
  recreational: [
    {
      id: 'dancing',
      name: 'Baile',
      description: 'Actividad física divertida que mejora la coordinación y quema calorías.',
      duration: 45,
      caloriesBurned: 250,
      intensity: 'medium',
      benefits: ['Mejora coordinación', 'Divertido', 'Socialización'],
      icon: 'Music'
    },
    {
      id: 'basketball',
      name: 'Baloncesto',
      description: 'Deporte de equipo que combina cardio y ejercicios de fuerza.',
      duration: 60,
      caloriesBurned: 350,
      intensity: 'high',
      benefits: ['Trabajo en equipo', 'Mejora resistencia', 'Fortalece músculos'],
      icon: 'CircleDot'
    },
    {
      id: 'hiking',
      name: 'Senderismo',
      description: 'Caminata por la naturaleza, excelente para la salud física y mental.',
      duration: 90,
      caloriesBurned: 400,
      intensity: 'medium',
      benefits: ['Contacto con la naturaleza', 'Bajo impacto', 'Trabaja todo el cuerpo'],
      icon: 'Mountain'
    }
  ]
};

// Función para obtener todas las actividades en una lista plana
export const getAllActivities = (): PhysicalActivity[] => {
  return Object.values(PHYSICAL_ACTIVITIES).flat();
};

// Función para obtener una actividad por su ID
export const getActivityById = (id: string): PhysicalActivity | undefined => {
  return getAllActivities().find(activity => activity.id === id);
};

// Función para calcular calorías quemadas basadas en intensidad y duración personalizada
export const calculateCaloriesBurned = (
  activity: PhysicalActivity, 
  duration: number, 
  userWeight: number = 70 // peso promedio en kg
): number => {
  // Factor base de calorías por minuto según intensidad
  const intensityFactor = 
    activity.intensity === 'low' ? 0.05 :
    activity.intensity === 'medium' ? 0.1 :
    0.15; // high
  
  // Calorías quemadas = duración × intensidad × peso
  return Math.round(duration * intensityFactor * userWeight);
};