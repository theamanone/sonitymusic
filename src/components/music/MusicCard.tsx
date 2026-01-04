// components/music/MusicCard.tsx - Music Track Card Component
"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Pause, Heart, MoreHorizontal, Clock } from "lucide-react";
import { TrackWithArtist } from "@/types/track.types";
import { cn, formatDuration, formatNumber } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";

interface MusicCardProps {
  track: TrackWithArtist;
  onPlay?: () => void;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  showArtist?: boolean;
  className?: string;
}

export default function MusicCard({
  track,
  onPlay,
  onClick,
  size = "md",
  showArtist = true,
  className,
}: MusicCardProps) {
  const { isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay();
    }
  };

  return (
    <div
      className={cn(
        "group relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
        sizeClasses[size],
        isDark ? "bg-gray-800/50" : "bg-gray-100",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Cover Art */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={track.coverArt?.medium || track.coverArt?.default || "/images/default-track.jpg"}
          alt={track.title}
          fill
          className={cn(
            "object-cover transition-all duration-300",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse" />
        )}

        {/* Clean Amazon Music Style - No overlay icons */}

        {/* Explicit Content Badge */}
        {track.explicit && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-medium">
            E
          </div>
        )}

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {formatDuration(track.duration)}
        </div>
      </div>

      {/* Content Info */}
      <div className="p-3">
        <h3 className={cn(
          "font-semibold line-clamp-1 mb-1",
          isDark ? "text-white" : "text-gray-900"
        )}>
          {track.title}
        </h3>

        {showArtist && track.artistDetails && (
          <p className={cn(
            "text-sm line-clamp-1 mb-2",
            isDark ? "text-gray-400" : "text-gray-600"
          )}>
            {track.artistDetails.name}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{formatNumber(track.likes)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Play className="w-3 h-3" />
              <span>{formatNumber(track.plays)}</span>
            </div>
          </div>

          {track.featured && (
            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Clean design - controls handled separately */}
    </div>
  );
}
