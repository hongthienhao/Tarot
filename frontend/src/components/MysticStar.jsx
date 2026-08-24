import React from 'react';

/**
 * Biểu tượng Tinh Tú phong cách Tarot Mystic (Ngôi sao 4 cánh tỏa sáng)
 */
export const MysticStar = ({ className = "w-4 h-4", glow = true, animate = false }) => {
  return (
    <span className={`inline-flex items-center justify-center relative shrink-0 ${animate ? 'animate-pulse' : ''}`}>
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`text-mystic-gold ${glow ? 'drop-shadow-[0_0_8px_rgba(212,175,55,0.85)]' : ''} ${className}`}
      >
        <path d="M12 0.5L14.7 9.3L23.5 12L14.7 14.7L12 23.5L9.3 14.7L0.5 12L9.3 9.3L12 0.5Z" />
        <circle cx="12" cy="12" r="2.2" className="text-yellow-100 fill-yellow-100/90" />
      </svg>
    </span>
  );
};

export default MysticStar;
