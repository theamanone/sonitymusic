import { NextRequest, NextResponse } from 'next/server';
import { SecurityValidator } from '@/lib/security';
import { blockUserByIp } from '@/lib/checkBlock';

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const isDevelopment = process.env.NODE_ENV === 'development';

// Paths that should be excluded from rate limiting
const RATE_LIMIT_EXCLUDED_PATHS = [
  '/api/tracks/stream/',
  '/api/tracks/segments/',
  '/api/audio/stream/',
  '/_next/static/',
  '/assets/'
];

const SECURITY_CONFIG = {
  RATE_LIMIT_WINDOW: 60 * 1000,
  RATE_LIMIT_MAX_REQUESTS: isDevelopment ? 5000 : 1000,
  RATE_LIMIT_MAX_AUTH_REQUESTS: isDevelopment ? 200 : 50,
  RATE_LIMIT_AUDIO_CHUNK_WINDOW: 10 * 1000, // 10 seconds for audio chunks
  RATE_LIMIT_AUDIO_CHUNK_MAX: 100, // Max chunks per 10 seconds
  RATE_LIMIT_IP_WINDOW: 60 * 1000, // 1 minute for IP-based limits
  RATE_LIMIT_IP_MAX: 5000, // Max requests per IP per minute
  MAX_REQUEST_SIZE: isDevelopment ? 10 * 1024 * 1024 : 1024 * 1024,
  MAX_JSON_SIZE: isDevelopment ? 1024 * 1024 : 100 * 1024,
  BLOCKED_USER_AGENTS: isDevelopment ? [] : [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /perl/i,
  ],
  ALLOWED_ORIGINS: [
    'https://sonity.veliessa.com',
    'https://www.sonity.veliessa.com',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://10.124.201.166:3001',
    ...(isDevelopment ? ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3004'] : []),
  ],
  PRODUCTION_DOMAIN: 'sonity.veliessa.com',
};

function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const current = rateLimitStore.get(key);
  const resetTime = now + windowMs;

  if (!current || current.resetTime < now) {
    rateLimitStore.set(key, { count: 1, resetTime });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  return true;
}

function validateRequestSize(request: NextRequest): boolean {
  const contentLength = request.headers.get('content-length');
  if (contentLength) {
    const size = parseInt(contentLength, 10);
    return size <= SECURITY_CONFIG.MAX_REQUEST_SIZE;
  }
  return true;
}

function isBlockedUserAgent(userAgent: string): boolean {
  return SECURITY_CONFIG.BLOCKED_USER_AGENTS.some(pattern => pattern.test(userAgent));
}

function validateCORS(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  if (!isDevelopment) {
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');
    
    if (host === SECURITY_CONFIG.PRODUCTION_DOMAIN || host === `www.${SECURITY_CONFIG.PRODUCTION_DOMAIN}`) {
      return true;
    }
    
    if (referer && (referer.includes(SECURITY_CONFIG.PRODUCTION_DOMAIN))) {
      return true;
    }
  }

  return SECURITY_CONFIG.ALLOWED_ORIGINS.includes(origin);
}

function addSecurityHeaders(response: NextResponse, skipCSP: boolean = false): NextResponse {
  const securityHeaders = SecurityValidator.getSecurityHeaders();

  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (skipCSP && key === 'Content-Security-Policy') {
      return;
    }
    response.headers.set(key, value);
  });

  return response;
}

