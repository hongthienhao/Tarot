import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, Check, X, Info } from 'lucide-react';
import useSoundStore from '../store/useSoundStore';
import ProtectedImage from './ProtectedImage';

const AstrolabeFan = ({ targetQuantity, onSelect }) => {
  const TOTAL_CARDS = 78;
  const { playSFX } = useSoundStore();

  // Rotation State (Angle in Degrees)
  const [rotationAngle, setRotationAngle] = useState(0);
  const [selectedCards, setSelectedCards] = useState([]); // indices of selected cards on the wheel
  const [focusedCardIndex, setFocusedCardIndex] = useState(null);

  // Responsive dynamic window width
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // DYNAMIC PIXEL-BASED SCALING & CLAMPING
  const { cardWidth, cardHeight, wheelRadius, maxVisibleAngle, anglePerCard } = useMemo(() => {
    let cWidth = 120;
    let radius = 920;
    let maxAngle = 22;

    if (windowWidth < 380) {
      cWidth = 68;
      radius = Math.max(460, Math.round(windowWidth * 1.35));
      const availableSpan = windowWidth - 56;
      const xMax = (availableSpan - cWidth) / 2;
      maxAngle = (Math.asin(Math.min(0.9, xMax / radius)) * 180) / Math.PI;
    } else if (windowWidth < 768) {
      cWidth = Math.min(78, Math.max(70, Math.round(windowWidth * 0.19)));
      radius = Math.max(540, Math.round(windowWidth * 1.4));
      const availableSpan = windowWidth - 64;
      const xMax = (availableSpan - cWidth) / 2;
      maxAngle = (Math.asin(Math.min(0.9, xMax / radius)) * 180) / Math.PI;
    } else {
      cWidth = 120;
      radius = 920;
      maxAngle = 22;
    }

    const cHeight = cWidth * 1.7;
    const aStep = isMobile ? 1.45 : 1.35;

    return {
      cardWidth: cWidth,
      cardHeight: cHeight,
      wheelRadius: radius,
      maxVisibleAngle: maxAngle,
      anglePerCard: aStep
    };
  }, [windowWidth, isMobile]);

  const totalArcSpan = TOTAL_CARDS * anglePerCard;

  // Drag & Interaction state
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const startAngleRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animFrameRef = useRef(null);
  const hasMovedSignificantlyRef = useRef(false);

  // Haptic feedback
  const triggerHaptic = (type = 'tick') => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (type === 'tick') navigator.vibrate(4);
        else if (type === 'focus') navigator.vibrate(12);
        else if (type === 'select') navigator.vibrate([25, 35, 25]);
        else if (type === 'cancel') navigator.vibrate(8);
      } catch (_) {}
    }
  };

  // Smooth Inertia
  const startInertia = (initialVelocity) => {
    const cappedVelocity = Math.max(-0.35, Math.min(0.35, initialVelocity));
    velocityRef.current = cappedVelocity;
    
    const step = () => {
      if (Math.abs(velocityRef.current) < 0.01) {
        velocityRef.current = 0;
        setRotationAngle(prev => prev); // Trigger final render to remove will-change
        return;
      }
      velocityRef.current *= 0.91;
      setRotationAngle(prev => {
        const next = prev + velocityRef.current;
        const minAngle = -(totalArcSpan / 2);
        const maxAngle = (totalArcSpan / 2);
        return Math.max(minAngle - 15, Math.min(maxAngle + 15, next));
      });
      animFrameRef.current = requestAnimationFrame(step);
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(step);
  };

  // Mouse / Touch Handlers
  const handlePointerDown = (e) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    isDraggingRef.current = true;
    hasMovedSignificantlyRef.current = false;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startPosRef.current = { x: clientX, y: clientY };
    startAngleRef.current = rotationAngle;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const now = performance.now();
    const dt = Math.max(1, now - lastTimeRef.current);
    const deltaX = clientX - startPosRef.current.x;

    if (Math.abs(deltaX) > 4) {
      hasMovedSignificantlyRef.current = true;
    }

    const sensitivity = isMobile ? 0.055 : 0.035;
    const rawAngle = startAngleRef.current + deltaX * sensitivity;
    
    const minAngle = -(totalArcSpan / 2);
    const maxAngle = (totalArcSpan / 2);
    const newAngle = Math.max(minAngle - 10, Math.min(maxAngle + 10, rawAngle));

    const instantVelocity = (deltaX * sensitivity) / dt * 8;
    velocityRef.current = instantVelocity;
    
    const prevCardStep = Math.round(rotationAngle / anglePerCard);
    const newCardStep = Math.round(newAngle / anglePerCard);
    if (prevCardStep !== newCardStep) {
      triggerHaptic('tick');
    }

    setRotationAngle(newAngle);
    lastTimeRef.current = now;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    
    if (Math.abs(velocityRef.current) > 0.06) {
      startInertia(velocityRef.current);
    } else {
      setRotationAngle(prev => prev); // Trigger final render to remove will-change
    }
  };

  // Fine Mouse Wheel
  const handleWheel = (e) => {
    e.preventDefault();
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const delta = e.deltaY * 0.008;
    setRotationAngle(prev => {
      const minAngle = -(totalArcSpan / 2);
      const maxAngle = (totalArcSpan / 2);
      return Math.max(minAngle, Math.min(maxAngle, prev - delta));
    });
    triggerHaptic('tick');
  };

  // Card Click Interaction
  const handleCardClick = (cardIndex) => {
    if (hasMovedSignificantlyRef.current) return;
    if (selectedCards.length >= targetQuantity || selectedCards.includes(cardIndex)) return;

    if (focusedCardIndex === cardIndex) {
      // Second tap -> Confirm Draw
      handleConfirmDraw(cardIndex);
    } else {
      // First tap -> Lift
      triggerHaptic('focus');
      setFocusedCardIndex(cardIndex);
    }
  };

  // Confirm Draw Action
  const handleConfirmDraw = (cardIndex = focusedCardIndex) => {
    if (cardIndex === null || selectedCards.length >= targetQuantity || selectedCards.includes(cardIndex)) return;
    triggerHaptic('select');
    
    setSelectedCards(prev => [...prev, cardIndex]);
    setFocusedCardIndex(null);
    
    // Notify parent component
    if (onSelect) {
      onSelect(cardIndex);
    }
  };

  // Cancel Focus
  const handleCancelFocus = () => {
    triggerHaptic('cancel');
    setFocusedCardIndex(null);
  };

  // Background Click
  const handleBackgroundClick = (e) => {
    if (focusedCardIndex !== null && !isDraggingRef.current && !hasMovedSignificantlyRef.current) {
      handleCancelFocus();
    }
  };

  // Render variables
  const visibleCards = [];
  const halfDeckOffset = (TOTAL_CARDS - 1) * anglePerCard / 2;

  for (let i = 0; i < TOTAL_CARDS; i++) {
    const cardBaseAngle = (i * anglePerCard) - halfDeckOffset;
    const relAngle = cardBaseAngle + rotationAngle;

    if (Math.abs(relAngle) <= maxVisibleAngle) {
      const rad = (relAngle * Math.PI) / 180;
      const x = Math.sin(rad) * wheelRadius;
      const y = wheelRadius - Math.cos(rad) * wheelRadius;
      const isSelected = selectedCards.includes(i);
      const isFocused = focusedCardIndex === i;

      const normAngle = Math.abs(relAngle) / maxVisibleAngle;
      const smoothCosineOpacity = Math.max(0, Math.cos(normAngle * (Math.PI / 2)));
      const cardOpacity = isSelected ? 0 : isFocused ? 1 : smoothCosineOpacity;

      visibleCards.push({
        index: i,
        relAngle,
        x,
        y,
        isSelected,
        isFocused,
        opacity: cardOpacity,
        zIndex: isFocused ? 9999 : isSelected ? 1 : i + 10,
      });
    }
  }

  const minAngle = -(totalArcSpan / 2);
  const maxAngle = (totalArcSpan / 2);
  const progressRatio = Math.max(0, Math.min(1, (rotationAngle - minAngle) / (maxAngle - minAngle || 1)));

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackgroundClick}
      className="w-full min-h-[75vh] flex flex-col items-center justify-center select-none overflow-visible relative pb-10"
    >
      {/* Background Ambience specific to the Astrolabe */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl -z-10">
      </div>

      {/* Header Info */}
      <div className="w-full max-w-4xl flex flex-col items-center text-center z-10 mb-4 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mystic-purple/60 border border-mystic-gold/40 text-mystic-gold text-xs font-semibold uppercase tracking-widest mb-3 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
          <Compass size={14} className="animate-spin-slow" />
          Vòng Xoay Chiêm Tinh Vũ Trụ
        </div>
        <p className="text-gray-400 text-sm md:text-base font-light">
          {focusedCardIndex !== null
            ? '✨ Chạm "Rút lá này" (hoặc chạm lại vào lá bài) để xác nhận'
            : `Hãy hít thở sâu, tập trung vào câu hỏi và rút ${targetQuantity} lá bài mà bạn cảm thấy kết nối nhất.`}
        </p>
      </div>

      {/* Drawn Cards Tray Indicator */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[90%] md:max-w-xl flex flex-col items-center justify-center px-6 py-4 rounded-2xl bg-mystic-dark/95 border border-mystic-gold/30 z-20 my-4 shadow-xl gap-4"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-mystic-gold animate-pulse" />
          <span className="text-sm text-gray-300 font-medium">Khay bài:</span>
          <span className="px-2 py-0.5 rounded bg-mystic-gold/20 text-mystic-gold text-sm font-bold">
            {selectedCards.length} / {targetQuantity}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2.5">
          {Array.from({ length: targetQuantity }).map((_, i) => {
            const isDrawn = selectedCards[i] !== undefined;
            return (
              <div
                key={i}
                className={`relative w-8 h-12 md:w-10 md:h-14 rounded-md border transition-all duration-300 overflow-hidden ${
                  isDrawn
                    ? 'border-mystic-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]'
                    : 'border-dashed border-gray-600 bg-mystic-purple/20'
                }`}
              >
                {isDrawn && (
                  <>
                    <ProtectedImage 
                      src="/assets/cards/card_back.jpeg" 
                      alt="Drawn Card" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-mystic-gold/20 mix-blend-overlay" />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ROTARY DENSE ARC CONTAINER */}
      <div className="w-full flex items-center justify-center relative mt-4 md:mt-8 mb-2 overflow-visible">
        <div
          className="relative w-full flex items-start justify-center cursor-grab active:cursor-grabbing select-none touch-none overflow-visible"
          style={{ height: cardHeight + 60 }}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          onWheel={handleWheel}
        >
          {/* Dense Cascaded Cards */}
          <div className="relative w-full h-full flex items-center justify-center overflow-visible">
            {visibleCards.map((card) => {
              const isFocused = card.isFocused;

              return (
                <div
                  key={card.index}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    position: 'absolute',
                    top: '0px',
                    left: '50%',
                    transformOrigin: `center ${wheelRadius}px`,
                    transform: `translate3d(calc(-50% + ${card.x}px), ${isFocused ? card.y - 32 : card.y}px, 0) rotate(${card.relAngle}deg) scale(${
                      card.isSelected ? 1.4 : isFocused ? 1.12 : 1
                    })`,
                    opacity: card.opacity,
                    zIndex: card.zIndex,
                    transition: isDraggingRef.current 
                      ? 'none' 
                      : 'transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.3s ease, box-shadow 0.25s ease',
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden',
                    willChange: (isDraggingRef.current || Math.abs(velocityRef.current) >= 0.01) ? 'transform, opacity' : 'auto',
                  }}
                  className="flex flex-col items-center justify-start overflow-visible"
                >
                  {/* CARD BODY */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(card.index);
                    }}
                    className={`relative w-full h-full rounded-xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-300 ${
                      isFocused
                        ? 'border-2 border-mystic-gold shadow-[0_0_30px_rgba(212,175,55,0.9)]'
                        : 'border border-mystic-gold/25'
                    } bg-mystic-dark`}
                  >
                    <ProtectedImage
                      src="/assets/cards/card_back.jpeg"
                      alt="Tarot Card Back"
                      className="w-full h-full object-cover pointer-events-none select-none"
                    />

                    {/* Subtle Mystic Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-mystic-purple/60 to-transparent pointer-events-none opacity-40" />

                    {/* Golden Focus Glow */}
                    {isFocused && (
                      <div className="absolute inset-0 bg-mystic-gold/25 pointer-events-none animate-pulse" />
                    )}

                    {/* Gold Flash on Draw */}
                    {card.isSelected && (
                      <div className="absolute inset-0 bg-mystic-gold opacity-90 pointer-events-none" />
                    )}
                  </div>

                  {/* FLOATING ACTION BUTTONS */}
                  <AnimatePresence>
                    {isFocused && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 12, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-full flex items-center gap-1.5 p-1.5 rounded-full bg-mystic-dark/95 border border-mystic-gold/50 shadow-[0_4px_25px_rgba(0,0,0,0.8)] whitespace-nowrap z-50 pointer-events-auto"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelFocus();
                          }}
                          className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-full bg-mystic-wine/90 border border-mystic-gold/40 text-mystic-gold hover:bg-mystic-wine hover:border-mystic-gold text-xs font-semibold tracking-wider transition-all active:scale-95 shadow-sm"
                        >
                          <X size={12} />
                          <span>Hạ bài</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmDraw(card.index);
                          }}
                          className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-mystic-gold via-yellow-400 to-amber-500 text-mystic-dark text-xs font-bold tracking-wider hover:shadow-[0_0_15px_rgba(212,175,55,0.8)] transition-all active:scale-95 shadow-md"
                        >
                          <Sparkles size={12} className="fill-mystic-dark" />
                          <span>Rút lá này</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FOOTER CONTROLS & ASTROLABE RADAR MINI-MAP */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl flex items-center justify-center mt-6 z-30 px-4"
      >
        <div className="flex flex-col items-center">
          <div className="text-[10px] uppercase font-bold tracking-widest text-mystic-gold/70 mb-2 flex items-center gap-1.5">
            <Compass size={12} /> La Bàn Chiêm Tinh
          </div>

          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border border-mystic-gold/40 bg-mystic-dark/95 shadow-[0_0_25px_rgba(0,0,0,0.8)] p-1.5 flex items-center justify-center">
            <div className="absolute inset-2 rounded-full border border-dashed border-mystic-gold/25 pointer-events-none" />
            <div className="absolute inset-5 md:inset-6 rounded-full border border-mystic-gold/15 pointer-events-none" />
            
            {/* Radar FOV Viewing Wedge */}
            <div
              className="absolute inset-0 pointer-events-none transition-transform duration-75"
              style={{ transform: `rotate(${-(progressRatio - 0.5) * 110}deg)` }}
            >
              <div className="w-full h-full flex items-start justify-center">
                <div className="w-0 h-0 border-l-[14px] md:border-l-[16px] border-l-transparent border-r-[14px] md:border-r-[16px] border-r-transparent border-t-[50px] md:border-t-[56px] border-t-mystic-gold/30" />
              </div>
            </div>

            {/* 24 Faint Notches for Navigation */}
            {Array.from({ length: 24 }).map((_, i) => {
              const deg = -55 + (i * 110) / 23;
              return (
                <div
                  key={`notch-${i}`}
                  onClick={() => {
                    const targetAngle = minAngle + (i / 23) * (maxAngle - minAngle);
                    setRotationAngle(targetAngle);
                    setFocusedCardIndex(null);
                    triggerHaptic('select');
                  }}
                  className="absolute w-1 h-1 rounded-full cursor-pointer hover:scale-150 transition-transform opacity-30"
                  style={{
                    transform: `rotate(${deg}deg) translate(0, ${isMobile ? '-42px' : '-48px'})`,
                    backgroundColor: 'rgba(212,175,55,0.6)',
                  }}
                  title="Nhấp để chuyển nhanh tới cung này"
                />
              );
            })}

            {/* Drawn Cards Glowing Dots */}
            {selectedCards.map((cardIndex) => {
              const deg = -55 + (cardIndex * 110) / (TOTAL_CARDS - 1);
              return (
                <div
                  key={`drawn-${cardIndex}`}
                  className="absolute w-2 h-2 rounded-full bg-mystic-gold shadow-[0_0_8px_#d4af37,0_0_15px_#d4af37] z-10 animate-pulse pointer-events-none"
                  style={{
                    transform: `rotate(${deg}deg) translate(0, ${isMobile ? '-42px' : '-48px'})`,
                  }}
                />
              );
            })}

            {/* Center Core */}
            <div className="relative w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-mystic-purple to-mystic-dark border border-mystic-gold/60 flex items-center justify-center shadow-inner">
              <div className="w-1.5 h-1.5 rounded-full bg-mystic-gold shadow-[0_0_6px_#d4af37]" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AstrolabeFan;
