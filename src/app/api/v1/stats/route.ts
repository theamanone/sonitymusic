// app/api/v1/stats/route.ts - System Statistics API
import { NextRequest, NextResponse } from 'next/server';
import { privateStorage } from '@/lib/storage/private-storage';
import { rateLimiter, withRateLimit, RATE_LIMIT_RULES } from '@/lib/rate-limiting/rate-limiter';
import { recentPlaysManager } from '@/lib/recent-plays';

async function statsHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const includeDetailed = searchParams.get('detailed') === 'true';

    // Get storage statistics
    const storageStats = await privateStorage.getStorageStats();
    
    // Get rate limiter statistics
    const rateLimitStats = rateLimiter.getStats();
    
    // Get listening statistics
    const listeningStats = await recentPlaysManager.getListeningStats();
    
    // Get recent plays
    const recentPlays = await recentPlaysManager.getRecentlyPlayed(10);
    const mostPlayed = await recentPlaysManager.getMostPlayed(10);

    const basicStats = {
      storage: {
        totalFiles: storageStats.totalFiles,
        totalSize: formatBytes(storageStats.totalSize),
        totalSizeBytes: storageStats.totalSize,
        totalAccesses: storageStats.totalAccesses,
        averageFileSize: formatBytes(
          storageStats.totalFiles > 0 
            ? Math.round(storageStats.totalSize / storageStats.totalFiles) 
            : 0
        )
      },
      listening: {
        totalPlays: listeningStats.totalPlays,
        totalListeningTime: formatDuration(listeningStats.totalListeningTime),
        totalListeningTimeSeconds: listeningStats.totalListeningTime,
        uniqueTracks: listeningStats.uniqueTracks,
        averageSessionLength: formatDuration(listeningStats.averageSessionLength)
      },
      rateLimiting: {
        activeConnections: rateLimitStats.totalEntries,
        blockedRequests: rateLimitStats.blockedEntries,
        memoryUsage: formatBytes(rateLimitStats.memoryUsage)
      },
      recentActivity: {
        recentPlaysCount: recentPlays.length,
        mostPlayedCount: mostPlayed.length
      }
    };

    const response: any = {
      success: true,
      timestamp: new Date().toISOString(),
      stats: basicStats
    };

    if (includeDetailed) {
      response.detailed = {
        mostAccessedFiles: storageStats.mostAccessed.slice(0, 5).map(file => ({
          id: file.id,
          title: file.metadata?.title || file.originalName,
          artist: file.metadata?.artist || 'Unknown',
          accessCount: file.accessCount,
          lastAccessed: file.lastAccessed
        })),
        recentPlays: recentPlays.slice(0, 5).map(play => ({
          title: play.title,
          artist: play.artistName,
          playedAt: play.playedAt,
          playCount: play.playCount
        })),
        mostPlayed: mostPlayed.slice(0, 5).map(play => ({
          title: play.title,
          artist: play.artistName,
          playCount: play.playCount,
          lastPlayed: play.playedAt
        })),
        systemHealth: {
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          nodeVersion: process.version,
          platform: process.platform
        }
      };
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve statistics' },
      { status: 500 }
    );
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDuration(seconds: number): string {
  if (seconds === 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

export async function GET(request: NextRequest) {
  return withRateLimit(
    RATE_LIMIT_RULES.API_GENERAL,
    () => statsHandler(request)
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
