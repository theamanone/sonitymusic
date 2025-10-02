// components/layout/AppChrome.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothRouter from "@/components/navigation/SmoothRouter";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = pathname?.startsWith("/premium");

  if (hideChrome) {
    return (
      <SmoothRouter>
        {children}
      </SmoothRouter>
    );
  }

  return (
    <SmoothRouter>
      <Navbar />
      <main className="min-h-screen relative overflow-hidden">
        {children}
      </main>
      <Footer />
    </SmoothRouter>
  );
}
