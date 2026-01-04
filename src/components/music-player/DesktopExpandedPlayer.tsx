// components/music-player/DesktopExpandedPlayer.tsx - Clean iOS 26 Glass Light Theme
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Heart,
  MoreHorizontal,
  ChevronDown,
  Music,
  Share2,
  List,
  Clock,
  User,
  Album,
  ListMusic,
  Minimize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ProgressBar from "./ProgressBar";
import { SITE_CONFIG } from "@/config/site.config";
import { ASSETS } from "@/utils/constants/assets.constants";

// Real lyrics data interface
interface LyricLine {
  time: number;
  text: string;
  duration?: number;
}

// Enhanced lyrics with better timing
const getLyricsForTrack = (trackId?: string): LyricLine[] => {
  // This would normally fetch from your API based on trackId
  return [
    { time: 0, text: "Verse line one", duration: 4 },
    { time: 4, text: "Verse line two", duration: 4 },
    { time: 8, text: "Verse line three", duration: 4 },
    { time: 12, text: "Verse line four", duration: 4 },
    { time: 16, text: "Chorus begins here", duration: 4 },
    { time: 20, text: "Chorus continues", duration: 4 },
    { time: 24, text: "Chorus line three", duration: 4 },
    { time: 28, text: "Chorus ends here", duration: 4 },
  ];
};

interface DesktopExpandedPlayerProps {
  track: any;
  state: any;
  actions: any;
  headerVisible: boolean;
  onShare: () => void;
  onToggleQueue: () => void;
  onShowTimer: () => void;
  remainingTime?: number | null;
}

