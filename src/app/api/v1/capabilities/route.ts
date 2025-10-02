import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // For video platform, return video-specific capabilities
    if (!session?.user?.id) {
      return NextResponse.json({
        canUploadVideo: false,
        canAccessPremium: false,
        canCreatePlaylist: false,
        canComment: false,
        maxVideoLength: 0,
      });
    }

    // For authenticated users, enable basic video features
    return NextResponse.json({
      canUploadVideo: true,
      canAccessPremium: false, // Based on subscription in future
      canCreatePlaylist: true,
      canComment: true,
      maxVideoLength: 300, // 5 minutes for free users
    });
  } catch (e) {
    return NextResponse.json({
      canUploadVideo: false,
      canAccessPremium: false,
      canCreatePlaylist: false,
      canComment: false,
      maxVideoLength: 0,
    });
  }
}
