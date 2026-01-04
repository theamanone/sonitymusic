"use client";

import { ReactNode, useEffect, useMemo } from "react";
import { usePathname } from 'next/navigation';
import { useDocumentEvents, defaultDocumentConfig } from '@/config/documentEvents';
import { ThemeProvider } from "@/components/providers/ThemeProvider";

interface ClientProviderProps {
  children: ReactNode;
}

export default function ClientProvider({ children }: ClientProviderProps) {
  const pathname = usePathname();

  // Simplified document events config - no restrictions
  const docEventsConfig = useMemo(() => ({
    ...defaultDocumentConfig,
  }), []);

  useDocumentEvents(docEventsConfig);

  return (
    <ThemeProvider
      defaultTheme="light"
      defaultVariant="default"
      enableSystem={true}
      storageKey="sonity-theme-config"
    >
      {children}
    </ThemeProvider>
  );
}
