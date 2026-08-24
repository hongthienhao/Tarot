import React, { useState, useEffect, useRef } from 'react';

/**
 * ProtectedImage component:
 * - Blocks right-clicks and drag-and-drop.
 * - Fetches image via XHR to avoid showing up in the Network "Img" filter.
 * - Renders to a <canvas> to hide the image source from the DOM.
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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    if (!src) return;

    setIsLoading(true);
    setHasError(false);

    fetch(src)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.blob();
      })
      .then(blob => {
        if (!isMounted) return;
        const objectUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          if (!isMounted) return;
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
          }
          URL.revokeObjectURL(objectUrl);
          setIsLoading(false);
        };
        img.onerror = () => {
          if (isMounted) {
            setHasError(true);
            setIsLoading(false);
            if (onError) onError(new Error('Image failed to load'));
          }
        };
        img.src = objectUrl;
      })
      .catch(err => {
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
          if (onError) onError(err);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [src, onError]);

  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      style={{
        WebkitUserSelect: 'none',
        WebkitUserDrag: 'none',
        ...style,
      }}
      onContextMenu={e => e.preventDefault()}
      onDragStart={e => e.preventDefault()}
      onClick={onClick}
      {...restProps}
    >
      {/* Loading Skeleton */}
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

      {/* Canvas rendering instead of img */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-cover pointer-events-none ${isLoading || hasError ? 'opacity-0' : 'opacity-100'}`}
        style={{ display: 'block' }}
      />

      {/* Invisible overlay */}
      <div className="absolute inset-0 z-20 pointer-events-auto" />
    </div>
  );
};

export default ProtectedImage;
