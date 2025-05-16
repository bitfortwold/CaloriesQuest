import { create } from "zustand";

interface AudioState {
  // Audio elements
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  voiceSound: HTMLAudioElement | null;
  
  // Audio states
  isMuted: boolean;        // Solo controla música de fondo
  isVoiceMuted: boolean;   // Controla efectos de voz
  volume: number;          // Volumen de música de fondo
  voiceVolume: number;     // Volumen de efectos de voz
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  setVoiceSound: (sound: HTMLAudioElement) => void;
  
  // Control functions para música de fondo
  toggleMute: () => void;
  increaseVolume: () => void;
  decreaseVolume: () => void;
  setVolume: (volume: number) => void;
  
  // Control functions para voces
  toggleVoiceMute: () => void;
  increaseVoiceVolume: () => void;
  decreaseVoiceVolume: () => void;
  setVoiceVolume: (volume: number) => void;
  
  // Reproducción de sonidos
  playHit: () => void;
  playSuccess: () => void;
  playVoice: (voiceFile: string) => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  voiceSound: null,
  
  isMuted: true, // Música de fondo inicialmente silenciada
  isVoiceMuted: false, // Voces inicialmente activadas
  volume: 0.5, // Volumen de música por defecto (0 a 1)
  voiceVolume: 0.8, // Volumen de voces por defecto (0 a 1)
  
  // Setter functions
  setBackgroundMusic: (music) => {
    set({ backgroundMusic: music });
    // Aplicar volumen y estado muted actuales
    const { volume, isMuted } = get();
    if (music) {
      music.volume = volume;
      music.muted = isMuted;
    }
  },
  
  setHitSound: (sound) => {
    set({ hitSound: sound });
    // Los sonidos de interacción usan el volumen de voces
    const { voiceVolume, isVoiceMuted } = get();
    if (sound) {
      sound.volume = voiceVolume;
      sound.muted = isVoiceMuted;
    }
  },
  
  setSuccessSound: (sound) => {
    set({ successSound: sound });
    // Los sonidos de éxito usan el volumen de voces
    const { voiceVolume, isVoiceMuted } = get();
    if (sound) {
      sound.volume = voiceVolume;
      sound.muted = isVoiceMuted;
    }
  },
  
  setVoiceSound: (sound) => {
    set({ voiceSound: sound });
    // Aplicar volumen y estado muted para voces
    const { voiceVolume, isVoiceMuted } = get();
    if (sound) {
      sound.volume = voiceVolume;
      sound.muted = isVoiceMuted;
    }
  },
  
  // Control de volumen de música de fondo
  setVolume: (newVolume) => {
    // Asegurar que el volumen esté entre 0 y 1
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    
    // Actualizar el estado del volumen
    set({ volume: clampedVolume });
    
    // Aplicar al elemento de música de fondo
    const { backgroundMusic } = get();
    if (backgroundMusic) {
      backgroundMusic.volume = clampedVolume;
    }
    
    console.log(`Music volume set to ${Math.round(clampedVolume * 100)}%`);
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
    
    // Actualizar el estado de mute para música
    set({ isMuted: newMutedState });
    
    // Aplicar mute/unmute al elemento de música
    if (backgroundMusic) {
      backgroundMusic.muted = newMutedState;
      
      // Si estamos desmutando, intentamos reproducir si estaba pausado
      if (!newMutedState && backgroundMusic.paused) {
        backgroundMusic.play().catch(err => console.log("Error playing background music:", err));
      }
    }
    
    // Registrar el cambio
    console.log(`Background music ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  // Control de volumen para voces y efectos
  setVoiceVolume: (newVolume) => {
    // Asegurar que el volumen esté entre 0 y 1
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    
    // Actualizar el estado del volumen de voz
    set({ voiceVolume: clampedVolume });
    
    // Aplicar a los elementos de sonido relacionados con la voz
    const { hitSound, successSound, voiceSound } = get();
    
    if (hitSound) {
      hitSound.volume = clampedVolume;
    }
    
    if (successSound) {
      successSound.volume = clampedVolume;
    }
    
    if (voiceSound) {
      voiceSound.volume = clampedVolume;
    }
    
    console.log(`Voice volume set to ${Math.round(clampedVolume * 100)}%`);
  },
  
  increaseVoiceVolume: () => {
    const { voiceVolume } = get();
    const newVolume = Math.min(1, voiceVolume + 0.1);
    get().setVoiceVolume(newVolume);
  },
  
  decreaseVoiceVolume: () => {
    const { voiceVolume } = get();
    const newVolume = Math.max(0, voiceVolume - 0.1);
    get().setVoiceVolume(newVolume);
  },
  
  toggleVoiceMute: () => {
    const { isVoiceMuted, hitSound, successSound, voiceSound } = get();
    const newMutedState = !isVoiceMuted;
    
    // Actualizar el estado de mute para voces
    set({ isVoiceMuted: newMutedState });
    
    // Aplicar mute/unmute a los elementos de sonido de voz
    if (hitSound) {
      hitSound.muted = newMutedState;
    }
    
    if (successSound) {
      successSound.muted = newMutedState;
    }
    
    if (voiceSound) {
      voiceSound.muted = newMutedState;
    }
    
    // Registrar el cambio
    console.log(`Voice sounds ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  // Reproducción de sonidos
  playHit: () => {
    const { hitSound, isVoiceMuted } = get();
    if (hitSound) {
      // Si las voces están silenciadas, no reproducir nada
      if (isVoiceMuted) {
        console.log("Hit sound skipped (voice muted)");
        return;
      }
      
      // Clonar el sonido para permitir reproducción superpuesta
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = get().voiceVolume * 0.7; // Ajustar volumen relativo
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isVoiceMuted } = get();
    if (successSound) {
      // Si las voces están silenciadas, no reproducir nada
      if (isVoiceMuted) {
        console.log("Success sound skipped (voice muted)");
        return;
      }
      
      successSound.currentTime = 0;
      successSound.volume = get().voiceVolume;
      successSound.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  },
  
  playVoice: (voiceFile) => {
    // Esta función permite reproducir archivos de voz específicos
    const { isVoiceMuted, voiceVolume } = get();
    
    // Si las voces están silenciadas, no reproducir nada
    if (isVoiceMuted) {
      console.log(`Voice playback skipped (voice muted): ${voiceFile}`);
      return;
    }
    
    // Crear un elemento de audio para la voz
    const voice = new Audio(voiceFile);
    voice.volume = voiceVolume;
    
    // Reproducir la voz
    voice.play().catch(error => {
      console.log(`Voice playback failed: ${voiceFile}`, error);
    });
    
    // Actualizar el elemento de voz actual
    set({ voiceSound: voice });
    
    return voice;
  }
}));
