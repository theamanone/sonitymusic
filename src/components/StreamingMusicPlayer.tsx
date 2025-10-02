// components/StreamingMusicPlayer.tsx - iOS 26 Glass UI with Enhanced Controls
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useViewportHeight } from "@/hooks/useViewportHeight";
import ExpandedPlayer from "./music-player/ExpandedPlayer";
import PlayerQueue from "./music-player/PlayerQueue";
import ShareCard from "./ShareCard";
import MusicVisualizer from "./music-player/MusicVisualizer";

// Types
interface TrackWithArtist {
  id: string;
  title: string;
  artistDetails?: {
    name: string;
  };
  coverArt?: {
    default?: string;
    medium?: string;
    large?: string;
  };
  audioUrl: string;
  duration: number;
  albumId?: string;
}

interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;
  isExpanded: boolean;
  showLyrics: boolean;
  isLiked: boolean;
  currentLyricIndex: number;
  isShuffled: boolean;
  repeatMode: 'none' | 'all' | 'one';
  isDragging: boolean;
  screenOffEnabled: boolean;
  sleepTimer: number | null;
}

interface PlayerActions {
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  skipToNext: () => void;
  skipToPrevious: () => void;
  handleSeek: (time: number) => void;
  setVolume: (volume: number) => void;
  handleVolumeChange: (volume: number) => void;
  toggleMute: () => void;
  toggleExpanded: () => void;
  toggleLyrics: () => void;
  toggleLike: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  cycleRepeatMode: () => void;
  setSleepTimer: (minutes: number | null) => void;
}

interface StreamingMusicPlayerProps {
  currentTrack?: TrackWithArtist | null;
  playlist?: TrackWithArtist[];
  onTrackChange?: (track: TrackWithArtist) => void;
  isPlaying?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
}

