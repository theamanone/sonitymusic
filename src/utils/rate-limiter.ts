// utils/rate-limiter.ts
const rateLimitMap = new Map();

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, []);
  }
  
  const requests = rateLimitMap.get(key).filter((time: number) => time > windowStart);
  
  if (requests.length >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  requests.push(now);
  rateLimitMap.set(key, requests);
  return true;
}
