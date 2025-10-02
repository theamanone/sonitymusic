// types/track.types.ts - TypeScript types for music tracks
import { Types } from "mongoose";

export interface TrackWithArtist {
  _id: string;
  customTrackId: string;
  title: string;
  description?: string;
  tags: string[];
  genre: string;
  privacy: "public" | "unlisted" | "private";
  allowComments: boolean;
  explicit: boolean;
  language: string;
  audioUrl: string;
  coverArt: {
    default?: string;
    small?: string;
    medium?: string;
    large?: string;
  };
  lyrics: {
    language: string;
    type: "plain" | "synced";
    content: string;
    isDefault?: boolean;
  }[];
  processingStatus: "pending" | "uploading" | "processing" | "ready" | "failed";
  availableQualities: string[];
  processingProgress: number;
  processingStartedAt?: Date;
  processingCompletedAt?: Date;
  processingError?: string;
  originalFileName?: string;
  originalFileSize: number;
  originalMimeType?: string;
  originalBitrate?: string;
  duration: number;
  drmEnabled: boolean;
  drmFolder?: string;
  encryptionStatus: "none" | "pending" | "encrypted" | "failed";
  artistId: string;
  artistType: "user" | "verified" | "admin";
  artistName?: string;
  albumId?: string;
  albumName?: string;
  contentType: "track" | "podcast" | "audiobook" | "mix" | "live";
  albumData?: {
    albumId?: string;
    albumTitle?: string;
    trackNumber?: number;
    discNumber?: number;
    releaseDate?: Date;
  };
  plays: number;
  uniquePlays: number;
  likes: number;
  dislikes: number;
  comments: number;
  shares: number;
  averageRating?: number;
  totalRatings: number;
  listenTime: number;
  completionRate: number;
  skipRate: number;
  moderationStatus: "pending" | "approved" | "rejected" | "flagged" | "reviewing";
  moderationFlags: {
    type: "spam" | "inappropriate" | "copyright" | "violence" | "other";
    reason?: string;
    flaggedBy: string;
    flaggedAt: Date;
    resolved: boolean;
  }[];
  contentWarnings?: string[];
  slug?: string;
  searchTags: string[];
  trending: boolean;
  featured: boolean;
  publishedAt?: Date;
  scheduledAt?: Date;
  version: number;
  isLatest: boolean;
  createdAt: string;
  updatedAt: string;
  artistDetails?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    verified?: boolean;
  };
}

export interface TrackCreateInput {
  title: string;
  description?: string;
  tags?: string[];
  genre: string;
  privacy?: "public" | "unlisted" | "private";
  allowComments?: boolean;
  explicit?: boolean;
  language?: string;
  artistId: string;
  artistName?: string;
  albumId?: string;
  albumName?: string;
  contentType?: "track" | "podcast" | "audiobook" | "mix" | "live";
}

export interface TrackUpdateInput extends Partial<TrackCreateInput> {
  customTrackId?: string;
  processingStatus?: "pending" | "uploading" | "processing" | "ready" | "failed";
  availableQualities?: string[];
  processingProgress?: number;
  processingError?: string;
  originalFileName?: string;
  originalFileSize?: number;
  originalMimeType?: string;
  originalBitrate?: string;
  duration?: number;
  drmEnabled?: boolean;
  drmFolder?: string;
  encryptionStatus?: "none" | "pending" | "encrypted" | "failed";
  plays?: number;
  uniquePlays?: number;
  likes?: number;
  dislikes?: number;
  comments?: number;
  shares?: number;
  averageRating?: number;
  totalRatings?: number;
  listenTime?: number;
  completionRate?: number;
  skipRate?: number;
  moderationStatus?: "pending" | "approved" | "rejected" | "flagged" | "reviewing";
  slug?: string;
  searchTags?: string[];
  trending?: boolean;
  featured?: boolean;
  publishedAt?: Date;
  scheduledAt?: Date;
}
