import { useEffect, useState } from 'react';

export function useViewportHeight() {
  const [viewportHeight, setViewportHeight] = useState<number>(0);

  useEffect(() => {
    function updateViewportHeight() {
      // Use visual viewport API if available (modern browsers)
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
      } else {
        // Fallback for older browsers
        setViewportHeight(window.innerHeight);
      }
    }

    // Initial calculation
    updateViewportHeight();

    // Listen for viewport changes
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportHeight);
      window.visualViewport.addEventListener('scroll', updateViewportHeight);
    } else {
      window.addEventListener('resize', updateViewportHeight);
      window.addEventListener('orientationchange', updateViewportHeight);
    }

    // Cleanup
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewportHeight);
        window.visualViewport.removeEventListener('scroll', updateViewportHeight);
      } else {
        window.removeEventListener('resize', updateViewportHeight);
        window.removeEventListener('orientationchange', updateViewportHeight);
      }
    };
  }, []);

  return viewportHeight;
}
