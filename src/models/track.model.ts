// models/track.model.ts - Music Track Model
import mongoose, { Document, Schema, Model, Types } from "mongoose";

// **Core Track Interface**
export interface ITrack extends Document {
  uploadedAt: string;
  channel: any;
  readonly _id: Types.ObjectId;

  // **Basic Information**
  audioUrl?: string;
  coverArtUrl?: string;
  title: string;
  description?: string;
  tags: string[];
  genre: MusicGenre;
  privacy: TrackPrivacy;
  allowComments: boolean;
  explicit: boolean;
  language: string;

  // **Custom Track Identifier**
  customTrackId: string;

  // **Storage Structure**
  storagePath: string; // data/tracks/{customTrackId}/
  masterAudioUrl?: string; // /api/tracks/stream/{customTrackId}/master.m3u8
  coverArtPath: string; // data/tracks/{customTrackId}/cover/
  lyricsPath?: string; // data/tracks/{customTrackId}/lyrics/
  metaFilePath: string; // data/tracks/{customTrackId}/meta.json
  accessFilePath: string; // data/tracks/{customTrackId}/.access

  // **Cover Art (Multiple Sizes)**
  coverArt: TrackCoverArt;

  // **Lyrics Support**
  lyrics?: TrackLyrics[];

  // **Audio Processing Status**
  processingStatus: TrackProcessingStatus;
  availableQualities: AudioQuality[];
  processingProgress: number; // 0-100
  processingStartedAt?: Date;
  processingCompletedAt?: Date;
  processingError?: string;

  // **Upload Chunk Tracking**
  totalChunks: number;
  uploadedChunks: number;
  uploadStartedAt?: Date;
  uploadCompletedAt?: Date;

  // **Source File Information**
  originalFileName?: string;
  originalFileSize: number; // bytes
  originalMimeType?: string;
  originalBitrate?: string; // e.g., "320kbps"
  fileName?: string;
  mimeType?: string;
  bitrate?: string[];
  status?: string;
  duration: number; // seconds

  // **DRM & Security**
  drmEnabled: boolean;
  drmFolder?: string;
  encryptionStatus: EncryptionStatus;

  // **Artist & Ownership**
  artistId: string;
  artistType: ArtistType; // 'user' | 'verified' | 'admin'
  artistName?: string;
  albumId?: string;
  albumName?: string;

  // **Content Type**
  contentType: "track" | "podcast" | "audiobook" | "mix" | "live";

  // **Engagement Metrics**
  plays: number;
  uniquePlays: number;
  likes: number;
  dislikes: number;
  comments: number;
  shares: number;
  averageRating?: number; // 1-5 stars
  totalRatings: number;

  // **Analytics**
  listenTime: number; // total seconds listened
  completionRate: number; // percentage of track listened
  skipRate: number; // percentage of users who skipped

  // **Content Moderation**
  moderationStatus: ModerationStatus;
  moderationFlags: ModerationFlag[];
  contentWarnings?: string[];

  // **SEO & Discovery**
  slug?: string;
  searchTags: string[];
  trending: boolean;
  featured: boolean;

  // **Album/Playlist Info**
  albumData?: {
    albumId?: string;
    albumTitle?: string;
    trackNumber?: number;
    discNumber?: number;
    releaseDate?: Date;
  };

  // **Timestamps**
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  scheduledAt?: Date;

  // **Version Control**
  version: number;
  isLatest: boolean;
}

// **Supporting Type Definitions**
export type MusicGenre =
  | "pop"
  | "rock"
  | "hip-hop"
  | "electronic"
  | "jazz"
  | "classical"
  | "country"
  | "r&b"
  | "indie"
  | "metal"
  | "folk"
  | "blues"
  | "reggae"
  | "latin"
  | "soul"
  | "funk"
  | "disco"
  | "house"
  | "techno"
  | "dubstep"
  | "ambient"
  | "world"
  | "experimental"
  | "podcast"
  | "other";

export type TrackPrivacy = "public" | "unlisted" | "private";

export type TrackProcessingStatus =
  | "pending"
  | "uploading"
  | "processing"
  | "ready"
  | "failed"
  | "archived";

export type AudioQuality =
  | "128kbps"
  | "192kbps"
  | "256kbps"
  | "320kbps"
  | "lossless"
  | "hi-res";

export type EncryptionStatus = "none" | "pending" | "encrypted" | "failed";

export type ArtistType = "user" | "verified" | "admin";

export type ModerationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "flagged"
  | "reviewing";

export interface TrackCoverArt {
  default?: string;
  small?: string;
  medium?: string;
  large?: string;
}

export interface TrackLyrics {
  language: string;
  type: "plain" | "synced";
  content: string;
  isDefault?: boolean;
}

