// app/api/v1/audio/stream/[id]/route.ts - Secure Audio Streaming API
import { NextRequest, NextResponse } from 'next/server';
import { privateStorage } from '@/lib/storage/private-storage';
import { withRateLimit, RATE_LIMIT_RULES } from '@/lib/rate-limiting/rate-limiter';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';

async function streamHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // Validate access token
    if (!token || !isValidToken(token, id)) {
      return NextResponse.json(
        { error: 'Invalid or expired access token' },
        { status: 401 }
      );
    }

    // Get file from storage
    const fileData = await privateStorage.getAudioFile(id);
    if (!fileData) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    const { buffer, metadata: fileMetadata } = fileData;
    const fileSize = buffer.length;
    const range = request.headers.get('range');

    // Handle range requests for streaming
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;
      const chunk = buffer.slice(start, end + 1);

      // Use Blob for range response
      const chunkCopy = new Uint8Array(chunk);
      const chunkBlob = new Blob([chunkCopy], { type: fileMetadata.mimeType || 'audio/mpeg' });

      return new NextResponse(chunkBlob, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': fileMetadata.mimeType || 'audio/mpeg',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
          'X-Audio-Title': fileMetadata.metadata?.title || 'Unknown',
          'X-Audio-Artist': fileMetadata.metadata?.artist || 'Unknown',
          'X-Audio-Duration': fileMetadata.duration?.toString() || '0'
        },
      });
    }

    // Full file response
    const bufferCopy = new Uint8Array(buffer);
    const bufferBlob = new Blob([bufferCopy], { type: fileMetadata.mimeType || 'audio/mpeg' });

    return new NextResponse(bufferBlob, {
      status: 200,
      headers: {
        'Content-Type': fileMetadata.mimeType || 'audio/mpeg',
        'Content-Length': fileSize.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'X-Audio-Title': fileMetadata.metadata?.title || 'Unknown',
        'X-Audio-Artist': fileMetadata.metadata?.artist || 'Unknown',
        'X-Audio-Duration': fileMetadata.duration?.toString() || '0'
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
  { params }: { params: Promise<{ id: string }> }
) {
  return withRateLimit(
    RATE_LIMIT_RULES.AUDIO_STREAM,
    () => streamHandler(request, { params })
  );
}

export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
