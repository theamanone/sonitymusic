// components/music-player/PlayerQueue.tsx - Enhanced with thumbnails
"use client";

import { TrackWithArtist } from "@/types/track.types";
import { X, Play, Music } from "lucide-react";
import { cn, formatDuration } from "@/lib/utils";
import Image from "next/image";

interface PlayerQueueProps {
  playlist: TrackWithArtist[];
  currentTrack: TrackWithArtist | null;
  isOpen: boolean;
  onClose: () => void;
  onTrackSelect: (track: TrackWithArtist) => void;
}

export default function PlayerQueue({
  playlist,
  currentTrack,
  isOpen,
  onClose,
  onTrackSelect
}: PlayerQueueProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 sm:w-96 z-[110] animate-in slide-in-from-right-full duration-300">
      <div className="h-full backdrop-blur-3xl bg-gradient-to-br from-white/95 via-white/90 to-white/85 border-l border-white/30 shadow-2xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <h2 className="text-lg font-bold text-gray-900">Playing Queue</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-black/5 transition-colors"
              aria-label="Close queue"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-3">
              <div className="space-y-2">
                {playlist.map((track, idx) => {
                  const trackId = (track as any)._id || (track as any).id || `track-${idx}`;
                  return (
                    <div
                      key={trackId}
                      className={cn(
                        "p-3 rounded-xl transition-all cursor-pointer backdrop-blur-xl border group",
                        (currentTrack as any)?._id === (track as any)._id || (currentTrack as any)?.id === (track as any).id
                          ? "bg-gradient-to-r from-violet-100/60 to-fuchsia-100/60 border-violet-200/50"
                          : "hover:bg-white/60 border-transparent hover:border-white/30"
                      )}
                      onClick={() => onTrackSelect(track)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 text-center">
                          <span className="text-sm text-gray-500 font-medium group-hover:hidden">
                            {idx + 1}
                          </span>
                          <Play className="w-3 h-3 text-violet-600 hidden group-hover:block mx-auto" />
                        </div>
                        
                        {/* Thumbnail */}
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          {track.coverArt?.default ? (
                            <Image
                              src={track.coverArt.default}
                              alt={track.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                              <Music className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                            {track.title}
                          </p>
                          <p className="text-xs text-gray-600 line-clamp-1">
                            {track.artistDetails?.name}
                          </p>
                        </div>
                        
                        <span className="text-xs text-gray-500 font-medium">
                          {formatDuration(track.duration)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