export default function StreamingMusicPlayer({
  currentTrack,
  playlist = [],
  onTrackChange,
  isPlaying: externalIsPlaying,
  onPlayStateChange,
  className,
}: StreamingMusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const viewportHeight = useViewportHeight();

  // State management
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [audioAnalyser, setAudioAnalyser] = useState<AnalyserNode | null>(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [swipeTransition, setSwipeTransition] = useState(false);

  // Player state
  const [state, setState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false,
    isLoading: false,
    error: null,
    isExpanded: false,
    showLyrics: false,
    isLiked: false,
    currentLyricIndex: 0,
    isShuffled: false,
    repeatMode: 'none',
    isDragging: false,
    screenOffEnabled: false,
    sleepTimer: null,
  });

  // Ensure header is visible when player expands
  useEffect(() => {
    if (state.isExpanded) {
      setHeaderVisible(true);
    }
  }, [state.isExpanded]);

  // Player actions
  const actions: PlayerActions = {
    play: useCallback(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
        setState(prev => ({ ...prev, isPlaying: true }));
      }
    }, []),

    pause: useCallback(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        setState(prev => ({ ...prev, isPlaying: false }));
      }
    }, []),

    togglePlayPause: useCallback(async () => {
      if (!audioRef.current || !currentTrack) return;
      try {
        const newPlayingState = !state.isPlaying;
        if (newPlayingState) {
          await audioRef.current.play();
          setState(prev => ({ ...prev, isPlaying: true, error: null }));
        } else {
          audioRef.current.pause();
          setState(prev => ({ ...prev, isPlaying: false }));
        }
        onPlayStateChange?.(newPlayingState);
      } catch (error) {
        console.error('Playback failed:', error);
        setState(prev => ({ ...prev, error: 'Playback failed', isPlaying: false }));
        onPlayStateChange?.(false);
      }
    }, [state.isPlaying, currentTrack, onPlayStateChange]),

    skipToNext: useCallback(() => {
      if (playlist.length > 0 && currentTrack) {
        const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
        const nextIndex = state.isShuffled
          ? Math.floor(Math.random() * playlist.length)
          : (currentIndex + 1) % playlist.length;
        onTrackChange?.(playlist[nextIndex]);
      }
    }, [playlist, currentTrack, onTrackChange, state.isShuffled]),

    skipToPrevious: useCallback(() => {
      if (audioRef.current && state.currentTime > 3) {
        audioRef.current.currentTime = 0;
      } else if (playlist.length > 0 && currentTrack) {
        const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
        const prevIndex = state.isShuffled
          ? Math.floor(Math.random() * playlist.length)
          : (currentIndex - 1 + playlist.length) % playlist.length;
        onTrackChange?.(playlist[prevIndex]);
      }
    }, [playlist, currentTrack, onTrackChange, state.currentTime, state.isShuffled]),

    handleSeek: useCallback((time: number) => {
      // Validate that time is a finite number and within valid range
      if (isFinite(time) && time >= 0 && time <= state.duration && state.duration > 0 && audioRef.current && !audioRef.current.paused) {
        try {
          audioRef.current.currentTime = time;
          setState(prev => ({ ...prev, currentTime: time }));
        } catch (error) {
          console.error('Failed to seek audio:', error);
        }
      }
    }, [state.duration]),

    setVolume: (volume: number) => {
      if (audioRef.current) {
        audioRef.current.volume = volume;
        setState(prev => ({ ...prev, volume, isMuted: volume === 0 }));
      }
    },

    handleVolumeChange: useCallback((newVolume: number) => {
      setState(prev => ({ ...prev, volume: newVolume, isMuted: newVolume === 0 }));
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
    }, []),

    toggleMute: useCallback(() => {
      if (!audioRef.current) return;
      if (state.isMuted) {
        audioRef.current.volume = state.volume;
        setState(prev => ({ ...prev, isMuted: false }));
      } else {
        audioRef.current.volume = 0;
        setState(prev => ({ ...prev, isMuted: true }));
      }
    }, [state.isMuted, state.volume]),

    toggleExpanded: () => setState(prev => ({ ...prev, isExpanded: !prev.isExpanded })),
    toggleShuffle: () => setState(prev => ({ ...prev, isShuffled: !prev.isShuffled })),

    cycleRepeatMode: () => setState(prev => ({
      ...prev,
      repeatMode: prev.repeatMode === 'none' ? 'all' : prev.repeatMode === 'all' ? 'one' : 'none'
    })),

    toggleRepeat: () => setState(prev => ({
      ...prev,
      repeatMode: prev.repeatMode === 'none' ? 'one' : prev.repeatMode === 'one' ? 'all' : 'none'
    })),

    toggleLike: () => setState(prev => ({ ...prev, isLiked: !prev.isLiked })),
    toggleLyrics: () => setState(prev => ({ ...prev, showLyrics: !prev.showLyrics })),
    setSleepTimer: (minutes: number | null) => setState(prev => ({ ...prev, sleepTimer: minutes })),
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const handleTimeUpdate = () => {
      setState(prev => ({
        ...prev,
        currentTime: audio.currentTime
      }));
    };
    const handleDurationChange = () => {
      setState(prev => ({
        ...prev,
        duration: audio.duration || 0
      }));
    };
    const handleCanPlay = () => {
      setState(prev => ({
        ...prev,
        isLoading: false
      }));
    };
    const handleLoadStart = () => {
      setState(prev => ({
        ...prev,
        isLoading: true
      }));
    };
    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
      onPlayStateChange?.(false);
      // Auto-play next track
      if (playlist.length > 0 && currentTrack) {
        const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
        const nextIndex = (currentIndex + 1) % playlist.length;
        if (nextIndex !== currentIndex) {
          onTrackChange?.(playlist[nextIndex]);
        }
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, playlist, onTrackChange, onPlayStateChange]);

  // Load track with HLS support
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      setState(prev => ({ ...prev, error: null, isLoading: true, isPlaying: false }));
      
      // Check if this is an HLS stream
      const isHLSStream = currentTrack.audioUrl.includes('.m3u8') || currentTrack.audioUrl.includes('/hls/');
      
      if (isHLSStream) {
        // Use HLS streaming
        const streamUrl = currentTrack.audioUrl.startsWith('/api/hls/')
          ? currentTrack.audioUrl
          : `/api/hls/playlist.m3u8`;
        audioRef.current.src = streamUrl;
      } else {
        // Use regular streaming
        const streamUrl = currentTrack.audioUrl.startsWith('/api/stream/')
          ? currentTrack.audioUrl
          : `/api/stream/${currentTrack.audioUrl}`;
        audioRef.current.src = streamUrl;
      }
      
      audioRef.current.load();
      
      // Wait for canplay event before attempting to play
      const handleCanPlayForAutoPlay = () => {
        if (audioRef.current && !state.isPlaying) {
          audioRef.current.play().then(() => {
            setState(prev => ({ ...prev, isPlaying: true, isLoading: false }));
            onPlayStateChange?.(true);
          }).catch((error) => {
            console.error('Auto-play failed:', error);
            setState(prev => ({ ...prev, error: 'Playback failed', isPlaying: false, isLoading: false }));
          });
        }
        audioRef.current?.removeEventListener('canplay', handleCanPlayForAutoPlay);
      };
      
      audioRef.current.addEventListener('canplay', handleCanPlayForAutoPlay);
    }
  }, [currentTrack, onPlayStateChange]);

  // Sync external playing state - only when not loading a new track
  useEffect(() => {
    if (externalIsPlaying !== undefined && externalIsPlaying !== state.isPlaying && audioRef.current && !state.isLoading) {
      setState(prev => ({ ...prev, isPlaying: externalIsPlaying }));
      if (externalIsPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [externalIsPlaying, state.isPlaying, state.isLoading]);

  // Enhanced Media Session API with artwork
  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      const artwork = [];

      if (currentTrack.coverArt?.default) {
        artwork.push(
          { src: currentTrack.coverArt.default, sizes: '96x96', type: 'image/jpeg' },
          { src: currentTrack.coverArt.default, sizes: '128x128', type: 'image/jpeg' },
          { src: currentTrack.coverArt.default, sizes: '192x192', type: 'image/jpeg' },
          { src: currentTrack.coverArt.default, sizes: '256x256', type: 'image/jpeg' },
          { src: currentTrack.coverArt.default, sizes: '384x384', type: 'image/jpeg' },
          { src: currentTrack.coverArt.default, sizes: '512x512', type: 'image/jpeg' }
        );
      }

      if (currentTrack.coverArt?.medium && currentTrack.coverArt.medium !== currentTrack.coverArt.default) {
        artwork.push(
          { src: currentTrack.coverArt.medium, sizes: '512x512', type: 'image/jpeg' }
        );
      }

      if (currentTrack.coverArt?.large && currentTrack.coverArt.large !== currentTrack.coverArt.medium) {
        artwork.push(
          { src: currentTrack.coverArt.large, sizes: '1024x1024', type: 'image/jpeg' }
        );
      }

      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artistDetails?.name || 'Unknown Artist',
        album: currentTrack.albumId || 'Sonity',
        artwork
      });

      // Set playback state
      navigator.mediaSession.playbackState = state.isPlaying ? 'playing' : 'paused';

      navigator.mediaSession.setActionHandler('play', () => {
        actions.togglePlayPause();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        actions.togglePlayPause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        actions.skipToPrevious();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        actions.skipToNext();
      });
      navigator.mediaSession.setActionHandler('seekto', (details: any) => {
        if (details.seekTime && audioRef.current) {
          audioRef.current.currentTime = details.seekTime;
        }
      });
    }
  }, [currentTrack, state.isPlaying, actions]);

  // Enhanced swipe gestures with better conflict prevention
  useEffect(() => {
    if (!state.isExpanded) return;

    const body = document.body;
    const html = document.documentElement;

    // Prevent body scroll when expanded
    const scrollY = window.scrollY;
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    body.style.touchAction = 'none';
    html.style.touchAction = 'none';

    // Enhanced swipe gestures
    let startY = 0;
    let startX = 0;
    let currentY = 0;
    let currentX = 0;
    let isDragging = false;
    let isSwipeArea = false;

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as Element;
      
      // Only allow swipes on album art area, not on progress bar or controls
      isSwipeArea = target.closest('.album-art-swipe-area') !== null;
      
      // Prevent swipes on progress bar, controls, or interactive elements
      const isProgressBar = target.closest('[role="slider"]') !== null;
      const isControl = target.closest('button, input, [role="button"], [data-no-swipe]') !== null;
      
      if (!isSwipeArea || isProgressBar || isControl) return;

      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      isDragging = true;
      
      // Add visual feedback
      setSwipeTransition(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !isSwipeArea) return;

      currentY = e.touches[0].clientY;
      currentX = e.touches[0].clientX;
      const diffY = currentY - startY;
      const diffX = currentX - startX;
      
      // Hide header on swipe down
      if (diffY > 50) {
        setHeaderVisible(false);
      } else if (diffY < -20) {
        setHeaderVisible(true);
      }

      // Swipe down to close (only from top area and header area)
      if (diffY > 120 && Math.abs(diffX) < 60 && startY < 300) {
        actions.toggleExpanded();
        isDragging = false;
        setSwipeTransition(false);
      }
      // Swipe left to next track (with visual feedback)
      else if (diffX < -140 && Math.abs(diffY) < 100) {
        actions.skipToNext();
        isDragging = false;
        setSwipeTransition(false);
      }
      // Swipe right to previous track (with visual feedback)
      else if (diffX > 140 && Math.abs(diffY) < 100) {
        actions.skipToPrevious();
        isDragging = false;
        setSwipeTransition(false);
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
      isSwipeArea = false;
      setSwipeTransition(false);
      
      // Auto-show header after touch ends
      setTimeout(() => {
        setHeaderVisible(true);
      }, 2000);
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);

      // Restore body scroll
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      body.style.overflow = '';
      html.style.overflow = '';
      body.style.touchAction = '';
      html.style.touchAction = '';
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY.toString().replace('-', '')) || 0);
      }
    };
  }, [state.isExpanded, actions]);

  if (!currentTrack) return null;

  return (
    <>
      <audio ref={audioRef} crossOrigin="anonymous" />

      {/* Hidden Music Visualizer */}
      <MusicVisualizer
        isPlaying={state.isPlaying}
        currentTime={state.currentTime}
        duration={state.duration}
        audioElement={audioRef.current}
        onVisualizerReady={() => {}}
        hidden={true}
      />

      <div className={cn(
        "fixed bottom-0 left-0 right-0 transition-all duration-500 ease-out",
        state.isExpanded ? "top-0 z-[100]" : "z-[90]",
        className
      )}
      style={{
        height: state.isExpanded ? (viewportHeight ? `${viewportHeight}px` : '100vh') : '80px',
        paddingTop: state.isExpanded ? 'env(safe-area-inset-top)' : '0'
      }}>
        <div className="relative h-full">
          {/* iOS 26 Glass Background */}
          <div className={cn(
            "absolute inset-0 transition-all duration-500",
            state.isExpanded
              ? "bg-white/[0.72] backdrop-blur-[100px] backdrop-saturate-[200%]"
              : "border-t border-white/15 bg-white/[0.72] backdrop-blur-[100px] backdrop-saturate-[200%]"
          )}>
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/3" />
          </div>

          {/* Enhanced Glass Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(139,92,246,0.08)_1px,transparent_0)] bg-[length:40px_40px]" />
          </div>

          {/* Glass Shimmer Effect */}
          <div className="absolute inset-0 opacity-[0.01] pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>

          <div className={cn(
            "relative h-full",
            state.isExpanded && viewportHeight && `max-h-[${viewportHeight}px]`
          )}>
            {state.isExpanded ? (
              <ExpandedPlayer
                track={currentTrack as any}
                state={state as any}
                actions={actions as any}
                headerVisible={headerVisible}
                swipeTransition={swipeTransition}
                onShare={() => setIsShareOpen(true)}
                onToggleQueue={() => setIsQueueOpen(true)}
              />
            ) : (
              <div 
                className="relative h-full w-full cursor-pointer"
                onClick={actions.toggleExpanded}
              >
                {/* Mini Progress Bar */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1 bg-black/10 overflow-hidden"
                  style={{ zIndex: 5 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                    const newTime = percent * state.duration;
                    
                    // Validate that newTime is finite before seeking
                    if (isFinite(newTime) && newTime >= 0 && newTime <= state.duration && state.duration > 0) {
                      actions.handleSeek(newTime);
                    }
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width));
                    const newTime = percent * state.duration;
                    
                    // Validate that newTime is finite before seeking
                    if (isFinite(newTime) && newTime >= 0 && newTime <= state.duration && state.duration > 0) {
                      actions.handleSeek(newTime);
                    }
                  }}
                >
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-[width] duration-100 ease-linear shadow-sm"
                    style={{ width: `${state.duration && isFinite(state.duration) && state.duration > 0 ? Math.min(100, Math.max(0, (state.currentTime / state.duration) * 100)) : 0}%` }}
                  />
                </div>
                
                {/* Mini Player Content */}
                <div className="flex items-center px-4 h-full">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {currentTrack?.coverArt?.default && (
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                        <img
                          src={currentTrack.coverArt.default}
                          alt={currentTrack.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate drop-shadow-sm">
                        {currentTrack?.title}
                      </p>
                      <p className="text-xs text-gray-700 truncate drop-shadow-sm">
                        {currentTrack?.artistDetails?.name}
                      </p>
                    </div>
                  </div>

                  {/* Mini Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.togglePlayPause();
                      }}
                      className="w-10 h-10 flex items-center justify-center text-gray-900 hover:scale-110 transition-transform active:scale-95"
                    >
                      {state.isPlaying ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Queue Modal */}
      {isQueueOpen && (
        <PlayerQueue
          playlist={playlist as any}
          currentTrack={currentTrack as any}
          isOpen={isQueueOpen}
          onClose={() => setIsQueueOpen(false)}
          onTrackSelect={(track: any) => {
            onTrackChange?.(track);
            setIsQueueOpen(false);
          }}
        />
      )}

      {/* Share Modal */}
      {isShareOpen && (
        <ShareCard
          track={{
            title: currentTrack.title,
            artist: currentTrack.artistDetails?.name || 'Unknown Artist',
            coverArt: currentTrack.coverArt?.default,
            duration: currentTrack.duration
          }}
          onClose={() => setIsShareOpen(false)}
        />
      )}

      {/* Spacer for content above mini player */}
      {!state.isExpanded && (
        <div 
          className="pointer-events-none"
          style={{ height: `${viewportHeight ? Math.min(80, viewportHeight * 0.1) : 80}px` }}
        />
      )}
    </>
  );
}
