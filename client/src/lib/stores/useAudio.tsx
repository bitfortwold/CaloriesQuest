import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  isMuted: boolean;
  volume: number;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  increaseVolume: () => void;
  decreaseVolume: () => void;
  setVolume: (volume: number) => void;
  playHit: () => void;
  playSuccess: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  isMuted: true, // Start muted by default
  volume: 0.5, // Default volume (0 to 1)
  
  setBackgroundMusic: (music) => {
    set({ backgroundMusic: music });
    // Apply current volume to the music
    const { volume, isMuted } = get();
    if (music) {
      music.volume = volume;
      music.muted = isMuted;
    }
  },
  
  setHitSound: (sound) => {
    set({ hitSound: sound });
    // Apply current volume to the sound
    const { volume } = get();
    if (sound) {
      sound.volume = volume;
    }
  },
  
  setSuccessSound: (sound) => {
    set({ successSound: sound });
    // Apply current volume to the sound
    const { volume } = get();
    if (sound) {
      sound.volume = volume;
    }
  },
  
  setVolume: (newVolume) => {
    // Ensure volume is between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    
    // Update volume state
    set({ volume: clampedVolume });
    
    // Apply to all audio elements
    const { backgroundMusic, hitSound, successSound } = get();
    
    if (backgroundMusic) {
      backgroundMusic.volume = clampedVolume;
    }
    
    if (hitSound) {
      hitSound.volume = clampedVolume;
    }
    
    if (successSound) {
      successSound.volume = clampedVolume;
    }
    
    console.log(`Volume set to ${Math.round(clampedVolume * 100)}%`);
  },
  
  increaseVolume: () => {
    const { volume } = get();
    const newVolume = Math.min(1, volume + 0.1);
    get().setVolume(newVolume);
  },
  
  decreaseVolume: () => {
    const { volume } = get();
    const newVolume = Math.max(0, volume - 0.1);
    get().setVolume(newVolume);
  },
  
  toggleMute: () => {
    const { isMuted, backgroundMusic } = get();
    const newMutedState = !isMuted;
    
    // Update the muted state
    set({ isMuted: newMutedState });
    
    // Actually apply mute/unmute to the audio element
    if (backgroundMusic) {
      backgroundMusic.muted = newMutedState;
      
      // Si estamos desmutando, intentamos reproducir si estaba pausado
      if (!newMutedState && backgroundMusic.paused) {
        backgroundMusic.play().catch(err => console.log("Error playing background music:", err));
      }
    }
    
    // Log the change
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Hit sound skipped (muted)");
        return;
      }
      
      // Clone the sound to allow overlapping playback
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Success sound skipped (muted)");
        return;
      }
      
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  }
}));
