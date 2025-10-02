// app/(legal)/cookies/page.tsx
import { CogIcon, ChartBarIcon, ShieldCheckIcon, KeyIcon } from '@heroicons/react/24/outline';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      
     {/* Hero Section */}
     <div className="bg-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
            <CogIcon className="h-4 w-4" />
            Cookie Management
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cookie Policy
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Transparent cookie usage for secure authentication and personalized music streaming experiences
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          
          {/* Cookie Categories - FIXED COLORS */}
          <div className="bg-slate-50 p-8 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Cookie Categories</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <ShieldCheckIcon className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Essential Security</h3>
                  <p className="text-sm text-slate-800">Required for authentication and fraud prevention</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ChartBarIcon className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Performance Analytics</h3>
                  <p className="text-sm text-slate-800">Anonymized usage data for service optimization</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <KeyIcon className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">AI Personalization</h3>
                  <p className="text-sm text-slate-800">Fashion preferences for customized recommendations</p>
                </div>
              </div>
            </div>
          </div>
  <div className="p-8 space-y-8">
            {/* Section 1 - FIXED COLORS */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Cookie Overview</h2>
              <p className="text-slate-900 leading-relaxed mb-4">
                Sonity by VELIESSA uses cookies and similar technologies to provide secure, personalized music streaming. 
                Our cookies are essential for platform functionality and personalization.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">🍪 What Are Cookies?</h3>
                <p className="text-blue-900 text-sm leading-relaxed">
                  Cookies are small text files stored on your device that help websites remember your preferences and 
                  maintain secure sessions. They enable our AI to provide personalized fashion recommendations and 
                  maintain your authentication state securely.
                </p>
              </div>
            </section>

            {/* Section 2 - FIXED COLORS */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Essential Cookies (Cannot Be Disabled)</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-red-900 mb-2">⚠️ Required for Basic Functionality</h3>
                <p className="text-red-900 text-sm">
                  These cookies are essential for security and core platform features. Disabling them will prevent 
                  proper platform operation.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <ShieldCheckIcon className="h-5 w-5 text-emerald-600" />
                    Authentication & Session Management
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="bg-slate-50 p-3 rounded border-l-4 border-emerald-500">
                      <p className="text-slate-900"><strong>Cookie:</strong> <code className="bg-white px-2 py-1 rounded text-xs text-slate-800">auth_session</code></p>
                      <p className="text-slate-800"><strong>Purpose:</strong> Maintains secure login session via centralized authentication</p>
                      <p className="text-slate-800"><strong>Duration:</strong> Session (automatically expires on browser close)</p>
                      <p className="text-slate-800"><strong>Security:</strong> HTTPOnly, Secure, SameSite=Strict</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border-l-4 border-blue-500">
                      <p className="text-slate-900"><strong>Cookie:</strong> <code className="bg-white px-2 py-1 rounded text-xs text-slate-800">csrf_token</code></p>
                      <p className="text-slate-800"><strong>Purpose:</strong> Prevents cross-site request forgery attacks</p>
                      <p className="text-slate-800"><strong>Duration:</strong> 24 hours</p>
                      <p className="text-slate-800"><strong>Security:</strong> Encrypted unique random value, HTTPOnly</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border-l-4 border-purple-500">
                      <p className="text-slate-900"><strong>Cookie:</strong> <code className="bg-white px-2 py-1 rounded text-xs text-slate-800">user_prefs</code></p>
                      <p className="text-slate-800"><strong>Purpose:</strong> Stores encrypted user settings and subscription status</p>
                      <p className="text-slate-800"><strong>Duration:</strong> 30 days</p>
                      <p className="text-slate-800"><strong>Security:</strong> AES-256 encrypted, user-specific encryption key</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 - FIXED COLORS */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Performance & Analytics Cookies</h2>
              <p className="text-slate-900 leading-relaxed mb-4">
                These cookies help us understand platform usage and optimize AI performance:
              </p>
              
              <div className="border border-slate-200 rounded-lg p-6 mb-4">
                <h4 className="font-semibold text-slate-900 mb-3">📊 Anonymized Usage Analytics</h4>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <p className="text-slate-900 font-medium">AI Response Times:</p>
                    <p className="text-slate-800">Optimize recommendation speed</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <p className="text-slate-900 font-medium">Feature Usage:</p>
                    <p className="text-slate-800">Understand popular platform features</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <p className="text-slate-900 font-medium">Error Tracking:</p>
                    <p className="text-slate-800">Identify and fix technical issues</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <p className="text-slate-900 font-medium">Performance Metrics:</p>
                    <p className="text-slate-800">Monitor platform reliability</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-xs text-green-900">
                  <strong>Privacy Protection:</strong> All analytics data is anonymized and aggregated. Individual user 
                  behavior cannot be identified or tracked.
                </div>
              </div>
            </section>

            {/* Section 4 - FIXED COLORS */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. AI Personalization Cookies</h2>
              <p className="text-slate-900 leading-relaxed mb-4">
                Enable personalized fashion recommendations and improved AI accuracy:
              </p>
              
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">🎨 Fashion Intelligence Cookies</h4>
                  <div className="space-y-3">
                    <div className="bg-purple-50 border border-purple-200 p-4 rounded">
                      <h5 className="font-medium text-purple-900 mb-2">Style Learning Algorithm</h5>
                      <p className="text-sm text-purple-900 mb-2">
                        Tracks your fashion consultation history to improve AI recommendation accuracy
                      </p>
                      <div className="text-xs text-purple-800 space-y-1">
                        <p><strong>Data Stored:</strong> Encrypted style preferences, consultation outcomes</p>
                        <p><strong>Duration:</strong> 90 days (automatically refreshed with usage)</p>
                        <p><strong>Purpose:</strong> Enable personalized music discovery
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-indigo-50 border border-indigo-200 p-4 rounded">
                      <h5 className="font-medium text-indigo-900 mb-2">Seasonal Adaptation</h5>
                      <p className="text-sm text-indigo-900 mb-2">
                        Adjusts recommendations based on location, season, and fashion trends
                      </p>
                      <div className="text-xs text-indigo-800 space-y-1">
                        <p><strong>Data Stored:</strong> Location preferences, seasonal choices</p>
                        <p><strong>Duration:</strong> 1 year (updates seasonally)</p>
                        <p><strong>Purpose:</strong> Context-aware fashion recommendations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6 - FIXED COLORS */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Managing Your Cookie Preferences</h2>
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h3 className="font-semibold text-emerald-900 mb-3">Browser Controls</h3>
                  <p className="text-emerald-900 text-sm mb-4">
                    You can manage cookies through your browser settings, though this may impact platform functionality:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="bg-white p-3 rounded border border-emerald-200">
                      <span className="text-slate-900 font-medium">Chrome:</span>
                      <span className="text-slate-800"> Settings → Privacy and Security → Cookies</span>
                    </div>
                    <div className="bg-white p-3 rounded border border-emerald-200">
                      <span className="text-slate-900 font-medium">Safari:</span>
                      <span className="text-slate-800"> Preferences → Privacy → Manage Website Data</span>
                    </div>
                    <div className="bg-white p-3 rounded border border-emerald-200">
                      <span className="text-slate-900 font-medium">Firefox:</span>
                      <span className="text-slate-800"> Preferences → Privacy & Security → Cookies</span>
                    </div>
                    <div className="bg-white p-3 rounded border border-emerald-200">
                      <span className="text-slate-900 font-medium">Edge:</span>
                      <span className="text-slate-800"> Settings → Site Permissions → Cookies</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h3 className="font-semibold text-amber-900 mb-3">⚠️ Impact of Disabling Cookies</h3>
                  <ul className="text-amber-900 text-sm space-y-2 list-disc list-inside">
                    <li>You will need to log in repeatedly (no session persistence)</li>
                    <li>AI recommendations will be generic, not personalized</li>
                    <li>Subscription benefits may not display correctly</li>
                    <li>Platform performance may be degraded</li>
                    <li>Some security features may not function properly</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Legal Compliance & Updates</h2>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <p className="text-slate-800 leading-relaxed mb-4">
                  Our cookie practices comply with GDPR, CCPA, and other applicable privacy regulations. 
                  We regularly audit our cookie usage to ensure minimal data collection and maximum security.
                </p>
                <p className="text-slate-800 leading-relaxed">
                  This policy may be updated to reflect changes in our services or legal requirements. 
                  Significant changes will be communicated through your account dashboard or email notification.
                </p>
              </div>
            </section>

            {/* Legal Protection */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="font-semibold text-red-900 mb-2">⚖️ Legal Disclaimer</h3>
              <p className="text-red-800 text-sm leading-relaxed">
                By using Sonity by VELIESSA, you acknowledge and consent to our cookie usage as described in this policy. 
                This policy is designed to protect both your privacy and our legitimate business interests. 
                Cookies are essential for platform security and cannot be completely disabled while maintaining full functionality.
              </p>
            </div>

            {/* Last Updated */}
            <div className="pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                Last updated: September 3, 2025 | Version 2.1
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
