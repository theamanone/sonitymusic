"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface Capabilities {
  canUploadVideo: boolean;
  canAccessPremium: boolean;
  canCreatePlaylist: boolean;
  canComment: boolean;
  maxVideoLength: number;
};

type CapabilitiesContextType = {
  capabilities: Capabilities | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const CapabilitiesContext = createContext<CapabilitiesContextType | undefined>(undefined);

export function CapabilitiesProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [capabilities, setCapabilities] = useState<Capabilities | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCapabilities = async () => {
    if (!session?.user) {
      // Set default capabilities for non-authenticated users
      setCapabilities({
        canUploadVideo: false,
        canAccessPremium: false,
        canCreatePlaylist: false,
        canComment: false,
        maxVideoLength: 0,
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/v1/capabilities", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCapabilities({
        canUploadVideo: data.canUploadVideo || true,
        canAccessPremium: data.canAccessPremium || false,
        canCreatePlaylist: data.canCreatePlaylist || true,
        canComment: data.canComment || true,
        maxVideoLength: data.maxVideoLength || 3600, // 1 hour default
      });
    } catch (error) {
      console.error('Failed to fetch capabilities:', error);
      // Default capabilities for authenticated users
      setCapabilities({
        canUploadVideo: true,
        canAccessPremium: false,
        canCreatePlaylist: true,
        canComment: true,
        maxVideoLength: 3600,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load
    fetchCapabilities();
  }, [session, status]);

  return (
    <CapabilitiesContext.Provider value={{ capabilities, loading, refresh: fetchCapabilities }}>
      {children}
    </CapabilitiesContext.Provider>
  );
}

export function useCapabilities() {
  const ctx = useContext(CapabilitiesContext);
  if (!ctx) throw new Error("useCapabilities must be used within a CapabilitiesProvider");
  return ctx;
}
