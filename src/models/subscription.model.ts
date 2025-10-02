import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  _id: string;
  subscriberId: string; // user who is subscribing
  channelId: string; // user being subscribed to
  channelUsername: string;
  channelAvatar?: string;
  notificationsEnabled: boolean;
  createdAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  subscriberId: { type: String, required: true },
  channelId: { type: String, required: true },
  channelUsername: { type: String, required: true },
  channelAvatar: { type: String },
  notificationsEnabled: { type: Boolean, default: true },
}, {
  timestamps: true,
});

// Compound index to ensure one subscription per user per channel
SubscriptionSchema.index({ subscriberId: 1, channelId: 1 }, { unique: true });
SubscriptionSchema.index({ channelId: 1, createdAt: -1 });
SubscriptionSchema.index({ subscriberId: 1, createdAt: -1 });

export const Subscription = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
