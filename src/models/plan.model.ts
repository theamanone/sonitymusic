// models/plan.model.ts - TRILLION DOLLAR ENHANCEMENT
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
  
  // 🎬 Content Access Control
  contentAccess: {
    regularVideos: boolean; // Always true for all plans
    premiumMovies: boolean;
    exclusiveSeries: boolean;
    originalContent: boolean;
    earlyAccess: boolean;
    behindTheScenes: boolean;
    directorsCut: boolean;
  };
  
  // 📱 Platform Features
  platformFeatures: {
    // Viewing Experience
    adsEnabled: boolean;
    skipAdsAfterSeconds: number;
    maxVideoQuality: '480p' | '720p' | '1080p' | '4K' | '8K';
    maxConcurrentStreams: number;
    offlineDownloads: boolean;
    maxOfflineDownloads: number;
    downloadExpiry: number; // hours
    
    // Social Features
    canComment: boolean;
    canLike: boolean;
    canShare: boolean;
    canCreatePlaylists: boolean;
    privatePlaylistsLimit: number;
    publicPlaylistsLimit: number;
    
    // Creator Features
    canUploadVideos: boolean;
    maxVideoUploadsPerMonth: number;
    maxVideoLength: number; // seconds
    maxUploadQuality: '720p' | '1080p' | '4K' | '8K';
    customThumbnails: boolean;
    videoScheduling: boolean;
    liveStreaming: boolean;
    monetization: boolean;
    advancedAnalytics: boolean;
    
    // Storage & Bandwidth
    storageQuotaGB: number;
    bandwidthQuotaGB: number; // per month
    priorityStreaming: boolean;
    
    // Premium Services
    prioritySupport: boolean;
    conciergeService: boolean;
    personalizedRecommendations: boolean;
    betaFeatures: boolean;
    apiAccess: boolean;
  };
  
  // 🎯 Business Features
  businessFeatures?: {
    teamMembersLimit: number;
    brandedPlayer: boolean;
    whiteLabel: boolean;
    customDomain: boolean;
    advancedSecurity: boolean;
    contentManagement: boolean;
    bulkOperations: boolean;
    dedicatedSupport: boolean;
  };
  
  // 🏆 Tier Classification
  tier: 'free' | 'basic' | 'premium' | 'pro' | 'enterprise';
  target: 'consumer' | 'creator' | 'business' | 'enterprise';
  
  // 📊 Marketing & Display
  features: string[];
  benefits: string[];
  popular: boolean;
  recommended: boolean;
  exclusive: boolean;
  limitedTime?: {
    discountPercent: number;
    validUntil: Date;
  };
  
  // 💳 Payment Integration
  paymentIntegration: {
    stripe: {
      monthlyPriceId: string;
      yearlyPriceId: string;
    };
    razorpay: {
      planId: string;
    };
    paypal: {
      productId: string;
    };
    applePay: {
      productId: string;
    };
    googlePay: {
      skuId: string;
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
  
  // 📈 Analytics & Limits
  analytics: {
    conversionTracking: boolean;
    userJourneyAnalytics: boolean;
    revenueAnalytics: boolean;
    contentPerformance: boolean;
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
    regularVideos: { type: Boolean, default: true },
    premiumMovies: { type: Boolean, default: false },
    exclusiveSeries: { type: Boolean, default: false },
    originalContent: { type: Boolean, default: false },
    earlyAccess: { type: Boolean, default: false },
    behindTheScenes: { type: Boolean, default: false },
    directorsCut: { type: Boolean, default: false }
  },
  
  platformFeatures: {
    // Viewing
    adsEnabled: { type: Boolean, default: true },
    skipAdsAfterSeconds: { type: Number, default: 5 },
    maxVideoQuality: { 
      type: String, 
      enum: ['480p', '720p', '1080p', '4K', '8K'], 
      default: '720p' 
    },
    maxConcurrentStreams: { type: Number, default: 1 },
    offlineDownloads: { type: Boolean, default: false },
    maxOfflineDownloads: { type: Number, default: 0 },
    downloadExpiry: { type: Number, default: 48 },
    
    // Social
    canComment: { type: Boolean, default: true },
    canLike: { type: Boolean, default: true },
    canShare: { type: Boolean, default: true },
    canCreatePlaylists: { type: Boolean, default: true },
    privatePlaylistsLimit: { type: Number, default: 10 },
    publicPlaylistsLimit: { type: Number, default: 5 },
    
    // Creator
    canUploadVideos: { type: Boolean, default: true },
    maxVideoUploadsPerMonth: { type: Number, default: -1 }, // -1 = unlimited
    maxVideoLength: { type: Number, default: -1 },
    maxUploadQuality: { 
      type: String, 
      enum: ['720p', '1080p', '4K', '8K'], 
      default: '1080p' 
    },
    customThumbnails: { type: Boolean, default: false },
    videoScheduling: { type: Boolean, default: false },
    liveStreaming: { type: Boolean, default: false },
    monetization: { type: Boolean, default: false },
    advancedAnalytics: { type: Boolean, default: false },
    
    // Storage
    storageQuotaGB: { type: Number, default: -1 },
    bandwidthQuotaGB: { type: Number, default: -1 },
    priorityStreaming: { type: Boolean, default: false },
    
    // Premium
    prioritySupport: { type: Boolean, default: false },
    conciergeService: { type: Boolean, default: false },
    personalizedRecommendations: { type: Boolean, default: false },
    betaFeatures: { type: Boolean, default: false },
    apiAccess: { type: Boolean, default: false }
  },
  
  businessFeatures: {
    teamMembersLimit: { type: Number, default: 1 },
    brandedPlayer: { type: Boolean, default: false },
    whiteLabel: { type: Boolean, default: false },
    customDomain: { type: Boolean, default: false },
    advancedSecurity: { type: Boolean, default: false },
    contentManagement: { type: Boolean, default: false },
    bulkOperations: { type: Boolean, default: false },
    dedicatedSupport: { type: Boolean, default: false }
  },
  
  tier: { 
    type: String, 
    enum: ['free', 'basic', 'premium', 'pro', 'enterprise'], 
    required: true 
  },
  target: { 
    type: String, 
    enum: ['consumer', 'creator', 'business', 'enterprise'], 
    default: 'consumer' 
  },
  
  features: [String],
  benefits: [String],
  popular: { type: Boolean, default: false },
  recommended: { type: Boolean, default: false },
  exclusive: { type: Boolean, default: false },
  
  limitedTime: {
    discountPercent: Number,
    validUntil: Date
  },
  
  paymentIntegration: {
    stripe: {
      monthlyPriceId: String,
      yearlyPriceId: String
    },
    razorpay: {
      planId: String
    },
    paypal: {
      productId: String
    },
    applePay: {
      productId: String
    },
    googlePay: {
      skuId: String
    }
  },
  
  ui: {
    colorTheme: { type: String, default: '#6B46C1' },
    gradientFrom: { type: String, default: '#6B46C1' },
    gradientTo: { type: String, default: '#8B5CF6' },
    badge: String,
    icon: String
  },
  
  analytics: {
    conversionTracking: { type: Boolean, default: false },
    userJourneyAnalytics: { type: Boolean, default: false },
    revenueAnalytics: { type: Boolean, default: false },
    contentPerformance: { type: Boolean, default: false }
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
