// components/ui/GenreFilterSkeleton.tsx - Loading skeleton for genre filter
"use client";

import { cn } from "@/lib/utils";

interface GenreFilterSkeletonProps {
  className?: string;
}

export default function GenreFilterSkeleton({ className }: GenreFilterSkeletonProps) {
  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-2", className)}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="px-6 py-3 rounded-full bg-gray-300 animate-pulse flex-shrink-0 flex items-center gap-2"
        >
          <div className="w-4 h-4 bg-gray-400 animate-pulse rounded" />
          <div className="w-16 h-4 bg-gray-400 animate-pulse rounded" />
          <div className="w-8 h-4 bg-gray-400 animate-pulse rounded-full" />
        </div>
      ))}
    </div>
  );
}
