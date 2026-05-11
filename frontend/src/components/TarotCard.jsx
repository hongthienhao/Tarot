import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Rune symbols for the float-up particle effect (Phase 3)
const RUNE_CHARS = ['✦', '✧', '⚝', '✴', '★', '✶', '⋆', '✺'];
const RUNE_POSITIONS = [
  { x: '10%', delay: 0.0 }, { x: '25%', delay: 0.1 }, { x: '42%', delay: 0.05 },
  { x: '58%', delay: 0.15 }, { x: '74%', delay: 0.08 }, { x: '88%', delay: 0.12 },
];

const TarotCard = ({ card, index, onFlip, isRevealed: controlledIsRevealed, isSelectable = true }) => {
  const [localIsFlipped, setLocalIsFlipped] = useState(false);
  const isFlipped = controlledIsRevealed !== undefined ? controlledIsRevealed : localIsFlipped;

  // Phase 3 effect states
  const [justFlipped, setJustFlipped] = useState(false);
  const [showRunes, setShowRunes] = useState(false);

  useEffect(() => {
    if (isFlipped) {
      // Glow burst fires when flip starts completing (~0.7s flip duration)
      const t1 = setTimeout(() => setJustFlipped(true), 700);
      // Runes appear slightly after
      const t2 = setTimeout(() => setShowRunes(true), 850);
      // Glow fades after 2s
      const t3 = setTimeout(() => setJustFlipped(false), 2700);
      // Runes done at 2.5s
      const t4 = setTimeout(() => setShowRunes(false), 2500);
      return () => [t1, t2, t3, t4].forEach(clearTimeout);
    }
  }, [isFlipped]);

  const handleFlip = () => {
    if (!isFlipped && isSelectable) {
      if (controlledIsRevealed === undefined) setLocalIsFlipped(true);
      if (onFlip) onFlip(card);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8, type: 'spring', stiffness: 50 }}
      className="relative w-full max-w-none aspect-[1/1.7] perspective-1000 cursor-pointer group mx-auto"
      onClick={handleFlip}
    >
      <motion.div
        animate={{
          rotateY: isFlipped ? 180 : 0,
          rotateZ: isFlipped && card.isReversed ? 180 : 0,
        }}
        transition={{
          duration: 0.8, type: 'spring', stiffness: 60,
          rotateZ: { delay: 0.3, duration: 0.6 },
        }}
        className="w-full h-full relative preserve-3d shadow-2xl rounded-2xl"
      >
        {/* Front face (revealed) */}
        <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden bg-mystic-dark border-2 transition-all duration-700 ${
          justFlipped ? 'border-mystic-gold shadow-[0_0_60px_rgba(212,175,55,0.6)]' : 'border-mystic-gold/40'
        }`}>
          <img
            src={card.image} alt={card.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://placehold.co/400x600/1a0b2e/d4af37?text=Tarot+Card'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-mystic-dark/40 via-transparent to-transparent opacity-60" />

          {/* Glow Burst — radial light that expands then fades */}
          <AnimatePresence>
            {justFlipped && (
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{ background: 'radial-gradient(circle at center, rgba(212,175,55,0.55) 0%, rgba(212,175,55,0.15) 50%, transparent 75%)' }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 1, 0.6, 0], scale: [0.5, 1.1, 1.4, 2] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, ease: 'easeOut', times: [0, 0.15, 0.5, 1] }}
              />
            )}
          </AnimatePresence>

          {/* Border shimmer sweep */}
          <AnimatePresence>
            {justFlipped && (
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ boxShadow: 'inset 0 0 40px rgba(212,175,55,0.5)', animation: 'shimmerBorder 2s ease-out forwards' }}
                exit={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Back face */}
        <div className="absolute inset-0 backface-hidden rounded-2xl border-2 border-mystic-gold/40 bg-mystic-dark flex items-center justify-center overflow-hidden">
          <img src="/assets/cards/card_back.jpeg" alt="Tarot Card Back" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-mystic-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-mystic-gold/40 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-mystic-gold/40 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-mystic-gold/40 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-mystic-gold/40 rounded-br-sm pointer-events-none" />
        </div>
      </motion.div>

      {/* Rune Particles — float up from the card after reveal */}
      <AnimatePresence>
        {showRunes && (
          <div className="absolute inset-0 pointer-events-none overflow-visible z-20">
            {RUNE_POSITIONS.map((pos, i) => (
              <motion.span
                key={i}
                className="absolute bottom-4 text-mystic-gold font-bold select-none"
                style={{
                  left: pos.x,
                  fontSize: `${10 + (i % 3) * 4}px`,
                  animation: `runeFloat ${1.4 + i * 0.15}s ease-out ${pos.delay}s forwards`,
                  opacity: 0,
                  animationFillMode: 'forwards',
                }}
              >
                {RUNE_CHARS[i]}
              </motion.span>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Scale bounce on flip complete */}
      <AnimatePresence>
        {justFlipped && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.04, 0.98, 1.01, 1] }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Hover instruction */}
      {!isFlipped && isSelectable && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-8 left-0 right-0 text-center pointer-events-none"
        >
          <span className="text-[9px] text-mystic-gold/60 uppercase tracking-[0.3em] animate-pulse">
            Chạm để lật
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TarotCard;
