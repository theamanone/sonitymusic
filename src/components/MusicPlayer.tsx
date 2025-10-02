// components/MusicPlayer.tsx - Modern Music Player Component
"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Heart, Share2, MoreHorizontal } from "lucide-react";
import { TrackWithArtist } from "@/types/track.types";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";
import Image from "next/image";

interface MusicPlayerProps {
  currentTrack?: TrackWithArtist | null;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  progress?: number;
  duration?: number;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  onProgressChange?: (progress: number) => void;
  className?: string;
}

export default function MusicPlayer({
  currentTrack,
  isPlaying = false,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  progress = 0,
  duration = 0,
  volume = 0.7,
  onVolumeChange,
  onProgressChange,
  className,
}: MusicPlayerProps) {
  const { isDark } = useTheme();
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !onProgressChange) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressPercentage = clickX / rect.width;
    const newProgress = Math.max(0, Math.min(1, progressPercentage));

    onProgressChange(newProgress);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current || !onVolumeChange) return;

    const rect = volumeBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const volumePercentage = clickX / rect.width;
    const newVolume = Math.max(0, Math.min(1, volumePercentage));

    onVolumeChange(newVolume);
  };

  if (!currentTrack) {
    return (
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md border-t transition-all duration-300",
        isDark
          ? "bg-gray-900/95 border-gray-800"
          : "bg-white/95 border-gray-200",
        className
      )}>
        <div className="flex items-center justify-center h-20 px-6">
          <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>
            No track selected
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md border-t transition-all duration-300",
      isDark
        ? "bg-gray-900/95 border-gray-800"
        : "bg-white/95 border-gray-200",
      className
    )}>
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Track Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={currentTrack.coverArt?.small || "/images/default-track.jpg"}
                alt={currentTrack.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className={cn(
                "font-medium text-sm truncate",
                isDark ? "text-white" : "text-gray-900"
              )}>
                {currentTrack.title}
              </h4>
              <p className={cn(
                "text-xs truncate",
                isDark ? "text-gray-400" : "text-gray-600"
              )}>
                {currentTrack.artistDetails?.name || "Unknown Artist"}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={isPlaying ? onPause : onPlay}
              className="bg-green-500 hover:bg-green-400 text-white rounded-full p-2 transition-all duration-200"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button className="text-gray-400 hover:text-white transition-colors duration-200">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-2">
          <div
            ref={progressBarRef}
            className="h-1 bg-gray-600 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-between px-6 py-4">
        {/* Track Info */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={currentTrack.coverArt?.medium || "/images/default-track.jpg"}
              alt={currentTrack.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className={cn(
              "font-semibold text-lg truncate",
              isDark ? "text-white" : "text-gray-900"
            )}>
              {currentTrack.title}
            </h4>
            <p className={cn(
              "text-sm truncate",
              isDark ? "text-gray-400" : "text-gray-600"
            )}>
              {currentTrack.artistDetails?.name || "Unknown Artist"}
            </p>
          </div>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={cn(
              "text-gray-400 hover:text-red-500 transition-colors duration-200",
              isLiked && "text-red-500"
            )}
          >
            <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsShuffled(!isShuffled)}
              className={cn(
                "text-gray-400 hover:text-white transition-colors duration-200",
                isShuffled && "text-green-500"
              )}
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={onPrevious}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <SkipBack className="w-6 h-6" />
            </button>

            <button
              onClick={isPlaying ? onPause : onPlay}
              className="bg-green-500 hover:bg-green-400 text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            <button
              onClick={onNext}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <SkipForward className="w-6 h-6" />
            </button>

            <button
              onClick={() => setRepeatMode(repeatMode === "off" ? "all" : repeatMode === "all" ? "one" : "off")}
              className={cn(
                "text-gray-400 hover:text-white transition-colors duration-200",
                repeatMode !== "off" && "text-green-500"
              )}
            >
              <Repeat className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full">
            <span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-600")}>
              {formatTime(progress)}
            </span>
            <div
              ref={progressBarRef}
              className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer relative"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-600")}>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume and Actions */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="flex items-center gap-2">
            <button
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {showVolumeSlider && (
              <div
                ref={volumeBarRef}
                className="w-20 h-1 bg-gray-600 rounded-full cursor-pointer"
                onClick={handleVolumeClick}
              >
                <div
                  className="h-full bg-white rounded-full transition-all duration-200"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
            )}
          </div>

          <button className="text-gray-400 hover:text-white transition-colors duration-200">
            <Share2 className="w-5 h-5" />
          </button>

          <button className="text-gray-400 hover:text-white transition-colors duration-200">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