export interface ModerationFlag {
  type: "spam" | "inappropriate" | "copyright" | "violence" | "other";
  reason?: string;
  flaggedBy: string;
  flaggedAt: Date;
  resolved: boolean;
}

// **Mongoose Schema**
const TrackCoverArtSchema = new Schema<TrackCoverArt>(
  {
    default: { type: String },
    small: { type: String },
    medium: { type: String },
    large: { type: String },
  },
  { _id: false }
);

const TrackLyricsSchema = new Schema<TrackLyrics>(
  {
    language: { type: String, required: true, match: /^[a-z]{2}$/ },
    type: { type: String, enum: ["plain", "synced"], default: "plain" },
    content: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const ModerationFlagSchema = new Schema<ModerationFlag>(
  {
    type: {
      type: String,
      required: true,
      enum: ["spam", "inappropriate", "copyright", "violence", "other"],
    },
    reason: { type: String, maxlength: 500 },
    flaggedBy: { type: String, required: true },
    flaggedAt: { type: Date, default: Date.now },
    resolved: { type: Boolean, default: false },
  },
  { _id: false }
);

const TrackSchema = new Schema<ITrack>(
  {
    customTrackId: {
      type: String,
      required: [true, "Custom track ID is required"],
      unique: true,
      match: /^(track_|seed_)[a-z0-9_]+$/,
    },

    // **Basic Information**
    title: {
      type: String,
      required: [true, "Track title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
      minlength: [1, "Title must be at least 1 character"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 50,
      },
    ],
    genre: {
      type: String,
      required: [true, "Genre is required"],
      enum: [
        "pop", "rock", "hip-hop", "electronic", "jazz", "classical",
        "country", "r&b", "indie", "metal", "folk", "blues", "reggae",
        "latin", "soul", "funk", "disco", "house", "techno", "dubstep",
        "ambient", "world", "experimental", "podcast", "other"
      ],
    },
    privacy: {
      type: String,
      enum: ["public", "unlisted", "private"],
      default: "public",
    },
    allowComments: { type: Boolean, default: true },
    explicit: { type: Boolean, default: false },
    language: { type: String, default: "en", match: /^[a-z]{2}$/ },

    // **Storage Structure**
    storagePath: {
      type: String,
      required: [true, "Storage path is required"],
    },
    masterAudioUrl: { type: String },
    coverArtPath: {
      type: String,
      required: [true, "Cover art path is required"],
    },
    lyricsPath: { type: String },
    metaFilePath: {
      type: String,
      required: [true, "Meta file path is required"],
    },
    accessFilePath: {
      type: String,
      required: [true, "Access file path is required"],
    },

    // **Cover Art & Lyrics**
    coverArt: { type: TrackCoverArtSchema, default: {} },
    lyrics: [TrackLyricsSchema],

    // **Processing Status**
    processingStatus: {
      type: String,
      enum: ["pending", "uploading", "processing", "ready", "failed", "archived"],
      default: "pending",
      index: true,
    },
    availableQualities: [
      {
        type: String,
        enum: ["128kbps", "192kbps", "256kbps", "320kbps", "lossless", "hi-res"],
      },
    ],
    processingProgress: { type: Number, default: 0, min: 0, max: 100 },
    processingStartedAt: Date,
    processingCompletedAt: Date,
    processingError: { type: String, maxlength: 1000 },

    // **Upload Tracking**
    totalChunks: { type: Number, default: 0, min: 0 },
    uploadedChunks: { type: Number, default: 0, min: 0 },
    uploadStartedAt: Date,
    uploadCompletedAt: Date,

    // **Source File Info**
    originalFileName: { type: String, maxlength: 255 },
    originalFileSize: { type: Number, required: true, min: 0 },
    originalMimeType: { type: String },
    originalBitrate: { type: String },
    duration: { type: Number, required: true, min: 0 },

    // **DRM & Security**
    drmEnabled: { type: Boolean, default: false },
    drmFolder: { type: String },
    encryptionStatus: {
      type: String,
      enum: ["none", "pending", "encrypted", "failed"],
      default: "none",
    },

    // **Artist & Album**
    artistId: {
      type: String,
      required: [true, "Artist ID is required"],
      index: true,
    },
    artistType: {
      type: String,
      enum: ["user", "verified", "admin"],
      default: "user",
    },
    artistName: { type: String, maxlength: 100 },
    albumId: { type: String },
    albumName: { type: String, maxlength: 200 },

    contentType: {
      type: String,
      enum: ["track", "podcast", "audiobook", "mix", "live"],
      default: "track",
    },

    // **Album Data**
    albumData: {
      albumId: String,
      albumTitle: String,
      trackNumber: Number,
      discNumber: Number,
      releaseDate: Date,
    },

    // **Engagement Metrics**
    plays: { type: Number, default: 0, min: 0, index: true },
    uniquePlays: { type: Number, default: 0, min: 0 },
    likes: { type: Number, default: 0, min: 0 },
    dislikes: { type: Number, default: 0, min: 0 },
    comments: { type: Number, default: 0, min: 0 },
    shares: { type: Number, default: 0, min: 0 },
    averageRating: { type: Number, min: 1, max: 5 },
    totalRatings: { type: Number, default: 0, min: 0 },

    // **Analytics**
    listenTime: { type: Number, default: 0, min: 0 },
    completionRate: { type: Number, default: 0, min: 0, max: 100 },
    skipRate: { type: Number, default: 0, min: 0, max: 100 },

    // **Content Moderation**
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "flagged", "reviewing"],
      default: "pending",
      index: true,
    },
    moderationFlags: [ModerationFlagSchema],
    contentWarnings: [String],

    // **SEO & Discovery**
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      maxlength: 100,
    },
    searchTags: [{ type: String, lowercase: true, maxlength: 50 }],
    trending: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false, index: true },

    // **Timestamps**
    publishedAt: Date,
    scheduledAt: Date,

    // **Version Control**
    version: { type: Number, default: 1, min: 1 },
    isLatest: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
    collection: "tracks",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// **Indexes**
TrackSchema.index({ artistId: 1, createdAt: -1 });
TrackSchema.index({ genre: 1, processingStatus: 1, createdAt: -1 });
TrackSchema.index({ privacy: 1, moderationStatus: 1, createdAt: -1 });
TrackSchema.index({ trending: 1, plays: -1 });
TrackSchema.index({ featured: 1, createdAt: -1 });
TrackSchema.index({ tags: 1 });
TrackSchema.index({ searchTags: 1 });

// **Virtual Fields**
TrackSchema.virtual("engagementScore").get(function () {
  if (this.plays === 0) return 0;
  return ((this.likes - this.dislikes) / this.plays) * 100;
});

TrackSchema.virtual("isProcessed").get(function () {
  return this.processingStatus === "ready";
});

// **Instance Methods**
TrackSchema.methods.incrementPlay = function (isUnique: boolean = false) {
  this.plays += 1;
  if (isUnique) this.uniquePlays += 1;
  return this.save();
};

TrackSchema.methods.updateProcessingStatus = function (
  status: TrackProcessingStatus,
  progress?: number,
  error?: string
) {
  this.processingStatus = status;
  if (progress !== undefined) this.processingProgress = progress;
  if (error) this.processingError = error;

  if (status === "processing" && !this.processingStartedAt) {
    this.processingStartedAt = new Date();
  }
  if (status === "ready" || status === "failed") {
    this.processingCompletedAt = new Date();
  }

  return this.save();
};

// **Static Methods**
TrackSchema.statics.findByArtist = function (artistId: string) {
  return this.find({ artistId, isLatest: true }).sort({ createdAt: -1 });
};

TrackSchema.statics.findPublicReady = function () {
  return this.find({
    privacy: "public",
    processingStatus: "ready",
    moderationStatus: "approved",
    isLatest: true,
  });
};

TrackSchema.statics.findTrending = function (limit: number = 20) {
  return this.find({
    trending: true,
    privacy: "public",
    processingStatus: "ready",
    moderationStatus: "approved",
  })
    .sort({ plays: -1, createdAt: -1 })
    .limit(limit);
};

// **Middleware**
TrackSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
      .replace(/^-+|-+$/g, "")
      .substring(0, 100);
  }

  if (this.isModified() && !this.isNew) {
    this.version += 1;
  }

  next();
});

TrackSchema.pre<mongoose.Query<any, ITrack>>(/^find/, function (next) {
  this.find({ isLatest: { $ne: false } });
  next();
});

// **Model Export**
export const Track: Model<ITrack> =
  mongoose.models.Track || mongoose.model<ITrack>("Track", TrackSchema);

// **Utility Types**
export type TrackCreateInput = Pick<
  ITrack,
  | "title"
  | "description"
  | "tags"
  | "genre"
  | "privacy"
  | "allowComments"
  | "explicit"
  | "language"
>;

export type TrackUpdateInput = Partial<TrackCreateInput>;

export type TrackResponse = Omit<
  ITrack,
  "processingError" | "moderationFlags" | "accessFilePath" | "drmFolder"
>;

export type TrackListResponse = Pick<
  ITrack,
  | "_id"
  | "customTrackId"
  | "title"
  | "description"
  | "genre"
  | "privacy"
  | "coverArt"
  | "duration"
  | "plays"
  | "likes"
  | "createdAt"
  | "artistId"
  | "artistName"
  | "processingStatus"
>;
