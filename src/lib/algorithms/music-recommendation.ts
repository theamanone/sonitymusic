// lib/algorithms/music-recommendation.ts - Advanced Music Recommendation Engine
import { TrackWithArtist } from '@/types/track.types';

interface UserPreferences {
  favoriteGenres: string[];
  favoriteArtists: string[];
  listeningHistory: TrackWithArtist[];
  mood: 'energetic' | 'calm' | 'focused' | 'party' | 'chill';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  weather?: 'sunny' | 'rainy' | 'cloudy' | 'stormy';
  activity?: 'workout' | 'commute' | 'study' | 'party' | 'relax';
}

interface RecommendationWeights {
  genreMatch: number;
  artistMatch: number;
  popularity: number;
  novelty: number;
  moodFit: number;
  contextualFit: number;
  collaborative: number;
}

class MusicRecommendationEngine {
  private userPreferences: UserPreferences;
  private recommendationHistory: Set<string> = new Set();
  private weights: RecommendationWeights;

  constructor(userPreferences: UserPreferences) {
    this.userPreferences = userPreferences;
    this.weights = {
      genreMatch: 0.25,
      artistMatch: 0.20,
      popularity: 0.15,
      novelty: 0.15,
      moodFit: 0.10,
      contextualFit: 0.10,
      collaborative: 0.05
    };
  }

  // Advanced collaborative filtering
  private calculateCollaborativeScore(track: TrackWithArtist, similarUsers: UserPreferences[]): number {
    let score = 0;
    const similarUserCount = similarUsers.length;

    similarUsers.forEach(user => {
      if (user.favoriteGenres.includes(track.genre)) score += 0.3;
      if (user.favoriteArtists.includes(track.artistDetails?.name || '')) score += 0.4;
      if (user.listeningHistory.some(t => t.genre === track.genre)) score += 0.3;
    });

    return similarUserCount > 0 ? score / similarUserCount : 0;
  }

  // Mood-based recommendation algorithm
  private calculateMoodScore(track: TrackWithArtist, targetMood: string): number {
    const moodMap = {
      energetic: ['electronic', 'rock', 'hip-hop', 'dance'],
      calm: ['classical', 'jazz', 'ambient', 'folk'],
      focused: ['classical', 'ambient', 'instrumental', 'lo-fi'],
      party: ['pop', 'dance', 'hip-hop', 'electronic'],
      chill: ['pop', 'indie', 'folk', 'acoustic']
    };

    const moodGenres = moodMap[targetMood as keyof typeof moodMap] || [];
    return moodGenres.includes(track.genre) ? 1 : 0.2;
  }

  // Contextual recommendation based on time/weather/activity
  private calculateContextualScore(track: TrackWithArtist): number {
    let score = 0.5; // Base score

    // Time-based adjustments
    const hour = new Date().getHours();
    if (this.userPreferences.timeOfDay === 'morning' && hour >= 6 && hour <= 10) {
      if (['classical', 'ambient', 'acoustic'].includes(track.genre)) score += 0.3;
    }

    // Weather-based adjustments
    if (this.userPreferences.weather === 'rainy') {
      if (['jazz', 'folk', 'classical'].includes(track.genre)) score += 0.2;
    }

    // Activity-based adjustments
    if (this.userPreferences.activity === 'workout') {
      if (['electronic', 'rock', 'hip-hop'].includes(track.genre)) score += 0.4;
    }

    return Math.min(score, 1);
  }

  // Novelty vs familiarity balance
  private calculateNoveltyScore(track: TrackWithArtist): number {
    const trackId = track._id || track.customTrackId;
    const isFamiliar = this.userPreferences.listeningHistory.some(t =>
      (t._id === trackId || t.customTrackId === trackId)
    );

    // Mix of familiar and novel content
    return isFamiliar ? 0.3 : 0.8;
  }

  // Main recommendation algorithm
  recommendTracks(
    availableTracks: TrackWithArtist[],
    count: number = 20,
    similarUsers: UserPreferences[] = []
  ): TrackWithArtist[] {
    const scoredTracks = availableTracks.map(track => {
      const trackId = track._id || track.customTrackId;

      // Skip if already recommended recently
      if (this.recommendationHistory.has(trackId)) {
        return { track, score: -1 };
      }

      const scores = {
        genreMatch: this.userPreferences.favoriteGenres.includes(track.genre) ? 1 : 0.3,
        artistMatch: this.userPreferences.favoriteArtists.includes(track.artistDetails?.name || '') ? 1 : 0.2,
        popularity: 0.5, // Default popularity score
        novelty: this.calculateNoveltyScore(track),
        moodFit: this.calculateMoodScore(track, this.userPreferences.mood),
        contextualFit: this.calculateContextualScore(track),
        collaborative: this.calculateCollaborativeScore(track, similarUsers)
      };

      const totalScore = Object.entries(scores).reduce((sum, [key, score]) => {
        return sum + (score * this.weights[key as keyof RecommendationWeights]);
      }, 0);

      return { track, score: totalScore, scores };
    });

    // Sort by score and take top results
    const recommendations = scoredTracks
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(item => item.track);

    // Add to recommendation history
    recommendations.forEach(track => {
      const trackId = track._id || track.customTrackId;
      this.recommendationHistory.add(trackId);
    });

    // Keep history size manageable
    if (this.recommendationHistory.size > 1000) {
      const historyArray = Array.from(this.recommendationHistory);
      this.recommendationHistory.clear();
      historyArray.slice(-500).forEach(id => this.recommendationHistory.add(id));
    }

    return recommendations;
  }

  // Real-time adaptation based on user feedback
  adaptToFeedback(track: TrackWithArtist, liked: boolean, skipped: boolean = false) {
    if (liked) {
      // Increase weight for this genre/artist
      if (!this.userPreferences.favoriteGenres.includes(track.genre)) {
        this.userPreferences.favoriteGenres.push(track.genre);
      }
      if (!this.userPreferences.favoriteArtists.includes(track.artistDetails?.name || '')) {
        this.userPreferences.favoriteArtists.push(track.artistDetails?.name || '');
      }
    } else if (skipped) {
      // Decrease weight for this genre/artist (soft penalty)
      this.weights.genreMatch *= 0.95;
      this.weights.artistMatch *= 0.95;
    }
  }

  // Update user preferences dynamically
  updatePreferences(newPreferences: Partial<UserPreferences>) {
    this.userPreferences = { ...this.userPreferences, ...newPreferences };
  }
}

// Singleton instance
let recommendationEngine: MusicRecommendationEngine | null = null;

export const musicRecommendationEngine = {
  initialize: (userPreferences: UserPreferences) => {
    recommendationEngine = new MusicRecommendationEngine(userPreferences);
    return recommendationEngine;
  },

  getInstance: () => {
    if (!recommendationEngine) {
      throw new Error('MusicRecommendationEngine not initialized');
    }
    return recommendationEngine;
  },

  isInitialized: () => !!recommendationEngine
};
