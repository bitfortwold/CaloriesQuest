import React, { useState, useEffect } from 'react';
import { useGameStateStore } from '../stores/useGameStateStore';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useTutorialStore } from '../stores/useTutorialStore';

// Importamos los tipos desde la tienda de tutorial
import type { TutorialStep, TutorialState } from '../stores/useTutorialStore';

const TutorialSystem: React.FC = () => {
  // Estado global del juego
  const { gameState } = useGameStateStore();
  const { playerPosition, playerData, updatePlayer } = usePlayerStore();
  
  // Estado del tutorial desde el store
  const { 
    tutorialState,
    currentStepIndex, 
    tutorialSteps,
    showTutorialModal,
    advanceToNextStep,
    triggerTutorialEvent,
    toggleTutorialModal,
    startTutorial
  } = useTutorialStore();
  ]);
  
  // Lógica para iniciar el tutorial
  useEffect(() => {
    // Si el jugador es nuevo (first_login) y el tutorial está inactivo, iniciarlo
    if (playerData?.first_login && tutorialState === 'inactive') {
      setTutorialState('active');
      setShowModal(true);
    }
  }, [playerData, tutorialState]);
  
  // Lógica para avanzar al siguiente paso
  const advanceToNextStep = () => {
    if (currentStepIndex < tutorialSteps.length - 1) {
      // Marcar el paso actual como completado
      const updatedSteps = [...tutorialSteps];
      updatedSteps[currentStepIndex].completed = true;
      setTutorialSteps(updatedSteps);
      
      // Dar recompensa si hay
      if (updatedSteps[currentStepIndex].rewardCoins && playerData) {
        const newCoins = (playerData.ih_coins || 0) + (updatedSteps[currentStepIndex].rewardCoins || 0);
        updatePlayer({
          ...playerData,
          ih_coins: newCoins
        });
      }
      
      // Avanzar al siguiente paso
      setCurrentStepIndex(currentStepIndex + 1);
      setShowModal(true);
    } else {
      // Tutorial completado
      const finalUpdatedSteps = [...tutorialSteps];
      finalUpdatedSteps[currentStepIndex].completed = true;
      setTutorialSteps(finalUpdatedSteps);
      
      // Dar recompensa final si hay
      if (finalUpdatedSteps[currentStepIndex].rewardCoins && playerData) {
        const newCoins = (playerData.ih_coins || 0) + (finalUpdatedSteps[currentStepIndex].rewardCoins || 0);
        updatePlayer({
          ...playerData,
          ih_coins: newCoins,
          first_login: false // Marcar que ya no es primera vez
        });
      }
      
      setTutorialState('completed');
      setTutorialCompleted(true);
      setShowModal(false);
    }
  };
  
  // Manejo de eventos del juego para avanzar en el tutorial
  useEffect(() => {
    if (tutorialState !== 'active') return;
    
    const currentStep = tutorialSteps[currentStepIndex];
    
    // Comprobar eventos según el trigger del paso actual
    switch (currentStep.trigger) {
      case 'movement':
        // Detectar si el jugador se ha movido
        const playerHasMoved = true; // Simplificado, normalmente comprobaríamos la posición
        if (playerHasMoved) {
          advanceToNextStep();
        }
        break;
        
      case 'enter_building':
        // Comprobar si el jugador ha entrado al edificio correcto
        if (gameState === currentStep.location) {
          advanceToNextStep();
        }
        break;
        
      case 'purchase_food':
        // Este evento se debe activar desde el componente Market
        // Se implementará la lógica para detectar compras
        break;
        
      case 'cook_meal':
        // Este evento se debe activar desde el componente Kitchen
        // Se implementará la lógica para detectar cocina
        break;
        
      case 'plant_seed':
        // Este evento se debe activar desde el componente Garden
        // Se implementará la lógica para detectar siembra
        break;
    }
  }, [playerPosition, gameState, tutorialState, currentStepIndex]);
  
  // Función para manejar el clic en el botón "Siguiente"
  const handleNextClick = () => {
    const currentStep = tutorialSteps[currentStepIndex];
    
    if (currentStep.trigger === 'next_button') {
      advanceToNextStep();
    } else {
      // Si no es un paso que avanza con botón, solo cerramos el modal
      setShowModal(false);
    }
  };
  
  // Métodos públicos para que otros componentes puedan avanzar el tutorial
  const triggerTutorialEvent = (eventType: string) => {
    if (tutorialState !== 'active') return;
    
    const currentStep = tutorialSteps[currentStepIndex];
    if (currentStep.trigger === eventType) {
      advanceToNextStep();
    }
  };
  
  // Renderizado del modal de tutorial
  if (!showModal || tutorialState !== 'active') return null;
  
  const currentStep = tutorialSteps[currentStepIndex];
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gray-800 text-white rounded-lg p-6 max-w-md w-full mx-4 border-2 border-amber-500">
        <h2 className="text-2xl font-bold mb-2 text-amber-400">
          {currentStep.title}
        </h2>
        
        <div className="mb-4 text-gray-300">
          {currentStep.content}
        </div>
        
        <div className="bg-gray-700 p-3 rounded-md mb-4 border-l-4 border-amber-500">
          <h3 className="font-bold text-amber-400 mb-1">Tu misión:</h3>
          <p>{currentStep.task}</p>
          
          {currentStep.rewardCoins && (
            <div className="mt-2 text-green-400">
              Recompensa: {currentStep.rewardCoins} IHC
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Paso {currentStepIndex + 1} de {tutorialSteps.length}
          </div>
          
          <button
            onClick={handleNextClick}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors"
          >
            {currentStep.trigger === 'next_button' ? 'Siguiente' : 'Entendido'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Exportar un hook para que otros componentes puedan usar el sistema de tutorial
export const useTutorialSystem = () => {
  const [tutorialSystem, setTutorialSystem] = useState<{
    triggerTutorialEvent: (eventType: string) => void;
  } | null>(null);
  
  useEffect(() => {
    // Este hook se usará para conectar componentes con el sistema de tutorial
    // La implementación completa requeriría un contexto o un store global
  }, []);
  
  return {
    triggerEvent: (eventType: string) => {
      if (tutorialSystem) {
        tutorialSystem.triggerTutorialEvent(eventType);
      }
    }
  };
};

export default TutorialSystem;