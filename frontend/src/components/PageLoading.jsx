import React from 'react';

/**
 * Lightweight fallback shown while React.lazy() chunks are loading.
 * No heavy animation — just a subtle shimmer to match Mystic Tarot aesthetic.
 */
const PageLoading = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      color: '#D4AF37',
      fontFamily: '"Cinzel", serif',
      letterSpacing: '0.2em',
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      opacity: 0.85,
    }}
  >
    {/* Minimal spinning rune ring — pure CSS, zero JS overhead */}
    <div
      style={{
        width: 36,
        height: 36,
        border: '2px solid rgba(212,175,55,0.15)',
        borderTopColor: '#D4AF37',
        borderRadius: '50%',
        animation: 'pl-spin 1.1s linear infinite',
      }}
    />
    <span>Đang mở cánh cổng...</span>

    <style>{`
      @keyframes pl-spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default PageLoading;
