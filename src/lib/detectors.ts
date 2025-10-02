import { NextRequest } from 'next/server';
import { SecurityValidator } from './security';

export const forbiddenPaths = ['/admin', '/api/secret'];

function isPublicAsset(url: string) {
  return (
    url.startsWith('/_next') ||
    url.startsWith('/static') ||
    url.startsWith('/public') ||
    url === '/favicon.ico'
  );
}

export function detectForbiddenPath(request: NextRequest) {
  const url = request.nextUrl.pathname;
  if (url === '/' || isPublicAsset(url)) return { block: false };
  if (forbiddenPaths.includes(url)) {
    return {
      block: true,
      reason: `Tried to access forbidden path: ${url}`,
      service: 'learn',
      status: 'permanent',
    };
  }
  return { block: false };
}

export function detectMaliciousPatterns(request: NextRequest) {
  const url = request.nextUrl.pathname;
  if (url === '/' || isPublicAsset(url)) return { block: false };
  const urlString = request.url;
  const headersString = JSON.stringify(Object.fromEntries(request.headers.entries()));

  // Debug: log what is being checked
  console.log('[DEBUG] Checking for malicious patterns:', { urlString, headersString });

  if (SecurityValidator.containsXSS(urlString)) console.log('[DEBUG] XSS in urlString');
  if (SecurityValidator.containsSQLInjection(urlString)) console.log('[DEBUG] SQLi in urlString');
  if (SecurityValidator.containsCommandInjection(urlString)) console.log('[DEBUG] CMDi in urlString');
  if (SecurityValidator.containsNoSQLInjection(urlString)) console.log('[DEBUG] NoSQLi in urlString');
  if (SecurityValidator.containsPathTraversal(urlString)) console.log('[DEBUG] PathTraversal in urlString');
  if (SecurityValidator.containsXSS(headersString)) console.log('[DEBUG] XSS in headersString');
  if (SecurityValidator.containsSQLInjection(headersString)) console.log('[DEBUG] SQLi in headersString');

  if (
    SecurityValidator.containsXSS(urlString) ||
    SecurityValidator.containsSQLInjection(urlString) ||
    SecurityValidator.containsCommandInjection(urlString) ||
    SecurityValidator.containsNoSQLInjection(urlString) ||
    SecurityValidator.containsPathTraversal(urlString) ||
    SecurityValidator.containsXSS(headersString) ||
    SecurityValidator.containsSQLInjection(headersString)
  ) {
    return {
      block: true,
      reason: 'Malicious pattern detected in request',
      service: 'learn',
      status: 'active',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    };
  }
  return { block: false };
}

export function detectMaliciousQueryParams(request: NextRequest) {
  const url = request.nextUrl.pathname;
  if (url === '/' || isPublicAsset(url)) return { block: false };
  const searchParams = request.nextUrl.searchParams;
  const entries = Array.from(searchParams.entries());
  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];
    if (
      SecurityValidator.containsXSS(value) ||
      SecurityValidator.containsSQLInjection(value) ||
      SecurityValidator.containsCommandInjection(value) ||
      SecurityValidator.containsNoSQLInjection(value) ||
      SecurityValidator.containsPathTraversal(value)
    ) {
      return {
        block: true,
        reason: `Malicious query parameter detected: ${key}=${value}`,
        service: 'learn',
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      };
    }
  }
  return { block: false };
}

// Add more detectors as needed (rate limiting, user agent, etc)