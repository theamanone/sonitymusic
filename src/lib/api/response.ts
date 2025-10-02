import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';
import { SITE_CONFIG } from '@/config/site.config';

// Security headers to add to all API responses
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; object-src 'none';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

/**
 * Creates a standardized API response with security headers
 * @param data The data to return in the response
 * @param status The HTTP status code
 * @param headers Optional headers to include in the response
 */
export const createApiResponse = <T>(
  data: T,
  status: number = 200,
  headers: HeadersInit = {}
): NextResponse => {
  return NextResponse.json(
    {
      success: status >= 200 && status < 300,
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
      data,
      meta: {
        apiVersion: '1.0',
        license: `${SITE_CONFIG.NAME} Proprietary`,
        encryption: 'AES-256',
        serverRegion: process.env.REGION || 'global',
      },
    },
    { status, headers: { ...securityHeaders, ...headers } }
  );
};

/**
 * Creates a standardized API error response with security headers
 * @param message The error message to return in the response
 * @param status The HTTP status code
 * @param code Optional error code to include in the response
 * @param details Optional error details to include in the response
 * @param headers Optional headers to include in the response
 */
export const createApiError = (
  message: string,
  status: number = 500,
  code?: string,
  details?: Record<string, unknown>,
  headers: HeadersInit = {}
): NextResponse => {
  return NextResponse.json(
    {
      success: false,
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
      error: {
        message,
        code,
        details,
      },
      meta: {
        apiVersion: '1.0',
        license: `${SITE_CONFIG.NAME} Proprietary`,
        encryption: 'AES-256',
        serverRegion: process.env.REGION || 'global',
      },
    },
    { status, headers: { ...securityHeaders, ...headers } }
  );
};

/**
 * Creates a middleware function to handle API responses and errors
 * @param handler The handler function to call for the API request
 * @param authCheck Optional authentication check function to call before handling the request
 */
export const createApiResponseMiddleware = (
  handler: (req: NextRequest) => Promise<NextResponse>,
  authCheck?: (req: NextRequest) => Promise<NextResponse | null>
) => async (req: NextRequest): Promise<NextResponse> => {
  if (authCheck) {
    const authResult = await authCheck(req);
    if (authResult) return authResult;
  }

  try {
    const response = await handler(req);
    return response;
  } catch (error) {
    console.error('API Error:', error);
    return createApiError(
      'Internal server error',
      500,
      'INTERNAL_ERROR',
      { error: error instanceof Error ? error.message : String(error) }
    );
  }
};

export function createResponse<T>(
  data: T,
  status: number = 200,
  headers: HeadersInit = {}
): NextResponse {
  const response = createApiResponse(data, status, headers);
  return response;
}


