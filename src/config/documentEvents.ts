// config/documentEvents.ts - FIXED CLIPBOARD HANDLING
import { useEffect } from 'react';

type DocumentEventConfig = {
  preventCopy?: boolean;
  preventCut?: boolean;
  preventPaste?: boolean;
  preventContextMenu?: boolean;
  preventDragStart?: boolean;
  preventDrop?: boolean;
  preventSelectStart?: boolean;
  preventPrintScreen?: boolean; // ✅ New feature
  applyGlobalStyles?: boolean;
};

const preventStyles = `
  /* Prevent text selection */
  * {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Prevent image drag */
  img, svg, a {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
  }

  /* Hide print styles */
  @media print {
    * {
      display: none !important;
    }
    body::after {
      content: "Printing is not allowed for copyright protection.";
      display: block !important;
      text-align: center;
      font-size: 24px;
      padding: 50px;
    }
  }
`;

export const useDocumentEvents = (config: DocumentEventConfig = {}) => {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const preventDefault = (e: Event) => e.preventDefault();
    const preventDefaultAndStopPropagation = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // ✅ FIXED: Safe clipboard clearing without permission
    const safeClearClipboard = () => {
      try {
        // Only try if clipboard API is available and we have permission
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('').catch(() => {
            // Silently ignore clipboard errors
          });
        }
      } catch (error) {
        // Silently ignore any clipboard-related errors
      }
    };

    // ✅ ENHANCED: Print screen detection and prevention
    const handlePrintScreen = (e: Event) => {
      if (!config.preventPrintScreen) return;
      
      const keyboardEvent = e as KeyboardEvent;
      if (keyboardEvent.key === 'PrintScreen' || (keyboardEvent as any).keyCode === 44) {
        e.preventDefault();
        safeClearClipboard();
        
        // Show warning (optional)
        console.warn('Screenshot disabled for copyright protection');
      }
    };

    // Add global styles if enabled
    let styleElement: HTMLStyleElement | null = null;
    if (config.applyGlobalStyles) {
      styleElement = document.createElement('style');
      styleElement.id = 'prevent-selection-styles';
      styleElement.textContent = preventStyles;
      document.head.appendChild(styleElement);
    }

    const events: [string, (e: Event) => void, boolean | AddEventListenerOptions][] = [];

    if (config.preventCopy) {
      events.push(['copy', preventDefault, true]);
    }
    if (config.preventCut) {
      events.push(['cut', preventDefault, true]);
    }
    if (config.preventPaste) {
      events.push(['paste', preventDefault, true]);
    }
    if (config.preventContextMenu) {
      events.push(['contextmenu', preventDefault, true]);
    }
    if (config.preventDragStart) {
      events.push(['dragstart', preventDefault, true]);
    }
    if (config.preventDrop) {
      events.push(['drop', preventDefaultAndStopPropagation, true]);
    }
    if (config.preventSelectStart) {
      events.push(['selectstart', preventDefault, true]);
    }
    if (config.preventPrintScreen) {
      events.push(['keydown', handlePrintScreen as EventListener, true]);
      events.push(['keyup', handlePrintScreen as EventListener, true]);
    }

    // Add all event listeners
    events.forEach(([event, handler, options]) => {
      document.addEventListener(event, handler, options);
    });

    return () => {
      events.forEach(([event, handler, options]) => {
        document.removeEventListener(event, handler, options);
      });

      if (styleElement && document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, [config]);
};

// ✅ ENHANCED: Default configuration with print screen prevention
export const defaultDocumentConfig: DocumentEventConfig = {
  preventCopy: true,
  preventCut: true,
  preventPaste: true,
  preventContextMenu: true,
  preventDragStart: true,
  preventDrop: true,
  preventSelectStart: true,
  preventPrintScreen: true, // ✅ New feature
  applyGlobalStyles: true,
};
