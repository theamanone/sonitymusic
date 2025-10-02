// components/ui/TrackGridSkeleton.tsx - Loading skeleton for track grid
"use client";

import { cn } from "@/lib/utils";

interface TrackGridSkeletonProps {
  count?: number;
  className?: string;
}

export default function TrackGridSkeleton({ count = 12, className }: TrackGridSkeletonProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="group relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300">
          {/* Cover Art Skeleton */}
          <div className="aspect-square bg-gray-300 animate-pulse rounded-lg" />

          {/* Content Info Skeleton */}
          <div className="p-3">
            {/* Title */}
            <div className="h-4 bg-gray-300 animate-pulse rounded mb-2" />

            {/* Artist */}
            <div className="h-3 bg-gray-300 animate-pulse rounded mb-3 w-3/4" />

            {/* Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 bg-gray-300 animate-pulse rounded w-12" />
                <div className="h-3 bg-gray-300 animate-pulse rounded w-12" />
              </div>
              <div className="h-4 bg-gray-300 animate-pulse rounded-full w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
