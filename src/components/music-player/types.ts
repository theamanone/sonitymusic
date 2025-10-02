// components/music-player/types.ts
export interface PlayerState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
    isLoading: boolean;
    error: string | null;
    isExpanded: boolean;
    isShuffled: boolean;
    repeatMode: 'none' | 'all' | 'one';
    isLiked: boolean;
    isDragging: boolean;
    showLyrics: boolean;
    currentLyricIndex: number;
    screenOffEnabled: boolean;
    sleepTimer: number | null;
  }
  
  export interface PlayerActions {
    togglePlayPause: () => void;
    skipToNext: () => void;
    skipToPrevious: () => void;
    handleSeek: (percent: number) => void;
    handleVolumeChange: (volume: number) => void;
    toggleMute: () => void;
    toggleExpanded: () => void;
    toggleShuffle: () => void;
    cycleRepeatMode: () => void;
    toggleLike: () => void;
    toggleLyrics: () => void;
    setSleepTimer: (minutes: number | null) => void;
  }
  