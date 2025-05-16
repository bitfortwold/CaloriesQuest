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
    
    if (gameState === "playing" || gameState === "market" || gameState === "kitchen") {
      backgroundMusic.play().catch(error => {
        console.log("Background music play prevented:", error);
      });
    } else {
      backgroundMusic.pause();
    }
  }, [gameState, backgroundMusic]);
  
  // Render sound control UI
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        className="bg-black/70 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center"
        onClick={toggleMute}
        aria-label="Toggle Sound"
      >
        {useAudio.getState().isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        )}
      </button>
    </div>
  );
};

export default AudioManager;
