import React from 'react';

const ZODIAC_SVG_PATHS = {
  Aries: (
    <path d="M12 21V9M12 9C10 5.5 6 5.5 3 8M12 9C14 5.5 18 5.5 21 8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  Taurus: (
    <path d="M6 3C6 6.5 8.5 9 12 9C15.5 9 18 6.5 18 3M12 9A6 6 0 1 0 12 21A6 6 0 1 0 12 9Z" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  Gemini: (
    <path d="M4 4C10 6 14 6 20 4M4 20C10 18 14 18 20 20M8 5V19M16 5V19" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  Cancer: (
    <path d="M6 9A3 3 0 1 0 6 3A3 3 0 0 0 6 9ZM6 3C13 3 18 8 18 13M18 15A3 3 0 1 0 18 21A3 3 0 0 0 18 15ZM18 21C11 21 6 16 6 11" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  Leo: (
    <path d="M7 16A3 3 0 1 1 5 11C8 11 10 7 13 7C16 7 17 10 16 13C15 16 17 21 21 19" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  Virgo: (
    <path d="M4 6V16M4 6C4 6 7 4 9 6V16M9 6C9 6 12 4 14 6V18C14 21 17 21 18 19M14 13C16 13 18 14 18 16V17" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  Libra: (
    <path d="M4 19H20M4 15H8C9.5 12 14.5 12 16 15H20M9 11A3 3 0 0 1 15 11" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  Scorpio: (
    <path d="M4 6V16M4 6C4 6 7 4 9 6V16M9 6C9 6 12 4 14 6V16C14 16 17 16 19 18M16 15L19 18L16 21" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  Sagittarius: (
    <path d="M5 19L19 5M19 5H12M19 5V12M9 9L4 14M15 15L20 20" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  Capricorn: (
    <path d="M4 6L8 15L12 6M12 6V15C12 18 14 20 17 20C19.5 20 21 18 20 15.5C19 13 16 14.5 16 17.5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  Aquarius: (
    <path d="M4 9L7 6L10 9L13 6L16 9L20 5M4 17L7 14L10 17L13 14L16 17L20 13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  Pisces: (
    <path d="M4 12H20M7 4C10 9 10 15 7 20M17 4C14 9 14 15 17 20" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
};

export const ZodiacIcon = ({ name, className = 'w-7 h-7' }) => {
  const path = ZODIAC_SVG_PATHS[name] || ZODIAC_SVG_PATHS.Aries;
  const gradientId = `zodiacGoldGrad-${name}`;

  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} drop-shadow-[0_0_10px_rgba(250,204,21,0.7)] group-hover:drop-shadow-[0_0_16px_rgba(250,204,21,0.95)] transition-all shrink-0`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="30%" stopColor="#FDE047" />
          <stop offset="70%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
      </defs>
      {React.cloneElement(path, { stroke: `url(#${gradientId})` })}
    </svg>
  );
};

export default ZodiacIcon;
