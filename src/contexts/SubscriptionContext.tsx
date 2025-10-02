'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { useSession } from 'next-auth/react';

export interface SubscriptionData {
  plan: string;
  status: string;
  videosUploaded: number;
  storageUsed: number;
  canWatchAdFree: boolean;
  canUploadHD: boolean;
  canUpload4K: boolean;
  canAccessPremium: boolean;
}

interface SubscriptionContextType {
  subscription: SubscriptionData | null;
  plan: any; // ✅ Add plan property
  loading: boolean;
  refreshSubscription: () => Promise<void>;
  updateVideoCount: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children, initial, disableAutoFetch }: { children: ReactNode; initial?: SubscriptionData; disableAutoFetch?: boolean }) {
  const { data: session, status } = useSession();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(initial ?? null);
  const [loading, setLoading] = useState(initial ? false : true);
  const hydratedOnce = useRef<boolean>(!!initial);

  const fetchSubscription = async () => {
    if (disableAutoFetch) {
      setLoading(false);
      return;
    }
    if (status !== 'authenticated' || !session?.user) {
      setLoading(false);
      return;
    }

    // If we already hydrated from SSR once, skip the initial fetch
    if (hydratedOnce.current && subscription) {
      setLoading(false);
      hydratedOnce.current = false; // only skip once
      return;
    }

    try {
      const response = await fetch('/api/v1/subscription');
      
      if (!response.ok) {
        if (response.status === 401) {
          console.log('User not authenticated');
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setSubscription({
          plan: result.data.plan || 'free',
          status: result.data.status || 'active',
          videosUploaded: result.data.videosUploaded || 0,
          storageUsed: result.data.storageUsed || 0,
          canWatchAdFree: !result.data.limits?.adsEnabled,
          canUploadHD: result.data.limits?.canUploadHD || false,
          canUpload4K: result.data.limits?.canUpload4K || false,
          canAccessPremium: result.data.limits?.canAccessPremium || false,
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // Set default free plan values on error
      setSubscription({
        plan: 'free',
        status: 'active',
        videosUploaded: 0,
        storageUsed: 0,
        canWatchAdFree: false,
        canUploadHD: false,
        canUpload4K: false,
        canAccessPremium: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = async () => {
    setLoading(true);
    await fetchSubscription();
  };

  const updateVideoCount = () => {
    if (subscription) {
      setSubscription(prev => prev ? {
        ...prev,
        videosUploaded: prev.videosUploaded + 1
      } : null);
    }
  };

  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load
    
    if (!disableAutoFetch && status === 'authenticated' && session?.user) {
      fetchSubscription();
    } else {
      setLoading(false);
      // Set null subscription for unauthenticated users
      if (status === 'unauthenticated') {
        setSubscription(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id, status, disableAutoFetch]);

  // React to global usage updates (e.g., after video upload)
  useEffect(() => {
    const onRefresh = (e: Event) => {
      // Re-fetch authoritative values when subscription changes
      fetchSubscription();
    };
    window.addEventListener('subscription:refresh', onRefresh as EventListener);
    return () => window.removeEventListener('subscription:refresh', onRefresh as EventListener);
  }, [subscription]);

return (
  <SubscriptionContext.Provider value={{
    subscription,
    plan: subscription?.plan || null, // ✅ Expose plan directly
    loading,
    refreshSubscription,
    updateVideoCount
  }}>
    {children}
  </SubscriptionContext.Provider>
);
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
