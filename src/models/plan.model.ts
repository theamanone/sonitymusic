// models/plan.model.ts - Music Streaming Platform Plans
import { Schema, model, models, Document } from 'mongoose';

export interface IPlan extends Document {
  name: string;
  displayName: string;
  description: string;
  tagline: string;

  // 🌍 International Pricing
  pricing: {
    regions: {
      [key: string]: {
        monthly: number;
        yearly: number;
        currency: string;
        taxRate?: number;
      }
    };
    defaultRegion: string;
  };

  // 🎵 Music Streaming Features (NO UPLOADS - License-based content only)
  contentAccess: {
    regularSongs: boolean;
    premiumSongs: boolean;
    exclusiveReleases: boolean;
    officialMusicVideos: boolean; // Unique feature: videos related to songs
    behindTheScenes: boolean;
    artistInterviews: boolean;
    liveSessions: boolean; // Access to live artist performances
  };

  platformFeatures: {
    // Listening Experience
    adsEnabled: boolean;
    skipAdsAfterSeconds: number;
    highQualityStreaming: boolean; // 320kbps
    losslessStreaming: boolean; // FLAC quality

    // Social Features (Consumption-focused)
    canCreatePlaylists: boolean;
    maxPlaylists: number;
    canFollowArtists: boolean;
    canComment: boolean;
    canShare: boolean;
    canLikeSongs: boolean;

    // Premium Features (Pure consumption)
    offlineDownloads: boolean;
    maxOfflineDevices: number;
    listenWithFriends: boolean; // Listen together feature
    liveSessions: boolean; // Join live artist sessions
    prioritySupport: boolean;
    earlyAccess: boolean;
    personalizedRecommendations: boolean;

    // Family/Group Plans
    familyPlan: boolean;
    maxFamilyMembers: number;
  };

  // 🏆 Plan Classification
  tier: 'free' | 'pro' | 'family' | 'student' | 'enterprise';
  target: 'individual' | 'family' | 'student' | 'business';

  // 📊 Marketing & Display
  features: string[];
  benefits: string[];
  popular: boolean;

  // 💳 Payment Integration
  paymentIntegration: {
    stripe: {
      monthlyPriceId: string;
      yearlyPriceId: string;
    };
    razorpay: {
      planId: string;
    };
  };

  // 🎨 UI & Branding
  ui: {
    colorTheme: string;
    gradientFrom: string;
    gradientTo: string;
    badge?: string;
    icon?: string;
  };

  active: boolean;
  sortOrder: number;

  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>({
  name: { type: String, required: true, unique: true, lowercase: true },
  displayName: { type: String, required: true },
  description: { type: String, required: true },
  tagline: { type: String, required: true },
  
  // International pricing structure
  pricing: {
    regions: {
      type: Map,
      of: {
        monthly: { type: Number, required: true },
        yearly: { type: Number, required: true },
        currency: { type: String, required: true },
        taxRate: Number
      }
    },
    defaultRegion: { type: String, default: 'US' }
  },
  
  contentAccess: {
    regularSongs: { type: Boolean, default: true },
    premiumSongs: { type: Boolean, default: false },
    exclusiveReleases: { type: Boolean, default: false },
    officialMusicVideos: { type: Boolean, default: false }, // Unique feature: videos related to songs
    behindTheScenes: { type: Boolean, default: false },
    artistInterviews: { type: Boolean, default: false },
    liveSessions: { type: Boolean, default: false }
  },

  platformFeatures: {
    // Listening Experience
    adsEnabled: { type: Boolean, default: true },
    skipAdsAfterSeconds: { type: Number, default: 5 },
    highQualityStreaming: { type: Boolean, default: false }, // 320kbps
    losslessStreaming: { type: Boolean, default: false }, // FLAC quality

    // Social Features (Consumption-focused)
    canCreatePlaylists: { type: Boolean, default: true },
    maxPlaylists: { type: Number, default: 100 },
    canFollowArtists: { type: Boolean, default: true },
    canComment: { type: Boolean, default: true },
    canShare: { type: Boolean, default: true },
    canLikeSongs: { type: Boolean, default: true },

    // Premium Features (Pure consumption)
    offlineDownloads: { type: Boolean, default: false },
    maxOfflineDevices: { type: Number, default: 0 },
    listenWithFriends: { type: Boolean, default: false }, // Listen together feature
    liveSessions: { type: Boolean, default: false }, // Join live artist sessions
    prioritySupport: { type: Boolean, default: false },
    earlyAccess: { type: Boolean, default: false },
    personalizedRecommendations: { type: Boolean, default: false },

    // Family/Group Plans
    familyPlan: { type: Boolean, default: false },
    maxFamilyMembers: { type: Number, default: 1 }
  },
  tier: {
    type: String,
    enum: ['free', 'pro', 'family', 'student', 'enterprise'],
    required: true
  },
  target: {
    type: String,
    enum: ['individual', 'family', 'student', 'business'],
    default: 'individual'
  },
  
  features: [String],
  benefits: [String],
  popular: { type: Boolean, default: false },

  paymentIntegration: {
    stripe: {
      monthlyPriceId: String,
      yearlyPriceId: String
    },
    razorpay: {
      planId: String
    }
  },

  ui: {
    colorTheme: { type: String, default: '#6B46C1' },
    gradientFrom: { type: String, default: '#6B46C1' },
    gradientTo: { type: String, default: '#8B5CF6' },
    badge: String,
    icon: String
  },

  active: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, {
  timestamps: true,
  collection: 'plans'
});

// Performance indexes
PlanSchema.index({ tier: 1, active: 1 });
PlanSchema.index({ target: 1, active: 1 });
PlanSchema.index({ popular: -1, sortOrder: 1 });
PlanSchema.index({ 'pricing.regions.currency': 1 });

export const Plan = models.Plan || model<IPlan>('Plan', PlanSchema);
