// components/music-player/DesktopExpandedPlayer.tsx - Amazon Music + iOS 26 Style Desktop Player
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  MoreHorizontal,
  ChevronDown,
  Music,
  Share2,
  List,
  Clock
} from 'lucide-react';
import { cn, formatDuration } from '@/lib/utils';

interface DesktopExpandedPlayerProps {
  track: any;
  state: any;
  actions: any;
  headerVisible: boolean;
  onShare: () => void;
  onToggleQueue: () => void;
  onShowTimer: () => void;
  remainingTime?: number | null;
}

export default function DesktopExpandedPlayer({
  track,
  state,
  actions,
  headerVisible,
  onShare,
  onToggleQueue,
  onShowTimer,
  remainingTime
}: DesktopExpandedPlayerProps) {
  const [showLyrics, setShowLyrics] = useState(false);

  return (
    <div className="flex h-full">
      {/* Left Panel - Album Art & Visualizer */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col items-center justify-center p-8 relative">
        {/* Album Art with iOS 26 Glass Effect */}
        <div className="relative group">
          <div className="w-80 h-80 xl:w-96 xl:h-96 rounded-3xl overflow-hidden shadow-2xl">
            {track?.coverArt?.default ? (
              <Image
                src={track.coverArt.default}
                alt={track.title}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                <Music className="w-24 h-24 text-[var(--text-primary)]/50" />
              </div>
            )}
          </div>
          
          {/* iOS 26 Glass Overlay on Hover */}
          <div className="absolute inset-0 rounded-3xl bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center">
              {state.isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" />
              )}
            </div>
          </div>
        </div>

        {/* Track Info */}
        <div className="mt-8 text-center max-w-sm">
          <h1 className="text-2xl xl:text-3xl font-bold text-[var(--text-primary)] mb-2 truncate">
            {track?.title || 'Unknown Track'}
          </h1>
          <p className="text-lg xl:text-xl text-[var(--text-secondary)] truncate">
            {track?.artistDetails?.name || 'Unknown Artist'}
          </p>
          {track?.albumId && (
            <p className="text-sm text-[var(--text-secondary)]/70 mt-1 truncate">
              {track.albumId}
            </p>
          )}
        </div>
      </div>

      {/* Right Panel - Controls & Content */}
      <div className="flex-1 lg:w-1/2 xl:w-3/5 flex flex-col">
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between p-4 lg:p-6 transition-all duration-300",
          headerVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        )}>
          <button
            onClick={actions.toggleExpanded}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronDown className="w-6 h-6 text-[var(--text-primary)]" />
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onShowTimer}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <Clock className="w-5 h-5 text-[var(--text-primary)]" />
            </button>
            <button
              onClick={onShare}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <Share2 className="w-5 h-5 text-[var(--text-primary)]" />
            </button>
            <button
              onClick={onToggleQueue}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <List className="w-5 h-5 text-[var(--text-primary)]" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <MoreHorizontal className="w-5 h-5 text-[var(--text-primary)]" />
            </button>
          </div>
        </div>

        {/* Mobile Track Info (Hidden on Desktop) */}
        <div className="lg:hidden px-6 py-4 text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2 truncate">
            {track?.title || 'Unknown Track'}
          </h1>
          <p className="text-lg text-[var(--text-secondary)] truncate">
            {track?.artistDetails?.name || 'Unknown Artist'}
          </p>
        </div>

        {/* Content Area - Lyrics/Visualizer Toggle */}
        <div className="flex-1 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-center mb-6">
            <div className="flex bg-[var(--bg-secondary)]/60 rounded-2xl p-1 backdrop-blur-xl">
              <button
                onClick={() => setShowLyrics(false)}
                className={cn(
                  "px-6 py-2 rounded-xl text-sm font-medium transition-all",
                  !showLyrics 
                    ? "bg-[var(--accent-primary)] text-white shadow-lg" 
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                Visualizer
              </button>
              <button
                onClick={() => setShowLyrics(true)}
                className={cn(
                  "px-6 py-2 rounded-xl text-sm font-medium transition-all",
                  showLyrics 
                    ? "bg-[var(--accent-primary)] text-white shadow-lg" 
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                Lyrics
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex items-center justify-center">
            {showLyrics ? (
              <div className="text-center max-w-2xl">
                <div className="text-lg lg:text-xl text-[var(--text-primary)] leading-relaxed">
                  <p className="mb-4 opacity-50">♪ Instrumental ♪</p>
                  <p className="text-2xl lg:text-3xl font-semibold mb-6">
                    {track?.title}
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    Lyrics will be displayed here when available
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md h-32 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 rounded-2xl flex items-center justify-center">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-1 bg-[var(--accent-primary)] rounded-full transition-all duration-300",
                        state.isPlaying ? "animate-pulse" : ""
                      )}
                      style={{
                        height: state.isPlaying ? `${20 + Math.random() * 40}px` : '20px',
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="p-4 lg:p-6 space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div 
              className="w-full h-1.5 bg-[var(--border-secondary)] rounded-full overflow-hidden cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                const newTime = percent * state.duration;
                
                if (isFinite(newTime) && newTime >= 0 && newTime <= state.duration && state.duration > 0) {
                  actions.handleSeek(newTime);
                }
              }}
            >
              <div
                className="h-full bg-[var(--accent-primary)] transition-[width] duration-100 ease-linear"
                style={{ width: `${state.duration && isFinite(state.duration) && state.duration > 0 ? Math.min(100, Math.max(0, (state.currentTime / state.duration) * 100)) : 0}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[var(--text-secondary)]">
              <span>{formatDuration(state.currentTime)}</span>
              <span>{formatDuration(state.duration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={actions.toggleShuffle}
              className={cn(
                "p-2 rounded-full transition-colors",
                state.isShuffled 
                  ? "text-[var(--accent-primary)] bg-[var(--accent-primary)]/20" 
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10"
              )}
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={actions.skipToPrevious}
              className="p-3 rounded-full hover:bg-white/10 transition-colors"
            >
              <SkipBack className="w-6 h-6 text-[var(--text-primary)]" />
            </button>

            <button
              onClick={actions.togglePlayPause}
              className="p-4 rounded-full hover:bg-white/10 transition-all active:scale-95"
              disabled={state.isLoading}
            >
              {state.isLoading ? (
                <div className="w-8 h-8 border-2 border-[var(--text-secondary)] border-t-[var(--text-primary)] rounded-full animate-spin" />
              ) : state.isPlaying ? (
                <Pause className="w-8 h-8 text-[var(--text-primary)]" />
              ) : (
                <Play className="w-8 h-8 text-[var(--text-primary)] ml-1" />
              )}
            </button>

            <button
              onClick={actions.skipToNext}
              className="p-3 rounded-full hover:bg-white/10 transition-colors"
            >
              <SkipForward className="w-6 h-6 text-[var(--text-primary)]" />
            </button>

            <button
              onClick={actions.cycleRepeatMode}
              className={cn(
                "p-2 rounded-full transition-colors",
                state.repeatMode !== 'none'
                  ? "text-[var(--accent-primary)] bg-[var(--accent-primary)]/20" 
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10"
              )}
            >
              <Repeat className="w-5 h-5" />
            </button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={actions.toggleLike}
              className={cn(
                "p-2 rounded-full transition-colors",
                state.isLiked 
                  ? "text-red-500 bg-red-500/20" 
                  : "text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10"
              )}
            >
              <Heart className={cn("w-5 h-5", state.isLiked && "fill-current")} />
            </button>
          </div>

          {remainingTime && (
            <div className="text-center">
              <p className="text-sm text-[var(--accent-primary)]">
                Sleep timer: {Math.ceil(remainingTime / 60)} minutes remaining
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
