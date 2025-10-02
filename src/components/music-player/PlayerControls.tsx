// components/music-player/PlayerControls.tsx - Clean iOS 26 Style
"use client";

import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlayerState, PlayerActions } from "./types";

interface PlayerControlsProps {
  state: PlayerState;
  actions: PlayerActions;
  size?: 'small' | 'large';
  className?: string;
}

export default function PlayerControls({ 
  state, 
  actions, 
  size = 'large',
  className 
}: PlayerControlsProps) {
  const isSmall = size === 'small';

  return (
    <div className={cn(
      "flex items-center justify-center music-control ios-gesture",
      isSmall ? "gap-2" : "gap-4 sm:gap-6",
      className
    )}>
      {!isSmall && (
        <button
          onClick={actions.toggleShuffle}
          className={cn(
            "p-3 rounded-2xl transition-all cursor-pointer",
            state.isShuffled 
              ? "text-violet-600 bg-violet-100" 
              : "text-gray-600 hover:bg-black/5"
          )}
          aria-label="Shuffle"
        >
          <Shuffle className="w-5 h-5" />
        </button>
      )}

      <button
        onClick={actions.skipToPrevious}
        className="p-2 rounded-xl text-gray-700 hover:bg-black/5 transition-colors cursor-pointer"
        aria-label="Previous"
      >
        <SkipBack className={cn(isSmall ? "w-4 h-4" : "w-6 h-6")} />
      </button>

      <button
        onClick={actions.togglePlayPause}
        className={cn(
          "rounded-full bg-transparent transition-all cursor-pointer",
          "text-gray-900 hover:text-gray-700 active:scale-95",
          isSmall ? "p-2" : "p-4"
        )}
        disabled={state.isLoading}
        aria-label={state.isPlaying ? "Pause" : "Play"}
      >
        {state.isPlaying ? (
          <Pause className={cn(isSmall ? "w-4 h-4" : "w-8 h-8")} />
        ) : (
          <Play className={cn(isSmall ? "w-4 h-4 ml-0.5" : "w-8 h-8 ml-1")} />
        )}
      </button>

      <button
        onClick={actions.skipToNext}
        className="p-2 rounded-xl text-gray-700 hover:bg-black/5 transition-colors cursor-pointer"
        aria-label="Next"
      >
        <SkipForward className={cn(isSmall ? "w-4 h-4" : "w-6 h-6")} />
      </button>

      {!isSmall && (
        <button
          onClick={actions.cycleRepeatMode}
          className={cn(
            "p-3 rounded-2xl transition-all relative cursor-pointer",
            state.repeatMode !== 'none' 
              ? "text-violet-600 bg-violet-100" 
              : "text-gray-600 hover:bg-black/5"
          )}
          aria-label="Repeat"
        >
          <Repeat className="w-5 h-5" />
          {state.repeatMode === 'one' && (
            <span className="absolute -top-1 -right-1 text-xs bg-violet-600 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
              1
            </span>
          )}
        </button>
      )}
    </div>
  );
}
