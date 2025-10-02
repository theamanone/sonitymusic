// lib/recent-plays.ts - Recent Plays Management with Offline Storage
"use client";

import { offlineStorage } from './offline-storage';

interface RecentPlay {
  id: string;
  trackId: string;
  title: string;
  artistName: string;
  albumName?: string;
  coverArt?: string;
  duration: number;
  playedAt: Date;
  playCount: number;
  lastPosition?: number; // Last playback position in seconds
  source: 'local' | 'streaming' | 'offline';
}

class RecentPlaysManager {
  private maxRecentPlays = 50; // Keep last 50 plays
  private storageKey = 'sonity_recent_plays';

  /**
   * Add a track to recent plays
   */
  async addRecentPlay(track: {
    trackId: string;
    title: string;
    artistName: string;
    albumName?: string;
    coverArt?: string;
    duration: number;
    lastPosition?: number;
    source?: 'local' | 'streaming' | 'offline';
  }): Promise<void> {
    try {
      const recentPlays = await this.getRecentPlays();
      
      // Check if track already exists in recent plays
      const existingIndex = recentPlays.findIndex(play => play.trackId === track.trackId);
      
      const recentPlay: RecentPlay = {
        id: `recent_${track.trackId}_${Date.now()}`,
        trackId: track.trackId,
        title: track.title,
        artistName: track.artistName,
        albumName: track.albumName,
        coverArt: track.coverArt,
        duration: track.duration,
        playedAt: new Date(),
        playCount: existingIndex >= 0 ? recentPlays[existingIndex].playCount + 1 : 1,
        lastPosition: track.lastPosition,
        source: track.source || 'streaming'
      };

      if (existingIndex >= 0) {
        // Update existing entry and move to top
        recentPlays.splice(existingIndex, 1);
      }

      // Add to beginning of array
      recentPlays.unshift(recentPlay);

      // Keep only the most recent plays
      const trimmedPlays = recentPlays.slice(0, this.maxRecentPlays);

      // Save to localStorage and IndexedDB
      await this.saveRecentPlays(trimmedPlays);

      // Update offline storage if available
      if (track.source === 'offline') {
        await offlineStorage.updateLastPlayed(track.trackId);
      }

    } catch (error) {
      console.error('Failed to add recent play:', error);
    }
  }

  /**
   * Get recent plays from storage
   */
  async getRecentPlays(): Promise<RecentPlay[]> {
    try {
      // Try localStorage first (faster)
      const localData = localStorage.getItem(this.storageKey);
      if (localData) {
        const plays = JSON.parse(localData).map((play: any) => ({
          ...play,
          playedAt: new Date(play.playedAt)
        }));
        return plays;
      }

      // Fallback to IndexedDB
      return await this.getRecentPlaysFromIndexedDB();
    } catch (error) {
      console.error('Failed to get recent plays:', error);
      return [];
    }
  }

  /**
   * Get recent plays from IndexedDB
   */
  private async getRecentPlaysFromIndexedDB(): Promise<RecentPlay[]> {
    try {
      await offlineStorage.init();
      // This would require extending the offline storage to support recent plays
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Failed to get recent plays from IndexedDB:', error);
      return [];
    }
  }

  /**
   * Save recent plays to storage
   */
  private async saveRecentPlays(plays: RecentPlay[]): Promise<void> {
    try {
      // Save to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(plays));

      // Also save to IndexedDB for persistence
      await this.saveRecentPlaysToIndexedDB(plays);
    } catch (error) {
      console.error('Failed to save recent plays:', error);
    }
  }

  /**
   * Save recent plays to IndexedDB
   */
  private async saveRecentPlaysToIndexedDB(plays: RecentPlay[]): Promise<void> {
    try {
      await offlineStorage.init();
      // This would require extending the offline storage schema
      // For now, we'll use localStorage as primary storage
    } catch (error) {
      console.error('Failed to save recent plays to IndexedDB:', error);
    }
  }

  /**
   * Get most played tracks
   */
  async getMostPlayed(limit: number = 10): Promise<RecentPlay[]> {
    const recentPlays = await this.getRecentPlays();
    
    // Group by trackId and sum play counts
    const playCountMap = new Map<string, RecentPlay>();
    
    recentPlays.forEach(play => {
      const existing = playCountMap.get(play.trackId);
      if (existing) {
        existing.playCount += play.playCount;
        // Keep the most recent play date
        if (play.playedAt > existing.playedAt) {
          existing.playedAt = play.playedAt;
        }
      } else {
        playCountMap.set(play.trackId, { ...play });
      }
    });

    return Array.from(playCountMap.values())
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, limit);
  }

  /**
   * Get recently played tracks (unique)
   */
  async getRecentlyPlayed(limit: number = 20): Promise<RecentPlay[]> {
    const recentPlays = await this.getRecentPlays();
    
    // Remove duplicates, keeping the most recent
    const uniquePlays = new Map<string, RecentPlay>();
    
    recentPlays.forEach(play => {
      if (!uniquePlays.has(play.trackId)) {
        uniquePlays.set(play.trackId, play);
      }
    });

    return Array.from(uniquePlays.values()).slice(0, limit);
  }

  /**
   * Clear all recent plays
   */
  async clearRecentPlays(): Promise<void> {
    try {
      localStorage.removeItem(this.storageKey);
      // Also clear from IndexedDB if implemented
    } catch (error) {
      console.error('Failed to clear recent plays:', error);
    }
  }

  /**
   * Remove a specific track from recent plays
   */
  async removeFromRecentPlays(trackId: string): Promise<void> {
    try {
      const recentPlays = await this.getRecentPlays();
      const filteredPlays = recentPlays.filter(play => play.trackId !== trackId);
      await this.saveRecentPlays(filteredPlays);
    } catch (error) {
      console.error('Failed to remove from recent plays:', error);
    }
  }

  /**
   * Get listening statistics
   */
  async getListeningStats(): Promise<{
    totalPlays: number;
    totalListeningTime: number; // in seconds
    uniqueTracks: number;
    topGenres: string[];
    averageSessionLength: number;
  }> {
    const recentPlays = await this.getRecentPlays();
    
    const totalPlays = recentPlays.reduce((sum, play) => sum + play.playCount, 0);
    const totalListeningTime = recentPlays.reduce((sum, play) => sum + (play.duration * play.playCount), 0);
    const uniqueTracks = new Set(recentPlays.map(play => play.trackId)).size;
    
    return {
      totalPlays,
      totalListeningTime,
      uniqueTracks,
      topGenres: [], // Would need genre data
      averageSessionLength: uniqueTracks > 0 ? totalListeningTime / uniqueTracks : 0
    };
  }
}

// Export singleton instance
export const recentPlaysManager = new RecentPlaysManager();
export type { RecentPlay };
