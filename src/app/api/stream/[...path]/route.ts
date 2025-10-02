// src/app/api/stream/[...path]/route.ts - Audio Streaming API with Range Support
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: filePathArray } = await params;
  try {
    const filePath = filePathArray.join('/');
    const publicDir = path.join(process.cwd(), 'public');
    const fullPath = path.join(publicDir, filePath);

    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Get file stats
    const stats = await fs.stat(fullPath);
    const fileSize = stats.size;

    // Parse range header for chunked streaming
    const range = request.headers.get('range');
    const contentType = getContentType(filePath);

    if (range) {
      // Handle range requests for better streaming
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;

      const file = await fs.open(fullPath, 'r');
      const buffer = Buffer.alloc(chunkSize);
      await file.read(buffer, 0, chunkSize, start);
      await file.close();

      return new NextResponse(buffer, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    } else {
      // Stream entire file
      const fileBuffer = await fs.readFile(fullPath);

      return new NextResponse(Buffer.from(fileBuffer), {
        headers: {
          'Content-Length': fileSize.toString(),
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000',
          'Accept-Ranges': 'bytes',
        },
      });
    }

  } catch (error) {
    console.error('Streaming error:', error);
    return NextResponse.json(
      { error: 'Failed to stream audio' },
      { status: 500 }
    );
  }
}

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes: Record<string, string> = {
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.m4a': 'audio/mp4',
    '.aac': 'audio/aac',
    '.flac': 'audio/flac',
  };

  return contentTypes[ext] || 'application/octet-stream';
}
