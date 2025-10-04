// components/StreamingMusicPlayer.tsx - Fixed Mobile Touch & Better Timer
"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { cn, formatDuration } from '@/lib/utils';
import { TrackWithArtist } from '@/types/track.types';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import { ASSETS } from '@/utils/constants/assets.constants';
import { Play, Pause, SkipBack, SkipForward, Music, Share2, List } from 'lucide-react';
import ExpandedPlayer from './music-player/ExpandedPlayer';
import DesktopExpandedPlayer from './music-player/DesktopExpandedPlayer';
import Hls from 'hls.js';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Dynamic imports for heavy components
const MusicVisualizer = dynamic(() => import('./music-player/MusicVisualizer'), { ssr: false });
const PlayerQueue = dynamic(() => import('./music-player/PlayerQueue'), { ssr: false });
const ShareCard = dynamic(() => import('./ShareCard'), { ssr: false });

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
  playlist,
  onTrackChange,
  isPlaying: externalIsPlaying,
  onPlayStateChange,
  className,
}: StreamingMusicPlayerProps) {
  const hlsRef = useRef<Hls | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const viewportHeight = useViewportHeight();
  
  // State management
  const [showTimer, setShowTimer] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [audioAnalyser, setAudioAnalyser] = useState<AnalyserNode | null>(null);
  const [headerVisible, setHeaderVisible] = useState(true);

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

  // Timer options - More versatile naming
  const timerOptions = [
    { label: "5 minutes", value: 5 },
    { label: "10 minutes", value: 10 },
    { label: "15 minutes", value: 15 },
    { label: "30 minutes", value: 30 },
    { label: "45 minutes", value: 45 },
    { label: "1 hour", value: 60 },
    { label: "90 minutes", value: 90 },
    { label: "2 hours", value: 120 }
  ];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (state.sleepTimer && remainingTime !== null) {
      interval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev === null || prev <= 0) {
            actions.pause();
            actions.setSleepTimer(null);
            setRemainingTime(null);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.sleepTimer, remainingTime]);

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
        if (hlsRef.current && currentTrack?.audioUrl.includes('.m3u8')) {
          if (hlsRef.current.media) {
            audioRef.current.play().catch(console.error);
            setState(prev => ({ ...prev, isPlaying: true }));
          }
        } else {
          audioRef.current.play().catch(console.error);
          setState(prev => ({ ...prev, isPlaying: true }));
        }
      }
    }, [currentTrack]),

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
          if (hlsRef.current && currentTrack.audioUrl.includes('.m3u8')) {
            if (hlsRef.current.levels && hlsRef.current.levels.length > 0) {
              await audioRef.current.play();
            } else {
              setTimeout(() => {
                if (audioRef.current) {
                  audioRef.current.play().catch(console.error);
                }
              }, 1000);
            }
          } else {
            await audioRef.current.play();
          }
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
      if (playlist && playlist.length > 0 && currentTrack) {
        const currentIndex = playlist.findIndex(t => (t as any)._id === (currentTrack as any)._id);
        const nextIndex = state.isShuffled
          ? Math.floor(Math.random() * playlist.length)
          : (currentIndex + 1) % playlist.length;
        onTrackChange?.(playlist[nextIndex]);
      }
    }, [playlist, currentTrack, onTrackChange, state.isShuffled]),

    skipToPrevious: useCallback(() => {
      if (audioRef.current && state.currentTime > 3) {
        audioRef.current.currentTime = 0;
      } else if (playlist && playlist.length > 0 && currentTrack) {
        const currentIndex = playlist.findIndex(t => (t as any)._id === (currentTrack as any)._id);
        const prevIndex = state.isShuffled
          ? Math.floor(Math.random() * playlist.length)
          : (currentIndex - 1 + playlist.length) % playlist.length;
        onTrackChange?.(playlist[prevIndex]);
      }
    }, [playlist, currentTrack, onTrackChange, state.currentTime, state.isShuffled]),

    handleSeek: useCallback((time: number) => {
      if (isFinite(time) && time >= 0 && time <= state.duration && state.duration > 0 && audioRef.current) {
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
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };
    const handleDurationChange = () => {
      setState(prev => ({ ...prev, duration: audio.duration || 0 }));
    };
    const handleCanPlay = () => {
      setState(prev => ({ ...prev, isLoading: false }));
    };
    const handleLoadStart = () => {
      setState(prev => ({ ...prev, isLoading: true }));
    };
    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
      onPlayStateChange?.(false);
      if (playlist && playlist.length > 0 && currentTrack) {
        const currentIndex = playlist.findIndex(t => (t as any)._id === (currentTrack as any)._id);
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

  // HLS Player setup
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    const audio = audioRef.current;
    const isHLSStream = currentTrack.audioUrl.includes('.m3u8') || currentTrack.audioUrl.includes('/hls/');
    
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (isHLSStream && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: false,
        lowLatencyMode: true,
        backBufferLength: 90,
      });
      
      hls.loadSource(currentTrack.audioUrl);
      hls.attachMedia(audio);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest parsed successfully');
        setState(prev => ({ ...prev, isLoading: false }));
        
        if (state.isPlaying && audioRef.current) {
          audioRef.current.play().catch(console.error);
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', data);
        if (data.fatal) {
          setState(prev => ({ 
            ...prev, 
            error: `HLS Error: ${data.type} - ${data.details}`, 
            isLoading: false 
          }));
        }
      });
    } else if (isHLSStream && !Hls.isSupported()) {
      console.warn('HLS not supported in this browser');
      setState(prev => ({ 
        ...prev, 
        error: 'HLS streaming not supported in this browser', 
        isLoading: false 
      }));
    } else {
      audio.src = currentTrack.audioUrl;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentTrack]);

  // Sync external playing state
  useEffect(() => {
    if (externalIsPlaying !== undefined && externalIsPlaying !== state.isPlaying && audioRef.current && !state.isLoading) {
      setState(prev => ({ ...prev, isPlaying: externalIsPlaying }));
      if (externalIsPlaying) {
        if (hlsRef.current && currentTrack?.audioUrl.includes('.m3u8')) {
          if (hlsRef.current.levels && hlsRef.current.levels.length > 0) {
            audioRef.current.play().catch(console.error);
          }
        } else {
          audioRef.current.play().catch(console.error);
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [externalIsPlaying, state.isPlaying, state.isLoading, currentTrack]);

  // Media Session API
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
        artwork.push({ src: currentTrack.coverArt.medium, sizes: '512x512', type: 'image/jpeg' });
      }

      if (currentTrack.coverArt?.large && currentTrack.coverArt.large !== currentTrack.coverArt.medium) {
        artwork.push({ src: currentTrack.coverArt.large, sizes: '1024x1024', type: 'image/jpeg' });
      }

      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artistDetails?.name || 'Unknown Artist',
        album: currentTrack.albumId || 'Sonity',
        artwork
      });

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

  // Enhanced swipe gestures
  useEffect(() => {
    if (!state.isExpanded) return;

    const body = document.body;
    const html = document.documentElement;
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

    let startY = 0;
    let startX = 0;
    let currentY = 0;
    let currentX = 0;
    let isDragging = false;
    let isSwipeArea = false;

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as Element;
      
      isSwipeArea = target.closest('.album-art-swipe-area') !== null;
      
      const isProgressBar = target.closest('[role="slider"]') !== null;
      const isControl = target.closest('button, input, [role="button"], [data-no-swipe]') !== null;
      
      if (!isSwipeArea || isProgressBar || isControl) return;

      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      isDragging = true;
      
      // no-op (removed swipe transition flag)
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !isSwipeArea) return;

      currentY = e.touches[0].clientY;
      currentX = e.touches[0].clientX;
      const diffY = currentY - startY;
      const diffX = currentX - startX;
      
      if (diffY > 50) {
        setHeaderVisible(false);
      } else if (diffY < -20) {
        setHeaderVisible(true);
      }

      if (diffY > 120 && Math.abs(diffX) < 60 && startY < 300) {
        actions.toggleExpanded();
        isDragging = false;
      }
      else if (diffX < -140 && Math.abs(diffY) < 100) {
        actions.skipToNext();
        isDragging = false;
      }
      else if (diffX > 140 && Math.abs(diffY) < 100) {
        actions.skipToPrevious();
        isDragging = false;
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
      isSwipeArea = false;
      
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
      <audio 
        ref={audioRef} 
        crossOrigin="anonymous"
        preload="metadata"
      />

      <MusicVisualizer
        isPlaying={state.isPlaying}
        currentTime={state.currentTime}
        duration={state.duration}
        audioElement={audioRef.current}
        onVisualizerReady={() => {}}
      />

      {/* Main Player Container - Fixed for Desktop */}
      <div className={cn(
        "fixed z-[100] transition-all duration-500 ease-out",
        state.isExpanded 
          ? "inset-0" 
          : "bottom-0 left-0 right-0",
        !currentTrack && "translate-y-full"
      )}
      style={{
        height: state.isExpanded 
          ? '100vh' 
          : 'auto',
        minHeight: state.isExpanded ? 'auto' : '80px',
        paddingTop: state.isExpanded ? 'env(safe-area-inset-top)' : '0'
      }}>
        <div className="relative h-full">
          {/* iOS 16-style glass background layers */}
          {state.isExpanded ? (
            <>
              {/* Blurred cover backdrop */}
              {currentTrack?.coverArt?.default && (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${currentTrack.coverArt.default})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(60px) saturate(1.8)',
                    opacity: 0.15,
                    transform: 'scale(1.1)'
                  }}
                />
              )}
              {/* iOS-style glass overlay with enhanced blur */}
              <div className="absolute inset-0 bg-gradient-to-b from-[var(--ios-glass-heavy)] via-[var(--ios-glass-medium)] to-[var(--ios-glass-light)] backdrop-blur-[40px] backdrop-saturate-[1.8]" />
              {/* Subtle noise texture */}
              <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(circle_at_1px_1px,var(--text-primary)_1px,transparent_0)] bg-[length:24px_24px]" />
            </>
          ) : (
            <div className="absolute inset-0 bg-[var(--glass-bg)] backdrop-blur-3xl border-t border-[var(--border-primary)]" />
          )}

          {!state.isExpanded && (
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,var(--text-primary)_1px,transparent_0)] bg-[length:50px_50px]" />
            </div>
          )}

          <div className="relative h-full">
            {state.isExpanded ? (
              <>
                {/* Desktop Expanded Player */}
                <div className="hidden lg:block h-full">
                  <DesktopExpandedPlayer
                    track={currentTrack as any}
                    state={state}
                    actions={actions}
                    headerVisible={headerVisible}
                    onShare={() => setIsShareOpen(true)}
                    onToggleQueue={() => setIsQueueOpen(true)}
                    onShowTimer={() => setShowTimer(true)}
                    remainingTime={remainingTime}
                  />
                </div>
                
                {/* Mobile Expanded Player */}
                <div className="lg:hidden h-full">
                  <ExpandedPlayer
                    track={currentTrack as any}
                    state={state}
                    actions={actions}
                    headerVisible={headerVisible}
                    swipeTransition={true}
                    onShare={() => setIsShareOpen(true)}
                    onToggleQueue={() => setIsQueueOpen(true)}
                    onShowTimer={() => setShowTimer(true)}
                    remainingTime={remainingTime}
                  />
                </div>
              </>
            ) : (
              <div 
                className="relative h-full w-full cursor-pointer"
                onClick={actions.toggleExpanded}
              >

                {/* Progress Bar */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1 bg-[var(--border-secondary)] overflow-hidden"
                  style={{ zIndex: 5 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                    const newTime = percent * state.duration;
                    
                    if (isFinite(newTime) && newTime >= 0 && newTime <= state.duration && state.duration > 0) {
                      actions.handleSeek(newTime);
                    }
                  }}
                >
                  <div
                    className="h-full bg-[var(--accent-primary)] transition-[width] duration-100 ease-linear"
                    style={{ width: `${state.duration && isFinite(state.duration) && state.duration > 0 ? Math.min(100, Math.max(0, (state.currentTime / state.duration) * 100)) : 0}%` }}
                  />
                </div>
                
                {/* Mini Player - Keep Original Mobile Design */}
                <div className="flex items-center px-2 sm:px-3 lg:px-4 h-[60px] sm:h-[70px] lg:h-[80px] gap-2">
                  {/* Album Art */}
                  <div className="flex-shrink-0">
                    {currentTrack?.coverArt?.default ? (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg overflow-hidden shadow-md">
                        <Image
                          src={currentTrack.coverArt.default}
                          alt={currentTrack.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                          priority
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                        <Music className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[var(--text-primary)]" />
                      </div>
                    )}
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                      {currentTrack?.title || 'No track'}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">
                      {currentTrack?.artistDetails?.name || 'Unknown Artist'}
                    </p>
                  </div>

                  {/* Controls - Responsive */}
                  <div className="flex items-center gap-2">
                    {/* Skip Back - Always Visible */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.skipToPrevious();
                      }}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      aria-label="Previous"
                    >
                      <SkipBack className="w-5 h-5 text-[var(--text-primary)]" />
                    </button>

                    {/* Play/Pause Button - Clean Design */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        state.isPlaying ? actions.pause() : actions.play();
                      }}
                      className="p-2 sm:p-2.5 rounded-full hover:bg-white/10 transition-all active:scale-95"
                      disabled={state.isLoading}
                    >
                      {state.isLoading ? (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-[var(--text-secondary)] border-t-[var(--text-primary)] rounded-full animate-spin" />
                      ) : state.isPlaying ? (
                        <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-primary)]" />
                      ) : (
                        <Play className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-primary)]" />
                      )}
                    </button>

                    {/* Skip Forward - Always Visible */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.skipToNext();
                      }}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                      aria-label="Next"
                    >
                      <SkipForward className="w-5 h-5 text-[var(--text-primary)]" />
                    </button>

                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timer Modal */}
      {showTimer && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-md" 
            onClick={() => setShowTimer(false)} 
          />
          
          <div className="relative bg-[var(--bg-primary)] rounded-3xl w-full max-w-sm max-h-[80vh] overflow-hidden shadow-[var(--shadow-glass)] border border-[var(--glass-border)]">
            {/* Header */}
            <div className="p-4 border-b border-[var(--border-primary)]">
              <h3 className="text-lg font-bold text-[var(--text-primary)] text-center">Timer</h3>
              <p className="text-sm text-[var(--text-secondary)] text-center mt-1">
                Auto-pause music after selected time
              </p>
              {remainingTime && (
                <p className="text-xl font-bold text-[var(--accent-primary)] text-center mt-2">
                  {Math.ceil(remainingTime / 60)} min left
                </p>
              )}
            </div>

            {/* Scrollable Options with dividers */}
            <div className="p-3 max-h-[400px] overflow-y-auto">
              <div className="rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-[var(--bg-secondary)]/60 divide-y divide-[var(--border-primary)]">
                {timerOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      const totalSeconds = option.value * 60;
                      setRemainingTime(totalSeconds);
                      actions.setSleepTimer(option.value);
                      setShowTimer(false);
                    }}
                    className="w-full px-4 py-3 text-left transition-colors hover:bg-[var(--bg-tertiary)]/60 text-[var(--text-primary)]"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>

              {remainingTime && (
                <div className="mt-3">
                  <button
                    onClick={() => {
                      actions.setSleepTimer(null);
                      setRemainingTime(null);
                      setShowTimer(false);
                    }}
                    className="w-full p-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 transition-colors"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <span className="font-medium">Cancel Timer</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Queue */}
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
            id: (currentTrack as any)._id || (currentTrack as any).customTrackId || 'unknown',
            title: currentTrack.title,
            artist: currentTrack.artistDetails?.name || 'Unknown Artist',
            coverArt: currentTrack.coverArt?.default,
            duration: currentTrack.duration,
            audioUrl: currentTrack.audioUrl
          }}
          onClose={() => setIsShareOpen(false)}
        />
      )}

      {/* Spacer for content - Fixed Bottom Spacing */}
      {!state.isExpanded && (
        <div 
          className="pointer-events-none" 
          style={{ 
            height: '80px',
            paddingBottom: 'max(env(safe-area-inset-bottom), 20px)'
          }} 
        />
      )}
    </>
  );
}
