import { NextRequest, NextResponse } from 'next/server';

const isDevelopment = process.env.NODE_ENV === 'development';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;

  // Handle legacy track URLs and ensure proper format
  if (url.startsWith('/track/') && url.length > 7) {
    const trackId = url.split('/track/')[1];
    if (trackId && trackId !== 'undefined' && trackId !== 'null') {
      // Allow the request to continue to the track page
    } else {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Redirect invalid track streaming requests
  if (url.includes('/api/tracks/stream/undefined') || url.includes('/api/tracks/stream/null')) {
    return new NextResponse('Invalid track request', { status: 400 });
  }

  if (isDevelopment) {
    const response = NextResponse.next();
    
    const devCsp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://*.razorpay.com",
      "script-src-elem 'self' 'unsafe-inline' https://checkout.razorpay.com https://*.razorpay.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.razorpay.com",
      "font-src 'self' https://fonts.gstatic.com https://*.razorpay.com data:",
      "img-src 'self' data: blob: https: http:",
      "connect-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://*.razorpay.com https://lumberjack.razorpay.com",
      "frame-src https://checkout.razorpay.com https://api.razorpay.com https://*.razorpay.com",
      "media-src 'self' data: blob:",
      "worker-src 'self' blob:",
      "child-src 'self' blob:",
      "frame-ancestors 'self'",
      "form-action 'self' https://*.razorpay.com",
      "base-uri 'self'",
      "object-src 'none'",
    ].join('; ');

    response.headers.set('Content-Security-Policy', devCsp);
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('Permissions-Policy', 'microphone=(self)');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    return response;
  }

  try {
    const response = NextResponse.next();

    if (url.startsWith('/api/')) {
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    return response;
  } catch (error) {
    console.error(`[ERROR] Middleware error:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/|\.well-known/).*)',
  ],
};
