// app/api/v1/audio/thumbnail/[id]/route.ts - Audio Thumbnail API
import { NextRequest, NextResponse } from 'next/server';
import { privateStorage } from '@/lib/storage/private-storage';
import { withRateLimit, RATE_LIMIT_RULES } from '@/lib/rate-limiting/rate-limiter';

async function thumbnailHandler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const size = searchParams.get('size') || 'medium'; // small, medium, large
    
    // Get thumbnail from private storage
    const thumbnailBuffer = await privateStorage.getThumbnail(id);
    
    if (!thumbnailBuffer) {
      // Return default music thumbnail
      return getDefaultThumbnail(size);
    }

    // Resize thumbnail based on requested size
    const resizedThumbnail = await resizeThumbnail(thumbnailBuffer, size);

    // Use Blob for thumbnail response
    const thumbnailCopy = new Uint8Array(resizedThumbnail);
    const thumbnailBlob = new Blob([thumbnailCopy], { type: 'image/jpeg' });

    return new NextResponse(thumbnailBlob, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*',
        'X-Thumbnail-Size': size
      }
    });

  } catch (error) {
    console.error('Thumbnail error:', error);
    const { searchParams } = new URL(request.url);
    const fallbackSize = searchParams.get('size') || 'medium';
    return getDefaultThumbnail(fallbackSize);
  }
}

async function resizeThumbnail(buffer: Buffer, size: string): Promise<Buffer> {
  // For production, use a proper image processing library like Sharp
  // For now, return original buffer
  return buffer;
}

function getDefaultThumbnail(size: string): NextResponse {
  // Generate a simple SVG placeholder
  const dimensions = size === 'small' ? 150 : size === 'large' ? 500 : 300;
  
  const svg = `
    <svg width="${dimensions}" height="${dimensions}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" rx="20"/>
      <circle cx="${dimensions/2}" cy="${dimensions/2 - 20}" r="40" fill="white" opacity="0.9"/>
      <polygon points="${dimensions/2 - 15},${dimensions/2 - 30} ${dimensions/2 - 15},${dimensions/2 - 10} ${dimensions/2 + 15},${dimensions/2 - 20}" fill="#8B5CF6"/>
      <text x="${dimensions/2}" y="${dimensions/2 + 40}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">SONITY</text>
    </svg>
  `;

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withRateLimit(
    RATE_LIMIT_RULES.API_GENERAL,
    () => thumbnailHandler(request, { params })
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
