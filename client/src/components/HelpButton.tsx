import React, { useState } from 'react';

interface HelpButtonProps {
  className?: string;
}

const HelpButton: React.FC<HelpButtonProps> = ({ className }) => {
  const [showHelp, setShowHelp] = useState(false);

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <>
      {/* Botón de ayuda flotante en la esquina inferior derecha */}
      <button
        onClick={toggleHelp}
        className={`fixed bottom-4 right-4 w-12 h-12 bg-amber-600 hover:bg-amber-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-40 ${className}`}
        aria-label="Ayuda"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Modal de ayuda que se muestra/oculta */}
      {showHelp && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleHelp}></div>
          
          <div className="bg-gray-800 text-white rounded-xl p-6 mx-4 max-w-2xl relative z-10 shadow-2xl border-2 border-amber-500">
            <button 
              onClick={toggleHelp}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-bold mb-4 text-amber-400">Controles del Juego</h2>
            
            <div className="space-y-6">
              {/* Controles de teclado */}
              <div>
                <h3 className="text-lg font-medium mb-2 text-amber-300">Teclado:</h3>
                <ul className="pl-5 space-y-2">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-md bg-gray-700 px-2 py-1 mr-2 text-sm font-medium">W A S D</span>
                    <span>o</span>
                    <span className="inline-flex items-center justify-center rounded-md bg-gray-700 px-2 py-1 mx-2 text-sm font-medium">↑ ← ↓ →</span>
                    <span>para moverte</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center rounded-md bg-gray-700 px-2 py-1 mr-2 text-sm font-medium">ESC</span>
                    <span>para salir de edificios y ventanas</span>
                  </li>
                </ul>
              </div>
              
              {/* Controles de ratón */}
              <div>
                <h3 className="text-lg font-medium mb-2 text-amber-300">Ratón:</h3>
                <ul className="pl-5 space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">🖱️ Clic</span>
                    <span>en cualquier punto para moverte ahí</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🖱️ Clic</span>
                    <span>en las puertas de los edificios para entrar</span>
                  </li>
                </ul>
              </div>
              
              {/* Controles para Mac */}
              <div>
                <h3 className="text-lg font-medium mb-2 text-amber-300">Trackpad Mac:</h3>
                <ul className="pl-5 space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">👆 Arrastrar</span>
                    <span>dos dedos para mover la cámara</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">👆 Pellizcar</span>
                    <span>para acercar/alejar la cámara</span>
                  </li>
                </ul>
              </div>
              
              {/* Controles táctiles */}
              <div>
                <h3 className="text-lg font-medium mb-2 text-amber-300">Pantalla táctil:</h3>
                <ul className="pl-5 space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">👆 Tocar</span>
                    <span>para moverte a ese punto</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">👆 Deslizar</span>
                    <span>para mover la cámara</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">👆 Pellizcar</span>
                    <span>con dos dedos para acercar/alejar la vista</span>
                  </li>
                </ul>
              </div>
              
              {/* Consejos de interacción */}
              <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-amber-500">
                <h3 className="text-lg font-medium mb-2 text-amber-300">Consejos:</h3>
                <ul className="pl-5 list-disc space-y-1 text-gray-300">
                  <li>Acércate a las puertas de los edificios para entrar en ellos</li>
                  <li>Usa la tecla ESC para salir de cualquier edificio o ventana</li>
                  <li>Haz clic en los objetos interactivos para interactuar con ellos</li>
                  <li>Gestiona tus calorías diarias comprando alimentos saludables</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpButton;