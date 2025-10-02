// lib/session-cache.ts - Session caching utility for faster app loads
"use client";

interface CachedSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires: string;
  cachedAt: number;
}

const SESSION_CACHE_KEY = 'sonity-session-cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export class SessionCache {
  static set(session: any) {
    if (typeof window === 'undefined') return;
    
    try {
      const cachedSession: CachedSession = {
        user: session.user,
        expires: session.expires,
        cachedAt: Date.now()
      };
      
      localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(cachedSession));
    } catch (error) {
      console.warn('Failed to cache session:', error);
    }
  }

  static get(): CachedSession | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(SESSION_CACHE_KEY);
      if (!cached) return null;
      
      const session: CachedSession = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() - session.cachedAt > CACHE_DURATION) {
        this.clear();
        return null;
      }
      
      // Check if session is expired
      if (new Date(session.expires) < new Date()) {
        this.clear();
        return null;
      }
      
      return session;
    } catch (error) {
      console.warn('Failed to get cached session:', error);
      this.clear();
      return null;
    }
  }

  static clear() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(SESSION_CACHE_KEY);
    } catch (error) {
      console.warn('Failed to clear session cache:', error);
    }
  }

  static isValid(): boolean {
    const cached = this.get();
    return cached !== null;
  }
}

// App state caching for faster loads
interface AppState {
  theme: 'light' | 'dark';
  lastTrack?: {
    id: string;
    title: string;
    artist: string;
    coverArt?: string;
    position: number;
  };
  volume: number;
  isShuffled: boolean;
  repeatMode: 'off' | 'one' | 'all';
  cachedAt: number;
}

const APP_STATE_KEY = 'sonity-app-state';
const APP_STATE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export class AppStateCache {
  static set(state: Partial<AppState>) {
    if (typeof window === 'undefined') return;
    
    try {
      const current = this.get() || {} as AppState;
      const newState: AppState = {
        ...current,
        ...state,
        cachedAt: Date.now()
      };
      
      localStorage.setItem(APP_STATE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.warn('Failed to cache app state:', error);
    }
  }

  static get(): AppState | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(APP_STATE_KEY);
      if (!cached) return null;
      
      const state: AppState = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() - state.cachedAt > APP_STATE_DURATION) {
        this.clear();
        return null;
      }
      
      return state;
    } catch (error) {
      console.warn('Failed to get cached app state:', error);
      this.clear();
      return null;
    }
  }

  static clear() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(APP_STATE_KEY);
    } catch (error) {
      console.warn('Failed to clear app state cache:', error);
    }
  }
}
