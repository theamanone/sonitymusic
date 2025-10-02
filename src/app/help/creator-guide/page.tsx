import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creator Guide - Sonity",
  description: "Get the most out of Sonity: discovery tips, playlists, following artists, and listening features."
};

export default function CreatorGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Creator Guide</h1>
          <p className="text-gray-400">Everything you need to know about using Sonity</p>
        </div>

        <div className="space-y-8">
          {/* Getting Started */}
          <section className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
            <div className="space-y-4 text-gray-300">
              <p>Welcome to Sonity! Here's how to get started:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Create your account and complete your profile</li>
                <li>Create your first playlist and follow your favorite artists</li>
                <li>Explore discovery sections and save tracks you love</li>
                <li>Engage with your audience through comments and community features</li>
              </ul>
            </div>
          </section>

          {/* Video Upload Best Practices */}
          <section className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Listening & Playlist Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Technical Requirements</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                  <li>Resolution: 1080p or higher recommended</li>
                  <li>Format: MP4, MOV, AVI supported</li>
                  <li>Max file size: 10GB</li>
                  <li>Frame rate: 24, 30, or 60 fps</li>
                  <li>Audio: 48kHz, stereo or mono</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Content Guidelines</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                  <li>Create engaging thumbnails</li>
                  <li>Write descriptive titles (60 chars max)</li>
                  <li>Add relevant tags for discoverability</li>
                  <li>Include closed captions when possible</li>
                  <li>Maintain consistent branding</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Monetization */}
          <section className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Monetization Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-red-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-semibold mb-2">Ad Revenue</h3>
                <p className="text-sm text-gray-400">Earn from ads shown on your videos</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎓</span>
                </div>
                <h3 className="font-semibold mb-2">Course Sales</h3>
                <p className="text-sm text-gray-400">Sell educational courses to your audience</p>
              </div>
              <div className="text-center">
                <div className="bg-green-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎬</span>
                </div>
                <h3 className="font-semibold mb-2">Premium Content</h3>
                <p className="text-sm text-gray-400">Offer exclusive content to subscribers</p>
              </div>
            </div>
          </section>

          {/* Analytics */}
          <section className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Understanding Analytics</h2>
            <div className="text-gray-300 space-y-4">
              <p>Track your performance with detailed analytics:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-400">Views</div>
                  <div className="text-sm text-gray-400">Total video views</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">Watch Time</div>
                  <div className="text-sm text-gray-400">Minutes watched</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">Engagement</div>
                  <div className="text-sm text-gray-400">Likes & comments</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-400">Revenue</div>
                  <div className="text-sm text-gray-400">Earnings</div>
                </div>
              </div>
            </div>
          </section>

          {/* Support */}
          <section className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <div className="text-gray-300">
              <p className="mb-4">Our creator support team is here to help you succeed:</p>
              <div className="flex flex-wrap gap-4">
                <a href="/support" className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors">
                  Contact Support
                </a>
                <a href="/community" className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors">
                  Join Community
                </a>
                <a href="/docs" className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors">
                  Documentation
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
