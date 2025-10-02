import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard - Sonity',
  description: 'Manage your content and analytics',
};

export default async function DashboardPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/auth/signin');
  }

  // Mock data for now - in real app, fetch from database
  const dashboardData = {
    stats: {
      totalVideos: 12,
      totalViews: 45230,
      totalLikes: 1250,
      totalSubscribers: 890
    },
    recentVideos: [
      {
        _id: '1',
        title: 'My Latest Upload',
        views: 1200,
        likes: 45,
        status: 'published',
        createdAt: new Date().toISOString(),
        thumbnailUrl: '/placeholder-thumbnail.jpg'
      }
    ],
    analytics: {
      viewsThisMonth: 12500,
      viewsLastMonth: 8900,
      topVideo: 'Advanced React Patterns',
      engagement: 8.5
    }
  };

  return <DashboardClient data={dashboardData} user={session.user} />;
}
