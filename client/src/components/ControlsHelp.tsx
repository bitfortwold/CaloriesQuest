import React, { useState } from 'react';

const ControlsHelp: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <>
      {/* Botón de ayuda con icono de interrogación */}
      <button
        onClick={toggleHelp}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-40 transition-all duration-300"
        aria-label="Controles"
        style={{ zIndex: 1000 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Ventana modal simple exactamente como en la referencia */}
      {showHelp && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleHelp}></div>
          <div className="bg-white text-center py-8 px-6 rounded-lg shadow-2xl max-w-lg w-full mx-4 z-10">
            <h1 className="text-3xl font-bold mb-4">Usa las teclas WASD para moverte</h1>
            <p className="text-xl">Acércate a las puertas o haz clic en los edificios para entrar</p>
            
            <button 
              onClick={toggleHelp}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ControlsHelp;