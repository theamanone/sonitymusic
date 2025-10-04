// components/music-player/ExpandedPlayer.tsx - Show App Header
"use client";

import { TrackWithArtist } from "@/types/track.types";
import { PlayerState, PlayerActions } from "./types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useViewportHeight } from "@/hooks/useViewportHeight";
import { 
  ChevronDown, List, Heart, Share2, Play, Pause, 
  SkipBack, SkipForward, Shuffle, Repeat, Timer
} from "lucide-react";
import ProgressBar from "./ProgressBar";
import { useState, useEffect } from "react";

interface ExpandedPlayerProps {
  track: TrackWithArtist | null;
  state: PlayerState;
  actions: PlayerActions;
  onShare: () => void;
  onToggleQueue: () => void;
  onShowTimer: () => void;
  remainingTime: number | null;
  headerVisible?: boolean;
  swipeTransition?: boolean;
  className?: string;
}

export default function ExpandedPlayer({
  track,
  state,
  actions,
  onShare,
  onToggleQueue,
  onShowTimer,
  remainingTime,
  headerVisible = true,
  swipeTransition = false,
  className,
}: ExpandedPlayerProps) {
  // Measure available visual viewport height consistently
  const viewportHeight = useViewportHeight();

  // Compute album art size based on available height (keeps controls always visible)
  // More conservative spacing for mobile, better proportions for desktop
  const isMobile = viewportHeight && viewportHeight < 800;
  const reservedVerticalSpace = isMobile ? 420 : 480;
  const artSize = viewportHeight
    ? Math.max(180, Math.min(isMobile ? 280 : 380, viewportHeight - reservedVerticalSpace))
    : undefined;

  if (!track) return null;

  return (
    <div className={cn(
      "relative grid grid-rows-[auto_1fr_auto_auto_auto] w-full overflow-hidden",
      "pb-[calc(env(safe-area-inset-bottom,20px)+2.5rem)] sm:pb-[calc(env(safe-area-inset-bottom,20px)+1rem)]",
      className
    )} style={{
      // Lock the expanded player height to the real visual viewport height when available
      height: viewportHeight ? `${viewportHeight}px` : '100vh',
      background: 'transparent'
    }}>
      {/* App Header - Responsive and Mobile Optimized */}
      <div className={cn(
        "relative z-30 transition-all duration-500 ease-out",
        "pt-[env(safe-area-inset-top,20px)] px-4 sm:px-6",
        "h-16 sm:h-20 flex items-center justify-between",
        headerVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}>
        <button
          onClick={actions.toggleExpanded}
          className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          style={{ touchAction: 'manipulation' }}
          aria-label="Collapse player"
        >
          <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--text-primary)]" />
        </button>
        
        {/* App Logo/Name - Centered and Responsive */}
        <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent-primary)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
          <span className="text-[var(--text-primary)] text-base sm:text-lg font-bold">Sonity</span>
        </div>

        <button
          onClick={onToggleQueue}
          className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          style={{ touchAction: 'manipulation' }}
          aria-label="Open queue"
        >
          <List className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--text-primary)]" />
        </button>
      </div>

      {/* Album Art - Sized by available viewport height so controls stay visible */}
      <div className="flex items-center justify-center px-4 sm:px-8 py-4 sm:py-8">
        <div
          className="album-art-swipe-area relative aspect-square"
          style={{
            width: artSize ? `${artSize}px` : undefined,
            maxWidth: artSize ? `${artSize}px` : undefined,
          }}
        >
          <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-lg">
            {track?.coverArt?.default ? (
              <Image
                src={track.coverArt.default}
                alt={track.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 250px, (max-width: 1024px) 300px, 350px"
              />
            ) : (
              <div className="w-full h-full bg-[var(--accent-primary)] flex items-center justify-center">
                <svg className="w-16 h-16 sm:w-20 sm:h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Track Info - Grid Auto */}
      <div className="px-4 sm:px-8 py-2 sm:py-3 text-center mx-auto max-w-[520px]">
        <h1 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-1 sm:mb-2 line-clamp-1">
          {track.title}
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] line-clamp-1">
          {track.artistDetails?.name || 'Unknown Artist'}
        </p>
      </div>

      {/* Progress Bar - Grid Auto */}
      <div className="px-4 sm:px-8 py-1 sm:py-2 mb-1 sm:mb-2 mx-auto max-w-[520px] w-full">
        <ProgressBar
          state={state}
          actions={actions}
          variant="full"
        />
      </div>

      {/* Controls - Grid Auto with Proper Spacing (iOS-like layout) */}
      <div className="px-4 sm:px-8 pb-6 sm:pb-8 pt-3 sm:pt-4 space-y-3 sm:space-y-5 mx-auto max-w-[520px] w-full">
        {/* Secondary Controls - evenly spaced row */}
        <div className="mx-auto w-full max-w-[380px] flex items-center justify-between">
          <button
            onClick={actions.toggleShuffle}
            className={cn(
              "p-3 rounded-2xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center",
              "hover:bg-[var(--bg-secondary)]",
              state.isShuffled ? "text-[var(--accent-primary)]" : "text-[var(--text-secondary)]"
            )}
            style={{ touchAction: 'manipulation' }}
            aria-label="Shuffle"
          >
            <Shuffle className="h-5 w-5" />
          </button>

          <button
            onClick={actions.toggleLike}
            className={cn(
              "p-3 rounded-2xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center",
              "hover:bg-[var(--bg-secondary)]",
              state.isLiked ? "text-red-500" : "text-[var(--text-secondary)]"
            )}
            style={{ touchAction: 'manipulation' }}
            aria-label="Like"
          >
            <Heart className={cn(
              "h-6 w-6",
              state.isLiked && "fill-current"
            )} />
          </button>

          <button
            onClick={onShowTimer}
            className={cn(
              "p-3 rounded-2xl transition-colors relative min-w-[44px] min-h-[44px] flex items-center justify-center",
              "hover:bg-[var(--bg-secondary)]",
              remainingTime ? "text-[var(--accent-primary)]" : "text-[var(--text-secondary)]"
            )}
            style={{ touchAction: 'manipulation' }}
            aria-label="Timer"
          >
            <Timer className="h-5 w-5" />
            {remainingTime && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--accent-primary)] rounded-full" />
            )}
          </button>

          <button
            onClick={onShare}
            className="p-3 rounded-2xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            style={{ touchAction: 'manipulation' }}
            aria-label="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>

          <button
            onClick={actions.cycleRepeatMode}
            className={cn(
              "p-3 rounded-2xl relative transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center",
              "hover:bg-[var(--bg-secondary)]",
              state.repeatMode !== 'none' ? "text-[var(--accent-primary)]" : "text-[var(--text-secondary)]"
            )}
            style={{ touchAction: 'manipulation' }}
            aria-label="Repeat"
          >
            <Repeat className="h-5 w-5" />
            {state.repeatMode === 'one' && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--accent-primary)] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">1</span>
              </div>
            )}
          </button>
        </div>

        {/* Main Controls - centered within fixed width */}
        <div className="mx-auto w-full max-w-[300px] flex items-center justify-center gap-4 sm:gap-6 mt-1 sm:mt-2">
          <button
            onClick={actions.skipToPrevious}
            className="p-3 sm:p-4 rounded-2xl text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            style={{ touchAction: 'manipulation' }}
            aria-label="Previous"
          >
            <SkipBack className="h-7 w-7 sm:h-8 sm:w-8" />
          </button>

          <button
            onClick={actions.togglePlayPause}
            disabled={state.isLoading}
            className="p-4 sm:p-6 rounded-full text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-50 min-w-[56px] min-h-[56px] sm:min-w-[72px] sm:min-h-[72px] flex items-center justify-center"
            style={{ touchAction: 'manipulation' }}
            aria-label="Play/Pause"
          >
            {state.isLoading ? (
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-[var(--border-secondary)] border-t-[var(--text-primary)] rounded-full animate-spin" />
            ) : state.isPlaying ? (
              <Pause className="w-8 h-8 sm:w-10 sm:h-10" />
            ) : (
              <Play className="w-8 h-8 sm:w-10 sm:h-10" />
            )}
          </button>

          <button
            onClick={actions.skipToNext}
            className="p-3 sm:p-4 rounded-2xl text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            style={{ touchAction: 'manipulation' }}
            aria-label="Next"
          >
            <SkipForward className="h-7 w-7 sm:h-8 sm:w-8" />
          </button>
        </div>
      </div>
    </div>
  );
}
