import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TarotCard = ({ card, index, onFlip, isRevealed: controlledIsRevealed, isSelectable = true }) => {
  const [localIsFlipped, setLocalIsFlipped] = useState(false);
  const isFlipped = controlledIsRevealed !== undefined ? controlledIsRevealed : localIsFlipped;

  const handleFlip = () => {
    if (!isFlipped && isSelectable) {
      if (controlledIsRevealed === undefined) {
        setLocalIsFlipped(true);
      }
      if (onFlip) onFlip(card);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.8, 
        type: "spring", 
        stiffness: 50 
      }}
      className="relative w-full max-w-none aspect-[1/1.7] perspective-1000 cursor-pointer group mx-auto"
      onClick={handleFlip}
    >
      <motion.div
        animate={{ 
          rotateY: isFlipped ? 180 : 0,
          rotateZ: isFlipped && card.isReversed ? 180 : 0
        }}
        transition={{ 
          duration: 0.8, 
          type: "spring", 
          stiffness: 60,
          rotateZ: { delay: 0.3, duration: 0.6 }
        }}
        className="w-full h-full relative preserve-3d shadow-2xl rounded-2xl"
      >
        {/* Front (Initially Hidden) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden border-2 border-mystic-gold/40 bg-mystic-dark">
          <img 
            src={card.image} 
            alt={card.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://placehold.co/400x600/1a0b2e/d4af37?text=Tarot+Card';
            }}
          />
          
          {/* Subtle overlay for depth, but no text */}
          <div className={`absolute inset-0 bg-gradient-to-t from-mystic-dark/40 via-transparent to-transparent opacity-60`} />
        </div>

        {/* Back (Initially Visible) */}

        <div className="absolute inset-0 backface-hidden rounded-2xl border-2 border-mystic-gold/40 bg-mystic-dark flex items-center justify-center overflow-hidden">
          <img 
            src="/assets/cards/card_back.jpeg" 
            alt="Tarot Card Back" 
            className="w-full h-full object-cover"
          />
          
          {/* Subtle Glow Overlay */}
          <div className="absolute inset-0 bg-mystic-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Decorative Corners for extra premium feel */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-mystic-gold/40 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-mystic-gold/40 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-mystic-gold/40 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-mystic-gold/40 rounded-br-sm pointer-events-none" />
        </div>
      </motion.div>

      {/* Hover Instruction */}
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
