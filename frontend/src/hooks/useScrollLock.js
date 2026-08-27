import { useEffect } from 'react';

const useScrollLock = (isLocked) => {
  useEffect(() => {
    if (!isLocked) return;

    // Save current scroll position
    const scrollY = window.scrollY;
    
    // Save original styles
    const body = document.body;
    const originalOverflow = body.style.overflow;
    const originalPosition = body.style.position;
    const originalTop = body.style.top;
    const originalWidth = body.style.width;

    // Apply lock styles
    // Using position: fixed is the most reliable way to prevent body scroll on iOS Safari
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';

    return () => {
      // Revert lock styles
      body.style.overflow = originalOverflow;
      body.style.position = originalPosition;
      body.style.top = originalTop;
      body.style.width = originalWidth;
      
      // Temporarily disable smooth scroll to restore position instantly
      const html = document.documentElement;
      const originalScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      
      // Restore scroll position
      window.scrollTo(0, scrollY);
      
      // Restore smooth scroll behavior
      html.style.scrollBehavior = originalScrollBehavior;
    };
  }, [isLocked]);
};

export default useScrollLock;
