// app/api/playlists/route.ts - Playlists API
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock playlists data
    const playlists = [
      {
        id: 'playlist-1',
        name: 'My Favorites',
        description: 'My favorite tracks collection',
        trackCount: 25,
        duration: 6420, // seconds
        coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: true,
        creator: {
          id: 'user-1',
          name: 'Premium User',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        }
      },
      {
        id: 'playlist-2', 
        name: 'Chill Vibes',
        description: 'Relaxing music for work and study',
        trackCount: 18,
        duration: 4320,
        coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop&crop=center',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: true,
        creator: {
          id: 'user-2',
          name: 'Music Lover',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=100&h=100&fit=crop&crop=face'
        }
      },
      {
        id: 'playlist-3',
        name: 'Workout Mix',
        description: 'High-energy tracks for gym sessions',
        trackCount: 32,
        duration: 7200,
        coverArt: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=center',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: true,
        creator: {
          id: 'user-3',
          name: 'Fitness Fan',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        }
      }
    ];

    return NextResponse.json({
      success: true,
      playlists,
      total: playlists.length,
      hasMore: false
    });

  } catch (error) {
    console.error('Playlists API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playlists' },
      { status: 500 }
    );
  }
}
