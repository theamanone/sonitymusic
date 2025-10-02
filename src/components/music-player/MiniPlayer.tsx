// components/music-player/MiniPlayer.tsx - Clean iOS 26 Style
"use client";

import { TrackWithArtist } from "@/types/track.types";
import { Mic2, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PlayerState, PlayerActions } from "./types";
import ProgressBar from "./ProgressBar";

interface MiniPlayerProps {
  track: TrackWithArtist;
  state: PlayerState;
  actions: PlayerActions;
  onExpand: () => void;
  className?: string;
}

export default function MiniPlayer({
  track,
  state,
  actions,
  onExpand,
  className
}: MiniPlayerProps) {
  return (
    <div className={cn("flex items-center h-full px-4 gap-4 music-control ios-gesture", className)}>
      {/* Track Info - Clickable to expand */}
      <div
        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
        onClick={onExpand}
      >
        <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform">
          {track.coverArt?.default ? (
            <Image
              src={track.coverArt.default}
              alt={track.title}
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Mic2 className="w-7 h-7 text-white/70" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate text-base group-hover:text-violet-600 transition-colors">
            {track.title}
          </h3>
          <p className="text-sm text-gray-600 truncate">
            {track.artistDetails?.name || 'Unknown Artist'}
          </p>
        </div>
      </div>

      {/* Minimal Controls - Only Play/Pause and Skip */}
      <div className="flex items-center gap-2">
        <button
          onClick={actions.skipToPrevious}
          className="p-2 rounded-xl text-gray-700 hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Previous"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <button
          onClick={actions.togglePlayPause}
          className="p-3 rounded-full text-gray-900 hover:text-gray-700 transition-all cursor-pointer active:scale-95"
          disabled={state.isLoading}
          aria-label={state.isPlaying ? "Pause" : "Play"}
        >
          {state.isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        <button
          onClick={actions.skipToNext}
          className="p-2 rounded-xl text-gray-700 hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Next"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
      
      {/* Progress Bar - Absolute positioned at bottom */}
      <ProgressBar 
        state={state} 
        actions={actions} 
        variant="mini" 
        className="absolute bottom-0 left-0 right-0 h-1"
      />
    </div>
  );
}
