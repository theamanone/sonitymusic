// components/music/MusicRow.tsx - Enhanced for instant play
"use client";

import { TrackWithArtist } from '@/types/track.types';
import { Play, Pause, Heart, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { cn, formatDuration } from '@/lib/utils';
import { useState } from 'react';

interface MusicRowProps {
  tracks: TrackWithArtist[];
  title?: string;
  cardSize?: 'small' | 'medium' | 'large';
  showArtist?: boolean;
  showPlayButton?: boolean;
  onTrackSelect?: (track: TrackWithArtist) => void;
  currentPlayingTrack?: TrackWithArtist | null;
  isPlaying?: boolean;
  onPlay?: (track: TrackWithArtist) => void;
  onPause?: () => void;
  className?: string;
}

export default function MusicRow({
  tracks,
  title,
  cardSize = 'medium',
  showArtist = true,
  showPlayButton = true,
  onTrackSelect,
  currentPlayingTrack,
  isPlaying,
  onPlay,
  onPause,
  className
}: MusicRowProps) {
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

  const cardSizeClasses = {
    small: 'w-28 sm:w-32',
    medium: 'w-36 sm:w-40',
    large: 'w-44 sm:w-48',
  };

  const handlePlayClick = (e: React.MouseEvent, track: TrackWithArtist) => {
    e.stopPropagation();
    
    if (currentPlayingTrack?._id === track._id) {
      if (isPlaying) {
        onPause?.();
      } else {
        onPlay?.(track);
      }
    } else {
      onTrackSelect?.(track);
      onPlay?.(track);
    }
  };

  const handleCardClick = (track: TrackWithArtist) => {
    onTrackSelect?.(track);
    onPlay?.(track);
  };

  return (
    <div className={cn("w-full", className)}>
      {title && (
        <div className="flex items-center justify-between mb-3 sm:mb-4 px-1">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
        </div>
      )}
      
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 hide-scrollbar">
        {tracks.map((track) => {
          const isCurrentTrack = currentPlayingTrack?._id === track._id;
          const isTrackPlaying = isCurrentTrack && isPlaying;
          
          return (
            <div
              key={track._id}
              className={cn("flex-shrink-0 group cursor-pointer", cardSizeClasses[cardSize])}
              onMouseEnter={() => setHoveredTrack(track._id)}
              onMouseLeave={() => setHoveredTrack(null)}
              onClick={() => handleCardClick(track)}
            >
              <div className={cn(
                "relative aspect-square rounded-2xl overflow-hidden mb-2 sm:mb-3 transition-all duration-300",
                "backdrop-blur-2xl bg-gradient-to-br from-white/40 to-white/20 border border-white/20",
                "shadow-sm group-hover:shadow-lg group-hover:scale-105",
                isCurrentTrack && "border-violet-400/50 shadow-violet-400/10"
              )}>
                {track.coverArt?.default ? (
                  <Image
                    src={track.coverArt.default}
                    alt={track.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes={cardSize === 'small' ? '128px' : cardSize === 'medium' ? '160px' : '192px'}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 flex items-center justify-center">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                      <Play className="w-4 h-4 sm:w-6 sm:h-6 text-white fill-current ml-0.5" />
                    </div>
                  </div>
                )}

                {(hoveredTrack === track._id || (isCurrentTrack && isPlaying)) && (
                  <div 
                    className={cn(
                      "absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-200",
                      (hoveredTrack === track._id || (isCurrentTrack && isPlaying)) ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <button
                      onClick={(e) => handlePlayClick(e, track)}
                      className={cn(
                        "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95",
                        "text-white hover:text-gray-200"
                      )}
                      aria-label={isTrackPlaying ? "Pause" : "Play"}
                    >
                      {isTrackPlaying ? (
                        <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
                      )}
                    </button>
                  </div>
                )}

                {isTrackPlaying && (
                  <div className="absolute top-2 right-2">
                    <div className="flex space-x-1">
                      <div className="w-1 h-3 bg-white rounded-full animate-pulse"></div>
                      <div className="w-1 h-4 bg-white rounded-full animate-pulse delay-75"></div>
                      <div className="w-1 h-2 bg-white rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-1">
                <h3 className={cn(
                  "font-semibold text-gray-900 mb-1 transition-colors",
                  "text-xs sm:text-sm line-clamp-1",
                  isCurrentTrack && "text-violet-600"
                )}>
                  {track.title}
                </h3>
                
                {showArtist && (
                  <p className="text-xs text-gray-600 line-clamp-1">
                    {track.artistDetails?.name || 'Unknown Artist'}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
