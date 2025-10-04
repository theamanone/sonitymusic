// app/api/v1/audio/stream/[id]/route.ts - Secure Audio Streaming API
import { NextRequest, NextResponse } from 'next/server';
import { privateStorage } from '@/lib/storage/private-storage';
import { withRateLimit, RATE_LIMIT_RULES } from '@/lib/rate-limiting/rate-limiter';

async function streamHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // For development, allow access without token
    // In production, you would validate authentication here
    if (process.env.NODE_ENV === 'production' && !token) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 401 }
      );
    }

    // For demo purposes, we'll serve a placeholder response
    // In a real app, you would stream the actual audio file
    const audioUrl = `/api/stream/${id}`;
    
    return NextResponse.redirect(new URL(audioUrl, request.url));

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;
      const chunk = buffer.slice(start, end + 1);

      return new NextResponse(chunk, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': metadata.mimeType,
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
          'X-Audio-Title': metadata.metadata?.title || 'Unknown',
          'X-Audio-Artist': metadata.metadata?.artist || 'Unknown',
          'X-Audio-Duration': metadata.duration?.toString() || '0'
        },
      });
    }

    // Full file response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': metadata.mimeType,
        'Content-Length': fileSize.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'X-Audio-Title': metadata.metadata?.title || 'Unknown',
        'X-Audio-Artist': metadata.metadata?.artist || 'Unknown',
        'X-Audio-Duration': metadata.duration?.toString() || '0'
      },
    });

  } catch (error) {
    console.error('Streaming error:', error);
    return NextResponse.json(
      { error: 'Streaming failed' },
      { status: 500 }
    );
  }
}

function isValidToken(token: string, fileId: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64url').toString();
    const parts = decoded.split('_');
    
    if (parts.length < 3) return false;
    
    const tokenFileId = parts[0];
    const timestamp = parseInt(parts[parts.length - 1]);
    
    // Check if token is for correct file
    if (tokenFileId !== fileId) return false;
    
    // Check if token is not expired (24 hours)
    const now = Date.now();
    const tokenAge = now - timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    return tokenAge < maxAge;
  } catch {
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withRateLimit(
    RATE_LIMIT_RULES.AUDIO_STREAM,
    () => streamHandler(request, { params })
  );
}

export async function HEAD(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return GET(request, { params });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range, Content-Type',
    },
  });
}
