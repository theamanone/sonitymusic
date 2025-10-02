"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MusicRow from '@/components/music/MusicRow';
import { TrackWithArtist } from '@/types/track.types';

type TrackResult = TrackWithArtist;

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [tracks, setTracks] = useState<TrackResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      // Track search endpoint (adjust when backend route is ready)
      const response = await fetch(`/api/tracks/search?q=${encodeURIComponent(searchQuery.trim())}`);
      if (response.ok) {
        const data = await response.json();
        setTracks((data.tracks || data.results || []).slice(0, 50));
      } else {
        setTracks([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const url = new URL(window.location.href);
      url.searchParams.set('q', query.trim());
      window.history.pushState({}, '', url.toString());
      performSearch(query.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Music</h1>
          
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for songs, artists, or playlists..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              />
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                type="submit"
                className="absolute right-2 top-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Searching...</span>
          </div>
        ) : hasSearched ? (
          <div>
            {tracks.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Search Results for "{searchParams.get('q')}"
                  </h2>
                  <span className="text-gray-600">
                    {tracks.length} track{tracks.length !== 1 ? 's' : ''} found
                  </span>
                </div>
                <MusicRow
                  title="Search Results"
                  tracks={tracks}
                  cardSize="medium"
                  showArtist={true}
                  showPlayButton={true}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tracks found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any tracks matching "{searchParams.get('q')}"
                </p>
                <div className="text-sm text-gray-500">
                  <p>Try:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Searching song titles or artists</li>
                    <li>Checking your spelling</li>
                    <li>Using more general terms</li>
                    <li>Browsing trending music instead</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Search for Music</h3>
            <p className="text-gray-600">
              Enter a search term above to find songs, artists, or playlists
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
