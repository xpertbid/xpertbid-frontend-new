'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { socialAuthService } from '../services/socialAuth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userData: any) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const { login, register, error: authError, clearError } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState({ google: false, facebook: false });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      
      onLoginSuccess({});
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      });
    } catch (error: any) {
      setError(error.message || 'An error occurred. Please try again.');
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
      socialAuthService.initializeGoogle();
      socialAuthService.initializeFacebook();
    }
  }, [isOpen]);

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setSocialLoading(prev => ({ ...prev, google: true }));
    setError('');
    
    try {
      const response = await new Promise((resolve, reject) => {
        const originalCallback = window.google?.accounts?.id?.callback;
        
        window.google.accounts.id.callback = (response: any) => {
          socialAuthService['handleGoogleResponse'](response)
            .then(resolve)
            .catch(reject);
        };
        
        window.google.accounts.id.prompt();
      });

      if (response) {
        onLoginSuccess(response);
      }
    } catch (error: any) {
      setError(error.message || 'Google login failed. Please try again.');
    } finally {
      setSocialLoading(prev => ({ ...prev, google: false }));
    }
  };

  // Handle Facebook Login
  const handleFacebookLogin = async () => {
    setSocialLoading(prev => ({ ...prev, facebook: true }));
    setError('');
    
    try {
      const response = await socialAuthService.triggerFacebookLogin();
      if (response) {
        onLoginSuccess(response);
      }
    } catch (error: any) {
      setError(error.message || 'Facebook login failed. Please try again.');
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
            <i className="fas fa-times"></i>
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
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .login-modal {
          background: white;
          border-radius: 8px;
          width: 100%;
          max-width: 450px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
          border-bottom: 1px solid #e9ecef;
        }

        .modal-title {
          font-family: 'Poppins', sans-serif;
          font-size: 24px;
          font-weight: 600;
          margin: 0;
          color: #000;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 20px;
          color: #606060;
          cursor: pointer;
          padding: 5px;
        }

        .modal-close:hover {
          color: #000;
        }

        .modal-body {
          padding: 30px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #000;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-control {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #606060;
          border-radius: 2px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.3s ease;
        }

        .form-control:focus {
          outline: none;
          border-color: #43ACE9;
          box-shadow: 0 0 0 3px rgba(67, 172, 233, 0.1);
        }

        .password-input {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #606060;
          cursor: pointer;
          padding: 5px;
        }

        .password-toggle:hover {
          color: #000;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #606060;
          cursor: pointer;
        }

        .checkbox-label input {
          margin-right: 8px;
        }

        .forgot-password {
          color: #43ACE9;
          text-decoration: none;
          font-size: 14px;
        }

        .forgot-password:hover {
          text-decoration: underline;
        }

        .btn-block {
          width: 100%;
          padding: 14px;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: 2px;
          margin-bottom: 20px;
        }

        .btn-primary {
          background-color: #43ACE9;
          border-color: #43ACE9;
          color: white;
        }

        .btn-primary:hover {
          background-color: #2B8BC7;
          border-color: #2B8BC7;
        }

        .divider {
          text-align: center;
          margin: 20px 0;
          position: relative;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background-color: #e9ecef;
        }

        .divider span {
          background: white;
          padding: 0 15px;
          color: #606060;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .social-login {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .btn-facebook, .btn-google {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 2px;
          font-family: 'Poppins', sans-serif;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-facebook {
          background-color: #1877f2;
          color: white;
        }

        .btn-google {
          background-color: #db4437;
          color: white;
        }

        .btn-facebook:hover, .btn-google:hover {
          opacity: 0.9;
        }

        .modal-footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
        }

        .modal-footer p {
          margin: 0;
          color: #606060;
          font-size: 14px;
        }

        .btn-link {
          background: none;
          border: none;
          color: #43ACE9;
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
          margin-left: 5px;
        }

        .btn-link:hover {
          text-decoration: underline;
        }

        .alert {
          padding: 12px;
          margin-bottom: 20px;
          border-radius: 2px;
          font-size: 14px;
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
