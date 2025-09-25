'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { socialAuthService } from '../services/socialAuth';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const { login, register, clearError, error: authError } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
 const [socialLoading, setSocialLoading] = useState({ google: false, facebook: false });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    clearError();

    try {
      if (isLoginMode) {
        await login(formData.email, formData.password);
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation
        });
      }
      
      onLoginSuccess();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    clearError();
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    });
  };

  // Show auth errors
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  // Initialize social auth when modal opens
  useEffect(() => {
    if (isOpen) {
      const initializeSocialAuth = async () => {
        try {
          await socialAuthService.initializeGoogle();
          await socialAuthService.initializeFacebook();
        } catch (error) {
          console.error('Error initializing social auth:', error);
        }
      };
      initializeSocialAuth();
    }
  }, [isOpen]);

  // Handle Google Login (JS/JSX)
const handleGoogleLogin = async () => {
  setSocialLoading(prev => ({ ...prev, google: true }));
  setError('');

  try {
    const ga = window?.google?.accounts?.id;
    if (!ga) {
      throw new Error('Google Sign-In is not available. Please try again.');
    }

    const response = await new Promise((resolve, reject) => {
      // 30s timeout so we don’t hang forever
      const timeout = setTimeout(() => {
        reject(new Error('Google Sign-In timed out. Please try again.'));
      }, 30000);

      // Define the callback Google will invoke
      ga.callback = (credResponse) => {
        clearTimeout(timeout);
        socialAuthService
          .handleGoogleResponse(credResponse)
          .then(resolve)
          .catch(reject);
      };

      try {
        // Recommended way is via initialize, but prompt works if already initialized
        // ga.initialize({ client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID, callback: ga.callback });
        ga.prompt();
      } catch (_err) {
        clearTimeout(timeout);
        reject(new Error('Failed to start Google Sign-In. Please try again.'));
      }
    });

    if (response) {
      onLoginSuccess();
    }
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.message
        : 'Google login failed. Please try again.';
    setError(msg);
  } finally {
    setSocialLoading(prev => ({ ...prev, google: false }));
  }
};


  // Handle Facebook Login
  const handleFacebookLogin = async () => {
    setSocialLoading(prev => ({ ...prev, facebook: true }));
    setError('');
    
    try {
      if (!window.FB) {
        throw new Error('Facebook login is not available. Please configure Facebook App ID.');
      }

      const response = await socialAuthService.triggerFacebookLogin();
      if (response) {
        onLoginSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Facebook login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setSocialLoading(prev => ({ ...prev, facebook: false }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{isLoginMode ? 'Sign in' : 'Create Account'}</h3>
          <button className="modal-close" onClick={onClose}>
            <i className="f-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {!isLoginMode && (
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLoginMode}
                  className="form-control"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="form-control"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {!isLoginMode && (
              <div className="form-group">
                <label htmlFor="password_confirmation">Confirm Password *</label>
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                  required={!isLoginMode}
                  className="form-control"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {isLoginMode && (
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <a href="#" className="forgot-password">Lost your password?</a>
              </div>
            )}

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  {isLoginMode ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                isLoginMode ? 'LOG IN' : 'CREATE ACCOUNT'
              )}
            </button>
          </form>

          {isLoginMode && (
            <>
              <div className="divider">
                <span>OR LOGIN WITH</span>
              </div>

              <div className="social-login">
                <button 
                  className="btn btn-facebook"
                  onClick={handleFacebookLogin}
                  disabled={socialLoading.facebook}
                >
                  {socialLoading.facebook ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Loading...
                    </>
                  ) : (
                    <>
                      <i className="fab fa-facebook-f me-2"></i>
                      FACEBOOK
                    </>
                  )}
                </button>
                <button 
                  className="btn btn-google"
                  onClick={handleGoogleLogin}
                  disabled={socialLoading.google}
                >
                  {socialLoading.google ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Loading...
                    </>
                  ) : (
                    <>
                      <i className="fab fa-google me-2"></i>
                      GOOGLE
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          <div className="modal-footer">
            <p>
              {isLoginMode ? 'No account yet?' : 'Already have an account?'}
              <button type="button" className="btn-link" onClick={toggleMode}>
                {isLoginMode ? 'CREATE AN ACCOUNT' : 'SIGN IN'}
              </button>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position;
          top;
          left;
          right;
          bottom;
          background-color: rgba(0, 0, 0, 0.5);
          display;
          align-items;
          justify-content;
          z-index;
          padding;
        }

        .login-modal {
          background;
          border-radius;
          width: 100%;
          max-width;
          max-height;
          overflow-y;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display;
          justify-content: space-between;
          align-items;
          padding;
          border-bottom: 1px solid #e9ecef;
        }

        .modal-title {
          font-family: 'Poppins', sans-serif;
          font-size;
          font-weight;
          margin;
          color: #000;
          text-transform;
          letter-spacing: 0.5px;
        }

        .modal-close {
          background;
          border;
          font-size;
          color: #606060;
          cursor;
          padding;
        }

        .modal-close:hover {
          color: #000;
        }

        .modal-body {
          padding;
        }

        .form-group {
          margin-bottom;
        }

        .form-group label {
          display;
          margin-bottom;
          font-family: 'Poppins', sans-serif;
          font-size;
          font-weight;
          color: #000;
          text-transform;
          letter-spacing: 0.5px;
        }

        .form-control {
          width: 100%;
          padding;
          border: 1px solid #606060;
          border-radius;
          font-size;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.3s ease;
        }

        .form-control:focus {
          outline;
          border-color: #43ACE9;
          box-shadow: 0 0 0 3px rgba(67, 172, 233, 0.1);
        }

        .password-input {
          position;
        }

        .password-toggle {
          position;
          right;
          top: 50%;
          transform: translateY(-50%);
          background;
          border;
          color: #606060;
          cursor;
          padding;
        }

        .password-toggle:hover {
          color: #000;
        }

        .form-options {
          display;
          justify-content: space-between;
          align-items;
          margin-bottom;
        }

        .checkbox-label {
          display;
          align-items;
          font-size;
          color: #606060;
          cursor;
        }

        .checkbox-label input {
          margin-right;
        }

        .forgot-password {
          color: #43ACE9;
          text-decoration;
          font-size;
        }

        .forgot-password:hover {
          text-decoration;
        }

        .btn-block {
          width: 100%;
          padding;
          font-family: 'Poppins', sans-serif;
          font-size;
          font-weight;
          text-transform;
          letter-spacing: 0.5px;
          border-radius;
          margin-bottom;
        }

        .btn-primary {
          background-color: #43ACE9;
          border-color: #43ACE9;
          color;
        }

        .btn-primary:hover {
          background-color: #2B8BC7;
          border-color: #2B8BC7;
        }

        .divider {
          text-align;
          margin;
          position;
        }

        .divider::before {
          content: '';
          position;
          top: 50%;
          left;
          right;
          height;
          background-color: #e9ecef;
        }

        .divider span {
          background;
          padding;
          color: #606060;
          font-size;
          text-transform;
          letter-spacing: 0.5px;
        }

        .social-login {
          display;
          gap;
          margin-bottom;
        }

        .btn-facebook, .btn-google {
          flex;
          padding;
          border;
          border-radius;
          font-family: 'Poppins', sans-serif;
          font-size;
          font-weight;
          text-transform;
          letter-spacing: 0.5px;
          cursor;
          transition: all 0.3s ease;
        }

        .btn-facebook {
          background-color: #1877f2;
          color;
        }

        .btn-google {
          background-color: #db4437;
          color;
        }

        .btn-facebook, .btn-google:hover {
          opacity: 0.9;
        }

        .modal-footer {
          text-align;
          padding-top;
          border-top: 1px solid #e9ecef;
        }

        .modal-footer p {
          margin;
          color: #606060;
          font-size;
        }

        .btn-link {
          background;
          border;
          color: #43ACE9;
          text-decoration;
          font-weight;
          cursor;
          margin-left;
        }

        .btn-link:hover {
          text-decoration;
        }

        .alert {
          padding;
          margin-bottom;
          border-radius;
          font-size;
        }

        .alert-danger {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
        }
      `}</style>
    </div>
  );
};

export default LoginModal;

