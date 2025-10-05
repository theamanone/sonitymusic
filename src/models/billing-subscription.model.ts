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
  
  razorpaySubscriptionId?: string;
  razorpayCustomerId?: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  
  // Enhanced Usage Tracking (Music Consumption Only)
  usage: {
    // Content Consumption
    songsPlayed: number;
    albumsPlayed: number;
    playlistsFollowed: number;
    totalListenTimeMinutes: number;

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
  };
  
  // Feature Access Cache (from plan) - MUSIC ONLY
  features: {
    // Content Access
    canListenToRegularSongs: boolean;
    canListenToPremiumSongs: boolean;
    canListenToExclusiveReleases: boolean;
    canListenToOfficialMusicVideos: boolean;
    hasEarlyAccess: boolean;

    // Platform Features
    adsEnabled: boolean;
    highQualityStreaming: boolean;
    losslessStreaming: boolean;
    maxPlaylists: number;
    canFollowArtists: boolean;
    canComment: boolean;
    canShare: boolean;
    canLikeSongs: boolean;

    // Premium Features
    offlineDownloads: boolean;
    maxOfflineDevices: number;
    listenWithFriends: boolean;
    liveSessions: boolean;
    prioritySupport: boolean;
    earlyAccess: boolean;
    personalizedRecommendations: boolean;

    // Family Plans
    familyPlan: boolean;
    maxFamilyMembers: number;
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
  
  // Enhanced Usage Tracking (Music Consumption Only)
  usage: {
    // Content Consumption
    songsPlayed: { type: Number, default: 0 },
    albumsPlayed: { type: Number, default: 0 },
    playlistsFollowed: { type: Number, default: 0 },
    totalListenTimeMinutes: { type: Number, default: 0 },

    // Social Features
    commentsPosted: { type: Number, default: 0 },
    playlistsCreated: { type: Number, default: 0 },
    likesGiven: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },

    // Downloads & Offline
    downloadsUsed: { type: Number, default: 0 },
    offlineStorageUsedGB: { type: Number, default: 0 },

    // Streaming
    concurrentStreamsUsed: { type: Number, default: 0 }
  },
  
  // Feature Access Cache - MUSIC ONLY
  features: {
    // Content Access
    canListenToRegularSongs: { type: Boolean, default: true },
    canListenToPremiumSongs: { type: Boolean, default: false },
    canListenToExclusiveReleases: { type: Boolean, default: false },
    canListenToOfficialMusicVideos: { type: Boolean, default: false },
    hasEarlyAccess: { type: Boolean, default: false },

    // Platform Features
    adsEnabled: { type: Boolean, default: true },
    highQualityStreaming: { type: Boolean, default: false },
    losslessStreaming: { type: Boolean, default: false },
    maxPlaylists: { type: Number, default: 10 },
    canFollowArtists: { type: Boolean, default: true },
    canComment: { type: Boolean, default: true },
    canShare: { type: Boolean, default: true },
    canLikeSongs: { type: Boolean, default: true },

    // Premium Features
    offlineDownloads: { type: Boolean, default: false },
    maxOfflineDevices: { type: Number, default: 0 },
    listenWithFriends: { type: Boolean, default: false },
    liveSessions: { type: Boolean, default: false },
    prioritySupport: { type: Boolean, default: false },
    earlyAccess: { type: Boolean, default: false },
    personalizedRecommendations: { type: Boolean, default: false },

    // Family Plans
    familyPlan: { type: Boolean, default: false },
    maxFamilyMembers: { type: Number, default: 1 }
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

export const SubscriptionModel = models.Subscription || model<ISubscription>('Subscription', SubscriptionSchema);
