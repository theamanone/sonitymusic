import { Schema, model, models, Document } from "mongoose";

// models/playlist.model.ts - USER PLAYLISTS
export interface IPlaylist extends Document {
  _id: string;
  title: string;
  description?: string;
  userId: string; // ✅ Only store user ID
  privacy: "public" | "unlisted" | "private";
  tracks: {
    trackId: string;
    addedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const PlaylistSchema = new Schema<IPlaylist>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 1000,
      trim: true,
    },
    userId: {
      type: String,
      required: true,
    },
    privacy: {
      type: String,
      enum: ["public", "unlisted", "private"],
      default: "public",
    },
    tracks: [
      {
        trackId: {
          type: String,
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// ✅ Indexes for user playlists and public discovery
PlaylistSchema.index({ userId: 1, createdAt: -1 });
PlaylistSchema.index({ privacy: 1, createdAt: -1 });

export const Playlist = models.Playlist || model<IPlaylist>("Playlist", PlaylistSchema);
