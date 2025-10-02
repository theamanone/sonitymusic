// app/(legal)/terms/page.tsx
import { CheckCircleIcon, ShieldCheckIcon, CreditCardIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
            <SparklesIcon className="h-4 w-4" />
            Legal Framework
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Professional terms governing Sonity by VELIESSA's music streaming platform
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          
          {/* Key Highlights */}
          <div className="bg-slate-50 p-8 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Service Highlights</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Transparent Billing</h3>
                  <p className="text-sm text-slate-700">Fair usage-based credits with prorated adjustments</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheckIcon className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Enterprise Security</h3>
                  <p className="text-sm text-slate-700">Centralized authentication with bank-grade encryption</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCardIcon className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Flexible Plans</h3>
                  <p className="text-sm text-slate-700">From Free to Velissa Black enterprise tiers</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Service Agreement</h2>
              <p className="text-slate-800 leading-relaxed mb-4">
                Sonity operates as a premium music streaming platform. By accessing our services, 
                you agree to these terms and acknowledge our commitment to delivering an exceptional listening experience.
              </p>
              <p className="text-slate-800 leading-relaxed">
                Our proprietary AI algorithms provide personalized styling recommendations, wardrobe optimization, 
                and fashion insights designed for professionals, businesses, and fashion enthusiasts.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Authentication & Account Security</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-blue-900 mb-3">Centralized Authentication System</h3>
                <p className="text-blue-800 mb-3">
                  We employ a centralized authentication infrastructure that provides:
                </p>
                <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
                  <li>Single sign-on across all VELIESSA services</li>
                  <li>Multi-factor authentication for enhanced security</li>
                  <li>Encrypted session management with automatic timeout</li>
                  <li>Role-based access control (RBAC) for enterprise accounts</li>
                </ul>
              </div>
              <p className="text-slate-800 leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities 
                that occur under your account.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Subscription Plans & Billing</h2>
              <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900">Available Service Tiers</h3>
                </div>
                <div className="p-6">
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between p-3 bg-slate-50 rounded">
                      <span className="font-medium text-slate-900">Free Plan</span>
                      <span className="text-slate-700">30 AI consultations/month</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded">
                      <span className="font-medium text-slate-900">Pro Plan ($9.99)</span>
                      <span className="text-slate-700">500 AI consultations/month</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded">
                      <span className="font-medium text-slate-900">Premium ($19.99)</span>
                      <span className="text-slate-700">2,000 AI consultations/month</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded">
                      <span className="font-medium text-slate-900">Velissa Black ($200)</span>
                      <span className="text-slate-700">Unlimited access + dedicated support</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-slate-800 leading-relaxed">
                Billing occurs monthly with automatic prorated adjustments for plan upgrades. Downgrades are scheduled 
                for the next billing cycle to protect your current period investment. All payments are processed securely 
                through industry-standard payment processors.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Intellectual Property & Usage Rights</h2>
              <p className="text-slate-800 leading-relaxed mb-4">
                Sonity's technology, algorithms, and music intelligence systems are proprietary and protected 
                by intellectual property laws. You may not reverse engineer, decompile, or attempt to extract our models.
              </p>
              <p className="text-slate-800 leading-relaxed">
                You retain ownership of any content you provide to our platform. We use this content solely to deliver 
                personalized fashion recommendations and improve our services.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Service Availability & Limitations</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-amber-900 mb-2">⚠️ Service Limitations</h3>
                <p className="text-amber-800 text-sm">
                  While we strive for 99.9% uptime, AI fashion recommendations are subjective. Results may vary based on 
                  individual preferences, current fashion trends, and available data. VELIESSA is not liable for fashion 
                  choices or their outcomes.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Termination & Refunds</h2>
              <p className="text-slate-800 leading-relaxed">
                Either party may terminate this agreement at any time. Upon termination, you will retain access to paid 
                services through the end of your current billing period. Refunds are processed according to our refund 
                policy and applicable consumer protection laws.
              </p>
            </section>

            {/* Legal Protection */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Limitation of Liability</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-900 text-sm leading-relaxed">
                  <strong>IMPORTANT:</strong> To the maximum extent permitted by law, VELIESSA's liability is limited to 
                  the amount paid for services in the preceding 12 months. We are not liable for indirect, incidental, 
                  or consequential damages. Some jurisdictions do not allow these limitations, so they may not apply to you.
                </p>
              </div>
            </section>

            {/* Contact & Updates */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Updates & Contact</h2>
              <p className="text-slate-800 leading-relaxed">
                We may update these terms periodically. Significant changes will be communicated via email or platform 
                notification. For questions, contact our legal team at: <strong>legal@veliessa.com</strong>
              </p>
            </section>

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
