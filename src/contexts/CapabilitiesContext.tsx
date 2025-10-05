import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface Capabilities {
  canAccessPremium: boolean;
  canComment: boolean;
  canCreatePlaylist: boolean;
  canListenWithFriends: boolean;
  maxPlaylists: number;
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
        canAccessPremium: false,
        canComment: false,
        canCreatePlaylist: false,
        canListenWithFriends: false,
        maxPlaylists: 10,
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/v1/capabilities", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCapabilities({
        canAccessPremium: data.canAccessPremium || false,
        canCreatePlaylist: data.canCreatePlaylist || true,
        canComment: data.canComment || true,
        canListenWithFriends: data.canListenWithFriends || false,
        maxPlaylists: data.maxPlaylists || 10,
      });
    } catch (error) {
      console.error('Failed to fetch capabilities:', error);
      // Default capabilities for authenticated users
      setCapabilities({
        canAccessPremium: false,
        canCreatePlaylist: true,
        canComment: true,
        canListenWithFriends: false,
        maxPlaylists: 10,
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
