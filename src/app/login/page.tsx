'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LoginFormData {
  email: string;
  password: string;
  remember_me: boolean;
}

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, error: authError, clearError } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    remember_me: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      
      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="login-page">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="login-card">
                <div className="card-header text-center">
                  <h2 className="mb-1">Welcome Back</h2>
                  <p className="text-muted mb-0">Sign in to your XpertBid account</p>
                </div>
                <div className="card-body">
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
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

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                        </button>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="remember_me"
                          name="remember_me"
                          checked={formData.remember_me}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="remember_me">
                          Remember me
                        </label>
                      </div>
                      <Link href="/forgot-password" className="text-primary">
                        Forgot Password?
                      </Link>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary w-100 mb-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Signing In...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Sign In
                        </>
                      )}
                    </button>
                  </form>

                  <div className="text-center">
                    <p className="mb-0">
                      Don&apos;t have an account?{' '}
                      <Link href="/register" className="text-primary fw-bold">
                        Create Account
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

              {/* Demo Credentials */}
              <div className="demo-credentials mt-4">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">
                      <i className="fas fa-info-circle me-2"></i>
                      Demo Credentials
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <strong>Admin:</strong><br />
                        <small className="text-muted">admin@xpertbid.com</small><br />
                        <small className="text-muted">admin123</small>
                      </div>
                      <div className="col-md-6">
                        <strong>User:</strong><br />
                        <small className="text-muted">user@example.com</small><br />
                        <small className="text-muted">password123</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .login-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 2rem 0;
          }

          .login-card {
            background: white;
            border-radius: var(--border-radius-lg);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            overflow: hidden;
          }

          .login-card .card-header {
            background: var(--gray-50);
            border-bottom: 1px solid var(--gray-200);
            padding: 2rem;
            margin: 0;
          }

          .login-card .card-header h2 {
            color: var(--secondary-color);
            font-weight: 700;
            font-family: 'Poppins', sans-serif;
          }

          .login-card .card-body {
            padding: 2rem;
          }

          .form-label {
            font-weight: 600;
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
            font-weight: 500;
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
            position: relative;
            text-align: center;
            color: var(--gray-600);
            font-size: 14px;
          }

          .divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: var(--gray-300);
            z-index: 1;
          }

          .divider span {
            background: white;
            padding: 0 1rem;
            position: relative;
            z-index: 2;
          }

          .social-login .btn {
            border-radius: var(--border-radius-lg);
            font-weight: 500;
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
            font-size: 14px;
            color: var(--gray-600);
          }

          .alert {
            border-radius: var(--border-radius-lg);
            border: none;
          }

          .alert-danger {
            background-color: #f8d7da;
            color: #721c24;
          }

          .demo-credentials .card {
            border-radius: var(--border-radius-lg);
            border: 1px solid var(--gray-300);
          }

          .demo-credentials .card-header {
            background: var(--gray-50);
            border-bottom: 1px solid var(--gray-200);
            padding: 0.75rem 1rem;
          }

          .demo-credentials .card-header h6 {
            color: var(--secondary-color);
            font-weight: 600;
            margin: 0;
          }

          .demo-credentials .card-body {
            padding: 1rem;
            font-size: 14px;
          }

          @media (max-width: 768px) {
            .login-page {
              padding: 1rem 0;
            }

            .login-card .card-header,
            .login-card .card-body {
              padding: 1.5rem;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default LoginPage;