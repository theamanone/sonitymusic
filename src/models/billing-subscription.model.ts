// models/billing-subscription.model.ts - ENHANCED FOR WORLD-CLASS PLATFORM
import mongoose, { Schema, models, model } from 'mongoose';

export interface ISubscription {
  _id: mongoose.Types.ObjectId;
  userId: string;
  plan: string;
  tier: 'free' | 'basic' | 'premium' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled' | 'expired' | 'paused' | 'trial';
  
  // Regional & Billing
  region: string; // User's region for pricing
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  
  // Period Management
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEnd?: Date;
  gracePeriodEnd?: Date;
  
  // Payment Integration
  razorpaySubscriptionId?: string;
  razorpayCustomerId?: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  
  // Enhanced Usage Tracking
  usage: {
    // Content Consumption
    videosWatched: number;
    moviesWatched: number;
    seriesWatched: number;
    totalWatchTimeMinutes: number;
    
    // Content Creation
    videosUploaded: number;
    videosUploadedThisMonth: number;
    storageUsedGB: number;
    bandwidthUsedGB: number;
    
    // Social Features
    commentsPosted: number;
    playlistsCreated: number;
    likesGiven: number;
    sharesCount: number;
    
    // Downloads & Offline
    downloadsUsed: number;
    offlineStorageUsedGB: number;
    
    // Streaming
    concurrentStreamsUsed: number;
    qualityUsage: {
      '480p': number;
      '720p': number;
      '1080p': number;
      '4K': number;
      '8K': number;
    };
    
    // Creator Analytics
    totalViews: number;
    totalRevenue: number;
    liveStreamsHosted: number;
  };
  
  // Feature Access Cache (from plan)
  features: {
    // Content Access
    canWatchRegularVideos: boolean;
    canWatchPremiumMovies: boolean;
    canWatchExclusiveSeries: boolean;
    canWatchOriginalContent: boolean;
    hasEarlyAccess: boolean;
    
    // Platform Features
    adsEnabled: boolean;
    maxVideoQuality: '480p' | '720p' | '1080p' | '4K' | '8K';
    maxConcurrentStreams: number;
    offlineDownloads: boolean;
    maxOfflineDownloads: number;
    
    // Creator Features
    canUploadVideos: boolean;
    maxVideoUploadsPerMonth: number;
    maxUploadQuality: '720p' | '1080p' | '4K' | '8K';
    customThumbnails: boolean;
    videoScheduling: boolean;
    liveStreaming: boolean;
    monetization: boolean;
    advancedAnalytics: boolean;
    
    // Premium Services
    prioritySupport: boolean;
    conciergeService: boolean;
    betaFeatures: boolean;
    apiAccess: boolean;
  };
  
  // Plan Change Management
  queuedChange?: {
    targetPlan: string;
    targetTier: string;
    changeType: 'upgrade' | 'downgrade' | 'lateral';
    effectiveAt: Date;
    requestedAt: Date;
    reason?: string;
    previousPlan: string;
    prorationAmount?: number;
  };
  
  // Renewal & Payment Tracking
  renewal: {
    lastRenewalAt?: Date;
    nextRenewalAt?: Date;
    renewalAttempts: number;
    autoRenewal: boolean;
    paymentMethod?: 'card' | 'upi' | 'netbanking' | 'wallet';
    lastPaymentAmount?: number;
    lastPaymentCurrency?: string;
  };
  
  // Engagement & Rewards
  engagement: {
    loyaltyPoints: number;
    streakDays: number;
    achievementBadges: string[];
    referralsCount: number;
    lastActiveAt: Date;
  };
  
  // Business Features (for enterprise users)
  business?: {
    teamSize: number;
    customDomain?: string;
    brandingEnabled: boolean;
    whiteLabel: boolean;
    dedicatedManager?: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  userId: { type: String, required: true, unique: true, index: true },
  plan: { type: String, default: 'free', index: true },
  tier: { 
    type: String, 
    enum: ['free', 'basic', 'premium', 'pro', 'enterprise'], 
    default: 'free',
    index: true
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'cancelled', 'expired', 'paused', 'trial'], 
    default: 'active',
    index: true
  },
  
  // Regional & Billing
  region: { type: String, default: 'US' },
  currency: { type: String, default: 'USD' },
  billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
  
