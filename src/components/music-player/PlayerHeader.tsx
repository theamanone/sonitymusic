// components/music-player/PlayerHeader.tsx
"use client";

import { ChevronDown, List, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerHeaderProps {
  onCollapse: () => void;
  onToggleQueue: () => void;
  onToggleLyrics: () => void;
  showLyrics: boolean;
  className?: string;
}

export default function PlayerHeader({
  onCollapse,
  onToggleQueue,
  onToggleLyrics,
  showLyrics,
  className
}: PlayerHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-6 sm:mb-8", className)}>
      <button
        onClick={onCollapse}
        className="p-2 sm:p-3 rounded-xl hover:bg-black/5 transition-colors cursor-pointer"
        aria-label="Collapse player"
      >
        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
      </button>
      
      <span className="text-sm font-medium text-gray-700 tracking-wide">NOW PLAYING</span>
      
      <div className="flex gap-2">
        <button
          onClick={onToggleQueue}
          className="p-2 sm:p-3 rounded-xl hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Open queue"
        >
          <List className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>
        
        <button
          onClick={onToggleLyrics}
          className={cn(
            "p-2 sm:p-3 rounded-xl transition-colors cursor-pointer",
            showLyrics ? "bg-violet-100 text-violet-700" : "hover:bg-black/5 text-gray-700"
          )}
          aria-label="Toggle lyrics"
        >
          <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
}
