// ENTERPRISE RAZORPAY CONFIGURATION FOR SONITY MUSIC PLATFORM
// Enhanced payment configuration with analytics

import toast from 'react-hot-toast';

declare const gtag: any;

// HELPER FUNCTIONS
function generateSessionId(): string {
    return `sonity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getURLParam(param: string): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || '';
}

function getDeviceType(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipod/.test(userAgent)) return 'mobile';
    if (/tablet|ipad/.test(userAgent)) return 'tablet';
    return 'desktop';
}

function getBrowserInfo(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'chrome';
    if (userAgent.includes('Firefox')) return 'firefox';
    if (userAgent.includes('Safari')) return 'safari';
    if (userAgent.includes('Edge')) return 'edge';
    return 'unknown';
}

function detectUserLanguage(): string {
    const lang = navigator.language || navigator.languages?.[0] || 'en';
    const supportedLangs = ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn'];
    const langCode = lang.split('-')[0];
    return supportedLangs.includes(langCode) ? langCode : 'en';
}

function getCurrentContentCategory(): string {
    const path = window.location.pathname;
    if (path.includes('premium')) return 'premium';
    if (path.includes('artist')) return 'artist';
    if (path.includes('playlist')) return 'playlist';
    if (path.includes('album')) return 'album';
    return 'music';
}

function getViewingPreferences(): any {
    try {
        return JSON.parse(localStorage.getItem('cinevo_viewing_prefs') || '{}');
    } catch {
        return {};
    }
}

function calculateLTVSegment(user: any): string {
    if (!user) return 'new';
    if (user.subscriptionHistory?.length > 3) return 'high_value';
    if (user.subscriptionHistory?.length > 1) return 'returning';
    return 'first_time';
}

function calculateChurnRisk(user: any): string {
    if (!user?.lastActivity) return 'unknown';
    const daysSinceActivity = (Date.now() - new Date(user.lastActivity).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceActivity > 30) return 'high';
    if (daysSinceActivity > 7) return 'medium';
    return 'low';
}

function getPersonalizationData(): any {
    try {
        return JSON.parse(localStorage.getItem('cinevo_personalization') || '{}');
    } catch {
        return {};
    }
}

function detectPreferredPaymentMethod(): string {
    try {
        const savedMethod = localStorage.getItem('cinevo_preferred_payment');
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile = /mobile|android|ios/.test(userAgent);

        if (savedMethod) return savedMethod;
        if (isMobile) return 'upi';
        return 'card';
    } catch {
        return 'upi';
    }
}

function determineOptimalPaymentSequence(user: any): string[] {
    const baseSequence = ['block.upi', 'block.card', 'block.netbanking', 'block.wallet'];

    if (user?.tier === 'premium' || user?.tier === 'enterprise') {
        return ['block.card', 'block.upi', 'block.netbanking', 'block.wallet'];
    }

    if (user?.age && user.age < 30) {
        return ['block.upi', 'block.card', 'block.wallet', 'block.netbanking'];
    }

    return baseSequence;
}

function getOptimalModalWidth(): string {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) return '100%';
    if (screenWidth < 1024) return '500px';
    return '600px';
}

function getTrafficSource(): string {
    try {
        const referrer = document.referrer;
        const utm_source = getURLParam('utm_source');

        if (utm_source) return utm_source;

        if (referrer.includes('google')) return 'google_search';
        if (referrer.includes('facebook')) return 'facebook';
        if (referrer.includes('instagram')) return 'instagram';
        if (referrer.includes('youtube')) return 'youtube';
        return 'direct';
    } catch {
        return 'direct';
    }
}

function trackEvent(eventName: string, properties: any) {
    try {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }

        // Custom analytics
        if ((window as any).cinevoAnalytics) {
            (window as any).cinevoAnalytics.track(eventName, properties);
        }

        console.log(` CINEVO Event: ${eventName}`, properties);
    } catch (error) {
        console.warn('Analytics tracking failed:', error);
    }
}

function showAdvancedToast(title: string, message: string, type: 'success'|'error'|'warning'|'loading'|'info' = 'info') {
    const styles: Record<'success'|'error'|'warning'|'loading'|'info', string> = {
        success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        loading: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    };

    // Fallback to console if toast library not available
    if (typeof toast === 'undefined') {
        console.log(`${title}: ${message}`);
        return null;
    }

    return toast(message, {

        duration: type === 'loading' ? 0 : 5000,
        style: {
            background: styles[type] || styles.info,
            color: '#fff',
            borderRadius: '16px',
            padding: '16px 24px',
            fontWeight: '600',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }
    });
}

function showRetentionOffer(planKey: string) {

    // Simple retention logic
    console.log(` Showing retention offer for ${planKey}`);
    // You can implement modal/popup logic here
}

function suggestAlternativePaymentMethod(errorCode: string, planKey: string) {

    console.log(` Suggesting alternative payment for error: ${errorCode}, plan: ${planKey}`);
    // Implement alternative payment suggestion logic
}

function updateUserPersonalization(planKey: string, platformType: string) {

    try {
        const currentPrefs = getPersonalizationData();
        const updatedPrefs = {
            ...currentPrefs,
            subscription_plan: planKey,
            platform_type: platformType,
            upgraded_at: new Date().toISOString()
        };
        localStorage.setItem('cinevo_personalization', JSON.stringify(updatedPrefs));
    } catch (error) {
        console.warn('Failed to update personalization:', error);
    }
}

function triggerConfettiAnimation() {

    // Simple confetti trigger - you can integrate with canvas-confetti library
    console.log(' Triggering confetti animation!');
    const confetti = (window as any).confetti;
    if (confetti) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

function buildSmartRedirectUrl(planKey: string, platformType: string, verifyResult: any) {

    const baseUrl = window.location.origin;
    const onboardingFlow = verifyResult?.isFirstTime ? '&onboarding=true' : '';
    const welcomeBonus = verifyResult?.bonusContent ? `&bonus=${verifyResult.bonusContent}` : '';

    return `${baseUrl}/premium?plan=${planKey}&platform=${platformType}&success=true${onboardingFlow}${welcomeBonus}`;
}

function createSupportTicket(response: any, error: any, user: any) {

    console.log(' Creating support ticket:', { response, error, user });
    // Implement support ticket creation logic
}

// MAIN CONFIGURATION FUNCTION
const createCinevoRazorpayConfig = (
    orderData: any,
    session: any,
    planKey: string,
    currentPlan: string,
    setIsProcessing: (v: boolean) => void,
    setLoading: (v: any) => void,
    setLocalQueued: (v: any) => void
): any => {

    // CINEVO BRANDING & PLATFORM DETECTION
    const platformConfig = {
        main: { name: 'CINEVO by VELIESSA', logo: 'http://localhost:3000/assets/veliessa.png' },
        fashion: { name: 'VELIESSA Fashion Studio', logo: 'http://localhost:3000/assets/veliessa.png' },
        premium: { name: 'CINEVO Premium', logo: 'http://localhost:3000/assets/veliessa.png' },
        creator: { name: 'CINEVO Creator Studio', logo: 'http://localhost:3000/assets/veliessa.png' }
    } as const;
  
    const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
    const subdomain = currentDomain.split('.')[0] || 'main';
    const platformType = subdomain === 'fashion' ? 'fashion' : 
                        subdomain === 'premium' ? 'premium' :
                        subdomain === 'creator' ? 'creator' : 'main';
  
    const branding = platformConfig[platformType];
  
    // 💎 PLAN CONFIGURATIONS
    const planConfigs: Record<string, { emoji: string; color: string; tier: string }> = {
      basic: { emoji: '🎬', color: '#6366f1', tier: 'Starter' },
      pro: { emoji: '🎭', color: '#8b5cf6', tier: 'Professional' },
      premium: { emoji: '👑', color: '#f59e0b', tier: 'Premium' },
      enterprise: { emoji: '💎', color: '#10b981', tier: 'Enterprise' },
      creator: { emoji: '🎨', color: '#ef4444', tier: 'Creator Studio' },
      fashion: { emoji: '👗', color: '#ec4899', tier: 'Fashion Access' }
    };
  
    const currentConfig = planConfigs[planKey] || planConfigs.basic;
    const planDisplayName = `${currentConfig.emoji} CINEVO ${currentConfig.tier}`;
  
    // 🌟 ULTRA-PREMIUM RAZORPAY CONFIGURATION
    return {
      // ⚡ CORE PAYMENT CONFIG
      key: orderData?.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      order_id: orderData?.orderId,
      amount: orderData?.amount,
      currency: orderData?.currency || 'INR',
      
      // 🎨 PREMIUM BRANDING & UI CUSTOMIZATION
      name: branding.name,
      description: `${planDisplayName} • Premium Video Streaming & Fashion Content`,
      image: branding.logo,
      
      // 🎭 ADVANCED THEME CUSTOMIZATION - RAZORPAY UI ONLY
      theme: {
        color: currentConfig.color,
        backdrop_color: 'rgba(0, 0, 0, 0.85)',
        image_padding: true,
        image_frame: true,
        hide_topbar: false,
      },
      
      // 👤 INTELLIGENT PREFILL SYSTEM
      prefill: {
        name: session?.user?.name || session?.user?.firstName || '',
        email: session?.user?.email || '',
        contact: session?.user?.phone || session?.user?.mobile || '',
        method: detectPreferredPaymentMethod(),
      },
      
      // 📊 OPTIMIZED METADATA (MAX 15 NOTES)
      notes: {
        user_id: session?.user?.id || 'anonymous',
        user_tier: session?.user?.tier || 'free',
        session_id: generateSessionId(),
        platform: 'cinevo_video',
        subdomain: subdomain,
        plan_key: planKey,
        plan_tier: currentConfig.tier,
        upgrade_from: currentPlan || 'free',
        timestamp: new Date().toISOString(),
        source: getTrafficSource(),
        campaign: getURLParam('utm_campaign'),
        device_type: getDeviceType(),
        brand_ecosystem: 'veliessa',
        content_category: getCurrentContentCategory(),
        ltv_segment: calculateLTVSegment(session?.user)
      },
      
      // 🔧 ENTERPRISE-GRADE RAZORPAY UI CONFIG
      config: {
        display: {
          language: detectUserLanguage(),
          blocks: {
            // 💳 UPI - PRIORITY #1 (India-first approach)
            upi: {
              name: 'UPI - Instant Payment',
              instruments: [
                { 
                  method: 'upi', 
                  flows: ['intent', 'collect', 'qr']
                }
              ]
            },
            
            // 💎 CARDS - PREMIUM EXPERIENCE
            card: {
              name: 'Cards & EMI',
              instruments: [
                { 
                  method: 'card', 
                  networks: ['visa', 'mastercard', 'rupay', 'amex']
                },
                { 
                  method: 'emi',
                  banks: ['hdfc', 'icici', 'axis', 'sbi', 'kotak']
                }
              ]
            },
            
            // 🏦 NET BANKING
            netbanking: {
              name: 'Net Banking',
              instruments: [
                {
                  method: 'netbanking',
                  banks: ['hdfc', 'icici', 'axis', 'sbi', 'kotak', 'yes']
                }
              ]
            },
            
            // 🔥 DIGITAL WALLETS
            wallet: {
              name: 'Digital Wallets',
              instruments: [
                {
                  method: 'wallet',
                  wallets: ['paytm', 'mobikwik', 'airtel', 'freecharge']
                }
              ]
            }
          },
          
          // 🎯 SMART PAYMENT METHOD ORDERING
          sequence: determineOptimalPaymentSequence(session?.user),
          
          preferences: {
            show_default_blocks: true,
            show_saved_cards: true,
          }
        }
      },
      
      // 🎪 MODAL BEHAVIOR - PREMIUM UX
      modal: {
        backdropclose: false,
        escape: true,
        handleback: true,
        confirm_close: true,
        animation: true,
        
        ondismiss: function() {
          trackEvent('payment_modal_dismissed', {
            plan: planKey,
            amount: orderData?.amount,
            platform: platformType,
            reason: 'user_dismissed'
          });
          
          showAdvancedToast('❌ Payment Cancelled', 
            'Your subscription remains unchanged. Need help? Contact our 24/7 support!', 
            'error'
          );
          
          if (setIsProcessing) setIsProcessing(false);
          if (setLoading) setLoading(null);
          
          setTimeout(() => {
            showRetentionOffer(planKey);
          }, 5000);
        }
      },
      
      // ✅ ENTERPRISE SUCCESS HANDLER
      handler: async function(response: any) {
        const verifyingToast = showAdvancedToast(
          '🔐 Securing Your Premium Access...', 
          'Verifying payment with bank-grade security',
          'loading'
        );
  
        try {
          trackEvent('payment_initiated', {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            plan: planKey,
            amount: orderData?.amount
          });
  
          console.log('💎 CINEVO Payment Success:', response);
          
          // 🔒 ENHANCED VERIFICATION
          const verifyResponse = await fetch('/api/v1/subscription/verify', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
              'X-Platform': 'cinevo',
              'X-Subdomain': subdomain,
              'X-Brand': 'veliessa'
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              plan_key: planKey,
              platform_type: platformType,
              metadata: {
                timestamp: new Date().toISOString(),
                session_id: generateSessionId()
              }
            })
          });
  
          const verifyResult = await verifyResponse.json();
          if (verifyingToast && typeof toast !== 'undefined') {
            toast.dismiss(verifyingToast);
          }
  
          if (verifyResult.success) {
            showAdvancedToast(
              `🎬 Welcome to ${planDisplayName}!`,
              `Your premium CINEVO experience starts now. Enjoy exclusive content!`,
              'success'
            );
  
            trackEvent('subscription_activated', {
              payment_id: response.razorpay_payment_id,
              plan: planKey,
              user_id: session?.user?.id,
              platform: platformType,
              upgrade_from: currentPlan
            });
  
            updateUserPersonalization(planKey, platformType);
            triggerConfettiAnimation();
            
            if (setLocalQueued) setLocalQueued(null);
            
            setTimeout(() => {
              const redirectUrl = buildSmartRedirectUrl(planKey, platformType, verifyResult);
              window.location.replace(redirectUrl);
            }, 2000);
            
          } else {
            throw new Error(verifyResult.error || 'Payment verification failed');
          }
          
        } catch (error: any) {
          if (verifyingToast && typeof toast !== 'undefined') {
            toast.dismiss(verifyingToast);
          }
          console.error('❌ CINEVO Verification Failed:', error);
          
          trackEvent('payment_verification_failed', {
            error: error.message,
            payment_id: response.razorpay_payment_id,
            plan: planKey,
            platform: platformType
          });
          
          showAdvancedToast(
            '⚠️ Verification Issue',
            'Payment successful but verification pending. Check email for confirmation.',
            'warning'
          );
          
          createSupportTicket(response, error, session?.user);
          
        } finally {
          if (setIsProcessing) setIsProcessing(false);
          if (setLoading) setLoading(null);
        }
      },
      
      // ❌ ADVANCED ERROR HANDLER
      error: function(error: any) {

        console.error('💥 CINEVO Payment Error:', error);
        
        trackEvent('payment_failed', {
          error_code: error.code,
          error_reason: error.reason,
          plan: planKey,
          platform: platformType,
          amount: orderData?.amount
        });

        const errorMessages = {
          'PAYMENT_CANCELLED': '🚫 Payment cancelled by you',
          'PAYMENT_FAILED': '💳 Payment failed - please try another method',
          'NETWORK_ERROR': '📡 Connection issue - check your internet',
          'INVALID_CARD': '💳 Card details seem incorrect',
          'INSUFFICIENT_FUNDS': '💰 Insufficient balance in your account',
          'CARD_DECLINED': '🏦 Card declined by your bank',
          'PAYMENT_TIMEOUT': '⏰ Payment timed out - please try again',
          'SERVER_ERROR': '⚡ Server busy - please retry in a moment'
        };
  
        const code = (error?.code || '') as keyof typeof errorMessages;
        const friendlyMessage = errorMessages[code] || (error?.description as string) || 'Payment failed';
        
        showAdvancedToast(
          'Payment Issue',
          friendlyMessage + ' • Our support team is here to help 24/7',
          'error'
        );
        
        setTimeout(() => {
          suggestAlternativePaymentMethod(error.code, planKey);
        }, 3000);
        
        if (setIsProcessing) setIsProcessing(false);
        if (setLoading) setLoading(null);
      },
      
      // 🔒 ENTERPRISE SECURITY & FEATURES
      readonly: false,
      remember_customer: true,
      send_sms_hash: true,
      allow_rotation: true,
      
      // ⏰ OPTIMIZED TIMEOUTS
      timeout: 900, // 15 minutes
      retry: {
        enabled: true,
        max_count: 3
      }
    };
  };
  
  // 🚀 EXPORT THE CONFIGURATION FUNCTION
  export default createCinevoRazorpayConfig;