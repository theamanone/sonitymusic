// models/payment.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  _id: string;
  userId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  plan: string;
  description: string;
  refundId?: string;
  refundedAt?: Date;
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  userId: { type: String, required: true },
  razorpayOrderId: { type: String, required: true, unique: true },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'INR' },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  plan: { type: String, required: true },
  description: { type: String, required: true },
  refundId: { type: String },
  refundedAt: { type: Date },
  refundReason: { type: String },
}, {
  timestamps: true,
});

// Index for efficient queries
PaymentSchema.index({ userId: 1, createdAt: -1 });
PaymentSchema.index({ razorpayOrderId: 1 });
PaymentSchema.index({ status: 1 });

export const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
