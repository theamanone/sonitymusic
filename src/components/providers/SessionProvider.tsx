// components/providers/SessionProvider.tsx - Enhanced session provider with caching
"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";
import { SessionCache } from "@/lib/session-cache";

interface SessionProviderProps {
  children: React.ReactNode;
  session?: any;
}

export default function SessionProvider({ children, session }: SessionProviderProps) {
  const [cachedSession, setCachedSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to get cached session first for faster loading
    const cached = SessionCache.get();
    if (cached) {
      setCachedSession(cached);
      setIsLoading(false);
    }

    // Cache the session when it's available
    if (session) {
      SessionCache.set(session);
      setCachedSession(session);
      setIsLoading(false);
    } else if (!cached) {
      setIsLoading(false);
    }
  }, [session]);

  // Show cached session immediately while NextAuth loads
  const displaySession = session || cachedSession;

  return (
    <NextAuthSessionProvider session={displaySession}>
      {children}
    </NextAuthSessionProvider>
  );
}
