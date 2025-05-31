import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useGameStateStore } from '../stores/useGameStateStore';
import { usePlayerStore } from '../stores/usePlayerStore';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  target?: string; // ID del elemento al que apuntar
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: string; // Acción requerida para avanzar ('click', 'move', etc.)
  completed: boolean;
  reward?: {
    coins?: number;
    calories?: number;
    xp?: number;
  };
}

export const Tutorial = () => {
  const { t, language } = useLanguage();
  const { gameState } = useGameStateStore();
  const { playerData, updatePlayer } = usePlayerStore();
  const [activeTutorial, setActiveTutorial] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);

  // Pasos del tutorial basados en el idioma actual
  const getTutorialSteps = (): TutorialStep[] => {
    // Versión en español por defecto
    const spanishSteps: TutorialStep[] = [
      {
        id: 1,
        title: '¡Bienvenido al Juego!',
        description: 'Aprenderás sobre nutrición, sostenibilidad y gestión de recursos mientras te diviertes.',
        position: 'top',
        completed: false,
        reward: { xp: 10 }
      },
      {
        id: 2,
        title: 'Movimiento básico',
        description: 'Usa las teclas WASD para moverte por el mundo del juego.',
        position: 'bottom',
        action: 'move',
        completed: false,
        reward: { xp: 15 }
      },
      {
        id: 3,
        title: 'Visita el Mercado',
        description: 'Dirígete al edificio del Mercado para comprar alimentos.',
        target: 'market',
        position: 'left',
        action: 'approach',
        completed: false,
        reward: { coins: 50, xp: 20 }
      },
      {
        id: 4,
        title: 'Compra tu primer alimento',
        description: 'Selecciona un alimento saludable y añádelo a tu carrito.',
        position: 'right',
        action: 'purchase',
        completed: false,
        reward: { xp: 25 }
      },
      {
        id: 5,
        title: 'Visita la Cocina',
        description: 'Ve a la Cocina para preparar tu primera comida.',
        target: 'kitchen',
        position: 'right',
        action: 'approach',
        completed: false,
        reward: { xp: 30 }
      },
      {
        id: 6,
        title: 'Prueba el Huerto',
        description: 'Visita el Huerto para cultivar tus propios alimentos.',
        target: 'garden',
        position: 'bottom',
        action: 'approach',
        completed: false,
        reward: { coins: 100, xp: 50 }
      },
      {
        id: 7,
        title: '¡Tutorial completado!',
        description: 'Has completado el tutorial básico. ¡Sigue explorando y aprendiendo!',
        position: 'top',
        completed: false,
        reward: { coins: 200, xp: 100 }
      }
    ];

    // Si el idioma es inglés
    if (language === 'en') {
      return [
        {
          id: 1,
          title: 'Welcome to the Game!',
          description: 'You will learn about nutrition, sustainability, and resource management while having fun.',
          position: 'top',
          completed: false,
          reward: { xp: 10 }
        },
        {
          id: 2,
          title: 'Basic Movement',
          description: 'Use the WASD keys to move around the game world.',
          position: 'bottom',
          action: 'move',
          completed: false,
          reward: { xp: 15 }
        },
        {
          id: 3,
          title: 'Visit the Market',
          description: 'Head to the Market building to purchase food.',
          target: 'market',
          position: 'left',
          action: 'approach',
          completed: false,
          reward: { coins: 50, xp: 20 }
        },
        {
          id: 4,
          title: 'Buy Your First Food',
          description: 'Select a healthy food and add it to your cart.',
          position: 'right',
          action: 'purchase',
          completed: false,
          reward: { xp: 25 }
        },
        {
          id: 5,
          title: 'Visit the Kitchen',
          description: 'Go to the Kitchen to prepare your first meal.',
          target: 'kitchen',
          position: 'right',
          action: 'approach',
          completed: false,
          reward: { xp: 30 }
        },
        {
          id: 6,
          title: 'Try the Garden',
          description: 'Visit the Garden to grow your own food.',
          target: 'garden',
          position: 'bottom',
          action: 'approach',
          completed: false,
          reward: { coins: 100, xp: 50 }
        },
        {
          id: 7,
          title: 'Tutorial Completed!',
          description: 'You have completed the basic tutorial. Keep exploring and learning!',
          position: 'top',
          completed: false,
          reward: { coins: 200, xp: 100 }
        }
      ];
    }
    // Si el idioma es catalán
    else if (language === 'ca') {
      return [
        {
          id: 1,
          title: 'Benvingut al Joc!',
          description: 'Aprendràs sobre nutrició, sostenibilitat i gestió de recursos mentre et diverteixes.',
          position: 'top',
          completed: false,
          reward: { xp: 10 }
        },
        {
          id: 2,
          title: 'Moviment bàsic',
          description: 'Utilitza les tecles WASD per moure\'t pel món del joc.',
          position: 'bottom',
          action: 'move',
          completed: false,
          reward: { xp: 15 }
        },
        {
          id: 3,
          title: 'Visita el Mercat',
          description: 'Dirigeix-te a l\'edifici del Mercat per comprar aliments.',
          target: 'market',
          position: 'left',
          action: 'approach',
          completed: false,
          reward: { coins: 50, xp: 20 }
        },
        {
          id: 4,
          title: 'Compra el teu primer aliment',
          description: 'Selecciona un aliment saludable i afegeix-lo al teu carret.',
          position: 'right',
          action: 'purchase',
          completed: false,
          reward: { xp: 25 }
        },
        {
          id: 5,
          title: 'Visita la Cuina',
          description: 'Vés a la Cuina per preparar el teu primer àpat.',
          target: 'kitchen',
          position: 'right',
          action: 'approach',
          completed: false,
          reward: { xp: 30 }
        },
        {
          id: 6,
          title: 'Prova l\'Hort',
          description: 'Visita l\'Hort per cultivar els teus propis aliments.',
          target: 'garden',
          position: 'bottom',
          action: 'approach',
          completed: false,
          reward: { coins: 100, xp: 50 }
        },
        {
          id: 7,
          title: 'Tutorial completat!',
          description: 'Has completat el tutorial bàsic. Continua explorant i aprenent!',
          position: 'top',
          completed: false,
          reward: { coins: 200, xp: 100 }
        }
      ];
    }

    return spanishSteps;
  };

  const [tutorialSteps, setTutorialSteps] = useState<TutorialStep[]>(getTutorialSteps());

  // Actualizar pasos del tutorial cuando cambia el idioma
  useEffect(() => {
    setTutorialSteps(getTutorialSteps());
  }, [language]);

  // Verificar y actualizar el progreso del tutorial
  useEffect(() => {
    if (!activeTutorial || !playerData) return;

    const currentTutorialStep = tutorialSteps[currentStep];
    
    // Verificar si se ha completado algún paso basado en el estado del juego actual
    if (currentTutorialStep.action === 'approach') {
      if (
        (currentTutorialStep.target === 'market' && gameState === 'market') ||
        (currentTutorialStep.target === 'kitchen' && gameState === 'kitchen') ||
        (currentTutorialStep.target === 'garden' && gameState === 'garden')
      ) {
        completeStep();
      }
    }
  }, [gameState, activeTutorial, playerData]);

  // Iniciar o reanudar el tutorial
  const startTutorial = () => {
    setActiveTutorial(true);
    
    // Si el jugador ya ha completado algunos pasos, restaurar el progreso
    if (playerData?.tutorialProgress) {
      setCurrentStep(playerData.tutorialProgress);
      
      // Marcar los pasos previos como completados
      const updatedSteps = [...tutorialSteps];
      for (let i = 0; i < playerData.tutorialProgress; i++) {
        updatedSteps[i].completed = true;
      }
      setTutorialSteps(updatedSteps);
    }
  };

  // Pausar el tutorial
  const pauseTutorial = () => {
    setActiveTutorial(false);
  };

  // Avanzar al siguiente paso del tutorial
  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prevStep => prevStep + 1);
      
      // Guardar progreso del tutorial
      if (playerData) {
        updatePlayer({
          ...playerData,
          tutorialProgress: currentStep + 1
        });
      }
    } else {
      // Tutorial completado
      completeTutorial();
    }
  };

  // Marcar el paso actual como completado
  const completeStep = () => {
    const updatedSteps = [...tutorialSteps];
    updatedSteps[currentStep].completed = true;
    setTutorialSteps(updatedSteps);
    
    // Otorgar recompensas
    const reward = updatedSteps[currentStep].reward;
    if (reward && playerData) {
      const newCoins = (playerData.coins || 0) + (reward.coins || 0);
      const newXP = (playerData.xp || 0) + (reward.xp || 0);
      
      updatePlayer({
        ...playerData,
        coins: newCoins,
        xp: newXP
      });
      
      // Mostrar notificación de recompensa
      if (reward.coins) {
        // Implementar notificación aquí
        console.log(`¡Has ganado ${reward.coins} monedas!`);
      }
      
      if (reward.xp) {
        // Implementar notificación aquí
        console.log(`¡Has ganado ${reward.xp} puntos de experiencia!`);
      }
    }
    
    // Pasar al siguiente paso
    nextStep();
  };

  // Completar todo el tutorial
  const completeTutorial = () => {
    setActiveTutorial(false);
    
    if (playerData) {
      updatePlayer({
        ...playerData,
        tutorialCompleted: true
      });
      
      // Notificación de tutorial completado
      console.log('¡Tutorial completado! Has obtenido todas las recompensas.');
    }
  };

  // Si el tutorial no está activo, mostrar botón para iniciarlo
  if (!activeTutorial) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={startTutorial}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {language === 'en' ? 'Start Tutorial' : language === 'ca' ? 'Iniciar Tutorial' : 'Iniciar Tutorial'}
        </button>
      </div>
    );
  }

  // Mostrar el paso actual del tutorial
  const currentTutorialStep = tutorialSteps[currentStep];
  
  // Determinar la posición del cuadro de diálogo según la propiedad position
  let positionClasses = '';
  switch (currentTutorialStep.position) {
    case 'top':
      positionClasses = 'bottom-full mb-4';
      break;
    case 'bottom':
      positionClasses = 'top-full mt-4';
      break;
    case 'left':
      positionClasses = 'right-full mr-4';
      break;
    case 'right':
      positionClasses = 'left-full ml-4';
      break;
  }

  return (
    <>
      {/* Cuadro de diálogo del tutorial */}
      <div className="fixed z-50 top-1/4 left-1/2 transform -translate-x-1/2 max-w-md w-full">
        <div className="bg-amber-100 border-4 border-amber-500 rounded-xl p-4 shadow-2xl">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-xl text-amber-800">{currentTutorialStep.title}</h3>
            <div className="flex space-x-2">
              <button 
                onClick={pauseTutorial}
                className="text-amber-800 hover:text-amber-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          <p className="text-amber-700 mb-4">{currentTutorialStep.description}</p>
          
          {/* Progreso del tutorial */}
          <div className="w-full bg-amber-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-amber-500 h-2.5 rounded-full" 
              style={{ width: `${((currentStep) / (tutorialSteps.length - 1)) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-amber-600 text-sm">
              {language === 'en' ? 'Step' : language === 'ca' ? 'Pas' : 'Paso'} {currentStep + 1}/{tutorialSteps.length}
            </span>
            
            {currentTutorialStep.action !== 'approach' && (
              <button
                onClick={completeStep}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded"
              >
                {language === 'en' ? 'Next' : language === 'ca' ? 'Següent' : 'Siguiente'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Controles del tutorial (mostrados en la esquina) */}
      {showControls && (
        <div className="fixed top-4 right-4 z-50 flex space-x-2">
          <button
            onClick={() => setShowControls(false)}
            className="bg-gray-700 hover:bg-gray-800 text-white rounded-full p-2"
            title={language === 'en' ? 'Hide Tutorial Controls' : language === 'ca' ? 'Amagar Controls' : 'Ocultar Controles'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Botón para mostrar controles cuando están ocultos */}
      {!showControls && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowControls(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white rounded-full p-2"
            title={language === 'en' ? 'Show Tutorial Controls' : language === 'ca' ? 'Mostrar Controls' : 'Mostrar Controles'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};