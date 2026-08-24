import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Sparkles, X, Sliders } from 'lucide-react';
import useSoundStore, { initAudioContext } from '../../store/useSoundStore';

const AudioController = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const {
    sfxEnabled,
    sfxVolume,
    toggleSFX,
    setSFXVolume
  } = useSoundStore();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleSFX = () => {
    initAudioContext();
    toggleSFX();
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-[999] flex flex-col items-end"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mb-4 w-72 glass border border-mystic-gold/25 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden"
          >
            {/* Ambient gold glow in panel background */}
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-mystic-gold/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-mystic-purple/25 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-center mb-1 pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-mystic-gold" />
                <span className="text-xs font-serif uppercase tracking-widest gold-text font-bold">Tần Số Âm Thanh</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <span className="font-accent italic text-[10px] text-mystic-gold/50 mb-4 block tracking-wider">
              "Giai điệu dẫn lối cho trực giác"
            </span>

            {/* SFX Controller */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${sfxEnabled ? 'text-mystic-gold animate-pulse' : 'text-white/30'}`} />
                  <span className="text-[11px] font-medium text-gray-300 tracking-wider">Hiệu Ứng Lật/Xào</span>
                </div>
                <button
                  onClick={handleToggleSFX}
                  className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer ${
                    sfxEnabled
                      ? 'bg-mystic-gold/25 border border-mystic-gold text-mystic-gold shadow-[0_0_10px_rgba(212,175,55,0.25)]'
                      : 'bg-white/5 border border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  {sfxEnabled ? 'Bật' : 'Tắt'}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleSFX}
                  className="text-white/40 hover:text-mystic-gold transition-colors"
                >
                  {sfxVolume === 0 || !sfxEnabled ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={sfxVolume}
                  disabled={!sfxEnabled}
                  onChange={(e) => setSFXVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-mystic-gold disabled:opacity-30"
                  style={{
                    background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${sfxVolume * 100}%, rgba(255,255,255,0.05) ${sfxVolume * 100}%, rgba(255,255,255,0.05) 100%)`
                  }}
                />
                <span className="text-[9px] font-mono text-gray-500 w-6 text-right">
                  {Math.round(sfxVolume * 100)}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Capsule trigger button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.5)] border transition-all duration-500 backdrop-blur-md bg-mystic-purple/40 hover:bg-mystic-purple/60 border-mystic-gold/30 text-mystic-gold"
      >
        <Sparkles className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default AudioController;
