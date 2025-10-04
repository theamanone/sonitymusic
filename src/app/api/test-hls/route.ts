// app/api/test-hls/route.ts - Test HLS Streaming
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Create a simple token for testing
    const fileId = 'hls_test_track';
    const timestamp = Date.now();
    const tokenData = `${fileId}_${timestamp}`;
    const token = Buffer.from(tokenData, 'utf8').toString('base64url');

    const testTrack = {
      id: 'hls_test_track',
      title: 'Ranjheya Ve',
      artistDetails: {
        name: 'Zain Zohaib'
      },
      coverArt: {
        default: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center',
        medium: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop&crop=center',
        large: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop&crop=center'
      },
      audioUrl: `/api/v1/audio/hls/hls_test_track/playlist.m3u8?token=${token}`,
      duration: 267,
      albumId: 'test_album',
      genre: 'Pop',
      trending: true,
      plays: 1250000
    };

    return NextResponse.json({
      success: true,
      message: 'HLS test track ready for streaming',
      track: testTrack,
      hlsInfo: {
        format: 'HLS (HTTP Live Streaming)',
        segments: 27,
        segmentDuration: '10 seconds',
        totalDuration: '4:27 minutes',
        bitrate: '128kbps AAC',
        adaptiveStreaming: true,
        description: 'Audio is now chunked into 10-second segments for optimal streaming, similar to Spotify and Apple Music'
      },
      usage: {
        playlistUrl: `/api/v1/audio/hls/hls_test_track/playlist.m3u8?token=${token}`,
        segmentUrls: Array.from({ length: 27 }, (_, i) => `/api/v1/audio/hls/hls_test_track/segment_${String(i).padStart(3, '0')}.ts?token=${token}`),
        instructions: [
          '1. Use the playlist URL in your audio player',
          '2. The player will automatically load segments as needed',
          '3. This enables adaptive streaming and faster startup times',
          '4. Perfect for mobile devices and varying network conditions'
        ]
      },
      token: token,
      tokenInfo: {
        expiresIn: '24 hours',
        fileId: fileId,
        createdAt: new Date(timestamp).toISOString()
      },
      // For client-side token generation
      tokenEndpoint: '/api/v1/tokens?trackId=hls_test_track'
    });

  } catch (error) {
    console.error('HLS test error:', error);
    return NextResponse.json(
      { error: 'Failed to prepare HLS test' },
      { status: 500 }
    );
  }
}
