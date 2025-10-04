// hooks/useChunkCache.ts - Client-side HLS chunk caching
"use client";

import { useCallback, useRef } from 'react';

interface CacheEntry {
  data: ArrayBuffer;
  timestamp: number;
  size: number;
}

interface ChunkCacheOptions {
  maxSize?: number; // Maximum cache size in bytes
  maxAge?: number;  // Maximum age in milliseconds
}

export function useChunkCache(options: ChunkCacheOptions = {}) {
  const { maxSize = 100 * 1024 * 1024, maxAge = 30 * 60 * 1000 } = options; // 100MB, 30 minutes
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const sizeRef = useRef(0);

  const getCachedChunk = useCallback(async (url: string): Promise<ArrayBuffer | null> => {
    const entry = cacheRef.current.get(url);
    if (!entry) return null;

    // Check if entry is expired
    if (Date.now() - entry.timestamp > maxAge) {
      cacheRef.current.delete(url);
      sizeRef.current -= entry.size;
      return null;
    }

    return entry.data;
  }, [maxAge]);

  const setCachedChunk = useCallback((url: string, data: ArrayBuffer) => {
    const entry: CacheEntry = {
      data: data.slice(), // Clone the data
      timestamp: Date.now(),
      size: data.byteLength,
    };

    // Check if we need to evict old entries
    if (sizeRef.current + entry.size > maxSize) {
      evictOldEntries(entry.size);
    }

    cacheRef.current.set(url, entry);
    sizeRef.current += entry.size;
  }, [maxSize]);

  const evictOldEntries = useCallback((neededSpace: number) => {
    const entries = Array.from(cacheRef.current.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp); // Sort by timestamp (oldest first)

    let freedSpace = 0;
    for (const [url, entry] of entries) {
      if (freedSpace >= neededSpace) break;

      cacheRef.current.delete(url);
      freedSpace += entry.size;
      sizeRef.current -= entry.size;
    }
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    sizeRef.current = 0;
  }, []);

  const getCacheStats = useCallback(() => {
    return {
      size: sizeRef.current,
      entries: cacheRef.current.size,
      maxSize,
      maxAge,
    };
  }, [maxSize, maxAge]);

  return {
    getCachedChunk,
    setCachedChunk,
    clearCache,
    getCacheStats,
  };
}
