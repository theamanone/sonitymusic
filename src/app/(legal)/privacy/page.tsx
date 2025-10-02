// app/(legal)/privacy/page.tsx
import { ShieldCheckIcon, LockClosedIcon, UserGroupIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
            <LockClosedIcon className="h-4 w-4" />
            Privacy Protection
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Enterprise-grade privacy protection with zero-knowledge architecture for your music content and data
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          
          {/* Privacy Commitments */}
          <div className="bg-slate-50 p-8 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Privacy Commitments</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <ShieldCheckIcon className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Data Minimization</h3>
                  <p className="text-sm text-slate-800">We collect only essential data for service delivery</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <LockClosedIcon className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Field-Level Encryption</h3>
                  <p className="text-sm text-slate-800">256-bit AES encryption for all sensitive data fields</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <EyeSlashIcon className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Limited Admin Access</h3>
                  <p className="text-sm text-slate-800">Restricted team access with data anonymization</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information Collection</h2>
              <p className="text-slate-800 leading-relaxed mb-6">
                Sonity operates on a privacy-by-design principle, collecting minimal data necessary for music streaming services and content delivery.
              </p>
              
              <div className="space-y-6">
                <div className="border border-slate-200 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <UserGroupIcon className="h-5 w-5 text-blue-600" />
                    Account Information (Centralized Auth)
                  </h3>
                  <p className="text-slate-800 text-sm leading-relaxed mb-3">
                    Our centralized authentication system processes:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 text-sm space-y-1 ml-4">
                    <li>Email address (for account identification and security notifications)</li>
                    <li>Encrypted authentication tokens (never plain-text passwords)</li>
                    <li>Multi-factor authentication data (when enabled)</li>
                    <li>Login session metadata (IP address, device type for security)</li>
                  </ul>
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                    <strong>Security Note:</strong> All authentication data is encrypted using AES-256 and stored in SOC 2 Type II compliant infrastructure.
                  </div>
                </div>
                
                <div className="border border-slate-200 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-3">Subscription & Usage Data</h3>
                  <p className="text-slate-800 text-sm leading-relaxed mb-3">
                    We track minimal usage data for billing accuracy and service optimization:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 text-sm space-y-1 ml-4">
                    <li>AI consultation usage counts (anonymized)</li>
                    <li>Subscription plan history (for billing accuracy)</li>
                    <li>Feature interaction patterns (aggregated, not individual)</li>
                    <li>Performance metrics (response times, error rates)</li>
                  </ul>
                </div>
                
                <div className="border border-slate-200 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-3">Music Content Data</h3>
                  <p className="text-slate-800 text-sm leading-relaxed mb-3">
                    Music content and listening data are encrypted and processed securely:
                  </p>
                  <ul className="list-disc list-inside text-slate-700 text-sm space-y-1 ml-4">
                    <li>Track metadata (title, artist, album - encrypted client-side)</li>
                    <li>Listening history and preferences (anonymized for recommendations)</li>
                    <li>Content interaction data (likes, comments - processed and anonymized)</li>
                    <li>Upload and streaming metrics (for platform optimization)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 */}
           <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Security Architecture & Admin Access</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">🔐 Field-Level Encryption & Access Controls</h3>
                <p className="text-blue-900 text-sm leading-relaxed mb-4">
                  VELIESSA implements advanced security measures with carefully controlled admin access:
                </p>
                
                <div className="space-y-4">
                  <div className="bg-white border border-blue-200 rounded p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">📋 Support Team Access (Limited)</h4>
                    <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
                      <li><strong>Anonymized Data Only:</strong> Phone numbers show as 99***999, emails as user****@domain.com</li>
                      <li><strong>User ID Access:</strong> Only when necessary for technical support resolution</li>
                      <li><strong>Name Visibility:</strong> Limited to account verification scenarios with user consent</li>
                      <li><strong>No Full Access:</strong> Support staff cannot view complete personal profiles</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border border-blue-200 rounded p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">🔒 Field-Level 256-bit Encryption</h4>
                    <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
                      <li><strong>Sensitive Data:</strong> Payment info, personal details encrypted at field level</li>
                      <li><strong>Unique Keys:</strong> Each user has individual encryption keys</li>
                      <li><strong>Admin Isolation:</strong> Even system administrators cannot decrypt personal data without proper authorization</li>
                      <li><strong>Audit Trails:</strong> Every data access attempt is logged and monitored</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border border-blue-200 rounded p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">👥 Role-Based Access Control (RBAC)</h4>
                    <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
                      <li><strong>Tiered Permissions:</strong> Different access levels for support, engineering, and management</li>
                      <li><strong>Least Privilege:</strong> Teams access only data necessary for their specific roles</li>
                      <li><strong>Time-Limited Access:</strong> Administrative permissions expire automatically</li>
                      <li><strong>User Consent:</strong> Sensitive data access requires explicit user permission when possible</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-900 text-sm">
                  <strong>Important:</strong> While our team may access limited data for support purposes, 
                  all access is logged, restricted, and governed by strict data protection protocols. 
                  Users can request to restrict data access in non-critical support scenarios.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Data Usage & AI Processing</h2>
              <p className="text-slate-800 leading-relaxed mb-4">
                Your data powers our AI recommendations while maintaining strict privacy boundaries:
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold text-sm">AI</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Personalized Recommendations</h4>
                    <p className="text-sm text-slate-700">AI processes encrypted listening data to provide personalized music recommendations</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">$</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Billing Management</h4>
                    <p className="text-sm text-slate-700">Usage data enables accurate billing and subscription management</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-bold text-sm">⚡</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Service Optimization</h4>
                    <p className="text-sm text-slate-700">Anonymized performance data improves audio streaming quality and platform performance</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Your Privacy Rights</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">🔍 Data Access</h3>
                  <p className="text-sm text-slate-700">Request complete data export in machine-readable format</p>
                </div>
                <div className="border border-slate-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">✏️ Data Correction</h3>
                  <p className="text-sm text-slate-700">Update or correct any inaccurate personal information</p>
                </div>
                <div className="border border-slate-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">🗑️ Data Deletion</h3>
                  <p className="text-sm text-slate-700">Request complete account and data deletion (irreversible)</p>
                </div>
                <div className="border border-slate-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-slate-900 mb-2">🚫 Processing Opt-out</h3>
                  <p className="text-sm text-slate-700">Limit data processing while maintaining core functionality</p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Third-Party Services</h2>
              <p className="text-slate-800 leading-relaxed mb-4">
                We work with select, security-audited partners:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
                <li><strong>Payment Processing:</strong> Stripe, Razorpay (PCI DSS Level 1 certified)</li>
                <li><strong>Infrastructure:</strong> Cloud providers with SOC 2 Type II compliance</li>
                <li><strong>Analytics:</strong> Privacy-first analytics with data anonymization</li>
                <li><strong>Authentication:</strong> Our proprietary centralized auth system</li>
              </ul>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Privacy Contact & Data Requests</h2>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <p className="text-slate-900 leading-relaxed mb-4">
                  For privacy questions, data access requests, or to restrict admin access to your data:
                </p>
                <div className="space-y-3 text-sm">
                  <div className="bg-white border border-slate-300 rounded p-3">
                    <p><strong className="text-slate-900">Data Protection Officer:</strong> <span className="text-blue-700">privacy@veliessa.com</span></p>
                    <p className="text-slate-700 text-xs mt-1">Data access requests, privacy concerns, admin access restrictions</p>
                  </div>
                  <div className="bg-white border border-slate-300 rounded p-3">
                    <p><strong className="text-slate-900">Security Team:</strong> <span className="text-blue-700">security@veliessa.com</span></p>
                    <p className="text-slate-700 text-xs mt-1">Security incidents, encryption questions, access control issues</p>
                  </div>
                  <div className="bg-white border border-slate-300 rounded p-3">
                    <p><strong className="text-slate-900">Support Team:</strong> <span className="text-blue-700">support@veliessa.com</span></p>
                    <p className="text-slate-700 text-xs mt-1">General support (limited data access, can restrict sensitive data visibility)</p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded">
                  <h4 className="font-semibold text-emerald-900 mb-2">🛡️ Request Admin Access Restrictions</h4>
                  <p className="text-emerald-800 text-sm">
                    You can request to limit admin access to your personal data for non-critical support scenarios. 
                    Contact our Data Protection Officer to set up enhanced privacy controls on your account.
                  </p>
                </div>
              </div>
            </section>

            {/* Last Updated */}
            <div className="pt-6 border-t border-slate-300">
              <p className="text-sm text-slate-700">
                Last updated: September 3, 2025 | Version 2.1
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}