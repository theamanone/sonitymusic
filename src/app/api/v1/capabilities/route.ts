import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // For music platform, return music-specific capabilities
    if (!session?.user?.id) {
      return NextResponse.json({
        canUploadSong: false,
        canAccessPremium: false,
        canCreatePlaylist: false,
        canComment: false,
        maxSongLength: 0,
      });
    }

    // For authenticated users, enable basic music features
    return NextResponse.json({
      canUploadSong: true,
      canAccessPremium: false, // Based on subscription in future
      canCreatePlaylist: true,
      canComment: true,
      maxSongLength: 300, // 5 minutes for free users
    });
  } catch (e) {
    return NextResponse.json({
      canUploadSong: false,
      canAccessPremium: false,
      canCreatePlaylist: false,
      canComment: false,
      maxSongLength: 0,
    });
  }
}
