import { useState } from "react";
import { useAudio } from "@/lib/stores/useAudio";

export const SoundButton = () => {
  const { isMuted, toggleMute, volume, increaseVolume, decreaseVolume } = useAudio();
  const [showVolumeControls, setShowVolumeControls] = useState(false);
  
  return (
    <div className="fixed left-4 bottom-4 z-[1000]">
      <div className="relative">
        {/* Botón principal de sonido */}
        <button
          className="w-12 h-12 rounded-full bg-black/80 flex items-center justify-center text-white hover:bg-black/90 transition-all"
          onClick={() => toggleMute()}
          onMouseEnter={() => setShowVolumeControls(true)}
        >
          {isMuted ? (
            // Ícono de mute
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            // Ícono de volumen
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
        
        {/* Panel de control de volumen */}
        {showVolumeControls && (
          <div 
            className="absolute bottom-14 left-0 bg-black/80 p-3 rounded-lg flex flex-col items-center"
            onMouseLeave={() => setShowVolumeControls(false)}
          >
            <div className="flex flex-col items-center gap-2">
              {/* Botón de aumentar volumen */}
              <button
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
                onClick={increaseVolume}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              
              {/* Nivel de volumen actual */}
              <div className="text-white text-sm font-bold">
                {Math.round(volume * 100)}%
              </div>
              
              {/* Botón de disminuir volumen */}
              <button
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
                onClick={decreaseVolume}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};