'use client';

import { useAuthModal } from '@/hooks/useAuthModal';
import AuthModal from './AuthModal';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({ 
  children, 
  fallback,
  requireAuth = false 
}: AuthGuardProps) {
  const { 
    isAuthenticated, 
    isAuthModalOpen, 
    closeAuthModal 
  } = useAuthModal();

  if (requireAuth && !isAuthenticated) {
    return (
      <>
        {fallback || (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
              <p className="text-gray-600 mb-4">Please sign in to access this feature.</p>
            </div>
          </div>
        )}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
        />
      </>
    );
  }

  return (
    <>
      {children}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />
    </>
  );
}
