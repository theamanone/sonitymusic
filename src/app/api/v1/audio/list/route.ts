// app/api/v1/audio/list/route.ts - List Audio Files API
import { NextRequest, NextResponse } from 'next/server';
import { privateStorage } from '@/lib/storage/private-storage';
import { withRateLimit, RATE_LIMIT_RULES } from '@/lib/rate-limiting/rate-limiter';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';

async function listHandler(request: NextRequest) {
  try {
    // Get NextAuth session
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    // Check authentication
    if (!currentUserId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || currentUserId;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100); // Max 100 items
    const sortBy = searchParams.get('sortBy') || 'createdAt'; // createdAt, accessCount, title
    const order = searchParams.get('order') || 'desc'; // asc, desc
    const search = searchParams.get('search');

    // Get all stored files
    let files = await privateStorage.listStoredFiles(userId ?? undefined);

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      files = files.filter(file => 
        file.metadata?.title?.toLowerCase().includes(searchLower) ||
        file.metadata?.artist?.toLowerCase().includes(searchLower) ||
        file.originalName.toLowerCase().includes(searchLower)
      );
    }

    // Sort files
    files.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'accessCount':
          aValue = a.accessCount;
          bValue = b.accessCount;
          break;
        case 'title':
          aValue = a.metadata?.title || a.originalName;
          bValue = b.metadata?.title || b.originalName;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }

      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFiles = files.slice(startIndex, endIndex);

    // Format response data
    const formattedFiles = paginatedFiles.map(file => {
      const accessToken = generateAccessToken(file.id, userId ?? undefined);
      
      return {
        id: file.id,
        title: file.metadata?.title || file.originalName.replace(/\.[^/.]+$/, ''),
        artist: file.metadata?.artist || 'Unknown Artist',
        album: file.metadata?.album,
        genre: file.metadata?.genre,
        year: file.metadata?.year,
        duration: file.duration,
        size: file.size,
        accessCount: file.accessCount,
        createdAt: file.createdAt,
        lastAccessed: file.lastAccessed,
        thumbnail: `/api/v1/audio/thumbnail/${file.id}`,
        streamUrl: `/api/v1/audio/stream/${file.id}?token=${accessToken}`,
        hlsUrl: `/api/v1/audio/hls/${file.id}/playlist.m3u8?token=${accessToken}`
      };
    });

    // Get storage stats
    const stats = await privateStorage.getStorageStats();

    return NextResponse.json({
      success: true,
      data: {
        files: formattedFiles,
        pagination: {
          page,
          limit,
          total: files.length,
          totalPages: Math.ceil(files.length / limit),
          hasNext: endIndex < files.length,
          hasPrev: page > 1
        },
        stats: {
          totalFiles: stats.totalFiles,
          totalSize: stats.totalSize,
          totalAccesses: stats.totalAccesses,
          averageFileSize: stats.totalFiles > 0 ? Math.round(stats.totalSize / stats.totalFiles) : 0
        },
        filters: {
          sortBy,
          order,
          search: search || null
        }
      }
    });

  } catch (error) {
    console.error('List files error:', error);
    return NextResponse.json(
      { error: 'Failed to list audio files' },
      { status: 500 }
    );
  }
}

function generateAccessToken(fileId: string, userId?: string): string {
  const timestamp = Date.now();
  const data = `${fileId}_${userId || 'anonymous'}_${timestamp}`;
  return Buffer.from(data).toString('base64url');
}

export async function GET(request: NextRequest) {
  return withRateLimit(
    RATE_LIMIT_RULES.API_GENERAL,
    () => listHandler(request)
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
