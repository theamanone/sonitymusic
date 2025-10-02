// hooks/useOfflineMusic.ts - React Hook for Offline Music Management
"use client";

import { useState, useEffect, useCallback } from "react";
import { offlineStorage, OfflineTrack, PlaylistOffline } from "@/lib/offline-storage";

interface UseOfflineMusicReturn {
  tracks: OfflineTrack[];
  playlists: PlaylistOffline[];
  isLoading: boolean;
  error: string | null;
  storageUsage: { used: number; total: number; percentage: number };
  
  // Track operations
  saveTrackOffline: (trackData: {
    trackId: string;
    title: string;
    artistName: string;
    albumName?: string;
    duration: number;
    audioUrl: string;
    coverArtUrl?: string;
    metadata?: {
      genre?: string;
      year?: number;
      bitrate?: string;
    };
  }) => Promise<string>;
  deleteTrack: (id: string) => Promise<void>;
  getTrackAudioUrl: (id: string) => Promise<string | null>;
  updateLastPlayed: (id: string) => Promise<void>;
  
  // Playlist operations
  createPlaylist: (name: string, description?: string, trackIds?: string[]) => Promise<string>;
  addTrackToPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  
  // Utility operations
  refreshData: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

export function useOfflineMusic(): UseOfflineMusicReturn {
  const [tracks, setTracks] = useState<OfflineTrack[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistOffline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storageUsage, setStorageUsage] = useState({ used: 0, total: 0, percentage: 0 });

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await offlineStorage.init();
      
      const [tracksData, playlistsData, usage] = await Promise.all([
        offlineStorage.getAllTracks(),
        offlineStorage.getAllPlaylists(),
        offlineStorage.getStorageUsage(),
      ]);
      
      setTracks(tracksData);
      setPlaylists(playlistsData);
      setStorageUsage(usage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load offline data");
      console.error("Error loading offline data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const saveTrackOffline = useCallback(async (
    trackData: {
      trackId: string;
      title: string;
      artistName: string;
      albumName?: string;
      duration: number;
      audioUrl: string;
      coverArtUrl?: string;
      metadata?: {
        genre?: string;
        year?: number;
        bitrate?: string;
      };
    }
  ): Promise<string> => {
    try {
      setError(null);
      const id = await offlineStorage.saveTrackOffline(trackData);
      await refreshData();
      return id;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save track offline";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [refreshData]);

  const deleteTrack = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await offlineStorage.deleteTrack(id);
      await refreshData();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete track";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [refreshData]);

  const getTrackAudioUrl = useCallback(async (id: string): Promise<string | null> => {
    try {
      return await offlineStorage.getTrackAudioUrl(id);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to get track audio URL";
      setError(errorMsg);
      return null;
    }
  }, []);

  const updateLastPlayed = useCallback(async (id: string): Promise<void> => {
    try {
      await offlineStorage.updateLastPlayed(id);
      await refreshData();
    } catch (err) {
      console.error("Failed to update last played:", err);
    }
  }, [refreshData]);

  const createPlaylist = useCallback(async (
    name: string,
    description?: string,
    trackIds: string[] = []
  ): Promise<string> => {
    try {
      setError(null);
      const id = await offlineStorage.createPlaylist(name, description, trackIds);
      await refreshData();
      return id;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create playlist";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [refreshData]);

  const addTrackToPlaylist = useCallback(async (
    playlistId: string,
    trackId: string
  ): Promise<void> => {
    try {
      setError(null);
      await offlineStorage.addTrackToPlaylist(playlistId, trackId);
      await refreshData();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to add track to playlist";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [refreshData]);

  const clearAllData = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await offlineStorage.clearAllData();
      await refreshData();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to clear data";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, [refreshData]);

  return {
    tracks,
    playlists,
    isLoading,
    error,
    storageUsage,
    saveTrackOffline,
    deleteTrack,
    getTrackAudioUrl,
    updateLastPlayed,
    createPlaylist,
    addTrackToPlaylist,
    refreshData,
    clearAllData,
  };
}
