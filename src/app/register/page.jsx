'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



export default function RegisterPage() {
  const { register, isAuthenticated, error: authError, clearError } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    terms_accepted: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
      clearError();
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.terms_accepted) {
      setError('You must accept the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        phone: formData.phone
      });
      
      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="register-page">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="register-card">
                <div className="card-header text-center">
                  <h2 className="mb-1">Create Account</h2>
                  <p className="text-muted mb-0">Join XpertBid and start your journey</p>
                </div>
                <div className="card-body">
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <i className="f-exclamation-circle me-2"></i>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="name" className="form-label">Full Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="email" className="form-label">Email Address *</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="password" className="form-label">Password *</label>
                        <div className="input-group">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            placeholder="Create a password"
                            minLength={6}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i className={`f-eye${showPassword ? '-slash' : ''}`}></i>
                          </button>
                        </div>
                        <small className="form-text text-muted">
                          Password must be at least 6 characters long
                        </small>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="password_confirmation" className="form-label">Confirm Password *</label>
                        <div className="input-group">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="form-control"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleInputChange}
                            required
                            placeholder="Confirm your password"
                            minLength={6}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            <i className={`f-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number (optional)"
                      />
                    </div>

                    <div className="mb-4">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="terms_accepted"
                          name="terms_accepted"
                          checked={formData.terms_accepted}
                          onChange={handleInputChange}
                          required
                        />
                        <label className="form-check-label" htmlFor="terms_accepted">
                          I agree to the{' '}
                          <Link href="/terms" className="text-primary">
                            Terms and Conditions
                          </Link>{' '}
                          and{' '}
                          <Link href="/privacy" className="text-primary">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary w-100 mb-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="f-user-plus me-2"></i>
                          Create Account
                        </>
                      )}
                    </button>
                  </form>

                  <div className="text-center">
                    <p className="mb-0">
                      Already have an account?{' '}
                      <Link href="/login" className="text-primary fw-bold">
                        Sign In
                      </Link>
                    </p>
                  </div>

                  <div className="divider my-4">
                    <span>Or continue with</span>
                  </div>

                  <div className="social-login">
                    <button className="btn btn-outline-danger w-100 mb-2">
                      <i className="fab fa-google me-2"></i>
                      Continue with Google
                    </button>
                    <button className="btn btn-outline-primary w-100">
                      <i className="fab fa-facebook-f me-2"></i>
                      Continue with Facebook
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .register-page {
            min-height;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding;
          }

          .register-card {
            background;
            border-radius: var(--border-radius-lg);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            overflow;
          }

          .register-card .card-header {
            background: var(--gray-50);
            border-bottom: 1px solid var(--gray-200);
            padding;
            margin;
          }

          .register-card .card-header h2 {
            color: var(--secondary-color);
            font-weight;
            font-family: 'Poppins', sans-serif;
          }

          .register-card .card-body {
            padding;
          }

          .form-label {
            font-weight;
            color: var(--secondary-color);
            margin-bottom: 0.5rem;
          }

          .form-control {
            border-radius: var(--border-radius-lg);
            border: 1px solid var(--gray-300);
            padding: 0.75rem 1rem;
            transition: border-color 0.3s ease;
          }

          .form-control:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.2rem rgba(67, 172, 233, 0.25);
          }

          .input-group .btn {
            border-radius: 0 var(--border-radius-lg) var(--border-radius-lg) 0;
          }

          .btn {
            border-radius: var(--border-radius-lg);
            font-weight;
            padding: 0.75rem 1.5rem;
            transition: all 0.3s ease;
          }

          .btn-primary {
            background: var(--primary-color);
            border-color: var(--primary-color);
          }

          .btn-primary:hover {
            background: var(--primary-dark);
            border-color: var(--primary-dark);
            transform: translateY(-1px);
          }

          .divider {
            position;
            text-align;
            color: var(--gray-600);
            font-size;
          }

          .divider::before {
            content: '';
            position;
            top: 50%;
            left;
            right;
            height;
            background: var(--gray-300);
            z-index;
          }

          .divider span {
            background;
            padding;
            position;
            z-index;
          }

          .social-login .btn {
            border-radius: var(--border-radius-lg);
            font-weight;
            transition: all 0.3s ease;
          }

          .social-login .btn:hover {
            transform: translateY(-1px);
          }

          .form-check-input:checked {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
          }

          .form-check-label {
            font-size;
            color: var(--gray-600);
          }

          .alert {
            border-radius: var(--border-radius-lg);
            border;
          }

          .alert-danger {
            background-color: #f8d7da;
            color: #721c24;
          }

          @media (max-width) {
            .register-page {
              padding;
            }

            .register-card .card-header,
            .register-card .card-body {
              padding: 1.5rem;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

