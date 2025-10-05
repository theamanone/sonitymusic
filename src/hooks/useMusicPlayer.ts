// hooks/useMusicPlayer.ts
"use client";

import { useEffect, useState } from 'react';
import { TrackWithArtist } from '@/types/track.types';

export function useMusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState<TrackWithArtist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initial state check - only runs once after mount
  useEffect(() => {
    // Ensure we're in browser environment
    if (typeof window === 'undefined') return;

    try {
      const savedTrack = localStorage.getItem('sonity-current-track');
      const savedState = localStorage.getItem('sonity-player-state');

      if (savedTrack) {
        setCurrentTrack(JSON.parse(savedTrack));
      }
      if (savedState) {
        setIsPlaying(JSON.parse(savedState)?.isPlaying || false);
      }
    } catch (error) {
      console.warn('Error loading music player state:', error);
    }

    setIsInitialized(true);
  }, []);

  // Event listeners - only set up after initialization
  useEffect(() => {
    if (!isInitialized || typeof window === 'undefined') return;

    const handleMusicPlayerChange = (event: CustomEvent) => {
      try {
        setCurrentTrack(event.detail?.currentTrack || null);
        setIsPlaying(event.detail?.isPlaying || false);
      } catch (error) {
        console.warn('Error handling music player change:', error);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key) return;

      try {
        if (e.key === 'sonity-current-track') {
          const track = e.newValue ? JSON.parse(e.newValue) : null;
          setCurrentTrack(track);
        } else if (e.key === 'sonity-player-state') {
          const state = e.newValue ? JSON.parse(e.newValue) : null;
          setIsPlaying(state?.isPlaying || false);
        }
      } catch (error) {
        console.warn('Error handling storage change:', error);
      }
    };

    // Use passive listeners for better performance
    window.addEventListener('music-player-change', handleMusicPlayerChange as EventListener, { passive: true });
    window.addEventListener('storage', handleStorageChange, { passive: true });

    return () => {
      window.removeEventListener('music-player-change', handleMusicPlayerChange as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isInitialized]);

  return { currentTrack, isPlaying, isInitialized };
}
