'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { VendorRegistrationData } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const VendorRegisterPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<VendorRegistrationData>({
    business_name: '',
    business_type: 'individual',
    business_registration_number: '',
    tax_id: '',
    store_name: '',
    store_slug: '',
    store_description: '',
    contact_email: user?.email || '',
    contact_phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    subscription_plan: 'basic'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, contact_email: user.email }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate store slug from store name
    if (name === 'store_name') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, store_slug: slug }));
    }

    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.business_name.trim()) {
          setError('Business name is required');
          return false;
        }
        if (!formData.store_name.trim()) {
          setError('Store name is required');
          return false;
        }
        if (!formData.contact_email.trim()) {
          setError('Contact email is required');
          return false;
        }
        break;
      case 2:
        if (formData.business_type === 'company' && !formData.business_registration_number?.trim()) {
          setError('Business registration number is required for companies');
          return false;
        }
        break;
      case 3:
        if (!formData.subscription_plan) {
          setError('Please select a subscription plan');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiService.registerVendor(formData);
      
      if (response.success) {
        setSuccess('Vendor registration submitted successfully! Your application is being reviewed.');
        setTimeout(() => {
          router.push('/vendor/dashboard');
        }, 2000);
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <h2>Please Login</h2>
            <p>You need to be logged in to register as a vendor.</p>
            <Link href="/login" className="btn btn-primary">
              Go to Login
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="vendor-register-page">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="vendor-register-card">
                <div className="card-header text-center">
                  <h2 className="mb-1">Become a Vendor</h2>
                  <p className="text-muted mb-0">Join our marketplace and start selling your products</p>
                </div>

                {/* Progress Steps */}
                <div className="progress-steps">
                  <div className="steps-container">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className={`step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
                        <div className="step-number">
                          {currentStep > step ? (
                            <i className="fas fa-check"></i>
                          ) : (
                            step
                          )}
                        </div>
                        <div className="step-label">
                          {step === 1 && 'Business Info'}
                          {step === 2 && 'Legal Details'}
                          {step === 3 && 'Subscription'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-body">
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="alert alert-success" role="alert">
                      <i className="fas fa-check-circle me-2"></i>
                      {success}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Business Information */}
                    {currentStep === 1 && (
                      <div className="step-content">
                        <h4 className="step-title">Business Information</h4>
                        
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="business_name" className="form-label">Business Name *</label>
                            <input
                              type="text"
                              className="form-control"
                              id="business_name"
                              name="business_name"
                              value={formData.business_name}
                              onChange={handleInputChange}
                              required
                              placeholder="Enter your business name"
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="business_type" className="form-label">Business Type *</label>
                            <select
                              className="form-select"
                              id="business_type"
                              name="business_type"
                              value={formData.business_type}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="individual">Individual</option>
                              <option value="company">Company</option>
                            </select>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="store_name" className="form-label">Store Name *</label>
                            <input
                              type="text"
                              className="form-control"
                              id="store_name"
                              name="store_name"
                              value={formData.store_name}
                              onChange={handleInputChange}
                              required
                              placeholder="Enter your store name"
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="store_slug" className="form-label">Store URL</label>
                            <div className="input-group">
                              <span className="input-group-text">xpertbid.com/store/</span>
                              <input
                                type="text"
                                className="form-control"
                                id="store_slug"
                                name="store_slug"
                                value={formData.store_slug}
                                onChange={handleInputChange}
                                placeholder="store-url"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="store_description" className="form-label">Store Description</label>
                          <textarea
                            className="form-control"
                            id="store_description"
                            name="store_description"
                            value={formData.store_description}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Describe your store and products..."
                          />
                        </div>

                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="contact_email" className="form-label">Contact Email *</label>
                            <input
                              type="email"
                              className="form-control"
                              id="contact_email"
                              name="contact_email"
                              value={formData.contact_email}
                              onChange={handleInputChange}
                              required
                              placeholder="Enter contact email"
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="contact_phone" className="form-label">Contact Phone</label>
                            <input
                              type="tel"
                              className="form-control"
                              id="contact_phone"
                              name="contact_phone"
                              value={formData.contact_phone}
                              onChange={handleInputChange}
                              placeholder="Enter contact phone"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Legal & Address Details */}
                    {currentStep === 2 && (
                      <div className="step-content">
                        <h4 className="step-title">Legal & Address Details</h4>
                        
                        {formData.business_type === 'company' && (
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label htmlFor="business_registration_number" className="form-label">Business Registration Number *</label>
                              <input
                                type="text"
                                className="form-control"
                                id="business_registration_number"
                                name="business_registration_number"
                                value={formData.business_registration_number}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter registration number"
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label htmlFor="tax_id" className="form-label">Tax ID</label>
                              <input
                                type="text"
                                className="form-control"
                                id="tax_id"
                                name="tax_id"
                                value={formData.tax_id}
                                onChange={handleInputChange}
                                placeholder="Enter tax ID"
                              />
                            </div>
                          </div>
                        )}

                        <div className="mb-3">
                          <label htmlFor="address" className="form-label">Business Address</label>
                          <textarea
                            className="form-control"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows={2}
                            placeholder="Enter your business address"
                          />
                        </div>

                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="city" className="form-label">City</label>
                            <input
                              type="text"
                              className="form-control"
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="Enter city"
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="state" className="form-label">State/Province</label>
                            <input
                              type="text"
                              className="form-control"
                              id="state"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              placeholder="Enter state"
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="country" className="form-label">Country</label>
                            <input
                              type="text"
                              className="form-control"
                              id="country"
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              placeholder="Enter country"
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="postal_code" className="form-label">Postal Code</label>
                            <input
                              type="text"
                              className="form-control"
                              id="postal_code"
                              name="postal_code"
                              value={formData.postal_code}
                              onChange={handleInputChange}
                              placeholder="Enter postal code"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Subscription Plan */}
                    {currentStep === 3 && (
                      <div className="step-content">
                        <h4 className="step-title">Choose Your Plan</h4>
                        
                        <div className="subscription-plans">
                          <div className="row">
                            <div className="col-md-4 mb-3">
                              <div className={`plan-card ${formData.subscription_plan === 'basic' ? 'selected' : ''}`} 
                                   onClick={() => setFormData(prev => ({ ...prev, subscription_plan: 'basic' }))}>
                                <div className="plan-header">
                                  <h5>Basic</h5>
                                  <div className="plan-price">$19/month</div>
                                </div>
                                <div className="plan-features">
                                  <ul>
                                    <li>Up to 50 products</li>
                                    <li>5% commission rate</li>
                                    <li>Basic analytics</li>
                                    <li>Email support</li>
                                  </ul>
                                </div>
                                <input
                                  type="radio"
                                  name="subscription_plan"
                                  value="basic"
                                  checked={formData.subscription_plan === 'basic'}
                                  onChange={handleInputChange}
                                  className="plan-radio"
                                />
                              </div>
                            </div>

                            <div className="col-md-4 mb-3">
                              <div className={`plan-card ${formData.subscription_plan === 'premium' ? 'selected' : ''}`}
                                   onClick={() => setFormData(prev => ({ ...prev, subscription_plan: 'premium' }))}>
                                <div className="plan-header">
                                  <h5>Premium</h5>
                                  <div className="plan-price">$49/month</div>
                                  <div className="plan-badge">Popular</div>
                                </div>
                                <div className="plan-features">
                                  <ul>
                                    <li>Up to 200 products</li>
                                    <li>3% commission rate</li>
                                    <li>Advanced analytics</li>
                                    <li>Priority support</li>
                                    <li>Custom branding</li>
                                  </ul>
                                </div>
                                <input
                                  type="radio"
                                  name="subscription_plan"
                                  value="premium"
                                  checked={formData.subscription_plan === 'premium'}
                                  onChange={handleInputChange}
                                  className="plan-radio"
                                />
                              </div>
                            </div>

                            <div className="col-md-4 mb-3">
                              <div className={`plan-card ${formData.subscription_plan === 'enterprise' ? 'selected' : ''}`}
                                   onClick={() => setFormData(prev => ({ ...prev, subscription_plan: 'enterprise' }))}>
                                <div className="plan-header">
                                  <h5>Enterprise</h5>
                                  <div className="plan-price">$99/month</div>
                                </div>
                                <div className="plan-features">
                                  <ul>
                                    <li>Unlimited products</li>
                                    <li>2% commission rate</li>
                                    <li>Full analytics suite</li>
                                    <li>24/7 phone support</li>
                                    <li>API access</li>
                                    <li>Dedicated manager</li>
                                  </ul>
                                </div>
                                <input
                                  type="radio"
                                  name="subscription_plan"
                                  value="enterprise"
                                  checked={formData.subscription_plan === 'enterprise'}
                                  onChange={handleInputChange}
                                  className="plan-radio"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="step-navigation">
                      <div className="d-flex justify-content-between">
                        <div>
                          {currentStep > 1 && (
                            <button 
                              type="button" 
                              className="btn btn-outline-secondary"
                              onClick={handlePrevious}
                            >
                              <i className="fas fa-arrow-left me-2"></i>
                              Previous
                            </button>
                          )}
                        </div>
                        <div>
                          {currentStep < totalSteps ? (
                            <button 
                              type="button" 
                              className="btn btn-primary"
                              onClick={handleNext}
                            >
                              Next
                              <i className="fas fa-arrow-right ms-2"></i>
                            </button>
                          ) : (
                            <button 
                              type="submit" 
                              className="btn btn-success"
                              disabled={loading}
                            >
                              {loading ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-check me-2"></i>
                                  Submit Application
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Additional Info */}
              <div className="additional-info mt-4">
                <div className="row">
                  <div className="col-md-4 text-center mb-3">
                    <div className="info-card">
                      <i className="fas fa-shield-alt fa-2x text-primary mb-2"></i>
                      <h6>Secure Platform</h6>
                      <p className="text-muted small">Your data is protected with enterprise-grade security</p>
                    </div>
                  </div>
                  <div className="col-md-4 text-center mb-3">
                    <div className="info-card">
                      <i className="fas fa-users fa-2x text-primary mb-2"></i>
                      <h6>Large Audience</h6>
                      <p className="text-muted small">Reach thousands of potential customers</p>
                    </div>
                  </div>
                  <div className="col-md-4 text-center mb-3">
                    <div className="info-card">
                      <i className="fas fa-chart-line fa-2x text-primary mb-2"></i>
                      <h6>Analytics</h6>
                      <p className="text-muted small">Track your performance with detailed analytics</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .vendor-register-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 2rem 0;
          }

          .vendor-register-card {
            background: white;
            border-radius: var(--border-radius-lg);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            overflow: hidden;
          }

          .vendor-register-card .card-header {
            background: var(--gray-50);
            border-bottom: 1px solid var(--gray-200);
            padding: 2rem;
            margin: 0;
          }

          .vendor-register-card .card-header h2 {
            color: var(--secondary-color);
            font-weight: 700;
            font-family: 'Poppins', sans-serif;
          }

          .progress-steps {
            background: white;
            padding: 2rem;
            border-bottom: 1px solid var(--gray-200);
          }

          .steps-container {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 2rem;
          }

          .step {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
          }

          .step:not(:last-child)::after {
            content: '';
            position: absolute;
            top: 15px;
            left: 100%;
            width: 2rem;
            height: 2px;
            background: var(--gray-300);
            z-index: 1;
          }

          .step.completed:not(:last-child)::after {
            background: var(--primary-color);
          }

          .step-number {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: var(--gray-300);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 14px;
            position: relative;
            z-index: 2;
          }

          .step.active .step-number {
            background: var(--primary-color);
          }

          .step.completed .step-number {
            background: var(--success-color);
          }

          .step-label {
            font-size: 12px;
            color: var(--gray-600);
            margin-top: 0.5rem;
            font-weight: 500;
          }

          .step.active .step-label {
            color: var(--primary-color);
          }

          .vendor-register-card .card-body {
            padding: 2rem;
          }

          .step-title {
            color: var(--secondary-color);
            font-weight: 600;
            margin-bottom: 1.5rem;
          }

          .form-label {
            font-weight: 600;
            color: var(--secondary-color);
            margin-bottom: 0.5rem;
          }

          .form-control, .form-select {
            border-radius: var(--border-radius-lg);
            border: 1px solid var(--gray-300);
            padding: 0.75rem 1rem;
            transition: border-color 0.3s ease;
          }

          .form-control:focus, .form-select:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.2rem rgba(67, 172, 233, 0.25);
          }

          .input-group-text {
            background: var(--gray-100);
            border: 1px solid var(--gray-300);
            color: var(--gray-600);
          }

          .subscription-plans {
            margin-bottom: 2rem;
          }

          .plan-card {
            background: white;
            border: 2px solid var(--gray-200);
            border-radius: var(--border-radius-lg);
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            height: 100%;
          }

          .plan-card:hover {
            border-color: var(--primary-color);
            transform: translateY(-2px);
          }

          .plan-card.selected {
            border-color: var(--primary-color);
            background: rgba(67, 172, 233, 0.05);
          }

          .plan-header {
            text-align: center;
            margin-bottom: 1rem;
            position: relative;
          }

          .plan-header h5 {
            color: var(--secondary-color);
            font-weight: 600;
            margin-bottom: 0.5rem;
          }

          .plan-price {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-color);
          }

          .plan-badge {
            position: absolute;
            top: -10px;
            right: -10px;
            background: var(--success-color);
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: var(--border-radius-sm);
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
          }

          .plan-features ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .plan-features li {
            padding: 0.25rem 0;
            font-size: 14px;
            color: var(--gray-600);
          }

          .plan-features li::before {
            content: '✓';
            color: var(--success-color);
            font-weight: bold;
            margin-right: 0.5rem;
          }

          .plan-radio {
            position: absolute;
            opacity: 0;
          }

          .step-navigation {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid var(--gray-200);
          }

          .btn {
            border-radius: var(--border-radius-lg);
            font-weight: 500;
            padding: 0.75rem 1.5rem;
            transition: all 0.3s ease;
          }

          .btn-primary:hover {
            transform: translateY(-1px);
          }

          .additional-info {
            background: rgba(255, 255, 255, 0.9);
            border-radius: var(--border-radius-lg);
            padding: 2rem;
          }

          .info-card {
            padding: 1rem;
          }

          .alert {
            border-radius: var(--border-radius-lg);
            border: none;
          }

          @media (max-width: 768px) {
            .vendor-register-page {
              padding: 1rem 0;
            }

            .vendor-register-card .card-header,
            .vendor-register-card .card-body,
            .progress-steps {
              padding: 1.5rem;
            }

            .steps-container {
              gap: 1rem;
            }

            .step:not(:last-child)::after {
              width: 1rem;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default VendorRegisterPage;
