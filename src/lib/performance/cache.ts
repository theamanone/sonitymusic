import { NextRequest, NextResponse } from 'next/server';

export interface CacheConfig {
  maxAge: number;
  staleWhileRevalidate?: number;
  tags?: string[];
  vary?: string[];
}

export const CACHE_CONFIGS = {
  // Static assets
  STATIC_LONG: { maxAge: 31536000, tags: ['static'] }, // 1 year
  STATIC_SHORT: { maxAge: 86400, tags: ['static'] }, // 1 day
  
  // API responses
  API_SHORT: { maxAge: 300, staleWhileRevalidate: 60, tags: ['api'] }, // 5 min
  API_MEDIUM: { maxAge: 1800, staleWhileRevalidate: 300, tags: ['api'] }, // 30 min
  API_LONG: { maxAge: 3600, staleWhileRevalidate: 600, tags: ['api'] }, // 1 hour
  
  // Video content
  VIDEO_METADATA: { maxAge: 3600, tags: ['video', 'metadata'] },
  VIDEO_STREAM: { maxAge: 86400, tags: ['video', 'stream'] },
  HLS_MANIFEST: { maxAge: 300, tags: ['hls', 'manifest'] },
  HLS_SEGMENTS: { maxAge: 86400, tags: ['hls', 'segments'] },
  
  // User data
  USER_PROFILE: { maxAge: 600, tags: ['user'] }, // 10 min
  USER_ACTIVITY: { maxAge: 300, tags: ['user', 'activity'] }, // 5 min
} as const;

export class CacheManager {
  static setHeaders(response: NextResponse, config: CacheConfig): NextResponse {
    const cacheControl = [];
    
    if (config.maxAge > 0) {
      cacheControl.push(`max-age=${config.maxAge}`);
    }
    
    if (config.staleWhileRevalidate) {
      cacheControl.push(`stale-while-revalidate=${config.staleWhileRevalidate}`);
    }
    
    response.headers.set('Cache-Control', cacheControl.join(', '));
    
    if (config.tags) {
      response.headers.set('Cache-Tags', config.tags.join(','));
    }
    
    if (config.vary) {
      response.headers.set('Vary', config.vary.join(', '));
    }
    
    // Add ETag for better caching
    const etag = this.generateETag(response);
    if (etag) {
      response.headers.set('ETag', etag);
    }
    
    return response;
  }
  
  static generateETag(response: NextResponse): string | null {
    try {
      // Simple ETag generation based on content
      const content = JSON.stringify(response);
      const hash = Buffer.from(content).toString('base64').slice(0, 16);
      return `"${hash}"`;
    } catch {
      return null;
    }
  }
  
  static checkIfModified(request: NextRequest, etag: string): boolean {
    const ifNoneMatch = request.headers.get('if-none-match');
    return ifNoneMatch !== etag;
  }
  
  static createCachedResponse(data: any, config: CacheConfig): NextResponse {
    const response = NextResponse.json(data);
    return this.setHeaders(response, config);
  }
}

// Redis-like in-memory cache for development
class MemoryCache {
  private cache = new Map<string, { data: any; expires: number; tags: string[] }>();
  
  set(key: string, data: any, ttl: number, tags: string[] = []): void {
    const expires = Date.now() + (ttl * 1000);
    this.cache.set(key, { data, expires, tags });
  }
  
  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
  
  invalidateByTag(tag: string): number {
    let count = 0;
    for (const [key, item] of Array.from(this.cache.entries())) {
      if (item.tags.includes(tag)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  size(): number {
    return this.cache.size;
  }
}

export const memoryCache = new MemoryCache();

// Cache middleware wrapper
export function withCache<T>(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>,
  config: CacheConfig,
  keyGenerator?: (request: NextRequest, ...args: any[]) => string
) {
  return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    const cacheKey = keyGenerator 
      ? keyGenerator(request, ...args)
      : `${request.method}:${request.url}`;
    
    // Try to get from cache
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      const response = NextResponse.json(cached);
      response.headers.set('X-Cache', 'HIT');
      return CacheManager.setHeaders(response, config);
    }
    
    // Execute handler
    const response = await handler(request, ...args);
    
    // Cache successful responses
    if (response.status === 200) {
      try {
        const data = await response.clone().json();
        memoryCache.set(cacheKey, data, config.maxAge, config.tags || []);
        response.headers.set('X-Cache', 'MISS');
      } catch {
        // Non-JSON response, skip caching
      }
    }
    
    return CacheManager.setHeaders(response, config);
  };
}
