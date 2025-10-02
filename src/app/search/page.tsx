// app/search/page.tsx - Simple approach
import SearchPage from '@/components/pages/SearchPage';
import { SITE_CONFIG } from '@/config/site.config';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Search Music - ${SITE_CONFIG.NAME}`,
  description: `Search and discover music on ${SITE_CONFIG.NAME}. Find tracks, artists, and albums by title or tags.`,
};

export default function Search() {
  return <SearchPage />;
}
