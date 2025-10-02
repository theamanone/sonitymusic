// components/music-player/ExpandedPlayer.tsx - Clean UI with Thumbnail
"use client";

import { TrackWithArtist } from "@/types/track.types";
import { PlayerState, PlayerActions } from "./types";

// Fallback types if imports fail
type FallbackPlayerState = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;
  isExpanded: boolean;
  showLyrics: boolean;
  isLiked: boolean;
  currentLyricIndex: number;
  isShuffled: boolean;
  repeatMode: 'none' | 'all' | 'one'; // Fixed to match PlayerState
  isDragging: boolean;
  screenOffEnabled: boolean;
  sleepTimer: number | null;
};

type FallbackPlayerActions = {
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  skipToNext: () => void;
  skipToPrevious: () => void;
  handleSeek: (time: number) => void;
  setVolume: (volume: number) => void;
  handleVolumeChange: (volume: number) => void;
  toggleMute: () => void;
  toggleExpanded: () => void;
  toggleLyrics: () => void;
  toggleLike: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  cycleRepeatMode: () => void;
  setSleepTimer: (minutes: number | null) => void;
};

import {
  Mic2,
  Heart,
  Share2,
  ChevronDown,
  List,
  FileText,
  Volume2,
  VolumeX,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import PlayerControls from "./PlayerControls";
import ProgressBar from "./ProgressBar";
import LyricsView from "./LyricsView";

interface ExpandedPlayerProps {
  track: TrackWithArtist | null;
  state: PlayerState | FallbackPlayerState;
  actions: PlayerActions | FallbackPlayerActions;
  onShare: () => void;
  onToggleQueue: () => void;
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
  headerVisible = true,
  swipeTransition = false,
  className,
}: ExpandedPlayerProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-full music-control ios-gesture",
        className
      )}
    >
      <div className="flex-1 flex flex-col min-h-0 p-4 pb-4 sm:pb-8">
        {/* Header - Conditional Visibility */}
        <div className={cn(
          "flex items-center justify-between mb-4 pt-4 sm:pt-8 z-10 relative backdrop-blur-sm rounded-b-2xl px-4 -mx-4 transition-all duration-300",
          headerVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        )}>
          <button
            onClick={actions.toggleExpanded}
            className="p-2 sm:p-3 rounded-2xl hover:bg-black/5 transition-colors cursor-pointer"
          >
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>

          <span className="text-xs font-bold text-gray-700 tracking-widest uppercase">
            Now Playing
          </span>

          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={onToggleQueue}
              className="p-2 sm:p-3 rounded-2xl hover:bg-black/5 transition-colors cursor-pointer"
            >
              <List className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>

            <button
              onClick={actions.toggleLyrics}
              className={cn(
                "p-2 sm:p-3 rounded-2xl transition-colors cursor-pointer",
                state.showLyrics
                  ? "bg-violet-100 text-violet-700"
                  : "hover:bg-black/5 text-gray-700"
              )}
            >
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Main Content - Centered */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 w-full">
          {state.showLyrics ? (
            <LyricsView currentIndex={state.currentLyricIndex} maxHeight={250} />
          ) : (
            <div className="mb-6 album-art-swipe-area">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-3xl overflow-hidden shadow-2xl mx-auto transition-transform duration-300 ease-out">
                {track ? (
                  track.coverArt?.medium ? (
                    <Image
                      src={track.coverArt.medium}
                      alt={track.title}
                      fill
                      priority
                      sizes="(max-width: 640px) 192px, 256px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                      {track.coverArt?.default ? (
                        <Image
                          src={track.coverArt.default}
                          alt={track.title}
                          fill
                          className="object-cover"
                          priority
                          sizes="(max-width: 640px) 192px, 256px"
                        />
                      ) : (
                        <Mic2 className="w-16 h-16 sm:w-20 sm:h-20 text-white/50" />
                      )}
                    </div>
                  )
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                    <Mic2 className="w-16 h-16 sm:w-20 sm:h-20 text-white/50" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Track Info */}
          {track && (
            <div className="text-center mb-4 w-full px-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 line-clamp-2 drop-shadow-sm">
                {track.title}
              </h1>
              <p className="text-base sm:text-lg text-gray-700 line-clamp-1 drop-shadow-sm">
                {track.artistDetails?.name || 'Unknown Artist'}
              </p>
            </div>
          )}
          <div className="w-full mb-4 sm:mb-6">
            <ProgressBar state={state} actions={actions} />
          </div>

          {/* Mobile Controls Layout */}
          <div className="flex flex-col gap-3 w-full">
            {/* Secondary Controls Row - Above Progress */}
            <div className="flex items-center justify-between px-8 sm:px-12 mb-2">
              {/* Left - Like Button */}
              <button
                onClick={actions.toggleLike}
                className={cn(
                  "p-2 rounded-xl transition-all cursor-pointer",
                  state.isLiked
                    ? "text-rose-600 bg-rose-100"
                    : "text-gray-700 hover:bg-black/5"
                )}
              >
                <Heart
                  className={cn(
                    "w-5 h-5",
                    state.isLiked && "fill-current"
                  )}
                />
              </button>

              {/* Right - Share Button */}
              <button
                onClick={onShare}
                className="p-2 rounded-xl text-gray-700 hover:bg-black/5 transition-all cursor-pointer"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            
            {/* Main Player Controls - Center */}
            <div className="flex justify-center">
              <PlayerControls state={state} actions={actions} size="large" />
            </div>
            
            {/* Track Progress Info */}
            <div className="flex items-center justify-between text-sm text-gray-600 px-4 mt-2 drop-shadow-sm">
              <span className="font-medium tabular-nums">{Math.floor(state.currentTime / 60)}:{String(Math.floor(state.currentTime % 60)).padStart(2, '0')}</span>
              <span className="text-center flex-1 px-4 text-xs text-gray-500">
                {track?.title || 'Unknown Track'} • {track?.artistDetails?.name || 'Unknown Artist'}
              </span>
              <span className="font-medium tabular-nums">{Math.floor(state.duration / 60)}:{String(Math.floor(state.duration % 60)).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
