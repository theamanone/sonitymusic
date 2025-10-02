// app/api/v1/audio/upload/route.ts - Secure Audio Upload API
import { NextRequest, NextResponse } from 'next/server';
import { privateStorage } from '@/lib/storage/private-storage';
import { withRateLimit, RATE_LIMIT_RULES } from '@/lib/rate-limiting/rate-limiter';
import { audioConverter } from '@/lib/audio-converter';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/aac', 'audio/ogg'];

async function uploadHandler(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('audio') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only audio files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Store file privately
    const storedAudio = await privateStorage.storeAudioFile(
      buffer,
      file.name,
      file.type,
      userId
    );

    // Generate secure access token
    const accessToken = generateAccessToken(storedAudio.id, userId);

    return NextResponse.json({
      success: true,
      message: 'Audio file uploaded successfully',
      data: {
        id: storedAudio.id,
        title: storedAudio.metadata?.title,
        artist: storedAudio.metadata?.artist,
        duration: storedAudio.duration,
        size: storedAudio.size,
        thumbnail: storedAudio.thumbnail ? `data:image/jpeg;base64,${storedAudio.thumbnail}` : null,
        streamUrl: `/api/v1/audio/stream/${storedAudio.id}?token=${accessToken}`,
        hlsUrl: `/api/v1/audio/hls/${storedAudio.id}/playlist.m3u8?token=${accessToken}`,
        createdAt: storedAudio.createdAt
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}

function generateAccessToken(fileId: string, userId?: string): string {
  const timestamp = Date.now();
  const data = `${fileId}_${userId || 'anonymous'}_${timestamp}`;
  return Buffer.from(data).toString('base64url');
}

export async function POST(request: NextRequest) {
  return withRateLimit(RATE_LIMIT_RULES.FILE_UPLOAD, () => uploadHandler(request));
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
