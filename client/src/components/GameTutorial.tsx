import React, { useState, useEffect } from 'react';
import { useGameStateStore } from '../stores/useGameStateStore';

interface TutorialStep {
  id: number;
  title: string;
  content: string;
  task: string;
  image?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "¡Bienvenido a Consumo Calórico!",
    content: "Aprenderás sobre nutrición, sostenibilidad y gestión de recursos mientras te diviertes.",
    task: "Haz clic en 'Siguiente' para continuar."
  },
  {
    id: 2,
    title: "Movimiento básico",
    content: "Puedes moverte usando las teclas WASD o las flechas del teclado. También puedes hacer clic en cualquier punto para desplazarte allí.",
    task: "Prueba a moverte por el mapa usando el teclado o haciendo clic."
  },
  {
    id: 3,
    title: "Visita los edificios",
    content: "Explora el Mercado, la Cocina y el Huerto haciendo clic en sus puertas. Cada lugar tiene funciones específicas.",
    task: "Acércate a un edificio y haz clic en su puerta para entrar."
  },
  {
    id: 4,
    title: "Compra alimentos en el Mercado",
    content: "En el Mercado puedes comprar ingredientes usando tus iHumanCoins (IHC).",
    task: "Compra algún alimento saludable en el Mercado."
  },
  {
    id: 5,
    title: "Prepara comidas en la Cocina",
    content: "Combina ingredientes en la Cocina para crear platos nutritivos.",
    task: "Prepara una receta saludable en la Cocina."
  },
  {
    id: 6,
    title: "Cultiva en el Huerto",
    content: "Cultiva tus propios alimentos orgánicos en el Huerto para ahorrar y ser sostenible.",
    task: "Planta y cuida alguna planta en el Huerto."
  },
  {
    id: 7,
    title: "¡Tutorial completado!",
    content: "Ya conoces lo básico del juego. Ahora puedes comprar, cocinar, cultivar y aprender sobre hábitos alimenticios saludables.",
    task: "¡Disfruta jugando y aprendiendo!"
  }
];

interface GameTutorialProps {
  isFirstLogin?: boolean;
  onComplete?: () => void;
}

const GameTutorial: React.FC<GameTutorialProps> = ({ 
  isFirstLogin = false, 
  onComplete 
}) => {
  const [showTutorial, setShowTutorial] = useState(isFirstLogin);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { gameState } = useGameStateStore();

  // Verificar el progreso del tutorial basado en el estado del juego
  useEffect(() => {
    if (!showTutorial) return;

    // Por ejemplo, si el jugador está en el mercado y estamos en el paso 3
    if (gameState === 'market' && currentStep === 3) {
      // Avanzar al siguiente paso
      setTimeout(() => setCurrentStep(prev => prev + 1), 1000);
    }
    // Más verificaciones para otros pasos...
  }, [gameState, currentStep, showTutorial]);

  const handleNextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
      setShowTutorial(false);
      if (onComplete) onComplete();
    }
  };

  const handleSkipTutorial = () => {
    setCompleted(true);
    setShowTutorial(false);
    if (onComplete) onComplete();
  };

  if (!showTutorial) return null;

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gray-800 text-white rounded-2xl p-6 max-w-lg w-full mx-4 border-2 border-amber-500 shadow-xl">
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-amber-400">
            {currentTutorialStep.title}
          </h2>
          <span className="text-sm text-gray-400">
            {currentStep + 1} / {tutorialSteps.length}
          </span>
        </div>
        
        {/* Contenido */}
        <div className="mb-6 text-gray-300 leading-relaxed">
          {currentTutorialStep.content}
        </div>
        
        {/* Tarea */}
        <div className="bg-gray-700 p-4 rounded-xl mb-6 border-l-4 border-amber-500">
          <h3 className="font-bold text-amber-400 mb-1">Tu misión:</h3>
          <p>{currentTutorialStep.task}</p>
        </div>
        
        {/* Imagen de tutorial (opcional) */}
        {currentTutorialStep.image && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src={currentTutorialStep.image} 
              alt={`Tutorial paso ${currentStep + 1}`} 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
        {/* Botones */}
        <div className="flex justify-between">
          <button
            onClick={handleSkipTutorial}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Saltar tutorial
          </button>
          
          <button
            onClick={handleNextStep}
            className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
          >
            {currentStep === tutorialSteps.length - 1 ? 'Completar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameTutorial;