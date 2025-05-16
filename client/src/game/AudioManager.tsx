import { useEffect } from "react";
import { useAudio } from "../lib/stores/useAudio";
import { useGameStateStore } from "../stores/useGameStateStore";

const AudioManager = () => {
  const { 
    backgroundMusic, 
    hitSound, 
    successSound,
    setBackgroundMusic,
    setHitSound,
    setSuccessSound,
    toggleMute
  } = useAudio();
  
  const { gameState } = useGameStateStore();
  
  // Initialize audio elements when component mounts
  useEffect(() => {
    // Background music
    if (!backgroundMusic) {
      const music = new Audio("/sounds/background.mp3");
      music.loop = true;
      music.volume = 0.3;
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
    
    // Unmute audio after user interaction
    const handleFirstInteraction = () => {
      toggleMute(); // This will toggle from default muted state to unmuted
      
      // Remove event listeners after first interaction
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
    
    // Add event listeners for first interaction
    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);
    
    // Clean up function
    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
      
      // Stop and clean up audio elements
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
      }
    };
  }, [
    backgroundMusic, 
    hitSound, 
    successSound,
    setBackgroundMusic, 
    setHitSound, 
    setSuccessSound,
    toggleMute
  ]);
  
  // Play/pause background music based on game state
  useEffect(() => {
    if (!backgroundMusic) return;
    
    // Obtener el estado actual de mute
    const isMuted = useAudio.getState().isMuted;
    
    // Asegurarnos de que el elemento de audio tenga el estado de mute correcto
    backgroundMusic.muted = isMuted;
    
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
