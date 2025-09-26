# Google Tag Manager & Analytics Setup Guide

This guide explains how to set up Google Tag Manager (GTM) and Google Analytics 4 (GA4) integration for the XpertBid application.

## 🚀 Quick Setup

### 1. Environment Variables

Create a `.env.local` file in the `frontend` directory with the following variables:

```bash
# Google Analytics 4 Measurement ID
# Format: G-XXXXXXXXXX
# Get this from: https://analytics.google.com/analytics/web/
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Tag Manager Container ID
# Format: GTM-XXXXXXX
# Get this from: https://tagmanager.google.com/
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# API Configuration
NEXT_PUBLIC_API_URL=https://v2.xpertbid.com/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google OAuth (for authentication)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Other Configuration
NEXT_PUBLIC_ENABLE_CURRENCY_CONVERSION=true
```

### 2. Google Analytics 4 Setup

1. **Create GA4 Property**:
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new GA4 property
   - Copy the Measurement ID (format: G-XXXXXXXXXX)

2. **Configure Data Streams**:
   - Add a web data stream for your domain
   - Enable enhanced measurement for automatic events

### 3. Google Tag Manager Setup

1. **Create GTM Container**:
   - Go to [Google Tag Manager](https://tagmanager.google.com/)
   - Create a new container for your website
   - Copy the Container ID (format: GTM-XXXXXXX)

2. **Configure Tags**:
   - Add GA4 Configuration Tag
   - Set up custom event tags as needed
   - Configure triggers for your specific use cases

## 📊 Available Tracking Events

### E-commerce Events
```javascript
import { useAnalytics } from '@/hooks/useAnalytics';

const { trackPurchase, trackAddToCart, trackRemoveFromCart, trackBeginCheckout } = useAnalytics();

// Track purchase completion
trackPurchase('TXN123', 299.99, 'USD', [
  {
    item_id: 'PROD123',
    item_name: 'Luxury Property',
    category: 'Property',
    price: 299.99,
    quantity: 1
  }
]);

// Track add to cart
trackAddToCart('PROD123', 'Luxury Property', 'Property', 299.99, 1);

// Track checkout start
trackBeginCheckout(299.99, 'USD', items);
```

### User Engagement Events
```javascript
const { trackSearch, trackLogin, trackSignUp } = useAnalytics();

// Track search
trackSearch('luxury properties', 15);

// Track login
trackLogin('google'); // or 'email', 'facebook'

// Track signup
trackSignUp('email');
```

### Property & Auction Events
```javascript
const { trackPropertyView, trackAuctionView, trackBidPlaced, trackAuctionWon } = useAnalytics();

// Track property view
trackPropertyView('PROP123', 'Luxury Penthouse', 1250000, 'Property');

// Track auction view
trackAuctionView('AUCT123', 'Vintage Car Auction', 50000, 'Vehicle');

// Track bid placement
trackBidPlaced('AUCT123', 55000, 'Vintage Car Auction');

// Track auction win
trackAuctionWon('AUCT123', 55000, 'Vintage Car Auction');
```

### Form Events
```javascript
const { trackFormSubmit, trackFormStart } = useAnalytics();

// Track form start
trackFormStart('contact-form', 'contact');

// Track form submission
trackFormSubmit('contact-form', 'contact');
```

### Custom Events
```javascript
const { trackEvent } = useAnalytics();

// Track any custom event
trackEvent('custom_action', {
  category: 'user_interaction',
  action: 'button_click',
  label: 'header_cta'
});
```

## 🎯 Implementation Examples

### Property Detail Page
```javascript
'use client';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useEffect } from 'react';

export default function PropertyDetailPage({ property }) {
  const { trackPropertyView } = useAnalytics();

  useEffect(() => {
    if (property) {
      trackPropertyView(
        property.id,
        property.title,
        property.price,
        'Property'
      );
    }
  }, [property]);

  // ... rest of component
}
```

### Search Page
```javascript
'use client';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function SearchPage() {
  const { trackSearch } = useAnalytics();

  const handleSearch = (query, results) => {
    trackSearch(query, results.length);
    // ... rest of search logic
  };

  // ... rest of component
}
```

### Cart Component
```javascript
'use client';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function CartComponent() {
  const { trackAddToCart, trackRemoveFromCart, trackBeginCheckout } = useAnalytics();

  const handleAddToCart = (item) => {
    trackAddToCart(
      item.id,
      item.name,
      item.category,
      item.price,
      item.quantity
    );
    // ... rest of add to cart logic
  };

  const handleRemoveFromCart = (item) => {
    trackRemoveFromCart(
      item.id,
      item.name,
      item.category,
      item.price,
      item.quantity
    );
    // ... rest of remove from cart logic
  };

  const handleCheckout = () => {
    trackBeginCheckout(total, 'USD', cartItems);
    // ... rest of checkout logic
  };

  // ... rest of component
}
```

## 🔧 Advanced Configuration

### Consent Management
```javascript
import { grantConsent, denyConsent, initializeConsent } from '@/utils/analytics';

// Initialize consent (called automatically in useAnalytics hook)
initializeConsent();

// Grant consent for analytics
grantConsent(true, false); // analytics: true, ads: false

// Deny all consent
denyConsent();
```

### Debug Mode
```javascript
import { enableDebugMode } from '@/utils/analytics';

// Enable debug mode for development
enableDebugMode();
```

### User Properties
```javascript
import { setUserProperties } from '@/utils/analytics';

// Set user properties
setUserProperties({
  user_type: 'premium',
  subscription_status: 'active',
  preferred_currency: 'USD'
});
```

## 🚀 Production Deployment

### Vercel Deployment
1. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - `NEXT_PUBLIC_GTM_ID`

2. Update your domain in GA4 and GTM configurations

### Testing
1. Use Google Analytics DebugView
2. Use GTM Preview mode
3. Check browser developer tools for dataLayer events

## 📈 Key Metrics to Track

### E-commerce Metrics
- Purchase conversion rate
- Average order value
- Cart abandonment rate
- Product performance

### User Engagement
- Page views and session duration
- Search queries and results
- Form completion rates
- User registration and login

### Auction-Specific Metrics
- Bid placement frequency
- Auction participation rate
- Winning bid amounts
- Auction completion rates

## 🔍 Troubleshooting

### Common Issues
1. **Events not firing**: Check environment variables are set correctly
2. **GTM not loading**: Verify container ID format (GTM-XXXXXXX)
3. **GA4 not tracking**: Verify measurement ID format (G-XXXXXXXXXX)

### Debug Tools
- Google Analytics DebugView
- GTM Preview mode
- Browser developer tools
- Google Tag Assistant

## 📚 Resources

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Google Tag Manager Documentation](https://developers.google.com/tag-manager)
- [GTM/GA4 E-commerce Tracking](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [Next.js Script Component](https://nextjs.org/docs/app/building-your-application/optimizing/scripts)
