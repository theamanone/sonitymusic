// Plan data is now sourced from the database via PlanModel. No more mock plans here.

export const RAZORPAY_CONFIG = {
  // Charge currency for Razorpay Orders. Keep INR to avoid international card restrictions.
  currency: 'INR',
  company: 'Veliessa',
  description: 'VLSA Fashion AI Assistant Subscription'
};

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}
