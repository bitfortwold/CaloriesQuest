import { useEffect, useRef } from "react";

interface AlertSoundProps {
  playSound: boolean;
  soundType?: "success" | "error" | "notification";
  onPlayComplete?: () => void;
}

const AlertSound = ({ playSound, soundType = "notification", onPlayComplete }: AlertSoundProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Definir los sonidos según el tipo
  const getSoundUrl = () => {
    switch (soundType) {
      case "success":
        return "/sounds/success.mp3";
      case "error":
        return "/sounds/error.mp3";
      case "notification":
      default:
        return "/sounds/notification.mp3";
    }
  };
  
  useEffect(() => {
    if (playSound) {
      if (!audioRef.current) {
        audioRef.current = new Audio(getSoundUrl());
        
        // Configurar el volumen
        audioRef.current.volume = 0.5;
        
        // Añadir evento de fin para notificar cuando termine
        audioRef.current.addEventListener('ended', () => {
          if (onPlayComplete) {
            onPlayComplete();
          }
        });
      }
      
      // Reproducir el sonido
      audioRef.current.play()
        .then(() => console.log("🔊 Reproduciendo alerta sonora"))
        .catch(err => console.error("Error al reproducir sonido:", err));
    }
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', onPlayComplete || (() => {}));
        audioRef.current = null;
      }
    };
  }, [playSound, soundType, onPlayComplete]);
  
  // Este componente no renderiza nada visible
  return null;
};

export default AlertSound;