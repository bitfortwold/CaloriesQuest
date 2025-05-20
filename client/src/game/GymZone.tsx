import React, { useState } from 'react';
import { useGameStateStore } from '../stores/useGameStateStore';
import { useKeyboardExit } from '../hooks/useKeyboardExit';
import { usePlayerStore } from '../stores/usePlayerStore';
import Activities from './Activities';
import { MoveLeft } from 'lucide-react';

const GymZone: React.FC = () => {
  // Estado del juego y jugador
  const { exitBuilding } = useGameStateStore();
  const { increaseCaloriesBurned, playerData } = usePlayerStore();
  const [message, setMessage] = useState<string | null>(null);

  // Hook para salir con tecla ESC
  useKeyboardExit('gym');
  
  // Manejar la finalización de una actividad
  const handleActivityComplete = (caloriesBurned: number) => {
    // Aumentar calorías quemadas en el perfil del jugador
    increaseCaloriesBurned(caloriesBurned);
    
    // Mostrar mensaje de confirmación
    setMessage(`¡Felicidades! Has quemado ${caloriesBurned} calorías.`);
    
    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gimnasio</h1>
          <div className="flex items-center">
            <span className="mr-4">
              Calorías Quemadas: {playerData?.caloriesBurned || 0}
            </span>
            <button 
              onClick={() => exitBuilding()}
              className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              <MoveLeft size={18} className="mr-2" />
              Salir
            </button>
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex-1 container mx-auto my-6 p-4 bg-white rounded-lg shadow-md">
        {/* Información del gimnasio */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Zona de Ejercicio</h2>
          <p className="text-gray-700">
            Bienvenido a la zona de ejercicio. Aquí puedes realizar diferentes 
            actividades físicas para quemar calorías y mantenerte saludable.
            Selecciona una categoría y actividad para comenzar.
          </p>
        </div>
        
        {/* Componente de actividades */}
        <Activities onActivityComplete={handleActivityComplete} />
        
        {/* Mensaje de notificación */}
        {message && (
          <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
            {message}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="bg-blue-800 text-white p-3">
        <div className="container mx-auto text-center">
          <button 
            onClick={() => exitBuilding()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Volver al Mapa
          </button>
        </div>
      </div>
    </div>
  );
};

export default GymZone;