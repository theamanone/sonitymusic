"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useCallback } from 'react';

interface SmoothRouterProps {
  children: React.ReactNode;
}

export default function SmoothRouter({ children }: SmoothRouterProps) {
  const router = useRouter();
  const pathname = usePathname();

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
    // Preload main routes for better UX
    router.prefetch('/');
    router.prefetch('/trending');
    router.prefetch('/library');
    router.prefetch('/settings');
  }, [router]);

  // Handle invalid routes
  useEffect(() => {
    // Redirect invalid routes to home
    const validRoutes = ['/', '/trending', '/library', '/settings', '/search'];
    const isValidRoute = validRoutes.some(route => pathname.startsWith(route));
    
    if (!isValidRoute && pathname !== '/') {
      router.replace('/');
    }
  }, [pathname, router]);

  return <>{children}</>;
}
