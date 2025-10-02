'use client';

import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { Toaster } from 'sonner';
// import { CapabilitiesProvider } from '@/contexts/CapabilitiesContext';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  // Enable subscription fetching globally
  return (
    <SubscriptionProvider disableAutoFetch>
      {/* <CapabilitiesProvider> */}
        {children}
        <Toaster richColors position="top-center" closeButton />
      {/* </CapabilitiesProvider> */}
    </SubscriptionProvider>
  );
}
