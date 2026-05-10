import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const CardFan = ({ count = 78, onSelect, isDrawing }) => {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Constants that adjust based on window width
  const isMobile = windowWidth < 768;
  const radius = isMobile ? 1200 : 2500; 
  const arcAngle = isMobile ? 50 : 25;  
  const cardWidth = isMobile ? 100 : 160; 
  const cardHeight = isMobile ? 160 : 260;

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const cards = Array.from({ length: count });

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[300px] md:h-[450px] flex items-center justify-center overflow-visible mt-10 md:mt-20 mb-10 md:mb-20"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-mystic-purple/20 blur-[60px] md:blur-[120px] rounded-full" />
      </div>

      {cards.map((_, index) => {
        const angleStep = arcAngle / (count - 1);
        const startAngle = -arcAngle / 2;
        const angleInDegrees = startAngle + index * angleStep;
        const angleInRadians = (angleInDegrees * Math.PI) / 180;

        const x = Math.sin(angleInRadians) * radius;
        const y = radius - Math.cos(angleInRadians) * radius;

        return (
          <FanCard
            key={index}
            index={index}
            x={x}
            y={y}
            rotation={angleInDegrees}
            mouseX={mouseX}
            mouseY={mouseY}
            containerRef={containerRef}
            onSelect={() => !isDrawing && onSelect(index)}
            isDrawing={isDrawing}
            width={cardWidth}
          />
        );
      })}
    </div>
  );
};

const FanCard = ({ index, x, y, rotation, mouseX, mouseY, containerRef, onSelect, isDrawing, width }) => {
  const cardRef = useRef(null);
  const springConfig = { stiffness: 500, damping: 50 };
  const scale = useSpring(1, springConfig);
  const translateY = useSpring(0, springConfig);
  const zIndexValue = useSpring(index, springConfig);

  useEffect(() => {
    const unsubscribe = mouseX.on("change", () => {
      if (!cardRef.current || isDrawing || !containerRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const contRect = containerRef.current.getBoundingClientRect();
      
      const cardCenterX = rect.left + rect.width / 2 - contRect.left;
      const cardCenterY = rect.top + rect.height / 2 - contRect.top;
      
      const dx = mouseX.get() - cardCenterX;
      const dy = mouseY.get() - cardCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        const factor = Math.pow(1 - distance / 150, 3);
        scale.set(1 + factor * 0.8); 
        translateY.set(-factor * 120);
        zIndexValue.set(2000 + index + Math.round(factor * 100));
      } else {
        scale.set(1);
        translateY.set(0);
        zIndexValue.set(index);
      }
    });

    return () => unsubscribe();
  }, [mouseX, mouseY, isDrawing, scale, translateY, zIndexValue, index, containerRef]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 300, rotate: 0 }}
      animate={{ 
        opacity: 1, 
        x, 
        y, 
        rotate: rotation,
      }}
      style={{ 
        scale,
        y: useTransform(translateY, (v) => y + v),
        zIndex: zIndexValue,
        width: width
      }}
      transition={{ 
        delay: index * 0.003,
        type: "spring",
        stiffness: 100,
        damping: 30
      }}
      onClick={onSelect}
      className="absolute aspect-[1/1.7] cursor-pointer"
    >
      <div className="w-full h-full rounded-xl md:rounded-2xl border border-mystic-gold/10 overflow-hidden shadow-2xl relative group bg-mystic-dark">
        <img 
          src="/assets/cards/card_back.jpeg" 
          alt="Card Back" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mystic-purple/90 to-transparent opacity-60" />
        <motion.div 
          style={{ opacity: useTransform(scale, [1, 1.5], [0, 1]) }}
          className="absolute inset-0 ring-2 ring-mystic-gold/60 rounded-xl md:rounded-2xl pointer-events-none" 
        />
      </div>
    </motion.div>
  );
};

export default CardFan;
