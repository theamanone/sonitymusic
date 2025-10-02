// components/music/TrackGrid.tsx - Simple Track Grid Component
"use client";

import { TrackWithArtist } from "@/types/track.types";
import { cn, formatDuration, formatNumber } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Play, Heart, MoreHorizontal } from "lucide-react";
import Image from "next/image";

interface TrackGridProps {
  tracks: TrackWithArtist[];
  onTrackClick?: (track: TrackWithArtist) => void;
  className?: string;
}

export default function TrackGrid({
  tracks,
  onTrackClick,
  className,
}: TrackGridProps) {
  const { isDark } = useTheme();

  if (!tracks || tracks.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No tracks found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4", className)}>
      {tracks.map((track) => (
        <div
          key={track._id}
          className={cn(
            "group relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
            isDark ? "bg-gray-800/50" : "bg-gray-100"
          )}
          onClick={() => onTrackClick?.(track)}
        >
          {/* Cover Art */}
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={track.coverArt?.medium || track.coverArt?.default || "/images/default-track.jpg"}
              alt={track.title}
              fill
              className="object-cover transition-all duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <button className="bg-green-500 hover:bg-green-400 text-white rounded-full p-3 transition-all duration-200 hover:scale-110 shadow-lg">
                <Play className="w-5 h-5 fill-current" />
              </button>
            </div>

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

            {track.artistDetails && (
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

          {/* Hover Actions */}
          <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all duration-200 hover:scale-110">
              <Heart className="w-4 h-4" />
            </button>
            <button className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all duration-200 hover:scale-110">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
