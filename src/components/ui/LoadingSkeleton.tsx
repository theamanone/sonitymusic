"use client";

import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'music' | 'text' | 'avatar' | 'button' | 'card';
  count?: number;
  animate?: boolean;
}

export default function LoadingSkeleton({
  className = '',
  variant = 'text',
  count = 1,
  animate = true
}: LoadingSkeletonProps) {
  const baseClasses = `bg-gradient-to-r from-gray-200/40 via-gray-300/30 to-gray-200/40 dark:from-gray-700/40 dark:via-gray-600/30 dark:to-gray-700/40 ${
    animate ? 'animate-pulse' : ''
  }`;

  const getVariantClasses = () => {
    switch (variant) {
      case 'music':
        return 'aspect-square rounded-lg';
      case 'avatar':
        return 'w-10 h-10 rounded-full';
      case 'button':
        return 'h-10 rounded-lg';
      case 'card':
        return 'h-48 rounded-lg';
      default:
        return 'h-4 rounded';
    }
  };

  const skeletonElement = (
    <div className={`${baseClasses} ${getVariantClasses()} ${className}`} />
  );

  if (count === 1) {
    return skeletonElement;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={`${baseClasses} ${getVariantClasses()} ${className}`} />
      ))}
    </div>
  );
}

// Specialized skeleton components for music platform
export function MusicCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      <LoadingSkeleton variant="music" />
      <div className="space-y-2">
        <LoadingSkeleton variant="text" className="h-4 w-3/4" />
        <LoadingSkeleton variant="text" className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function MusicGridSkeleton({ count = 12, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <MusicCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function MusicPlayerSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      <LoadingSkeleton variant="music" className="w-full h-96" />
      <div className="space-y-3">
        <LoadingSkeleton variant="text" className="h-6 w-2/3" />
        <LoadingSkeleton variant="text" className="h-4 w-1/3" />
        <div className="flex space-x-2">
          <LoadingSkeleton variant="button" className="w-12" />
          <LoadingSkeleton variant="button" className="w-12" />
          <LoadingSkeleton variant="button" className="w-24" />
        </div>
      </div>
    </div>
  );
}
