'use client';

// Google Analytics and GTM Event Tracking Utilities

// Check if gtag is available
const isGtagAvailable = () => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// Check if dataLayer is available
const isDataLayerAvailable = () => {
  return typeof window !== 'undefined' && Array.isArray(window.dataLayer);
};

// Push event to dataLayer for GTM
const pushToDataLayer = (eventData) => {
  if (isDataLayerAvailable()) {
    window.dataLayer.push(eventData);
  } else {
    console.warn('dataLayer is not available');
  }
};

// Track page views
export const trackPageView = (url, title) => {
  const pageData = {
    event: 'page_view',
    page_title: title || document.title,
    page_location: url || window.location.href,
    page_path: url ? new URL(url).pathname : window.location.pathname,
  };

  if (isGtagAvailable()) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, pageData);
  }

  pushToDataLayer(pageData);
};

// Track custom events
export const trackEvent = (eventName, parameters = {}) => {
  const eventData = {
    event: eventName,
    ...parameters,
  };

  if (isGtagAvailable()) {
    window.gtag('event', eventName, parameters);
  }

  pushToDataLayer(eventData);
};

// E-commerce tracking functions
export const trackPurchase = (transactionId, value, currency = 'USD', items = []) => {
  const purchaseData = {
    transaction_id: transactionId,
    value: value,
    currency: currency,
    items: items,
  };

  trackEvent('purchase', purchaseData);
};

export const trackAddToCart = (itemId, itemName, category, price, quantity = 1) => {
  trackEvent('add_to_cart', {
    currency: 'USD',
    value: price,
    items: [
      {
        item_id: itemId,
        item_name: itemName,
        item_category: category,
        price: price,
        quantity: quantity,
      },
    ],
  });
};

export const trackRemoveFromCart = (itemId, itemName, category, price, quantity = 1) => {
  trackEvent('remove_from_cart', {
    currency: 'USD',
    value: price,
    items: [
      {
        item_id: itemId,
        item_name: itemName,
        item_category: category,
        price: price,
        quantity: quantity,
      },
    ],
  });
};

export const trackBeginCheckout = (value, currency = 'USD', items = []) => {
  trackEvent('begin_checkout', {
    currency: currency,
    value: value,
    items: items,
  });
};

// User engagement tracking
export const trackSearch = (searchTerm, resultsCount = 0) => {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

export const trackLogin = (method = 'email') => {
  trackEvent('login', {
    method: method,
  });
};

export const trackSignUp = (method = 'email') => {
  trackEvent('sign_up', {
    method: method,
  });
};

// Property and auction specific tracking
export const trackPropertyView = (propertyId, propertyTitle, price, category = 'Property') => {
  trackEvent('view_item', {
    item_id: propertyId,
    item_name: propertyTitle,
    item_category: category,
    price: price,
    currency: 'USD',
  });
};

export const trackAuctionView = (auctionId, auctionTitle, currentBid, category = 'Auction') => {
  trackEvent('view_item', {
    item_id: auctionId,
    item_name: auctionTitle,
    item_category: category,
    price: currentBid,
    currency: 'USD',
  });
};

export const trackBidPlaced = (auctionId, bidAmount, auctionTitle) => {
  trackEvent('bid_placed', {
    item_id: auctionId,
    item_name: auctionTitle,
    bid_amount: bidAmount,
    currency: 'USD',
  });
};

export const trackAuctionWon = (auctionId, finalBid, auctionTitle) => {
  trackEvent('auction_won', {
    item_id: auctionId,
    item_name: auctionTitle,
    final_bid: finalBid,
    currency: 'USD',
  });
};

// Form interaction tracking
export const trackFormSubmit = (formName, formType = 'contact') => {
  trackEvent('form_submit', {
    form_name: formName,
    form_type: formType,
  });
};

export const trackFormStart = (formName, formType = 'contact') => {
  trackEvent('form_start', {
    form_name: formName,
    form_type: formType,
  });
};

// Error tracking
export const trackError = (errorType, errorMessage, errorLocation = '') => {
  trackEvent('error', {
    error_type: errorType,
    error_message: errorMessage,
    error_location: errorLocation,
  });
};

// User properties
export const setUserProperties = (properties) => {
  if (isGtagAvailable()) {
    window.gtag('set', { user_properties: properties });
  }
};

// Custom dimensions (if configured in GA4)
export const setCustomDimensions = (dimensions) => {
  if (isGtagAvailable()) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      custom_map: dimensions,
    });
  }
};

// Debug mode
export const enableDebugMode = () => {
  if (isGtagAvailable()) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      debug_mode: true,
    });
  }
};

// Consent management
export const grantConsent = (analytics_storage = true, ad_storage = false) => {
  if (isGtagAvailable()) {
    window.gtag('consent', 'update', {
      analytics_storage: analytics_storage ? 'granted' : 'denied',
      ad_storage: ad_storage ? 'granted' : 'denied',
    });
  }
};

export const denyConsent = () => {
  if (isGtagAvailable()) {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
    });
  }
};

// Initialize consent (should be called on page load)
export const initializeConsent = () => {
  if (isGtagAvailable()) {
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      wait_for_update: 500,
    });
  }
};