  // Period Management
  currentPeriodStart: { type: Date, default: Date.now },
  currentPeriodEnd: { 
    type: Date, 
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  trialEnd: Date,
  gracePeriodEnd: Date,
  
  // Payment Integration
  razorpaySubscriptionId: String,
  razorpayCustomerId: String,
  stripeSubscriptionId: String,
  stripeCustomerId: String,
  
  // Enhanced Usage Tracking
  usage: {
    // Content Consumption
    videosWatched: { type: Number, default: 0 },
    moviesWatched: { type: Number, default: 0 },
    seriesWatched: { type: Number, default: 0 },
    totalWatchTimeMinutes: { type: Number, default: 0 },
    
    // Content Creation
    videosUploaded: { type: Number, default: 0 },
    videosUploadedThisMonth: { type: Number, default: 0 },
    storageUsedGB: { type: Number, default: 0 },
    bandwidthUsedGB: { type: Number, default: 0 },
    
    // Social Features
    commentsPosted: { type: Number, default: 0 },
    playlistsCreated: { type: Number, default: 0 },
    likesGiven: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    
    // Downloads & Offline
    downloadsUsed: { type: Number, default: 0 },
    offlineStorageUsedGB: { type: Number, default: 0 },
    
    // Streaming
    concurrentStreamsUsed: { type: Number, default: 0 },
    qualityUsage: {
      '480p': { type: Number, default: 0 },
      '720p': { type: Number, default: 0 },
      '1080p': { type: Number, default: 0 },
      '4K': { type: Number, default: 0 },
      '8K': { type: Number, default: 0 }
    },
    
    // Creator Analytics
    totalViews: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    liveStreamsHosted: { type: Number, default: 0 }
  },
  
  // Feature Access Cache
  features: {
    // Content Access
    canWatchRegularVideos: { type: Boolean, default: true },
    canWatchPremiumMovies: { type: Boolean, default: false },
    canWatchExclusiveSeries: { type: Boolean, default: false },
    canWatchOriginalContent: { type: Boolean, default: false },
    hasEarlyAccess: { type: Boolean, default: false },
    
    // Platform Features
    adsEnabled: { type: Boolean, default: true },
    maxVideoQuality: { 
      type: String, 
      enum: ['480p', '720p', '1080p', '4K', '8K'], 
      default: '720p' 
    },
    maxConcurrentStreams: { type: Number, default: 1 },
    offlineDownloads: { type: Boolean, default: false },
    maxOfflineDownloads: { type: Number, default: 0 },
    
    // Creator Features
    canUploadVideos: { type: Boolean, default: true },
    maxVideoUploadsPerMonth: { type: Number, default: -1 },
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
    
    // Premium Services
    prioritySupport: { type: Boolean, default: false },
    conciergeService: { type: Boolean, default: false },
    betaFeatures: { type: Boolean, default: false },
    apiAccess: { type: Boolean, default: false }
  },
  
  // Plan Change Management
  queuedChange: {
    targetPlan: String,
    targetTier: String,
    changeType: { type: String, enum: ['upgrade', 'downgrade', 'lateral'] },
    effectiveAt: Date,
    requestedAt: Date,
    reason: String,
    previousPlan: String,
    prorationAmount: Number
  },
  
  // Renewal & Payment
  renewal: {
    lastRenewalAt: Date,
    nextRenewalAt: Date,
    renewalAttempts: { type: Number, default: 0 },
    autoRenewal: { type: Boolean, default: true },
    paymentMethod: { type: String, enum: ['card', 'upi', 'netbanking', 'wallet'] },
    lastPaymentAmount: Number,
    lastPaymentCurrency: String
  },
  
  // Engagement & Rewards
  engagement: {
    loyaltyPoints: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
    achievementBadges: [String],
    referralsCount: { type: Number, default: 0 },
    lastActiveAt: { type: Date, default: Date.now }
  },
  
  // Business Features
  business: {
    teamSize: { type: Number, default: 1 },
    customDomain: String,
    brandingEnabled: { type: Boolean, default: false },
    whiteLabel: { type: Boolean, default: false },
    dedicatedManager: String
  }
}, { 
  timestamps: true,
  collection: 'subscriptions'
});

// Enhanced Indexes
SubscriptionSchema.index({ userId: 1, status: 1 });
SubscriptionSchema.index({ tier: 1, status: 1 });
SubscriptionSchema.index({ region: 1, currency: 1 });
SubscriptionSchema.index({ currentPeriodEnd: 1 });
SubscriptionSchema.index({ 'queuedChange.effectiveAt': 1 });
SubscriptionSchema.index({ 'renewal.nextRenewalAt': 1 });
SubscriptionSchema.index({ 'engagement.lastActiveAt': -1 });

// Pre-save middleware to update monthly usage
SubscriptionSchema.pre('save', function(next) {
  const now = new Date();
  
  // Reset monthly counters if new month
  if (this.isModified('usage.videosUploadedThisMonth')) {
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastUpdate = this.updatedAt || this.createdAt;
    
    if (lastUpdate < currentMonth) {
      this.usage.videosUploadedThisMonth = 0;
    }
  }
  
  next();
});

export const SubscriptionModel = models.Subscription || model<ISubscription>('Subscription', SubscriptionSchema);
