// Social Authentication Service
import { apiService } from './api';

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

interface FacebookUser {
  id: string;
  email: string;
  name: string;
  picture: {
    data: {
      url: string;
    };
  };
}

class SocialAuthService {
  private googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  private facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '';

  // Initialize Google Sign-In
  initializeGoogle() {
    if (typeof window !== 'undefined' && this.googleClientId) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      return new Promise((resolve) => {
        script.onload = () => {
          if (window.google) {
            window.google.accounts.id.initialize({
              client_id: this.googleClientId,
              callback: this.handleGoogleResponse.bind(this),
            });
            resolve(true);
          }
        };
      });
    }
  }

  // Handle Google Sign-In Response
  private async handleGoogleResponse(response: any) {
    try {
      const credential = response.credential;
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
  private parseJwt(token: string) {
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
        window.FB.login((response: any) => {
          if (response.authResponse) {
            this.getFacebookUserData(response.authResponse.accessToken)
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
  private async getFacebookUserData(accessToken: string) {
    try {
      return new Promise((resolve, reject) => {
        window.FB.api('/me', { fields: 'id,name,email,picture' }, async (response: any) => {
          if (response && !response.error) {
            const userData = {
              id: response.id,
              email: response.email,
              name: response.name,
              picture: response.picture?.data?.url || '',
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
  private async authenticateWithBackend(userData: any) {
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
    if (typeof window !== 'undefined' && this.facebookAppId) {
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
          }
        };
      });
    }
  }

  // Trigger Google Sign-In
  triggerGoogleLogin() {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  }

  // Trigger Facebook Login
  triggerFacebookLogin() {
    return this.handleFacebookLogin();
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google: any;
    FB: any;
  }
}

export const socialAuthService = new SocialAuthService();
export default socialAuthService;
