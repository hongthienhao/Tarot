import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  startAmbientMusic, 
  stopAmbientMusic, 
  setMusicVolume, 
  setSFXVolume,
  initAudioContext
} from '../utils/soundEngine';

const useSoundStore = create(
  persist(
    (set, get) => ({
      musicEnabled: false,
      sfxEnabled: true,
      musicVolume: 0.3,
      sfxVolume: 0.5,

      // Actions
      toggleMusic: () => {
        const { musicEnabled, musicVolume } = get();
        const nextState = !musicEnabled;
        
        set({ musicEnabled: nextState });

        // Synchronize with synthesizer
        if (nextState) {
          // Initialize AudioContext on user gesture
          initAudioContext();
          setMusicVolume(musicVolume);
          startAmbientMusic();
        } else {
          stopAmbientMusic();
        }
      },

      toggleSFX: () => {
        const { sfxEnabled, sfxVolume } = get();
        const nextState = !sfxEnabled;
        
        set({ sfxEnabled: nextState });
        
        // Sync SFX volume setting
        if (nextState) {
          setSFXVolume(sfxVolume);
        } else {
          setSFXVolume(0.0);
        }
      },

      setMusicVolume: (volume) => {
        const vol = Math.max(0, Math.min(1, volume));
        set({ musicVolume: vol });
        
        if (get().musicEnabled) {
          setMusicVolume(vol);
        }
      },

      setSFXVolume: (volume) => {
        const vol = Math.max(0, Math.min(1, volume));
        set({ sfxVolume: vol });
        
        if (get().sfxEnabled) {
          setSFXVolume(vol);
        }
      },

      // Initialize the audio settings on first user interaction
      initSound: () => {
        const { musicEnabled, sfxEnabled, musicVolume, sfxVolume } = get();
        
        // Setup initial volume levels inside synthesizer
        setMusicVolume(musicVolume);
        setSFXVolume(sfxEnabled ? sfxVolume : 0.0);

        if (musicEnabled) {
          // Try to start ambient music if enabled
          try {
            startAmbientMusic();
          } catch (e) {
            console.warn('AudioContext failed to autoplay ambient music. Will resume on first gesture.', e);
          }
        }
      }
    }),
    {
      name: 'tarot-sound-storage', // Key name in LocalStorage
      partialize: (state) => ({ 
        musicEnabled: state.musicEnabled, 
        sfxEnabled: state.sfxEnabled,
        musicVolume: state.musicVolume,
        sfxVolume: state.sfxVolume
      }),
    }
  )
);

export default useSoundStore;
export { playSFX } from '../utils/soundEngine';
export { initAudioContext } from '../utils/soundEngine';
