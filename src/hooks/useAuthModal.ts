'use client';

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export function useAuthModal() {
  const { data: session, status } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const requireAuth = useCallback((callback?: () => void) => {
    if (status === 'authenticated' && session?.user) {
      // User is authenticated, execute callback
      callback?.();
      return true;
    } else {
      // User is not authenticated, show modal
      setIsAuthModalOpen(true);
      return false;
    }
  }, [session, status]);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  return {
    isAuthenticated: status === 'authenticated' && !!session?.user,
    isAuthModalOpen,
    requireAuth,
    closeAuthModal,
    session,
    status
  };
}
