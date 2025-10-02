// app/ClientHome.tsx
"use client";

import HomePage from "@/components/pages/HomePage";
import {
  SubscriptionProvider,
  type SubscriptionData,
} from "@/contexts/SubscriptionContext";
import { TrackWithArtist } from "@/types/track.types";

interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

interface ClientHomeProps {
  initialSubscription: SubscriptionData;
  trendingTracks: TrackWithArtist[];
  recentTracks: TrackWithArtist[];
  user: User | null;
}

export default function ClientHome({
  initialSubscription,
  trendingTracks,
  recentTracks,
  user,
}: ClientHomeProps) {
  return (
    <SubscriptionProvider initial={initialSubscription}>
      <HomePage
        trendingTracks={trendingTracks}
        recentTracks={recentTracks}
        user={user}
      />
    </SubscriptionProvider>
  );
}
