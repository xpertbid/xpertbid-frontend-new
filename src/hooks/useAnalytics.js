'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as analytics from '@/utils/analytics';

export const useAnalytics = () => {
  const router = useRouter();

  useEffect(() => {
    // Initialize consent on page load
    analytics.initializeConsent();

    // Track initial page view
    analytics.trackPageView();

    // Listen for route changes (if using Next.js router)
    const handleRouteChange = (url) => {
      analytics.trackPageView(url);
    };

    // Note: In Next.js 13+ with app router, we need to track page views differently
    // This is a basic implementation - you might want to use a more sophisticated approach
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  return {
    // E-commerce tracking
    trackPurchase: analytics.trackPurchase,
    trackAddToCart: analytics.trackAddToCart,
    trackRemoveFromCart: analytics.trackRemoveFromCart,
    trackBeginCheckout: analytics.trackBeginCheckout,
    
    // User engagement
    trackSearch: analytics.trackSearch,
    trackLogin: analytics.trackLogin,
    trackSignUp: analytics.trackSignUp,
    
    // Property and auction tracking
    trackPropertyView: analytics.trackPropertyView,
    trackAuctionView: analytics.trackAuctionView,
    trackBidPlaced: analytics.trackBidPlaced,
    trackAuctionWon: analytics.trackAuctionWon,
    
    // Form tracking
    trackFormSubmit: analytics.trackFormSubmit,
    trackFormStart: analytics.trackFormStart,
    
    // Error tracking
    trackError: analytics.trackError,
    
    // Custom events
    trackEvent: analytics.trackEvent,
    trackPageView: analytics.trackPageView,
    
    // User properties
    setUserProperties: analytics.setUserProperties,
    
    // Consent management
    grantConsent: analytics.grantConsent,
    denyConsent: analytics.denyConsent,
    
    // Debug
    enableDebugMode: analytics.enableDebugMode,
  };
};

// Hook for tracking page views on route changes
export const usePageTracking = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      analytics.trackPageView(url);
    };

    // Track page view on component mount
    analytics.trackPageView();

    // Note: For Next.js 13+ app router, you might need to implement this differently
    // Consider using a custom component or middleware for route change tracking

    return () => {
      // Cleanup
    };
  }, []);
};
