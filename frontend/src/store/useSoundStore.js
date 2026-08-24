import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  setSFXVolume,
  initAudioContext
} from '../utils/soundEngine';

const useSoundStore = create(
  persist(
    (set, get) => ({
      sfxEnabled: true,
      sfxVolume: 0.5,

      // Actions
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

      setSFXVolume: (volume) => {
        const vol = Math.max(0, Math.min(1, volume));
        set({ sfxVolume: vol });

        if (get().sfxEnabled) {
          setSFXVolume(vol);
        }
      },

      // Initialize the audio settings on first user interaction
      initSound: () => {
        const { sfxEnabled, sfxVolume } = get();

        // Setup initial SFX volume inside synthesizer
        setSFXVolume(sfxEnabled ? sfxVolume : 0.0);
      }
    }),
    {
      name: 'tarot-sound-storage', // Key name in LocalStorage
      partialize: (state) => ({
        sfxEnabled: state.sfxEnabled,
        sfxVolume: state.sfxVolume
      }),
    }
  )
);

export default useSoundStore;
export { playSFX } from '../utils/soundEngine';
export { initAudioContext } from '../utils/soundEngine';
