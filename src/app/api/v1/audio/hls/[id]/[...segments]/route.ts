// app/api/v1/audio/hls/[id]/[...segments]/route.ts - Secure HLS Streaming API
import { NextRequest, NextResponse } from 'next/server';
import { privateStorage } from '@/lib/storage/private-storage';
import { hlsAudioManager } from '@/lib/hls-audio-manager';
import { withRateLimit, RATE_LIMIT_RULES } from '@/lib/rate-limiting/rate-limiter';
import { readFile, access } from 'fs/promises';
import { join } from 'path';

async function hlsHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; segments: string[] }> }
) {
  try {
    const { id, segments } = await params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // For development/testing - allow access without token for now
    // In production, require proper authentication
    if (!token && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 401 }
      );
    }

    // Validate token if provided
    if (token && !isValidToken(token, id)) {
      return NextResponse.json(
        { error: 'Invalid access token' },
        { status: 403 }
      );
    }

    // For HLS tracks, verify the HLS directory exists instead of audio file
    const hlsDir = join(process.cwd(), 'private', 'audio', id);
    
    try {
      await access(hlsDir);
    } catch {
      return NextResponse.json(
        { error: 'HLS directory not found' },
        { status: 404 }
      );
    }

    // For HLS, we don't need metadata from private storage
    const metadata = { duration: 267, title: 'HLS Track' };

    const fileName = segments[segments.length - 1];

    // Handle playlist request
    if (fileName === 'playlist.m3u8') {
      console.log('Serving playlist for:', id, 'with segments:', segments);
      return await handlePlaylistRequest(id, metadata);
    }

    // Handle segment request
    if (fileName.endsWith('.ts') || fileName.endsWith('.aac')) {
      return await handleSegmentRequest(fileName, id);
    }

    return NextResponse.json(
      { error: 'Invalid HLS request' },
      { status: 400 }
    );

  } catch (error) {
    console.error('HLS streaming error:', error);
    return NextResponse.json(
      { error: 'HLS streaming failed' },
      { status: 500 }
    );
  }
}

async function handlePlaylistRequest(audioId: string, metadata: any) {
  try {
    console.log('handlePlaylistRequest called for:', audioId);
    // Check if we have pre-generated HLS segments
    const hlsDir = join(process.cwd(), 'private', 'audio', audioId);
    console.log('Looking for HLS directory:', hlsDir);
    
    try {
      const playlistPath = join(hlsDir, 'playlist.m3u8');
      console.log('Looking for playlist file:', playlistPath);
      const playlistContent = await readFile(playlistPath, 'utf8');
      console.log('Found playlist, length:', playlistContent.length);
      
      return new NextResponse(playlistContent, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Cache-Control': 'public, max-age=300',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      console.error('Error reading playlist file:', error);
      // Generate dynamic playlist if pre-generated doesn't exist
      const dynamicPlaylist = generateDynamicPlaylist(audioId, metadata);
      console.log('Generated dynamic playlist, length:', dynamicPlaylist.length);
      
      return new NextResponse(dynamicPlaylist, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Cache-Control': 'public, max-age=300',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  } catch (error) {
    console.error('Playlist generation error:', error);
    throw error;
  }
}

async function handleSegmentRequest(fileName: string, audioId: string) {
  try {
    // Try to serve from pre-generated HLS segments
    const segmentPath = join(process.cwd(), 'private', 'audio', audioId, fileName);
    
    try {
      const segmentBuffer = await readFile(segmentPath);
      
      return new NextResponse(segmentBuffer, {
        status: 200,
        headers: {
          'Content-Type': fileName.endsWith('.ts') ? 'video/mp2t' : 'audio/aac',
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
          'Accept-Ranges': 'bytes',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch {
      return NextResponse.json(
        { error: 'Segment not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Segment serving error:', error);
    throw error;
  }
}

function generateDynamicPlaylist(audioId: string, metadata: any): string {
  const duration = metadata.duration || 267; // Default duration
  const segmentDuration = 10;
  const segmentCount = Math.ceil(duration / segmentDuration);

  let playlist = '#EXTM3U\n';
  playlist += '#EXT-X-VERSION:3\n';
  playlist += `#EXT-X-TARGETDURATION:${segmentDuration}\n`;
  playlist += '#EXT-X-MEDIA-SEQUENCE:0\n';
  playlist += '#EXT-X-PLAYLIST-TYPE:VOD\n';

  for (let i = 0; i < segmentCount; i++) {
    const segmentLength = i === segmentCount - 1 
      ? duration - (i * segmentDuration) 
      : segmentDuration;
    
    playlist += `#EXTINF:${segmentLength.toFixed(6)},\n`;
    playlist += `segment_${String(i).padStart(3, '0')}.ts\n`;
  }

  playlist += '#EXT-X-ENDLIST\n';
  return playlist;
}

function isValidToken(token: string, fileId: string): boolean {
  try {
    // For development, accept any token that contains the fileId
    if (process.env.NODE_ENV !== 'production') {
      const decoded = Buffer.from(token, 'base64url').toString();
      return decoded.includes(fileId) || decoded.includes('hls_test_track');
    }
    
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
  { params }: { params: Promise<{ id: string; segments: string[] }> }
) {
  return await withRateLimit(
    RATE_LIMIT_RULES.HLS_SEGMENTS,
    async () => await hlsHandler(request, { params })
  );
}

export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; segments: string[] }> }
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
