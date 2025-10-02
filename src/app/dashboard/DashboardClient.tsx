"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Play, 
  Eye, 
  Heart, 
  TrendingUp, 
  Users, 
  Video, 
  BarChart3,
  Plus,
  Upload,
} from 'lucide-react';
import { formatNumber, formatTimeAgo } from '@/lib/utils';

interface DashboardData {
  stats: {
    totalVideos: number;
    totalViews: number;
    totalLikes: number;
    totalSubscribers: number;
  };
  recentVideos: Array<{
    _id: string;
    title: string;
    views: number;
    likes: number;
    status: string;
    createdAt: string;
    thumbnailUrl: string;
  }>;
  analytics: {
    viewsThisMonth: number;
    viewsLastMonth: number;
    topVideo: string;
    engagement: number;
  };
}

interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

interface DashboardClientProps {
  data: DashboardData;
  user: User;
}

export default function DashboardClient({ data, user }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'videos' | 'analytics'>('overview');

  const growthPercentage = ((data.analytics.viewsThisMonth - data.analytics.viewsLastMonth) / data.analytics.viewsLastMonth * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Creator Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/upload"
              className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 sm:px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-2xl hover:shadow-red-500/30 transform hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Upload Video</span>
              <span className="sm:hidden">Upload</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 mb-8 bg-white/[0.05] p-1 rounded-2xl backdrop-blur-xl border border-white/[0.08]">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'videos', label: 'Videos', icon: Video },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center justify-center sm:justify-start space-x-2 px-4 sm:px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'bg-white text-black shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Video className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">Total</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{formatNumber(data.stats.totalVideos)}</h3>
                <p className="text-gray-400 text-sm">Videos Uploaded</p>
              </div>

              <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <Eye className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded-full">+{growthPercentage}%</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{formatNumber(data.stats.totalViews)}</h3>
                <p className="text-gray-400 text-sm">Total Views</p>
              </div>

              <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-500/20 rounded-xl">
                    <Heart className="w-6 h-6 text-red-400" />
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">Total</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{formatNumber(data.stats.totalLikes)}</h3>
                <p className="text-gray-400 text-sm">Total Likes</p>
              </div>

              <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">Followers</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{formatNumber(data.stats.totalSubscribers)}</h3>
                <p className="text-gray-400 text-sm">Subscribers</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Videos */}
              <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Recent Videos</h3>
                  <Link href="/dashboard?tab=videos" className="text-red-400 hover:text-red-300 text-sm font-medium">
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {data.recentVideos.map((video) => (
                    <div key={video._id} className="flex items-center space-x-4 p-4 bg-white/[0.03] rounded-xl hover:bg-white/[0.05] transition-colors">
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-800">
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{video.title}</h4>
                        <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {formatNumber(video.views)}
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            {formatNumber(video.likes)}
                          </span>
                          <span>{formatTimeAgo(video.createdAt)}</span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        video.status === 'published' 
                          ? 'bg-green-900/30 text-green-400' 
                          : 'bg-yellow-900/30 text-yellow-400'
                      }`}>
                        {video.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analytics Summary */}
              <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Analytics Summary</h3>
                  <Link href="/dashboard?tab=analytics" className="text-red-400 hover:text-red-300 text-sm font-medium">
                    View Details
                  </Link>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Views This Month</span>
                      <span className="text-white font-semibold">{formatNumber(data.analytics.viewsThisMonth)}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Top Performing Video</span>
                    </div>
                    <p className="text-white font-medium">{data.analytics.topVideo}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Engagement Rate</span>
                      <span className="text-white font-semibold">{data.analytics.engagement}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full" style={{ width: `${data.analytics.engagement * 10}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8">
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Video Management</h3>
              <p className="text-gray-400 mb-6">Manage all your uploaded videos, edit details, and track performance.</p>
              <Link
                href="/upload"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Your First Video</span>
              </Link>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8">
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Advanced Analytics</h3>
              <p className="text-gray-400 mb-6">Deep insights into your content performance, audience demographics, and growth trends.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">+{growthPercentage}%</div>
                  <div className="text-sm text-gray-400">Growth Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{data.analytics.engagement}%</div>
                  <div className="text-sm text-gray-400">Engagement</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{formatNumber(data.analytics.viewsThisMonth)}</div>
                  <div className="text-sm text-gray-400">Monthly Views</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
