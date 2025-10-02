// lib/rate-limiting/rate-limiter.ts - Advanced Rate Limiting System
"use server";

import { headers } from 'next/headers';

interface RateLimitRule {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: any) => string;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
    blocked?: boolean;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Check if request should be rate limited
   */
  async checkRateLimit(
    identifier: string,
    rule: RateLimitRule
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
  }> {
    const now = Date.now();
    const key = identifier;

    // Get or create entry
    if (!this.store[key] || now > this.store[key].resetTime) {
      this.store[key] = {
        count: 0,
        resetTime: now + rule.windowMs,
        blocked: false
      };
    }

    const entry = this.store[key];

    // Check if blocked
    if (entry.blocked && now < entry.resetTime) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      };
    }

    // Increment counter
    entry.count++;

    // Check if limit exceeded
    if (entry.count > rule.maxRequests) {
      entry.blocked = true;
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      };
    }

    return {
      allowed: true,
      remaining: Math.max(0, rule.maxRequests - entry.count),
      resetTime: entry.resetTime
    };
  }

  /**
   * Get client identifier from request
   */
  getClientIdentifier(req?: any): string {
    try {
      const headersList = headers();
      
      // Try to get real IP from various headers
      const forwarded = headersList.get('x-forwarded-for');
      const realIp = headersList.get('x-real-ip');
      const cfConnectingIp = headersList.get('cf-connecting-ip');
      
      let clientIp = 'unknown';
      
      if (forwarded) {
        clientIp = forwarded.split(',')[0].trim();
      } else if (realIp) {
        clientIp = realIp;
      } else if (cfConnectingIp) {
        clientIp = cfConnectingIp;
      }

      // Add user agent for additional uniqueness
      const userAgent = headersList.get('user-agent') || 'unknown';
      const userAgentHash = this.simpleHash(userAgent);

      return `${clientIp}_${userAgentHash}`;
    } catch (error) {
      console.error('Failed to get client identifier:', error);
      return 'fallback_' + Date.now();
    }
  }

  /**
   * Simple hash function for user agent
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (now > this.store[key].resetTime) {
        delete this.store[key];
      }
    });
  }

  /**
   * Get rate limit stats
   */
  getStats(): {
    totalEntries: number;
    blockedEntries: number;
    memoryUsage: number;
  } {
    const entries = Object.values(this.store);
    return {
      totalEntries: entries.length,
      blockedEntries: entries.filter(e => e.blocked).length,
      memoryUsage: JSON.stringify(this.store).length
    };
  }

  /**
   * Clear all rate limit data
   */
  clear(): void {
    this.store = {};
  }

  /**
   * Destroy rate limiter and cleanup
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}

// Predefined rate limit rules
export const RATE_LIMIT_RULES = {
  // API endpoints
  API_GENERAL: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100 // 100 requests per 15 minutes
  },
  
  // Audio streaming
  AUDIO_STREAM: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30 // 30 requests per minute
  },
  
  // File upload
  FILE_UPLOAD: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10 // 10 uploads per hour
  },
  
  // Authentication
  AUTH_LOGIN: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5 // 5 login attempts per 15 minutes
  },
  
  // Search
  SEARCH: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20 // 20 searches per minute
  },
  
  // HLS segments
  HLS_SEGMENTS: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100 // 100 segment requests per minute
  }
} as const;

// Export singleton instance
export const rateLimiter = new RateLimiter();

/**
 * Rate limiting middleware for API routes
 */
export async function withRateLimit(
  rule: RateLimitRule,
  handler: Function,
  customIdentifier?: string
) {
  try {
    const identifier = customIdentifier || rateLimiter.getClientIdentifier();
    const result = await rateLimiter.checkRateLimit(identifier, rule);

    if (!result.allowed) {
      return Response.json(
        {
          error: 'Rate limit exceeded',
          retryAfter: result.retryAfter,
          resetTime: result.resetTime
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rule.maxRequests.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetTime.toString(),
            'Retry-After': (result.retryAfter || 60).toString()
          }
        }
      );
    }

    // Add rate limit headers to successful responses
    const response = await handler();
    
    if (response instanceof Response) {
      response.headers.set('X-RateLimit-Limit', rule.maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
      response.headers.set('X-RateLimit-Reset', result.resetTime.toString());
    }

    return response;
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Continue without rate limiting if there's an error
    return await handler();
  }
}
