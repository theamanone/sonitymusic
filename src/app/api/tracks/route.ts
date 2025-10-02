// src/app/api/tracks/route.ts - Music Tracks API
import { NextRequest, NextResponse } from 'next/server';

// Mock track data for demonstration
const mockTracks = [
  {
    _id: '1',
    title: 'Ranjheya Ve',
    artist: 'Zain Zohaib',
    duration: 240,
    genre: 'pop',
    audioUrl: '/uploads/Ranjheya Ve Zain Zohaib Yratta media.mp3',
    coverArt: {
      default: '/images/default-track.jpg',
      medium: '/images/default-track.jpg'
    },
    plays: 15420,
    likes: 892,
    featured: true,
    explicit: false,
    description: 'A beautiful Punjabi track by Zain Zohaib',
    artistDetails: {
      name: 'Zain Zohaib',
      avatar: '/images/default-artist.jpg'
    }
  },
  {
    _id: '2',
    title: 'Summer Vibes',
    artist: 'DJ Cool',
    duration: 180,
    genre: 'electronic',
    audioUrl: '/uploads/sample-track-2.mp3',
    coverArt: {
      default: '/images/default-track.jpg',
      medium: '/images/default-track.jpg'
    },
    plays: 8930,
    likes: 456,
    featured: false,
    explicit: false,
    description: 'Upbeat electronic track perfect for summer',
    artistDetails: {
      name: 'DJ Cool',
      avatar: '/images/default-artist.jpg'
    }
  },
  {
    _id: '3',
    title: 'Jazz Night',
    artist: 'Smooth Sounds',
    duration: 320,
    genre: 'jazz',
    audioUrl: '/uploads/sample-track-3.mp3',
    coverArt: {
      default: '/images/default-track.jpg',
      medium: '/images/default-track.jpg'
    },
    plays: 5670,
    likes: 234,
    featured: false,
    explicit: false,
    description: 'Relaxing jazz for evening listening',
    artistDetails: {
      name: 'Smooth Sounds',
      avatar: '/images/default-artist.jpg'
    }
  },
  {
    _id: '4',
    title: 'Rock Anthem',
    artist: 'Thunder Band',
    duration: 280,
    genre: 'rock',
    audioUrl: '/uploads/sample-track-4.mp3',
    coverArt: {
      default: '/images/default-track.jpg',
      medium: '/images/default-track.jpg'
    },
    plays: 12340,
    likes: 678,
    featured: false,
    explicit: false,
    description: 'High-energy rock anthem',
    artistDetails: {
      name: 'Thunder Band',
      avatar: '/images/default-artist.jpg'
    }
  },
  {
    _id: '5',
    title: 'Hip Hop Flow',
    artist: 'MC Rhythm',
    duration: 200,
    genre: 'hip-hop',
    audioUrl: '/uploads/sample-track-5.mp3',
    coverArt: {
      default: '/images/default-track.jpg',
      medium: '/images/default-track.jpg'
    },
    plays: 9876,
    likes: 543,
    featured: false,
    explicit: true,
    description: 'Fresh hip-hop beats with smooth flow',
    artistDetails: {
      name: 'MC Rhythm',
      avatar: '/images/default-artist.jpg'
    }
  },
  {
    _id: '6',
    title: 'Classical Symphony',
    artist: 'Orchestra Elite',
    duration: 450,
    genre: 'classical',
    audioUrl: '/uploads/sample-track-6.mp3',
    coverArt: {
      default: '/images/default-track.jpg',
      medium: '/images/default-track.jpg'
    },
    plays: 3456,
    likes: 189,
    featured: false,
    explicit: false,
    description: 'Beautiful classical symphony composition',
    artistDetails: {
      name: 'Orchestra Elite',
      avatar: '/images/default-artist.jpg'
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const genre = searchParams.get('genre') || 'all';

    // Filter by genre
    let filteredTracks = mockTracks;
    if (genre !== 'all') {
      filteredTracks = mockTracks.filter(track => track.genre === genre);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTracks = filteredTracks.slice(startIndex, endIndex);

    // Calculate total pages
    const totalTracks = filteredTracks.length;
    const totalPages = Math.ceil(totalTracks / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      tracks: paginatedTracks,
      pagination: {
        currentPage: page,
        totalPages,
        totalTracks,
        hasMore,
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching tracks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tracks' },
      { status: 500 }
    );
  }
}
