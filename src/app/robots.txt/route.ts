import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Block access to API routes
Disallow: /api/

# Block access to private areas
Disallow: /dashboard/
Disallow: /settings/
Disallow: /profile/

# Block access to auth routes
Disallow: /auth/

# Allow access to sitemap
Allow: /sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Sitemap
Sitemap: https://sonity.veliessa.com/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}
