import React, { useState, useRef, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

const CardFan = ({ count = 78, onSelect, isDrawing }) => {
  const containerRef = useRef(null);
  const [activeLayerIndex, setActiveLayerIndex] = useState(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const fanRadius = isMobile ? 600 : 900;
  const fanArcAngle = isMobile ? 60 : 65;
  const cardWidth = isMobile ? 77 : 126;
  const cardHeight = cardWidth * 1.7;
  
  const estimatedWidth = (fanRadius * Math.sin((fanArcAngle/2) * Math.PI / 180) * 2) + cardWidth;
  const scale = Math.min(1.0, (windowWidth - 40) / estimatedWidth);

  const layers = [
    { id: 0, start: 0, end: 25, yOffset: isMobile ? -210 : -280 },
    { id: 1, start: 26, end: 51, yOffset: 0 },
    { id: 2, start: 52, end: 77, yOffset: isMobile ? 210 : 280 },
  ];

  const handleTouchEnd = () => {
    if (!isDrawing) {
      if (hoveredCardIndex !== null) {
        onSelect(hoveredCardIndex);
      }
      setHoveredCardIndex(null);
      setActiveLayerIndex(null);
    }
  };

  // Add a global window listener to catch fast mouse movements leaving the area
  useEffect(() => {
    const handleWindowMouseMove = (e) => {
      if (!containerRef.current || isMobile) return;
      const rect = containerRef.current.getBoundingClientRect();
      // If mouse is far outside the container, clear everything
      const padding = 100;
      if (
        e.clientX < rect.left - padding || 
        e.clientX > rect.right + padding || 
        e.clientY < rect.top - padding || 
        e.clientY > rect.bottom + padding
      ) {
        if (activeLayerIndex !== null || hoveredCardIndex !== null) {
          setActiveLayerIndex(null);
          setHoveredCardIndex(null);
        }
      }
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, [activeLayerIndex, hoveredCardIndex, isMobile]);

  const detectInteraction = (px, py) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const dx = (px - centerX) / scale;
    const dy = (py - centerY) / scale;
    
    let foundLayerIdx = null;
    let foundCardIdx = null;

    const getLayerHit = (layer, isCurrentlyActive) => {
      const relativeYInLayer = dy - layer.yOffset;
      const arcDy = relativeYInLayer - fanRadius;
      const dist = Math.sqrt(dx * dx + arcDy * arcDy);
      const ang = Math.atan2(dx, -arcDy) * (180 / Math.PI);

      // Active layer padding
      const rPadding = isCurrentlyActive ? 70 : 40;
      const aPadding = isCurrentlyActive ? 22 : 12;

      const isWithinRadius = Math.abs(dist - fanRadius) < (cardHeight / 2 + rPadding);
      const isWithinAngle = Math.abs(ang) < (fanArcAngle / 2 + aPadding);

      if (isWithinRadius && isWithinAngle) {
        const normalized = Math.max(0, Math.min(1, (ang + fanArcAngle / 2) / fanArcAngle));
        const idxInLayer = Math.round(normalized * 25);
        return { hit: true, cardIdx: layer.start + idxInLayer };
      }
      return { hit: false };
    };

    // 1. Check current active layer first
    if (activeLayerIndex !== null) {
      const activeHit = getLayerHit(layers[activeLayerIndex], true);
      if (activeHit.hit) {
        foundLayerIdx = activeLayerIndex;
        foundCardIdx = activeHit.cardIdx;
      }
    }

    // 2. Check other layers if no active hit
    if (foundLayerIdx === null) {
      for (const layer of layers) {
        const result = getLayerHit(layer, false);
        if (result.hit) {
          foundLayerIdx = layer.id;
          foundCardIdx = result.cardIdx;
          break;
        }
      }
    }

    // Explicitly set to null if nothing found to clear any stuck states
    setActiveLayerIndex(foundLayerIdx);
    setHoveredCardIndex(foundCardIdx);
  };

  const handleMouseMove = (e) => {
    if (isMobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    detectInteraction(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleTouch = (e) => {
    if (!isMobile || !containerRef.current || isDrawing) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    detectInteraction(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  return (
    <div 
      className="relative w-full h-[700px] md:h-[1050px] flex flex-col items-center justify-center overflow-visible select-none touch-none"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setHoveredCardIndex(null);
        setActiveLayerIndex(null);
      }}
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div 
        style={{ scale }}
        className="relative w-full h-full flex flex-col items-center justify-center overflow-visible"
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[800px] bg-mystic-purple/10 blur-[150px] rounded-full" />
        </div>

        {layers.map((layer) => (
          <div 
            key={layer.id} 
            className="absolute w-full flex items-center justify-center overflow-visible"
            style={{ 
              transform: `translateY(${layer.yOffset}px)`,
              zIndex: activeLayerIndex === layer.id ? 1000 : (layer.id * 10)
            }}
          >
            {Array.from({ length: 26 }).map((_, i) => {
              const cardIndex = layer.start + i;
              const angleStep = fanArcAngle / 25;
              const startAngle = -fanArcAngle / 2;
              const angleInDegrees = startAngle + i * angleStep;
              const angleInRadians = (angleInDegrees * Math.PI) / 180;

              const x = Math.sin(angleInRadians) * fanRadius;
              const y = (fanRadius - Math.cos(angleInRadians) * fanRadius);

              return (
                <FanCard
                  key={cardIndex}
                  index={cardIndex}
                  layerIndex={layer.id}
                  activeLayerIndex={activeLayerIndex}
                  isActiveLayer={layer.id === activeLayerIndex}
                  // Enforce reset: if no layer is active, no card should be hovered
                  hoveredCardIndex={activeLayerIndex === null ? null : hoveredCardIndex}
                  x={x}
                  y={y}
                  rotation={angleInDegrees}
                  onSelect={() => !isDrawing && onSelect(cardIndex)}
                  isDrawing={isDrawing}
                  width={cardWidth}
                  isMobile={isMobile}
                />
              );
            })}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const FanCard = ({ index, layerIndex, activeLayerIndex, isActiveLayer, hoveredCardIndex, x, y, rotation, onSelect, isDrawing, width, isMobile }) => {
  const isHovered = hoveredCardIndex === index;
  const isNeighbor = hoveredCardIndex !== null && Math.abs(hoveredCardIndex - index) <= 2 && Math.floor(hoveredCardIndex / 26) === Math.floor(index / 26);
  
  let pushX = 0;
  let pushRotate = 0;
  if (isNeighbor && !isHovered) {
    const diff = index - hoveredCardIndex;
    const strength = 3 - Math.abs(diff);
    pushX = diff * strength * (isMobile ? 22 : 45);
    pushRotate = diff * strength * 5;
  }

  const springConfig = { stiffness: 600, damping: 45 };
  const scale = isHovered ? (isMobile ? 1.5 : 1.8) : (isNeighbor ? 0.85 : 1);
  const zIndex = isHovered ? 9000 : (layerIndex * 100 + index);
  
  // Stays on the arc, no jumping out
  const displayY = y; 
  const displayX = x + pushX;
  const displayRotate = rotation + pushRotate;

  return (
    <motion.div
      onTap={() => !isMobile && !isDrawing && isActiveLayer && onSelect()}
      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
      animate={{ 
        opacity: (activeLayerIndex === null || isActiveLayer) ? 1 : 0.3, 
        x: displayX, 
        y: displayY,
        rotate: displayRotate,
        scale,
        zIndex,
      }}
      transition={{ 
        type: "spring",
        ...springConfig,
        opacity: { duration: 0.2 },
        // Ripple effect: start from middle layer (1) and middle card (12.5)
        delay: (Math.abs(layerIndex - 1) * 0.15) + (Math.abs((index % 26) - 12.5) * 0.025)
      }}
      style={{ 
        width: width,
        filter: isHovered ? 'brightness(1.2) contrast(1.1)' : `brightness(${(activeLayerIndex === null || isActiveLayer) ? 1.0 : 0.3})`,
        pointerEvents: isActiveLayer ? 'auto' : 'none',
        transformOrigin: "center center"
      }}
      className="absolute aspect-[1/1.7] cursor-pointer touch-none transition-filter duration-500"
    >
      <div className={`w-full h-full rounded-xl md:rounded-2xl border ${isHovered ? 'border-mystic-gold shadow-[0_0_50px_rgba(212,175,55,0.4)]' : 'border-mystic-gold/15'} overflow-hidden shadow-2xl relative bg-mystic-dark`}>
        <img src="/assets/cards/card_back.jpeg" alt="Card Back" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-mystic-purple/90 to-transparent opacity-60" />
        
        {isHovered && (
          <>
            {/* Radial Ripple effect from center */}
            <motion.div 
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 bg-mystic-gold/30 rounded-full blur-2xl pointer-events-none"
              style={{ left: '10%', top: '10%', right: '10%', bottom: '10%' }}
            />
            <motion.div 
              layoutId="glow"
              className="absolute inset-0 ring-2 ring-mystic-gold rounded-xl md:rounded-2xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          </>
        )}
      </div>
    </motion.div>
  );
};

export default CardFan;
