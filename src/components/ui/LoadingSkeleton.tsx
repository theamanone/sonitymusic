"use client";

import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'video' | 'text' | 'avatar' | 'button' | 'card';
  count?: number;
  animate?: boolean;
}

export default function LoadingSkeleton({ 
  className = '', 
  variant = 'text',
  count = 1,
  animate = true 
}: LoadingSkeletonProps) {
  const baseClasses = `bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 ${
    animate ? 'animate-pulse' : ''
  }`;

  const getVariantClasses = () => {
    switch (variant) {
      case 'video':
        return 'aspect-video rounded-lg';
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

// Specialized skeleton components for common use cases
export function VideoCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      <LoadingSkeleton variant="video" />
      <div className="space-y-2">
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-3 w-1/2" />
        <div className="flex items-center space-x-2">
          <LoadingSkeleton variant="avatar" className="w-6 h-6" />
          <LoadingSkeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

export function VideoGridSkeleton({ count = 12, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <VideoCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function VideoPlayerSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      <LoadingSkeleton variant="video" className="w-full h-[60vh]" />
      <div className="space-y-3">
        <LoadingSkeleton className="h-6 w-3/4" />
        <div className="flex items-center space-x-4">
          <LoadingSkeleton variant="avatar" />
          <div className="space-y-1">
            <LoadingSkeleton className="h-4 w-32" />
            <LoadingSkeleton className="h-3 w-24" />
          </div>
        </div>
        <LoadingSkeleton className="h-4 w-full" count={3} />
      </div>
    </div>
  );
}

export function CategoryFilterSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`flex gap-2 overflow-x-auto pb-2 ${className}`}>
      {Array.from({ length: 8 }, (_, index) => (
        <LoadingSkeleton key={index} variant="button" className="min-w-20 flex-shrink-0" />
      ))}
    </div>
  );
}

export function HeroSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`relative h-[40vh] sm:h-[50vh] lg:h-[70vh] overflow-hidden ${className}`}>
      {/* Background gradient skeleton */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-pink-900/50 animate-pulse" />

      {/* Content overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent animate-pulse" />

      {/* Content skeleton */}
      <div className="relative z-10 flex items-end h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-8 lg:pb-16 w-full">
          <div className="max-w-2xl">
            {/* Title skeleton */}
            <div className="h-8 sm:h-10 md:h-12 lg:h-16 xl:h-20 bg-white/20 animate-pulse rounded-lg mb-2 sm:mb-4 backdrop-blur-sm" />

            {/* Artist skeleton */}
            <div className="h-4 sm:h-5 lg:h-6 bg-white/20 animate-pulse rounded mb-2 backdrop-blur-sm" />

            {/* Description skeleton */}
            <div className="space-y-2 mb-3 sm:mb-6">
              <div className="h-3 sm:h-4 bg-white/20 animate-pulse rounded backdrop-blur-sm" />
              <div className="h-3 sm:h-4 bg-white/20 animate-pulse rounded w-3/4 backdrop-blur-sm" />
            </div>

            {/* Stats skeleton */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="h-3 w-16 bg-white/20 animate-pulse rounded backdrop-blur-sm" />
              <div className="h-3 w-14 bg-white/20 animate-pulse rounded backdrop-blur-sm" />
              <div className="h-3 w-12 bg-white/20 animate-pulse rounded backdrop-blur-sm" />
            </div>

            {/* Button skeleton */}
            <div className="h-10 sm:h-12 w-32 sm:w-40 bg-white/20 animate-pulse rounded-lg backdrop-blur-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MusicCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`group relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${className}`}>
      {/* Cover Art Skeleton with Glass Effect */}
      <div className="aspect-square bg-gradient-to-br from-gray-300/80 via-gray-400/60 to-gray-300/80 animate-pulse rounded-lg backdrop-blur-sm border border-white/20 shadow-lg relative">
        {/* Play button overlay skeleton */}
        <div className="absolute inset-0 bg-black/40 animate-pulse rounded-lg backdrop-blur-sm" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-green-500/60 animate-pulse rounded-full backdrop-blur-sm" />
        </div>

        {/* Duration badge skeleton */}
        <div className="absolute bottom-2 right-2 h-6 w-12 bg-black/60 animate-pulse rounded backdrop-blur-sm" />
      </div>

      {/* Content Info Skeleton */}
      <div className="p-3">
        {/* Title skeleton */}
        <div className="h-4 bg-gradient-to-r from-gray-300/80 to-gray-400/60 animate-pulse rounded mb-2 backdrop-blur-sm" />

        {/* Artist skeleton */}
        <div className="h-3 bg-gradient-to-r from-gray-300/60 to-gray-400/40 animate-pulse rounded mb-3 w-3/4 backdrop-blur-sm" />

        {/* Stats skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 bg-gradient-to-r from-gray-300/60 to-gray-400/40 animate-pulse rounded w-12 backdrop-blur-sm" />
            <div className="h-3 bg-gradient-to-r from-gray-300/60 to-gray-400/40 animate-pulse rounded w-12 backdrop-blur-sm" />
          </div>
          <div className="h-4 bg-gradient-to-r from-gray-300/80 to-gray-400/60 animate-pulse rounded-full w-16 backdrop-blur-sm" />
        </div>
      </div>

      {/* Hover actions skeleton */}
      <div className="absolute top-2 left-2 flex gap-2">
        <div className="w-8 h-8 bg-black/60 animate-pulse rounded-full backdrop-blur-sm" />
        <div className="w-8 h-8 bg-black/60 animate-pulse rounded-full backdrop-blur-sm" />
      </div>
    </div>
  );
}

export function TrackGridSkeleton({ count = 12, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <MusicCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function GenreFilterSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`flex gap-2 overflow-x-auto pb-2 ${className}`}>
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-gray-300/80 via-gray-400/60 to-gray-300/80 animate-pulse flex-shrink-0 flex items-center gap-2 backdrop-blur-sm border border-white/20 shadow-lg min-w-fit"
        >
          <div className="w-4 h-4 bg-gradient-to-r from-gray-400/80 to-gray-500/60 animate-pulse rounded backdrop-blur-sm" />
          <div className="w-12 sm:w-16 h-4 bg-gradient-to-r from-gray-400/80 to-gray-500/60 animate-pulse rounded backdrop-blur-sm" />
          <div className="w-6 sm:w-8 h-4 bg-gradient-to-r from-gray-400/80 to-gray-500/60 animate-pulse rounded-full backdrop-blur-sm" />
        </div>
      ))}
    </div>
  );
}

export function FullPageSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`min-h-screen ${className}`}>
      {/* Navbar skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[70px] bg-gray-900/95 backdrop-blur-xl animate-pulse" />

      {/* Content skeleton */}
      <div className="pt-[70px]">
        {/* Hero skeleton */}
        <HeroSkeleton />

        {/* Music section skeleton */}
        <div className="py-6 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Genre filter skeleton */}
            <div className="mb-6 sm:mb-8">
              <GenreFilterSkeleton />
            </div>

            {/* Track grid skeleton */}
            <TrackGridSkeleton count={12} />

            {/* Loading more skeleton */}
            <div className="flex justify-center py-8 sm:py-12">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-green-600 border-t-transparent"></div>
                <div className="h-4 w-32 bg-gray-300 animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
