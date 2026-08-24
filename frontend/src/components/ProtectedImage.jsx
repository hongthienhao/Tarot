import React, { useState } from 'react';

/**
 * ProtectedImage component:
 * Optimized version for fast loading while maintaining basic protection.
 * 1. Uses native <img> tag for optimal browser caching, parallel downloading and lazy loading.
 * 2. Applies an invisible overlay over the image to block right-clicks and drag-and-drop.
 * 3. Prevents context menu events.
 */
const ProtectedImage = ({
  src,
  alt = 'Tarot Card',
  className = '',
  style = {},
  showWatermark, // Kept for prop compatibility but ignored
  watermarkText, // Kept for prop compatibility but ignored
  onError,
  onClick,
  ...restProps
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    return false;
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = (err) => {
    setHasError(true);
    setIsLoading(false);
    if (onError) onError(err);
  };

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
      {...restProps}
    >
      {/* Loading Skeleton indicator */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-mystic-dark/80 animate-pulse flex items-center justify-center z-10">
          <div className="w-6 h-6 border-2 border-mystic-gold/40 border-t-mystic-gold rounded-full animate-spin" />
        </div>
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-mystic-dark flex items-center justify-center border border-mystic-gold/20 text-mystic-gold/60 text-xs p-2 text-center z-10">
          <span>{alt || 'Lỗi tải ảnh'}</span>
        </div>
      )}

      {/* Main Image */}
      {src && !hasError && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover pointer-events-none"
          draggable="false"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Protection Overlay - Invisible layer that intercepts clicks */}
      <div className="absolute inset-0 z-20 pointer-events-auto" />
    </div>
  );
};

export default ProtectedImage;
