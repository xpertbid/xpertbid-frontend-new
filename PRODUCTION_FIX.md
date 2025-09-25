# Production Deployment Fix for Currency System

## Issue
Currency system works locally but not on production (https://xpertbid-frontend-v2.vercel.app/shop)

## Root Cause
The production environment is missing proper environment variables and API configuration.

## Solution

### 1. Set Environment Variables in Vercel

Go to your Vercel dashboard and set these environment variables:

```env
NEXT_PUBLIC_API_URL=https://v2.xpertbid.com/api
NEXT_PUBLIC_SITE_URL=https://xpertbid-frontend-v2.vercel.app
NEXT_PUBLIC_APP_NAME=XpertBid
NEXT_PUBLIC_ENABLE_CURRENCY_CONVERSION=true
NEXT_PUBLIC_ENABLE_LANGUAGE_SWITCHING=true
```

### 2. Verify API Endpoints

Test these endpoints are accessible from production:
- https://v2.xpertbid.com/api/currencies
- https://v2.xpertbid.com/api/convert-price?amount=100&from_currency=USD&to_currency=EUR

### 3. Check CORS Configuration

Ensure the backend allows CORS from your production domain:
- Add `https://xpertbid-frontend-v2.vercel.app` to allowed origins
- Allow `GET`, `POST`, `OPTIONS` methods
- Allow `Content-Type`, `Authorization` headers

### 4. Debug Steps

1. Open browser dev tools on production site
2. Check console for currency-related errors
3. Look for network requests to `/api/currencies`
4. Check if fallback currencies are being used

### 5. Files Updated

- `frontend/vercel.json` - Production configuration
- `frontend/src/services/api.js` - Better error handling
- `frontend/src/contexts/CurrencyLanguageContext.jsx` - Debug logging

## Expected Behavior After Fix

1. Currency dropdown should show available currencies
2. Prices should convert when currency changes
3. Currency selection should persist across page reloads
4. No console errors related to currency API

## Testing

After deployment, test:
1. Currency dropdown functionality
2. Price conversion on product pages
3. Currency persistence
4. Error handling when API is unavailable
