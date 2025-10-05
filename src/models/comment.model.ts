import { Schema, model, models, Document } from "mongoose";

export interface IComment extends Document {
  _id: string;
  trackId: string;
  userId: string; // ✅ Only store user ID
  content: string;
  likes: number;
  dislikes: number;
  parentId?: string; // for replies
  status: "active" | "hidden" | "deleted" | "reported";
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    trackId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    parentId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "hidden", "deleted", "reported"],
      default: "active",
    },
  },
  { timestamps: true }
);

// ✅ Indexes at end only
CommentSchema.index({ trackId: 1, createdAt: -1 });
CommentSchema.index({ userId: 1, createdAt: -1 });
CommentSchema.index({ parentId: 1 });

export const Comment = models.Comment || model<IComment>("Comment", CommentSchema);