const forbiddenPaths = ['/admin', '/api/secret'];

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const ip = request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown';
  const userAgent = request.headers.get('user-agent') || '';
  const url = request.nextUrl.pathname;

  if (url === '/home' || url === '/videos' || url === '/browse') {
    return NextResponse.redirect(new URL('/', request.url));
  }

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

  console.log(`[${new Date().toISOString()}] ${request.method} ${url} from ${ip}`);

  if (isBlockedUserAgent(userAgent)) {
    console.log(`[SECURITY] Blocked malicious user agent: ${userAgent}`);
    return new NextResponse('Forbidden', { status: 403 });
  }

  if (!validateCORS(request)) {
    console.log(`[SECURITY] Blocked unauthorized origin`);
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Skip rate limiting for static assets and audio chunks
  const shouldSkipRateLimit = RATE_LIMIT_EXCLUDED_PATHS.some(path => url.startsWith(path));
  
  if (!shouldSkipRateLimit) {
    // Apply different rate limits based on endpoint type
    const isAuthEndpoint = url.startsWith('/api/auth');
    const rateLimitKey = isAuthEndpoint ? `auth:${ip}` : `ip:${ip}`;
    const maxRequests = isAuthEndpoint 
      ? SECURITY_CONFIG.RATE_LIMIT_MAX_AUTH_REQUESTS 
      : SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS;
      
    if (!checkRateLimit(rateLimitKey, maxRequests, SECURITY_CONFIG.RATE_LIMIT_WINDOW)) {
      console.log(`[SECURITY] Rate limit exceeded for ${ip} on ${url}`);
      return new NextResponse(JSON.stringify({
        error: 'Too Many Requests',
        message: 'Please slow down and try again later.'
      }), {
        status: 429,
        headers: { 
          'Content-Type': 'application/json',
          'Retry-After': '60' 
        }
      });
    }
    
    // Apply additional rate limiting for audio chunks if needed
    if (url.includes('/stream/') && (url.includes('/tracks/') || url.includes('/audio/'))) {
      const chunkKey = `chunk:${ip}`;
      if (!checkRateLimit(chunkKey, SECURITY_CONFIG.RATE_LIMIT_AUDIO_CHUNK_MAX, SECURITY_CONFIG.RATE_LIMIT_AUDIO_CHUNK_WINDOW)) {
        console.log(`[SECURITY] Audio chunk rate limit exceeded for ${ip}`);
        return new NextResponse(JSON.stringify({
          error: 'Too Many Requests',
          message: 'Please wait a moment before requesting more audio chunks.'
        }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  }

  if (!validateRequestSize(request)) {
    console.log(`[SECURITY] Request too large from ${ip}`);
    return new NextResponse('Payload Too Large', { status: 413 });
  }

  const pathname = request.nextUrl.pathname;
  if (SecurityValidator.containsPathTraversal(pathname)) {
    console.log(`[SECURITY] Malicious path traversal detected in request from ${ip}`);
    return new NextResponse('Bad Request', { status: 400 });
  }

  const searchParams = request.nextUrl.searchParams;
  let badParam: { key: string; value: string } | null = null;
  searchParams.forEach((value, key) => {
    if (
      SecurityValidator.containsXSS(value) ||
      SecurityValidator.containsSQLInjection(value) ||
      SecurityValidator.containsCommandInjection(value) ||
      SecurityValidator.containsNoSQLInjection(value) ||
      SecurityValidator.containsPathTraversal(value)
    ) {
      badParam = { key, value };
    }
  });
  
  if (badParam !== null) {
    const { key, value } = badParam;
    console.log(`[SECURITY] Malicious query parameter detected: ${key}=${value}`);
    return new NextResponse('Bad Request', { status: 400 });
  }

  const requestKey = `${ip}:frequency`;
  const now = Date.now();
  const frequencyData = rateLimitStore.get(requestKey);

  if (frequencyData && (now - frequencyData.resetTime) < 1000) {
    if (frequencyData.count > 10) {
      console.log(`[SECURITY] DDoS protection triggered for ${ip}`);
      return new NextResponse('Too Many Requests', { status: 429 });
    }
    frequencyData.count++;
  } else {
    rateLimitStore.set(requestKey, { count: 1, resetTime: now + 1000 });
  }

  if (forbiddenPaths.includes(url)) {
    await blockUserByIp({
      ip,
      reason: `Tried to access forbidden path: ${url}`,
      service: 'learn',
      blockedBy: 'middleware',
    });
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const response = NextResponse.next();

    addSecurityHeaders(response, true);

    if (url.startsWith('/api/')) {
      const origin = request.headers.get('origin');
      if (origin && SECURITY_CONFIG.ALLOWED_ORIGINS.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        response.headers.set('Access-Control-Allow-Credentials', 'true');
      }
    }

    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${request.method} ${url} completed in ${duration}ms`);

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
