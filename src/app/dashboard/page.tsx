import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard - Sonity',
  description: 'Manage your music and analytics',
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Music Dashboard</h1>
        <p className="text-gray-400 mb-8">Coming soon - Track your music streaming analytics and manage your playlists.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
            <div className="text-2xl font-bold text-white mb-1">🎵</div>
            <div className="text-white font-medium">Songs Played</div>
            <div className="text-gray-400 text-sm">Track your listening</div>
          </div>
          <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
            <div className="text-2xl font-bold text-white mb-1">📊</div>
            <div className="text-white font-medium">Analytics</div>
            <div className="text-gray-400 text-sm">View your stats</div>
          </div>
          <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
            <div className="text-2xl font-bold text-white mb-1">🎧</div>
            <div className="text-white font-medium">Playlists</div>
            <div className="text-gray-400 text-sm">Manage collections</div>
          </div>
        </div>
      </div>
    </div>
  );
}
