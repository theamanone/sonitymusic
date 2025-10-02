"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface SmoothRouterProps {
  children: React.ReactNode;
}

export default function SmoothRouter({ children }: SmoothRouterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const handleNavigation = useCallback((url: string) => {
    // Add loading state and smooth transitions
    document.body.style.cursor = 'wait';
    
    // Preload the route
    router.prefetch(url);
    
    // Navigate with smooth transition
    setTimeout(() => {
      router.push(url);
      document.body.style.cursor = 'default';
    }, 100);
  }, [router]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      // Add smooth transition for back/forward navigation
      document.body.style.opacity = '0.9';
      setTimeout(() => {
        document.body.style.opacity = '1';
      }, 150);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Preload critical routes
  useEffect(() => {
    if (status === 'authenticated') {
      router.prefetch('/');
      router.prefetch('/channel');
      router.prefetch('/subscription');
    }
  }, [router, status]);

  // Handle invalid routes
  useEffect(() => {
    const invalidRoutes = ['/home', '/videos', '/browse'];
    if (invalidRoutes.includes(pathname)) {
      router.replace('/');
    }
  }, [pathname, router]);

  return (
    <div className="smooth-router">
      {children}
    </div>
  );
}
