export interface PlanLimits {
  // Calculated/upload gating fields
  maxSize: number; // bytes
  maxDuration: number; // seconds
  formats: string[];

  // Display/meta
  label: string;
  description: string;
  tier: 'free' | 'premium' | 'pro' | 'enterprise' | string;

  // Feature gates
  maxVideoUploadsPerMonth: number;
  maxVideoLength: number; // seconds
  maxUploadQuality: string; // e.g., '1080p', '4K'
  storageQuotaGB: number;
  customThumbnails: boolean;
  videoScheduling: boolean;
  liveStreaming: boolean;
}