export default function DesktopExpandedPlayer({
  track,
  state,
  actions,
  headerVisible,
  onShare,
  onToggleQueue,
  onShowTimer,
  remainingTime,
}: DesktopExpandedPlayerProps) {
  const [showLyrics, setShowLyrics] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
  const [audioData, setAudioData] = useState<number[]>([]);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>(0);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  
  // Spacebar play/pause functionality
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only trigger if no input elements are focused
      const activeElement = document.activeElement as HTMLElement;
      const isInputFocused =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.contentEditable === "true");
      
      if (!isInputFocused && event.code === "Space") {
        event.preventDefault();
        actions.togglePlayPause();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [actions]);
  
  // Get lyrics for current track
  const lyrics = useMemo(() => getLyricsForTrack(track?.id), [track?.id]);

  // Amazon Music Style Lyrics Synchronization - Optimized
  useEffect(() => {
    if (!lyrics.length || !state.currentTime || !lyricsContainerRef.current) return;

    const currentTime = state.currentTime;
    let currentIndex = 0;

    // Find the current lyric line - optimized search
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= lyrics[i].time) {
        currentIndex = i;
        break;
      }
    }

    // Only update if index changed to prevent unnecessary renders
    if (currentIndex !== currentLyricIndex) {
      setCurrentLyricIndex(currentIndex);
      
      // Optimized scroll - only when needed and with immediate positioning
      const container = lyricsContainerRef.current;
      const activeElement = container.querySelector(`[data-lyric-index="${currentIndex}"]`);
      
      if (activeElement && showLyrics) {
        // Use transform for instant positioning instead of scrollIntoView
        const containerHeight = container.clientHeight;
        const elementTop = (activeElement as HTMLElement).offsetTop;
        const elementHeight = (activeElement as HTMLElement).offsetHeight;
        const centerPosition = elementTop - (containerHeight / 2) + (elementHeight / 2);
        
        // Only scroll if element is not in view
        const scrollTop = container.scrollTop;
        const containerBottom = scrollTop + containerHeight;
        
        if (elementTop < scrollTop || elementTop + elementHeight > containerBottom) {
          container.scrollTop = Math.max(0, centerPosition);
        }
      }
    }
  }, [state.currentTime, showLyrics, lyrics.length, currentLyricIndex]);

  // Optimized visualization with better performance
  useEffect(() => {
    if (state.isPlaying) {
      startVisualization();
    } else {
      stopVisualization();
    }
  }, [state.isPlaying]);

  const startVisualization = () => {
    let previousData: number[] = [];
    let smoothingBuffer: number[][] = [];
    const bufferSize = 3; // Smooth over 3 frames
    
    const updateVisualization = () => {
      if (!state.isPlaying) return;

      // Enhanced frequency simulation with advanced smoothing
      const rawData = [];
      const time = Date.now() * 0.001;
      
      for (let i = 0; i < 40; i++) {
        // More realistic frequency distribution
        const bassWeight = i < 8 ? 1.5 : i < 16 ? 1.2 : 1.0;
        const midWeight = i >= 8 && i < 24 ? 1.3 : 1.0;
        const trebleWeight = i >= 24 ? 1.4 : 1.0;
        
        const baseFreq = Math.sin(i * 0.15 + time * 2.5) * 50 * bassWeight + 60;
        const midFreq = Math.sin(i * 0.12 + time * 1.8) * 35 * midWeight + 45;
        const highFreq = Math.sin(i * 0.08 + time * 3.2) * 25 * trebleWeight + 30;
        
        const combined = (baseFreq + midFreq + highFreq) / 3;
        const withNoise = combined + (Math.random() - 0.5) * 8;
        rawData.push(Math.max(15, Math.min(255, withNoise)));
      }

      // Add to smoothing buffer
      smoothingBuffer.push(rawData);
      if (smoothingBuffer.length > bufferSize) {
        smoothingBuffer.shift();
      }

      // Apply multi-frame smoothing
      const processedData = [];
      for (let i = 0; i < 40; i++) {
        let sum = 0;
        for (let j = 0; j < smoothingBuffer.length; j++) {
          sum += smoothingBuffer[j][i];
        }
        const averaged = sum / smoothingBuffer.length;
        
        // Additional smoothing with previous frame
        const smoothedValue = previousData[i] 
          ? previousData[i] * 0.7 + averaged * 0.3
          : averaged;
        
        processedData.push(smoothedValue);
      }

      previousData = [...processedData];
      setAudioData(processedData);
      animationRef.current = requestAnimationFrame(updateVisualization);
    };

    updateVisualization();
  };

  const stopVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = 0;
    }
    // Immediately clear audio data when stopped
    setAudioData([]);
  };

  // Screen Recording Protection (blur sensitive content)
  const handleScreenRecording = () => {
    if (typeof window !== "undefined" && "screen" in navigator) {
      // Detect screen recording on supported browsers
      try {
        const mediaDevices = navigator.mediaDevices;
        if (
          mediaDevices &&
          typeof mediaDevices.getDisplayMedia === "function"
        ) {
          // Add protection class when screen recording is detected
          document.body.classList.add("screen-recording-protected");
        }
      } catch (error) {
        console.log("Screen recording detection not available");
      }
    }
  };

  useEffect(() => {
    handleScreenRecording();
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = () => {
      if (showMoreOptions) {
        setShowMoreOptions(false);
      }
    };

    if (showMoreOptions) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showMoreOptions]);

  // Optimized lyric progress calculation - only when needed
  const lyricProgress = useMemo(() => {
    if (!showLyrics || !lyrics.length || !state.currentTime) return 0;

    const current = lyrics[currentLyricIndex];
    const next = lyrics[currentLyricIndex + 1];

    if (!current || !next) return 0;

    const elapsed = state.currentTime - current.time;
    const duration = next.time - current.time;

    return Math.max(0, Math.min(1, elapsed / duration));
  }, [currentLyricIndex, state.currentTime, showLyrics, lyrics]);

  return (
    <div className="flex h-full relative overflow-hidden bg-gradient-to-br from-white/98 via-white/95 to-gray-50/95 backdrop-blur-3xl border border-white/40 dark:border-gray-700/40 shadow-[0_64px_128px_rgba(0,0,0,0.18)] ring-2 ring-white/30 dark:ring-gray-700/30">
      {/* Ultra iOS 26 Glass Background */}
      <div className="absolute inset-0 z-0">
        {track?.coverArt?.default && (
          <>
            {/* Enhanced album art backdrop with iOS 26 effects */}
            <div
              className="absolute inset-0 scale-125 animate-pulse"
              style={{
                backgroundImage: `url(${track.coverArt.default})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(80px) saturate(1.2) brightness(0.85) contrast(1.1)",
                opacity: 0.25,
              }}
            />
            {/* Multiple glass layers for iOS 26 depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/25 to-white/10 dark:from-gray-100/30 dark:via-gray-200/20 dark:to-gray-300/10" />
            <div className="absolute inset-0 backdrop-blur-3xl saturate-180 brightness-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/8 via-transparent to-white/15 dark:from-white/8 dark:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-fuchsia-500/5" />
          </>
        )}

        {/* iOS 26 Glass reflection layers */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/30 to-transparent dark:from-white/20 opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white/25 to-transparent dark:from-gray-100/20 opacity-70" />
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-white/20 to-transparent dark:from-white/15 opacity-60" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-white/20 to-transparent dark:from-white/15 opacity-60" />
        
        {/* Enhanced texture pattern */}
        <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(circle_at_3px_3px,rgba(139,92,246,0.8)_1px,transparent_0)] bg-[length:60px_60px] animate-pulse" />
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[length:20px_20px]" />
      </div>

      {/* App Logo - Top Left Corner */}
      <div className="absolute top-4 left-4 z-50">
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Image
              src={ASSETS.LOGO.PRIMARY}
              alt="Sonity Logo"
              width={24}
              height={24}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-md transition-all duration-300 group-hover:scale-125 opacity-90"
              style={{ width: "auto", height: "auto" }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.nextElementSibling?.classList.remove("hidden");
              }}
            />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full opacity-90 hidden group-hover:block" />
          </div>
          <span className="font-medium text-sm text-gray-700 opacity-80 hidden sm:block">
            {SITE_CONFIG.NAME}
          </span>
        </div>
      </div>

      {/* Left Panel - Clean Album Art */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col items-center justify-center p-8 relative z-10">
        {/* Clean Album Art */}
        <div
          className="relative group cursor-pointer"
          onClick={actions.togglePlayPause}
        >
          <div className="w-80 h-80 xl:w-96 xl:h-96 rounded-3xl overflow-hidden relative bg-white/30 backdrop-blur-3xl border border-white/40 dark:border-gray-600/40 shadow-[0_32px_64px_rgba(0,0,0,0.12)] ring-1 ring-white/20">
            <div className="absolute inset-0 bg-gradient-to-t from-black/8 via-transparent to-white/15 dark:from-white/8 dark:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5" />
            {track?.coverArt?.default ? (
              <Image
                src={track.coverArt.default}
                alt={track.title}
                width={400}
                height={400}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.02] relative z-10 rounded-3xl"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 flex items-center justify-center relative z-10 rounded-3xl">
                <Music className="w-24 h-24 text-gray-400" />
              </div>
            )}
          </div>

          {/* Enhanced Play Overlay with iOS 26 Glass */}
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20">
            <div className="w-24 h-24 rounded-full backdrop-blur-2xl bg-white/90 flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/50 dark:border-gray-600/50 shadow-2xl shadow-violet-500/20 ring-2 ring-white/30">
              {state.isPlaying ? (
                <Pause className="w-10 h-10 text-gray-800 dark:text-gray-200" />
              ) : (
                <Play className="w-10 h-10 text-gray-800 dark:text-gray-200 ml-1" />
              )}
            </div>
          </div>

          {/* Clean Audio Visualization */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-end gap-0.5 z-15">
            {state.isPlaying && audioData.length > 0
              ? audioData.slice(0, 20).map((value, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full transition-all duration-75 ease-out bg-gray-400"
                    style={{
                      height: `${Math.max(4, (value / 255) * 30 + 4)}px`,
                      opacity: 0.6 + (value / 255) * 0.4,
                    }}
                  />
                ))
              : [...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gray-300 rounded-full"
                    style={{ height: "6px" }}
                  />
                ))}
          </div>
        </div>

        {/* Clean Track Info */}
        <div className="mt-8 text-center max-w-sm space-y-3 relative z-10">
          <h1 className="text-2xl xl:text-3xl font-bold text-gray-800 mb-2 truncate">
            {track?.title || "Unknown Track"}
          </h1>
          <p className="text-lg xl:text-xl text-gray-600 truncate">
            {track?.artistDetails?.name || "Unknown Artist"}
          </p>
          {track?.genre && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs text-gray-600 mt-2">
              {track.genre}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Clean Controls & Content */}
      <div className="flex-1 lg:w-1/2 xl:w-3/5 flex flex-col relative z-10 ">
        {/* Always Visible Header - Clean */}
        <div className="flex items-center justify-between p-4 lg:p-6 transition-all duration-300 relative z-20 border-b border-gray-200/30">
          <div className="flex items-center gap-2">
            <button
              onClick={actions.toggleExpanded}
              className="p-2 rounded-full hover:bg-white/20 transition-all active:scale-95 cursor-pointer"
            >
              <ChevronDown className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={actions.toggleLike}
              className={cn(
                "p-3 rounded-2xl backdrop-blur-xl  transition-all duration-300 active:scale-95 cursor-pointer ",
                state.isLiked
                  ? "text-red-500"
                  : "text-gray-600 hover:text-red-500 "
              )}
            >
              <Heart
                className={cn("w-5 h-5", state.isLiked && "fill-current")}
              />
            </button>

            <button
              onClick={onShowTimer}
              className={cn(
                "p-2 rounded-full hover:bg-white/20 transition-all active:scale-95 cursor-pointer relative",
                remainingTime && "text-blue-600 bg-blue-50"
              )}
            >
              <Clock className="w-5 h-5 text-gray-600" />
              {remainingTime && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>

            <button
              onClick={onShare}
              className="p-2 rounded-full hover:bg-white/20 transition-all active:scale-95 cursor-pointer"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={onToggleQueue}
              className="p-2 rounded-full hover:bg-white/20 transition-all active:scale-95 cursor-pointer"
            >
              <List className="w-5 h-5 text-gray-600" />
            </button>

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMoreOptions(!showMoreOptions);
                }}
                className="p-2 rounded-full hover:bg-white/20 transition-all active:scale-95 cursor-pointer"
              >
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </button>

              {showMoreOptions && (
                <div className="absolute top-full right-0 mt-2 w-48 sm:w-56 bg-gradient-to-br from-white/95 via-white/80 to-gray-50/90 backdrop-blur-3xl border border-white/40 dark:border-gray-700/40 shadow-[0_48px_96px_rgba(0,0,0,0.15)] ring-1 ring-white/20 dark:ring-gray-700/20 rounded-2xl py-2 z-50">
                  <button
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    onClick={() => setShowMoreOptions(false)}
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Go to Artist</span>
                    <span className="sm:hidden">Artist</span>
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    onClick={() => setShowMoreOptions(false)}
                  >
                    <Album className="w-4 h-4" />
                    <span className="hidden sm:inline">Go to Album</span>
                    <span className="sm:hidden">Album</span>
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    onClick={() => setShowMoreOptions(false)}
                  >
                    <ListMusic className="w-4 h-4" />
                    <span className="hidden sm:inline">Add to Playlist</span>
                    <span className="sm:hidden">Playlist</span>
                  </button>
                  <div className="border-t border-gray-200 my-1" />
                </div>
              )}
            </div>

            <button
              onClick={actions.toggleExpanded}
              className="p-2 rounded-full hover:bg-white/20 transition-all active:scale-95 cursor-pointer ml-2"
              title="Minimize Player"
            >
              <Minimize2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile Track Info (Hidden on Desktop) - Responsive */}
        <div className="lg:hidden px-4 sm:px-6 py-4 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 truncate">
            {track?.title || "Unknown Track"}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 truncate">
            {track?.artistDetails?.name || "Unknown Artist"}
          </p>
        </div>

        {/* Clean Content Area - Responsive */}
        <div className="flex-1 px-2 sm:px-4 lg:px-6 py-4">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="flex bg-white/80 backdrop-blur-2xl rounded-full p-1.5 ">
              <button
                onClick={() => setShowLyrics(false)}
                className={cn(
                  "px-6 sm:px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer active:scale-95",
                  !showLyrics
                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
                    : "text-gray-700 hover:text-gray-900 hover:bg-white/60"
                )}
              >
                Visualizer
              </button>
              <button
                onClick={() => setShowLyrics(true)}
                className={cn(
                  "px-6 sm:px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer active:scale-95",
                  showLyrics
                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
                    : "text-gray-700 hover:text-gray-900 hover:bg-white/60"
                )}
              >
                Lyrics
              </button>
            </div>
          </div>

          {/* Enhanced Content Display */}
          <div className="flex-1 flex items-center justify-center transition-all duration-500 ease-in-out">
            {showLyrics ? (
              /* Amazon Music Style Clean Lyrics */
              <div className="w-full max-w-4xl h-64 sm:h-80 flex flex-col transition-all duration-500 ease-in-out">
                <div
                  ref={lyricsContainerRef}
                  className="flex-1 overflow-y-auto px-4 sm:px-6 py-6"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitOverflowScrolling: "touch"
                  }}
                >
                  <div className="space-y-4 sm:space-y-6">
                    {lyrics.map((lyric: LyricLine, index: number) => {
                      const isCurrent = index === currentLyricIndex;
                      const isPast = index < currentLyricIndex;
                      
                      return (
                        <div
                          key={index}
                          data-lyric-index={index}
                          className="text-center transition-all duration-200 cursor-pointer px-2 sm:px-4 py-2"
                          onClick={() => {
                            if (actions.handleSeek) {
                              actions.handleSeek(lyric.time);
                            }
                          }}
                        >
                          <p className={cn(
                            "font-medium leading-relaxed transition-all duration-200",
                            isCurrent 
                              ? "text-base sm:text-lg xl:text-xl text-gray-900 font-semibold" 
                              : isPast
                              ? "text-sm sm:text-base text-gray-400"
                              : "text-sm sm:text-base text-gray-600"
                          )}>
                            {lyric.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* Enhanced iOS 26 Visualizer - Amazon Music Style */
              <div className="w-full max-w-4xl h-40 sm:h-56 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-2xl rounded-3xl flex items-end justify-center gap-1 p-6 sm:p-8 ring-1 ring-white/20">
                {state.isPlaying && audioData.length > 0
                  ? audioData
                      .slice(0, window.innerWidth < 640 ? 24 : 40)
                      .map((value, i) => (
                        <div
                          key={i}
                          className="rounded-full transition-all duration-700 ease-out bg-gradient-to-t from-violet-500 via-fuchsia-500 to-violet-400"
                          style={{
                            width: window.innerWidth < 640 ? "4px" : "5px",
                            height: `${Math.max(
                              8,
                              (value / 255) *
                                (window.innerWidth < 640 ? 80 : 120) +
                                8
                            )}px`,
                            opacity: 0.7 + (value / 255) * 0.3,
                            boxShadow: `0 0 ${(value / 255) * 20 + 5}px rgba(139, 92, 246, 0.4)`,
                          }}
                        />
                      ))
                  : [...Array(window.innerWidth < 640 ? 24 : 40)].map(
                      (_, i) => (
                        <div
                          key={i}
                          className="rounded-full bg-gradient-to-t from-gray-400 to-gray-300 animate-pulse transition-all duration-300"
                          style={{
                            width: window.innerWidth < 640 ? "4px" : "5px",
                            height: window.innerWidth < 640 ? "12px" : "16px",
                            opacity: 0.4,
                          }}
                        />
                      )
                    )}
              </div>
            )}
          </div>
        </div>

        {/* Clean Bottom Controls - Matching Background */}
        <div className="p-4 lg:p-6 space-y-4 pb-8 ">
          <ProgressBar
            state={state}
            actions={actions}
            variant="full"
            className="mb-3"
          />

          {/* Main Controls */}
          <div className="flex items-center justify-center gap-4 pb-4">
            <motion.button
              onClick={actions.toggleShuffle}
              className={cn(
                "p-3 rounded-2xl backdrop-blur-xl hover:bg-white/80 transition-all duration-300 cursor-pointer",
                state.isShuffled
                  ? "text-violet-600 bg-white/60"
                  : "text-gray-600 hover:text-gray-800 hover:bg-white/20"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                animate={{ 
                  rotate: state.isShuffled ? 360 : 0,
                  color: state.isShuffled ? "#8b5cf6" : "#6b7280"
                }}
                transition={{ duration: 0.3 }}
              >
                <Shuffle className="w-4 h-4" />
              </motion.div>
            </motion.button>

            <motion.button
              onClick={actions.skipToPrevious}
              className="p-3 rounded-full hover:bg-white/20 transition-all cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <SkipBack className="w-6 h-6 text-gray-700" />
            </motion.button>

            {/* Enhanced Amazon Music Style Play Button */}
            <motion.button
              onClick={actions.togglePlayPause}
              className="p-5 rounded-3xl backdrop-blur-3xl transition-all duration-300 cursor-pointer"
              disabled={state.isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <AnimatePresence mode="wait">
                {state.isLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="w-8 h-8 border-3 border-gray-700/30 border-t-gray-700 rounded-full animate-spin" 
                  />
                ) : state.isPlaying ? (
                  <motion.div
                    key="pause"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Pause className="w-12 h-12 text-gray-700" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Play className="w-12 h-12 text-gray-700 ml-1" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              onClick={actions.skipToNext}
              className="p-3 rounded-full hover:bg-white/20 transition-all cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <SkipForward className="w-6 h-6 text-gray-700" />
            </motion.button>

            <motion.button
              onClick={actions.cycleRepeatMode}
              className={cn(
                "p-3 rounded-2xl backdrop-blur-xl hover:bg-white/80 transition-all duration-300 cursor-pointer relative",
                state.repeatMode !== "none"
                  ? "text-violet-600 bg-white/60"
                  : "text-gray-600 hover:text-gray-800 hover:bg-white/20"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                animate={{ 
                  rotate: state.repeatMode !== 'none' ? 360 : 0,
                  color: state.repeatMode !== 'none' ? "#8b5cf6" : "#6b7280"
                }}
                transition={{ duration: 0.3 }}
              >
                <Repeat className="w-4 h-4" />
              </motion.div>
              <AnimatePresence>
                {state.repeatMode === "one" && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-violet-600 rounded-full flex items-center justify-center"
                  >
                    <span className="text-white text-xs font-bold">1</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Timer Display - Compact */}
          <AnimatePresence>
            {remainingTime && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center pt-2"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-xl rounded-full border border-white/30">
                  <motion.div 
                    className="w-1.5 h-1.5 bg-violet-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <Clock className="w-3 h-3 text-gray-600" />
                  <span className="text-xs text-gray-700 font-medium">
                    Sleep timer: {Math.ceil(remainingTime / 60)} min
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
