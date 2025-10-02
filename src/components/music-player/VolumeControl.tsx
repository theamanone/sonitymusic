// components/music-player/VolumeControl.tsx - Better volume slider
"use client";

import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlayerState, PlayerActions } from "./types";

interface VolumeControlProps {
  state: PlayerState;
  actions: PlayerActions;
  showSlider?: boolean;
  className?: string;
}

export default function VolumeControl({ 
  state, 
  actions, 
  showSlider = true,
  className 
}: VolumeControlProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button 
        onClick={actions.toggleMute} 
        className="p-2 cursor-pointer rounded-xl hover:bg-black/5 transition-colors"
        aria-label="Toggle mute"
      >
        {state.isMuted ? (
          <VolumeX className="w-4 h-4 text-gray-700" />
        ) : (
          <Volume2 className="w-4 h-4 text-gray-700" />
        )}
      </button>
      
      {showSlider && (
        <div className="relative flex items-center w-20">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={state.isMuted ? 0 : state.volume}
            onChange={(e) => actions.handleVolumeChange(parseFloat(e.target.value))}
            className="volume-slider w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(state.isMuted ? 0 : state.volume) * 100}%, #e5e7eb ${(state.isMuted ? 0 : state.volume) * 100}%, #e5e7eb 100%)`
            }}
            aria-label="Volume"
          />
        </div>
      )}
    </div>
  );
}
