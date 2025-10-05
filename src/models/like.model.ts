import { Schema, model, models, Document } from "mongoose";

export interface ILike extends Document {
  _id: string;
  userId: string;
  targetId: string;
  targetType: "track" | "comment" | "playlist";
  type: "like" | "dislike";
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    userId: {
      type: String,
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      enum: ["track", "comment", "playlist"],
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Compound indexes for uniqueness and performance
LikeSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });
LikeSchema.index({ targetId: 1, targetType: 1, type: 1 });

export const Like = models.Like || model<ILike>("Like", LikeSchema);
