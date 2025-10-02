// lib/offline-storage.ts - IndexedDB Offline Music Storage
"use client";

interface OfflineTrack {
  id: string;
  trackId: string;
  title: string;
  artistName: string;
  albumName?: string;
  duration: number;
  audioBlob: Blob;
  coverArtBlob?: Blob;
  addedAt: Date;
  lastPlayedAt?: Date;
  metadata: {
    genre?: string;
    year?: number;
    bitrate?: string;
    format?: string;
  };
  source: "uploaded" | "scraped" | "library";
  sourceUrl?: string;
}

interface PlaylistOffline {
  id: string;
  name: string;
  description?: string;
  trackIds: string[];
  coverArt?: Blob;
  createdAt: Date;
  updatedAt: Date;
}

class OfflineStorageManager {
  private dbName = "SonityOfflineStorage";
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create tracks store
        if (!db.objectStoreNames.contains("tracks")) {
          const trackStore = db.createObjectStore("tracks", { keyPath: "id" });
          trackStore.createIndex("trackId", "trackId", { unique: false });
          trackStore.createIndex("artistName", "artistName", { unique: false });
          trackStore.createIndex("addedAt", "addedAt", { unique: false });
          trackStore.createIndex("source", "source", { unique: false });
        }

        // Create playlists store
        if (!db.objectStoreNames.contains("playlists")) {
          const playlistStore = db.createObjectStore("playlists", { keyPath: "id" });
          playlistStore.createIndex("name", "name", { unique: false });
          playlistStore.createIndex("createdAt", "createdAt", { unique: false });
        }

        // Create metadata store
        if (!db.objectStoreNames.contains("metadata")) {
          db.createObjectStore("metadata", { keyPath: "key" });
        }
      };
    });
  }

  private ensureDb(): IDBDatabase {
    if (!this.db) {
      throw new Error("Database not initialized. Call init() first.");
    }
    return this.db;
  }

  // **Save Track from Platform Library**
  async saveTrackOffline(
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
  ): Promise<string> {
    const db = this.ensureDb();
    const id = `saved_${trackData.trackId}_${Date.now()}`;

    try {
      // Fetch audio from platform
      const response = await fetch(trackData.audioUrl);
      if (!response.ok) throw new Error("Failed to download track");

      const audioBlob = await response.blob();
      
      let coverArtBlob: Blob | undefined;
      if (trackData.coverArtUrl) {
        try {
          const coverResponse = await fetch(trackData.coverArtUrl);
          if (coverResponse.ok) {
            coverArtBlob = await coverResponse.blob();
          }
        } catch (err) {
          console.warn("Failed to download cover art:", err);
        }
      }

      const track: OfflineTrack = {
        id,
        trackId: trackData.trackId,
        title: trackData.title,
        artistName: trackData.artistName,
        albumName: trackData.albumName,
        duration: trackData.duration,
        audioBlob,
        coverArtBlob,
        addedAt: new Date(),
        metadata: trackData.metadata || {},
        source: "library",
      };

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(["tracks"], "readwrite");
        const store = transaction.objectStore("tracks");
        const request = store.add(track);

        request.onsuccess = () => resolve(id);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      throw new Error(`Failed to save track offline: ${error}`);
    }
  }

  // **Get Audio Duration**
  private async getAudioDuration(blob: Blob): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const url = URL.createObjectURL(blob);

      audio.addEventListener("loadedmetadata", () => {
        URL.revokeObjectURL(url);
        resolve(audio.duration);
      });

      audio.addEventListener("error", () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load audio metadata"));
      });

      audio.src = url;
    });
  }

  // **Get All Tracks**
  async getAllTracks(): Promise<OfflineTrack[]> {
    const db = this.ensureDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["tracks"], "readonly");
      const store = transaction.objectStore("tracks");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // **Get Track by ID**
  async getTrack(id: string): Promise<OfflineTrack | null> {
    const db = this.ensureDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["tracks"], "readonly");
      const store = transaction.objectStore("tracks");
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // **Get Track Audio Blob URL**
  async getTrackAudioUrl(id: string): Promise<string | null> {
    const track = await this.getTrack(id);
    if (!track) return null;

    return URL.createObjectURL(track.audioBlob);
  }

  // **Delete Track**
  async deleteTrack(id: string): Promise<void> {
    const db = this.ensureDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["tracks"], "readwrite");
      const store = transaction.objectStore("tracks");
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // **Update Last Played**
  async updateLastPlayed(id: string): Promise<void> {
    const db = this.ensureDb();
    const track = await this.getTrack(id);
    if (!track) return;

    track.lastPlayedAt = new Date();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["tracks"], "readwrite");
      const store = transaction.objectStore("tracks");
      const request = store.put(track);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // **Create Playlist**
  async createPlaylist(
    name: string,
    description?: string,
    trackIds: string[] = []
  ): Promise<string> {
    const db = this.ensureDb();
    const id = `playlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const playlist: PlaylistOffline = {
      id,
      name,
      description,
      trackIds,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["playlists"], "readwrite");
      const store = transaction.objectStore("playlists");
      const request = store.add(playlist);

      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(request.error);
    });
  }

  // **Get All Playlists**
  async getAllPlaylists(): Promise<PlaylistOffline[]> {
    const db = this.ensureDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["playlists"], "readonly");
      const store = transaction.objectStore("playlists");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // **Add Track to Playlist**
  async addTrackToPlaylist(playlistId: string, trackId: string): Promise<void> {
    const db = this.ensureDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["playlists"], "readwrite");
      const store = transaction.objectStore("playlists");
      const getRequest = store.get(playlistId);

      getRequest.onsuccess = () => {
        const playlist = getRequest.result;
        if (!playlist) {
          reject(new Error("Playlist not found"));
          return;
        }

        if (!playlist.trackIds.includes(trackId)) {
          playlist.trackIds.push(trackId);
          playlist.updatedAt = new Date();

          const putRequest = store.put(playlist);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // **Get Storage Usage**
  async getStorageUsage(): Promise<{ used: number; total: number; percentage: number }> {
    if (!navigator.storage || !navigator.storage.estimate) {
      return { used: 0, total: 0, percentage: 0 };
    }

    const estimate = await navigator.storage.estimate();
    const used = estimate.usage || 0;
    const total = estimate.quota || 0;
    const percentage = total > 0 ? (used / total) * 100 : 0;

    return { used, total, percentage };
  }

  // **Clear All Data**
  async clearAllData(): Promise<void> {
    const db = this.ensureDb();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["tracks", "playlists"], "readwrite");

      const tracksStore = transaction.objectStore("tracks");
      const playlistsStore = transaction.objectStore("playlists");

      const clearTracks = tracksStore.clear();
      const clearPlaylists = playlistsStore.clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorageManager();
export type { OfflineTrack, PlaylistOffline };
