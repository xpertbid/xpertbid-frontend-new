// Social Authentication Service
import { apiService } from './api';

class SocialAuthService {
  constructor() {
    this.googleClientId = '971421469748-k1qicbfj8298bb9notpe8cfijcvf9t40.apps.googleusercontent.com';
    this.facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '';
  }

  // Initialize Google Sign-In
  initializeGoogle() {
    if (typeof window !== 'undefined' && this.googleClientId) {
      // Check if Google SDK is already loaded
      if (window.google) {
        return Promise.resolve(true);
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      return new Promise((resolve) => {
        script.onload = () => {
          if (window.google) {
            try {
              window.google.accounts.id.initialize({
                client_id: this.googleClientId,
                callback: this.handleGoogleResponse.bind(this),
                auto_select: false,
                cancel_on_tap_outside: true
              });
              console.log('Google Sign-In initialized successfully');
              resolve(true);
            } catch (error) {
              console.error('Error initializing Google Sign-In:', error);
              resolve(false);
            }
          } else {
            console.error('Google SDK not available after script load');
            resolve(false);
          }
        };
        script.onerror = () => {
          console.error('Failed to load Google Sign-In SDK');
          resolve(false);
        };
      });
    }
    return Promise.resolve(false);
  }

  // Handle Google Sign-In Response
  async handleGoogleResponse(response) {
    try {
      const responseObj = response;
      const credential = responseObj.credential;
      const payload = this.parseJwt(credential);
      
      const userData = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name,
        provider: 'google',
        access_token: credential
      };

      return await this.authenticateWithBackend(userData);
    } catch (error) {
      console.error('Google authentication error:', error);
      throw error;
    }
  }

  // Parse JWT token
  parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }

  // Handle Facebook Login
  async handleFacebookLogin() {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && window.FB) {
        window.FB.login((response) => {
          const responseObj = response;
          if (responseObj.authResponse) {
            const authResponse = responseObj.authResponse;
            this.getFacebookUserData(authResponse.accessToken)
              .then(resolve)
              .catch(reject);
          } else {
            reject(new Error('Facebook login failed'));
          }
        }, { scope: 'email,public_profile' });
      } else {
        reject(new Error('Facebook SDK not loaded'));
      }
    });
  }

  // Get Facebook User Data
  async getFacebookUserData(accessToken) {
    try {
      return new Promise((resolve, reject) => {
        window.FB.api('/me', { fields: 'id,name,email,picture' }, async (response) => {
          const responseObj = response;
          if (responseObj && !responseObj.error) {
            const picture = responseObj.picture;
            const pictureData = picture?.data;
            const userData = {
              id: responseObj.id,
              email: responseObj.email,
              name: responseObj.name,
              picture: pictureData?.url || '',
              provider: 'facebook',
              access_token: accessToken
            };

            try {
              const result = await this.authenticateWithBackend(userData);
              resolve(result);
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error('Failed to get Facebook user data'));
          }
        });
      });
    } catch (error) {
      console.error('Facebook authentication error:', error);
      throw error;
    }
  }

  // Authenticate with backend
  async authenticateWithBackend(userData) {
    try {
      const response = await apiService.socialLogin(userData);
      return response;
    } catch (error) {
      console.error('Backend authentication error:', error);
      throw error;
    }
  }

  // Initialize Facebook SDK
  initializeFacebook() {
    if (typeof window !== 'undefined') {
      // Check if Facebook SDK is already loaded
      if (window.FB) {
        return Promise.resolve(true);
      }

      // If no Facebook App ID, skip initialization
      if (!this.facebookAppId) {
        console.warn('Facebook App ID not configured. Facebook login will be disabled.');
        return Promise.resolve(false);
      }

      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      return new Promise((resolve) => {
        script.onload = () => {
          if (window.FB) {
            window.FB.init({
              appId: this.facebookAppId,
              cookie: true,
              xfbml: true,
              version: 'v18.0'
            });
            resolve(true);
          } else {
            resolve(false);
          }
        };
        script.onerror = () => {
          console.error('Failed to load Facebook SDK');
          resolve(false);
        };
      });
    }
    return Promise.resolve(false);
  }

  // Trigger Google Sign-In
  triggerGoogleLogin() {
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt();
        console.log('Google Sign-In prompt triggered');
      } catch (error) {
        console.error('Error triggering Google Sign-In:', error);
        throw error;
      }
    } else {
      console.error('Google Sign-In not initialized');
      throw new Error('Google Sign-In not initialized');
    }
  }

  // Trigger Facebook Login
  triggerFacebookLogin() {
    return this.handleFacebookLogin();
  }
}

export const socialAuthService = new SocialAuthService();
export default socialAuthService;
