import { useEffect } from "react";
import { useAudio } from "../lib/stores/useAudio";
import { useGameStateStore } from "../stores/useGameStateStore";

const AudioManager = () => {
  const { 
    backgroundMusic, 
    hitSound, 
    successSound,
    voiceSound,
    setBackgroundMusic,
    setHitSound,
    setSuccessSound,
    setVoiceSound,
    toggleMute
  } = useAudio();
  
  const { gameState } = useGameStateStore();
  
  // Initialize audio elements when component mounts
  useEffect(() => {
    // Background music
    if (!backgroundMusic) {
      const music = new Audio("/sounds/background.mp3");
      music.loop = true;
      // El volumen se establecerá automáticamente en setBackgroundMusic
      setBackgroundMusic(music);
    }
    
    // Hit sound (used for interactions)
    if (!hitSound) {
      const sound = new Audio("/sounds/hit.mp3");
      setHitSound(sound);
    }
    
    // Success sound
    if (!successSound) {
      const sound = new Audio("/sounds/success.mp3");
      setSuccessSound(sound);
    }
    
    // Configurar un sonido de voz inicial vacío (se usará más adelante)
    if (!voiceSound) {
      // No cargamos ningún archivo por defecto, solo configuramos el estado
      setVoiceSound(new Audio());
    }
    
    // Clean up function
    return () => {      
      // Stop and clean up audio elements
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
      }
      
      // Limpiar sonidos de voz si hay alguno reproduciéndose
      if (voiceSound) {
        voiceSound.pause();
        voiceSound.currentTime = 0;
      }
    };
  }, [
    backgroundMusic, 
    hitSound, 
    successSound,
    voiceSound,
    setBackgroundMusic, 
    setHitSound, 
    setSuccessSound,
    setVoiceSound,
    toggleMute
  ]);
  
  // Play/pause background music based on game state
  useEffect(() => {
    if (!backgroundMusic) return;
    
    // Obtener el estado actual de mute de música
    const isMuted = useAudio.getState().isMuted;
    
    // Asegurarnos de que el elemento de audio tenga el estado de mute correcto
    backgroundMusic.muted = isMuted;
    
    // Reproducir música según el estado del juego
    if (gameState === "playing" || gameState === "market" || gameState === "kitchen") {
      backgroundMusic.play().catch(error => {
        console.log("Background music play prevented:", error);
      });
    } else {
      backgroundMusic.pause();
    }
  }, [gameState, backgroundMusic]);
  
  // No UI, just audio management
  return null;
};

export default AudioManager;
