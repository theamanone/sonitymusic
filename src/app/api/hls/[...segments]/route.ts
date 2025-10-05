// app/api/hls/[...segments]/route.ts - HLS Streaming API
import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: { segments: string[] } }
) {
  try {
    const segments = params.segments;
    
    if (!segments || segments.length === 0) {
      return NextResponse.json({ error: 'Invalid segment path' }, { status: 400 });
    }

    // Construct file path
    const fileName = segments[segments.length - 1];
    const hlsDir = join(process.cwd(), 'public', 'uploads', 'hls');
    const filePath = join(hlsDir, fileName);

    // Security check - ensure file is within HLS directory
    if (!filePath.startsWith(hlsDir)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'Segment not found' }, { status: 404 });
    }

    // Read file
    const fileBuffer = await readFile(filePath);

    // Determine content type
    let contentType = 'application/octet-stream';
    if (fileName.endsWith('.m3u8')) {
      contentType = 'application/vnd.apple.mpegurl';
    } else if (fileName.endsWith('.ts')) {
      contentType = 'video/mp2t';
    } else if (fileName.endsWith('.aac')) {
      contentType = 'audio/aac';
    }

    // Set appropriate headers for streaming
    const headers = new Headers({
      'Content-Type': contentType,
      'Content-Length': fileBuffer.length.toString(),
      'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      'Accept-Ranges': 'bytes',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range, Content-Type',
    });

    // Handle range requests for better streaming
    const range = request.headers.get('range');
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileBuffer.length - 1;
      const chunkSize = (end - start) + 1;
      const chunk = fileBuffer.slice(start, end + 1);

      headers.set('Content-Range', `bytes ${start}-${end}/${fileBuffer.length}`);
      headers.set('Content-Length', chunkSize.toString());

      // Use Blob with a copied Uint8Array to avoid SharedArrayBuffer typing issues
      const chunkCopy = new Uint8Array(chunk); // forces a new ArrayBuffer backing store
      const chunkBlob = new Blob([chunkCopy], { type: contentType });
      return new NextResponse(chunkBlob, {
        status: 206, // Partial Content
        headers,
      });
    }

    // Use Blob for full file response with a copied Uint8Array
    const fileCopy = new Uint8Array(fileBuffer);
    const fileBlob = new Blob([fileCopy], { type: contentType });
    return new NextResponse(fileBlob, {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('HLS streaming error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function HEAD(
  request: NextRequest,
  { params }: { params: { segments: string[] } }
) {
  // Handle HEAD requests for metadata
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
