import React from 'react';

/**
 * ProtectedImage component (Performance-optimized):
 * - Uses native <img> with lazy loading & async decoding for maximum performance
 * - Blocks right-clicks and drag-and-drop via event handlers
 * - Optional CSS watermark overlay (no canvas/fetch overhead)
 * - Previous Canvas/ImageBitmap approach caused OOM crashes on Safari iOS
 */
const ProtectedImage = ({
  src,
  alt = 'Tarot Card',
  className = '',
  style = {},
  showWatermark,
  watermarkText,
  onError,
  onClick,
  ...restProps
}) => {
  const handleContextMenu = (e) => e.preventDefault();
  const handleDragStart = (e) => e.preventDefault();

  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      style={{
        WebkitUserSelect: 'none',
        WebkitUserDrag: 'none',
        ...style,
      }}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        onError={onError}
        className="w-full h-full object-cover pointer-events-none select-none"
        style={{ display: 'block', WebkitUserDrag: 'none' }}
        {...restProps}
      />

      {/* Invisible overlay to block right-click on the image itself */}
      <div className="absolute inset-0 z-10 pointer-events-auto" onContextMenu={handleContextMenu} />

      {/* CSS Watermark (no canvas overhead) */}
      {showWatermark && watermarkText && (
        <div
          className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-hidden"
          style={{ userSelect: 'none' }}
        >
          <span
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              fontSize: '9px',
              fontWeight: '700',
              letterSpacing: '0.1em',
              color: 'rgba(212,175,55,0.35)',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {watermarkText}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProtectedImage;
