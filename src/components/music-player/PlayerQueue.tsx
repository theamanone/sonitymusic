// components/music-player/PlayerQueue.tsx - Enhanced with thumbnails
"use client";

import { useState, useEffect } from "react";
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
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Handle opening animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Use requestAnimationFrame for smoother animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsClosing(false);
        });
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
      setIsClosing(false);
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-[105] bg-black/20 backdrop-blur-sm transition-opacity duration-300",
          isOpen && !isClosing ? "opacity-100" : "opacity-0"
        )}
        onClick={handleClose}
      />
      
      {/* Queue Panel with smooth slide animation */}
      <div 
        className={cn(
          "fixed right-0 top-0 h-full w-80 sm:w-96 z-[110] transform transition-all duration-700 ease-out",
          (isOpen && !isClosing) ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
      >
        <div className="h-full relative">
          {/* iOS glass effect */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/20 to-white/10" />
            <div className="absolute inset-0 backdrop-blur-[50px] backdrop-saturate-[1.8]" />
            <div className="absolute inset-0 border-l border-white/25" />
          </div>
          
          <div className="flex flex-col h-full relative z-10">
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <h2 className="text-lg font-bold text-gray-900">Playing Queue</h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <div className="space-y-2">
                {playlist.map((track, idx) => {
                  const trackId = (track as any)._id || (track as any).id || `track-${idx}`;
                  const currentId = (currentTrack as any)?._id || (currentTrack as any)?.id;
                  return (
                    <div
                      key={trackId}
                      className={cn(
                        "p-3 rounded-xl transition-all cursor-pointer group",
                        currentId === trackId
                          ? "bg-gradient-to-r from-violet-100/60 to-fuchsia-100/60"
                          : "hover:bg-white/60"
                      )}
                    onClick={() => onTrackSelect(track)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-6">{idx + 1}</span>
                      
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        {track.coverArt?.default ? (
                          <Image
                            src={track.coverArt.default}
                            alt={track.title}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Music className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {track.title}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {track.artistDetails?.name}
                        </p>
                      </div>
                      
                      <span className="text-xs text-gray-500">
                        {formatDuration(track.duration ?? 0)}
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
    </>
  );
}
