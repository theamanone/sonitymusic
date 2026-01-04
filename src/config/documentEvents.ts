// config/documentEvents.ts - Simplified without security restrictions
import { useEffect } from 'react';

type DocumentEventConfig = {
  // All security features disabled - allowing full user access
};

export const useDocumentEvents = (config: DocumentEventConfig = {}) => {
  useEffect(() => {
    // No event restrictions - allowing all user interactions
    return () => {
      // Cleanup function - no restrictions to remove
    };
  }, [config]);
};

// Simplified default configuration with no restrictions
export const defaultDocumentConfig: DocumentEventConfig = {};
