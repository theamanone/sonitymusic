import { NextRequest } from 'next/server';

export interface RouteOptimization {
  preload?: readonly string[];
  prefetch?: readonly string[];
  priority?: 'high' | 'medium' | 'low';
  compression?: boolean;
  streaming?: boolean;
}

export const ROUTE_OPTIMIZATIONS = {
  // Critical pages
  HOME: {
    preload: ['/api/videos', '/api/v1/subscription'],
    prefetch: ['/watch', '/dashboard'],
    priority: 'high',
    compression: true,
    streaming: true
  },
  
  // Video pages
  WATCH: {
    preload: ['/api/comments', '/api/videos/related'],
    prefetch: ['/channel', '/dashboard'],
    priority: 'high',
    compression: true,
    streaming: true
  },
  
  // User pages
  DASHBOARD: {
    preload: ['/api/videos/user', '/api/analytics'],
    prefetch: ['/upload', '/settings'],
    priority: 'medium',
    compression: true
  },
  
  // API routes
  API_VIDEOS: {
    priority: 'high',
    compression: true,
    streaming: true
  }
} as const;

export class RouteOptimizer {
  static getOptimization(pathname: string): RouteOptimization {
    if (pathname === '/') return ROUTE_OPTIMIZATIONS.HOME;
    if (pathname.startsWith('/watch/')) return ROUTE_OPTIMIZATIONS.WATCH;
    if (pathname === '/dashboard') return ROUTE_OPTIMIZATIONS.DASHBOARD;
    if (pathname.startsWith('/api/videos')) return ROUTE_OPTIMIZATIONS.API_VIDEOS;
    
    return { priority: 'medium', compression: true };
  }
  
  static generatePreloadHeaders(optimization: RouteOptimization): string[] {
    const headers = [];
    
    if (optimization.preload) {
      for (const url of optimization.preload) {
        headers.push(`<${url}>; rel=preload; as=fetch; crossorigin=anonymous`);
      }
    }
    
    if (optimization.prefetch) {
      for (const url of optimization.prefetch) {
        headers.push(`<${url}>; rel=prefetch`);
      }
    }
    
    return headers;
  }
  
  static shouldCompress(request: NextRequest, optimization: RouteOptimization): boolean {
    if (!optimization.compression) return false;
    
    const acceptEncoding = request.headers.get('accept-encoding') || '';
    return acceptEncoding.includes('gzip') || acceptEncoding.includes('br');
  }
  
  static getPriority(optimization: RouteOptimization): string {
    return optimization.priority || 'medium';
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static metrics = new Map<string, number[]>();
  
  static startTimer(key: string): () => number {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(key, duration);
      return duration;
    };
  }
  
  static recordMetric(key: string, value: number): void {
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    
    const values = this.metrics.get(key)!;
    values.push(value);
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
  }
  
  static getAverageMetric(key: string): number {
    const values = this.metrics.get(key);
    if (!values || values.length === 0) return 0;
    
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }
  
  static getMetrics(): Record<string, { average: number; count: number }> {
    const result: Record<string, { average: number; count: number }> = {};
    
    for (const [key, values] of Array.from(this.metrics.entries())) {
      result[key] = {
        average: this.getAverageMetric(key),
        count: values.length
      };
    }
    
    return result;
  }
}

// Database query optimization
export class QueryOptimizer {
  static buildVideoQuery(filters: {
    category?: string;
    tags?: string[];
    status?: string;
    privacy?: string;
    uploaderId?: string;
    search?: string;
  }) {
    const query: any = {};
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.privacy) {
      query.privacy = filters.privacy;
    }
    
    if (filters.uploaderId) {
      query.uploaderId = filters.uploaderId;
    }
    
    if (filters.search) {
      query.$text = { $search: filters.search };
    }
    
    return query;
  }
  
  static getOptimalProjection(fields?: string[]) {
    if (!fields) {
      // Default projection for video lists
      return {
        title: 1,
        description: 1,
        thumbnailUrl: 1,
        duration: 1,
        views: 1,
        likes: 1,
        category: 1,
        tags: 1,
        createdAt: 1,
        uploaderId: 1,
        status: 1,
        privacy: 1
      };
    }
    
    const projection: any = {};
    for (const field of fields) {
      projection[field] = 1;
    }
    return projection;
  }
  
  static getOptimalSort(sortBy?: string) {
    switch (sortBy) {
      case 'newest':
        return { createdAt: -1 };
      case 'oldest':
        return { createdAt: 1 };
      case 'popular':
        return { views: -1, likes: -1 };
      case 'trending':
        return { 
          $expr: {
            $divide: [
              { $add: ['$views', { $multiply: ['$likes', 10] }] },
              { $add: [{ $divide: [{ $subtract: [new Date(), '$createdAt'] }, 86400000] }, 1] }
            ]
          }
        };
      default:
        return { createdAt: -1 };
    }
  }
}
