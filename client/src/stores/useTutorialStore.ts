import { create } from "zustand";

// Definición de los pasos del tutorial
export interface TutorialStep {
  id: number;
  title: string;
  content: string;
  task: string;
  completed: boolean;
  trigger?: string; // Evento que activa el siguiente paso
  location?: string; // Ubicación necesaria para este paso
  rewardCoins?: number; // Recompensa en iHumanCoins
  rewardExp?: number; // Recompensa en experiencia
}

// Estados posibles del tutorial
export type TutorialState = 'inactive' | 'active' | 'completed' | 'paused';

// Definición del store
interface TutorialStoreState {
  // Estado
  tutorialState: TutorialState;
  currentStepIndex: number;
  tutorialSteps: TutorialStep[];
  showTutorialModal: boolean;
  
  // Acciones
  setTutorialState: (state: TutorialState) => void;
  setCurrentStepIndex: (index: number) => void;
  updateTutorialStep: (stepId: number, updates: Partial<TutorialStep>) => void;
  markStepCompleted: (stepId: number) => void;
  advanceToNextStep: () => void;
  toggleTutorialModal: (show?: boolean) => void;
  
  // Eventos
  triggerTutorialEvent: (eventType: string) => void;
  startTutorial: () => void;
  resetTutorial: () => void;
}

// Pasos predefinidos del tutorial
const defaultTutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "¡Bienvenido al juego Consumo Calórico!",
    content: "Aprenderás sobre nutrición, sostenibilidad y gestión de recursos mientras te diviertes.",
    task: "Haz clic en 'Siguiente' para continuar.",
    completed: false,
    trigger: 'next_button'
  },
  {
    id: 2,
    title: "Movimiento básico",
    content: "Puedes moverte usando las teclas WASD o las flechas del teclado. También puedes hacer clic en cualquier punto del mapa para moverte allí.",
    task: "Intenta moverte un poco por el mapa.",
    completed: false,
    trigger: 'movement'
  },
  {
    id: 3,
    title: "Visita el Mercado",
    content: "El Mercado es donde puedes comprar alimentos usando tus iHumanCoins (IHC).",
    task: "Acércate a la puerta del Mercado y haz clic para entrar.",
    completed: false,
    location: 'market',
    trigger: 'enter_building',
    rewardCoins: 50
  },
  {
    id: 4,
    title: "Compra tu primer alimento",
    content: "Cada alimento tiene un valor calórico y un precio en IHC. Intenta comprar algo saludable.",
    task: "Compra cualquier alimento del Mercado.",
    completed: false,
    location: 'market',
    trigger: 'purchase_food',
    rewardCoins: 100
  },
  {
    id: 5,
    title: "Visita la Cocina",
    content: "En la Cocina puedes preparar comidas con los alimentos que has comprado.",
    task: "Sal del Mercado (ESC) y visita la Cocina.",
    completed: false,
    location: 'kitchen',
    trigger: 'enter_building',
    rewardCoins: 50
  },
  {
    id: 6,
    title: "Prepara tu primera comida",
    content: "Combina ingredientes para crear comidas nutritivas y deliciosas.",
    task: "Prepara cualquier receta en la Cocina.",
    completed: false,
    location: 'kitchen',
    trigger: 'cook_meal',
    rewardCoins: 100
  },
  {
    id: 7,
    title: "Visita el Huerto Virtual",
    content: "En el Huerto puedes cultivar tus propios alimentos de manera sostenible.",
    task: "Sal de la Cocina (ESC) y visita el Huerto.",
    completed: false,
    location: 'garden',
    trigger: 'enter_building',
    rewardCoins: 50
  },
  {
    id: 8,
    title: "Cultiva tu primer alimento",
    content: "Cultivar tus propios alimentos es económico y sostenible.",
    task: "Planta cualquier semilla en el Huerto.",
    completed: false,
    location: 'garden',
    trigger: 'plant_seed',
    rewardCoins: 100
  },
  {
    id: 9,
    title: "¡Tutorial completado!",
    content: "Has aprendido los fundamentos básicos del juego. Ahora puedes explorar libremente, comprar y preparar alimentos, cultivar en tu huerto y gestionar tus recursos calóricos.",
    task: "Disfruta del juego y aprende sobre nutrición saludable.",
    completed: false,
    trigger: 'next_button',
    rewardCoins: 200,
    rewardExp: 100
  }
];

// Crear el store
export const useTutorialStore = create<TutorialStoreState>((set, get) => ({
  // Estado inicial
  tutorialState: 'inactive',
  currentStepIndex: 0,
  tutorialSteps: defaultTutorialSteps,
  showTutorialModal: false,
  
  // Acciones
  setTutorialState: (state) => set({ tutorialState: state }),
  
  setCurrentStepIndex: (index) => set({ currentStepIndex: index }),
  
  updateTutorialStep: (stepId, updates) => {
    const { tutorialSteps } = get();
    const updatedSteps = tutorialSteps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    );
    set({ tutorialSteps: updatedSteps });
  },
  
  markStepCompleted: (stepId) => {
    const { tutorialSteps } = get();
    const updatedSteps = tutorialSteps.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    );
    set({ tutorialSteps: updatedSteps });
  },
  
  advanceToNextStep: () => {
    const { currentStepIndex, tutorialSteps } = get();
    
    // Marcar paso actual como completado
    const updatedSteps = [...tutorialSteps];
    updatedSteps[currentStepIndex].completed = true;
    
    if (currentStepIndex < tutorialSteps.length - 1) {
      // Avanzar al siguiente paso
      set({
        tutorialSteps: updatedSteps,
        currentStepIndex: currentStepIndex + 1,
        showTutorialModal: true
      });
    } else {
      // Tutorial completado
      set({
        tutorialSteps: updatedSteps,
        tutorialState: 'completed',
        showTutorialModal: false
      });
    }
  },
  
  toggleTutorialModal: (show) => {
    if (show !== undefined) {
      set({ showTutorialModal: show });
    } else {
      set(state => ({ showTutorialModal: !state.showTutorialModal }));
    }
  },
  
  // Eventos
  triggerTutorialEvent: (eventType) => {
    const { tutorialState, currentStepIndex, tutorialSteps } = get();
    
    // Solo procesar eventos si el tutorial está activo
    if (tutorialState !== 'active') return;
    
    const currentStep = tutorialSteps[currentStepIndex];
    
    // Si el evento coincide con el trigger del paso actual
    if (currentStep.trigger === eventType) {
      get().advanceToNextStep();
    }
  },
  
  startTutorial: () => {
    set({
      tutorialState: 'active',
      currentStepIndex: 0,
      showTutorialModal: true
    });
  },
  
  resetTutorial: () => {
    set({
      tutorialState: 'inactive',
      currentStepIndex: 0,
      tutorialSteps: defaultTutorialSteps,
      showTutorialModal: false
    });
  }
}));