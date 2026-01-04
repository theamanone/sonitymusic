// components/music-player/ProgressBar.tsx - Next-Gen iOS 26 Design
"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { cn, formatDuration } from "@/lib/utils";
import { PlayerState, PlayerActions } from "./types";

interface ProgressBarProps {
  state: PlayerState;
  actions: PlayerActions;
  variant?: 'mini' | 'full';
  className?: string;
}

export default function ProgressBar({ 
  state, 
  actions, 
  variant = 'full',
  className 
}: ProgressBarProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const progress = state.duration && isFinite(state.duration) && state.duration > 0 
    ? Math.min(100, Math.max(0, (state.currentTime / state.duration) * 100)) 
    : 0;

  const handleSeek = useCallback((clientX: number) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = percent * state.duration;
    
    // Validate that newTime is a finite number
    if (isFinite(newTime) && newTime >= 0 && newTime <= state.duration && state.duration > 0) {
      // Actually seek the audio to the new time
      actions.handleSeek(newTime);
    }
  }, [actions, state.duration]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    progressRef.current.setPointerCapture(e.pointerId);
    
    handleSeek(e.clientX);
  }, [handleSeek]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    handleSeek(e.clientX);
  }, [isDragging, handleSeek]);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (progressRef.current) {
      progressRef.current.releasePointerCapture(e.pointerId);
    }
  }, [isDragging]);

  const onClickSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) {
      e.preventDefault();
      e.stopPropagation();
      handleSeek(e.clientX);
    }
  }, [isDragging, handleSeek]);

  if (variant === 'mini') {
    return (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-white/60 to-white/40 transition-[width] duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  }

  return (
    <div className={cn("mb-4", className)}>
      {/* Modern Glass Progress Bar */}
      <div
        ref={progressRef}
        className="group relative w-full py-3 cursor-pointer touch-none select-none"
        style={{ zIndex: 10, pointerEvents: 'auto' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={onClickSeek}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onTouchStart={(e) => {
          e.stopPropagation();
          onPointerDown(e as any);
        }}
        onTouchMove={(e) => {
          e.stopPropagation();
          onPointerMove(e as any);
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          onPointerUp(e as any);
        }}
        aria-label="Seek audio track"
        role="slider"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Track Background - Glass Effect */}
        <div className="relative w-full h-2 bg-black/10 rounded-full backdrop-blur-sm border border-white/10">
          {/* Progress Fill - Animated */}
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-[width] duration-100 ease-linear shadow-lg"
            style={{ width: `${progress}%` }}
          />
          
          {/* Buffered/Loaded Indicator */}
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-white/20"
            style={{ width: '100%' }}
          />
          
          {/* Glow Effect on Hover */}
          <div
            className={cn(
              "absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-violet-400/30 to-fuchsia-400/30 transition-opacity duration-200",
              (isHovering || isDragging) ? "opacity-100" : "opacity-0"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Enhanced Thumb - More visible */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full transition-all duration-200 ease-out",
            "bg-white shadow-xl border-2 border-violet-400",
            (isDragging || isHovering || progress > 2) 
              ? "opacity-100 scale-110" 
              : "opacity-0 scale-75"
          )}
          style={{ 
            left: `${progress}%`,
            boxShadow: isDragging ? '0 6px 16px rgba(139, 92, 246, 0.5)' : '0 3px 10px rgba(139, 92, 246, 0.3)'
          }}
        />

        {/* Removed hover preview line to avoid thin straight line artifacts */}
      </div>

      {/* Time Display - Better contrast */}
      <div className="flex items-center justify-between mt-2 px-1">
        <time className="text-sm font-medium text-gray-800 tabular-nums drop-shadow-sm">
          {formatDuration(state.currentTime)}
        </time>
        <time className="text-sm font-medium text-gray-600 tabular-nums drop-shadow-sm">
          {formatDuration(state.duration)}
        </time>
      </div>
    </div>
  );
}
