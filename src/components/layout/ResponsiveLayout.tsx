// components/layout/ResponsiveLayout.tsx - Responsive Layout System
"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveLayout({ children, className }: ResponsiveLayoutProps) {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const updateDevice = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDevice('mobile');
      } else if (width < 1024) {
        setDevice('tablet');
      } else {
        setDevice('desktop');
      }

      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    updateDevice();
    window.addEventListener('resize', updateDevice);
    window.addEventListener('orientationchange', updateDevice);

    return () => {
      window.removeEventListener('resize', updateDevice);
      window.removeEventListener('orientationchange', updateDevice);
    };
  }, []);

  return (
    <div 
      className={cn(
        'min-h-screen relative',
        device === 'mobile' && 'mobile-layout',
        device === 'tablet' && 'tablet-layout',
        device === 'desktop' && 'desktop-layout',
        orientation === 'landscape' && 'landscape-mode',
        className
      )}
      data-device={device}
      data-orientation={orientation}
    >
      {children}
    </div>
  );
}

// Responsive Container with max-width constraints
export function ResponsiveContainer({ 
  children, 
  className,
  maxWidth = '7xl' 
}: { 
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
}) {
  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  };

  return (
    <div className={cn(
      'mx-auto px-4 sm:px-6 lg:px-8',
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  );
}

// Responsive Grid System
export function ResponsiveGrid({ 
  children, 
  className,
  cols = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  },
  gap = 4
}: { 
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: number;
}) {
  return (
    <div className={cn(
      'grid',
      `grid-cols-${cols.mobile || 1}`,
      `sm:grid-cols-${cols.tablet || 2}`,
      `lg:grid-cols-${cols.desktop || 3}`,
      `gap-${gap}`,
      className
    )}>
      {children}
    </div>
  );
}

// Responsive Text Sizing
export function ResponsiveText({ 
  children, 
  className,
  size = 'base'
}: { 
  children: React.ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
}) {
  const sizeClasses = {
    'xs': 'text-xs sm:text-sm',
    'sm': 'text-sm sm:text-base',
    'base': 'text-base sm:text-lg',
    'lg': 'text-lg sm:text-xl lg:text-2xl',
    'xl': 'text-xl sm:text-2xl lg:text-3xl',
    '2xl': 'text-2xl sm:text-3xl lg:text-4xl',
    '3xl': 'text-3xl sm:text-4xl lg:text-5xl',
    '4xl': 'text-4xl sm:text-5xl lg:text-6xl',
    '5xl': 'text-5xl sm:text-6xl lg:text-7xl',
    '6xl': 'text-6xl sm:text-7xl lg:text-8xl'
  };

  return (
    <div className={cn(sizeClasses[size], className)}>
      {children}
    </div>
  );
}
