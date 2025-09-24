'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { PaymentGateway } from '@/types';
import Image from 'next/image';

export default function CheckoutPage() {
  const { items, subtotal, total, shipping, tax, isLoaded, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
    paymentMethod: 'stripe',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    sameAsShipping: true,
    acceptTerms: false,
    newsletter: false
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);
  const [loadingGateways, setLoadingGateways] = useState(true);

  // Update form data when user authentication changes
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || ''
      }));
    }
  }, [isAuthenticated, user]);

  // Fetch payment gateways on component mount
  useEffect(() => {
    const fetchPaymentGateways = async () => {
      try {
        const response = await apiService.getPaymentGateways();
        if (response.success) {
          setPaymentGateways(response.data);
          // Set default payment method to first gateway
          if (response.data.length > 0) {
            setFormData(prev => ({
              ...prev,
              paymentMethod: response.data[0].code
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching payment gateways:', error);
      } finally {
        setLoadingGateways(false);
      }
    };

    fetchPaymentGateways();
  }, []);

  // Helper function to get gateway icon
  const getGatewayIcon = (code: string): string => {
    switch (code) {
      case 'stripe':
        return 'fa-credit-card';
      case 'paypal':
        return 'fa-paypal';
      case 'razorpay':
        return 'fa-university';
      case 'cod':
        return 'fa-money-bill-wave';
      default:
        return 'fa-credit-card';
    }
  };

  // Check if current payment method requires card details
  const requiresCardDetails = () => {
    const selectedGateway = paymentGateways.find(g => g.code === formData.paymentMethod);
    return selectedGateway && ['stripe', 'card'].includes(selectedGateway.code);
  };

  // Handle conditional rendering after all hooks
  if (!isLoaded) {
    return (
      <Layout>
        <div className="checkout-page">
          <div className="container py-5">
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading checkout...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="checkout-page">
          <div className="container py-5">
            <div className="text-center">
              <h1>Your cart is empty</h1>
              <p>Add some items to your cart before checking out.</p>
              <Link href="/shop" className="btn btn-primary">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions';

    if (requiresCardDetails()) {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
      if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and show success
      clearCart();
      setOrderSuccess(true);
      
      // Log order data
      console.log('Order submitted:', {
        ...formData,
        items,
        total,
        orderNumber: `ORD-${Date.now()}`
      });
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <Layout>
        <div className="checkout-page">
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="order-success text-center">
                  <div className="success-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h1>Order Confirmed!</h1>
                  <p className="lead">Thank you for your purchase. Your order has been placed successfully.</p>
                  <div className="order-details">
                    <p><strong>Order Number:</strong> ORD-{Date.now()}</p>
                    <p><strong>Total Amount:</strong> ${total.toFixed(2)}</p>
                    <p>You will receive a confirmation email shortly.</p>
                  </div>
                  <div className="success-actions">
                    <Link href="/shop" className="btn btn-primary btn-lg">
                      Continue Shopping
                    </Link>
                    <Link href="/account" className="btn btn-outline-secondary btn-lg ms-3">
                      View Orders
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="checkout-page">
        <div className="container py-5">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link href="/">Home</Link></li>
              <li className="breadcrumb-item"><Link href="/cart">Cart</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Checkout</li>
            </ol>
          </nav>

          <div className="checkout-header mb-5">
            <h1 className="page-title">Secure Checkout</h1>
            <p className="checkout-subtitle">Complete your purchase safely and securely</p>
          </div>
          
          <div className="row">
            <div className="col-lg-8">
              <form onSubmit={handleSubmit} className="checkout-form">
                {/* Contact Information */}
                <div className="form-section">
                  <h3 className="section-title">
                    <i className="fas fa-user me-2"></i>Contact Information
                  </h3>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="firstName">First Name *</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                          placeholder="Enter your first name"
                        />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="lastName">Last Name *</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                          placeholder="Enter your last name"
                        />
                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="form-section">
                  <h3 className="section-title">
                    <i className="fas fa-truck me-2"></i>Shipping Address
                  </h3>
                  <div className="form-group">
                    <label htmlFor="address">Street Address *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      placeholder="Enter your street address"
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="city">City *</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                          placeholder="Enter your city"
                        />
                        {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="state">State</label>
                        <select
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="form-control"
                        >
                          <option value="">Select State</option>
                          <option value="AL">Alabama</option>
                          <option value="CA">California</option>
                          <option value="NY">New York</option>
                          <option value="TX">Texas</option>
                          <option value="FL">Florida</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="zipCode">ZIP Code *</label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`}
                          placeholder="12345"
                        />
                        {errors.zipCode && <div className="invalid-feedback">{errors.zipCode}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="form-section">
                  <h3 className="section-title">
                    <i className="fas fa-credit-card me-2"></i>Payment Method
                  </h3>
                  
                  {loadingGateways ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading payment methods...</span>
                      </div>
                      <p className="mt-2">Loading payment methods...</p>
                    </div>
                  ) : (
                    <div className="payment-methods">
                      {paymentGateways.map((gateway) => (
                        <div key={gateway.id} className="payment-option">
                          <input
                            type="radio"
                            id={gateway.code}
                            name="paymentMethod"
                            value={gateway.code}
                            checked={formData.paymentMethod === gateway.code}
                            onChange={handleInputChange}
                          />
                          <label htmlFor={gateway.code} className="payment-label">
                            <div className="payment-logo">
                              {gateway.logo_url ? (
                                <Image
                                  src={gateway.logo_url}
                                  alt={gateway.name}
                                  width={40}
                                  height={25}
                                  className="gateway-logo"
                                />
                              ) : (
                                <i className={`fas ${getGatewayIcon(gateway.code)} me-2`}></i>
                              )}
                            </div>
                            <div className="payment-info">
                              <span className="gateway-name">{gateway.name}</span>
                              <small className="gateway-description">{gateway.description}</small>
                              {gateway.transaction_fee > 0 && (
                                <small className="gateway-fee">
                                  Fee: {(gateway.transaction_fee * 100).toFixed(2)}% + ${parseFloat(gateway.fixed_fee.toString()).toFixed(2)}
                                </small>
                              )}
                              {gateway.is_test_mode && (
                                <span className="test-mode-badge">Test Mode</span>
                              )}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Card Details */}
                  {requiresCardDetails() && (
                    <div className="card-details">
                      <div className="form-group">
                        <label htmlFor="cardName">Cardholder Name *</label>
                        <input
                          type="text"
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className={`form-control ${errors.cardName ? 'is-invalid' : ''}`}
                          placeholder="Name on card"
                        />
                        {errors.cardName && <div className="invalid-feedback">{errors.cardName}</div>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="cardNumber">Card Number *</label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                        {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="expiryDate">Expiry Date *</label>
                            <input
                              type="text"
                              id="expiryDate"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                            {errors.expiryDate && <div className="invalid-feedback">{errors.expiryDate}</div>}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="cvv">CVV *</label>
                            <input
                              type="text"
                              id="cvv"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                              placeholder="123"
                              maxLength={4}
                            />
                            {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="form-section">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className={`form-check-input ${errors.acceptTerms ? 'is-invalid' : ''}`}
                    />
                    <label htmlFor="acceptTerms" className="form-check-label">
                      I agree to the <Link href="/terms" target="_blank">Terms and Conditions</Link> and <Link href="/privacy" target="_blank">Privacy Policy</Link> *
                    </label>
                    {errors.acceptTerms && <div className="invalid-feedback d-block">{errors.acceptTerms}</div>}
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="newsletter"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleInputChange}
                      className="form-check-input"
                    />
                    <label htmlFor="newsletter" className="form-check-label">
                      Subscribe to our newsletter for updates and special offers
                    </label>
                  </div>
                </div>

                <div className="checkout-actions">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg btn-checkout"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-lock me-2"></i>
                        Complete Secure Order - ${total.toFixed(2)}
                      </>
                    )}
                  </button>
                  <Link href="/cart" className="btn btn-outline-secondary btn-lg">
                    <i className="fas fa-arrow-left me-2"></i>Back to Cart
                  </Link>
                </div>
              </form>
            </div>
            
            <div className="col-lg-4">
              <div className="order-summary">
                <h3 className="summary-title">Order Summary</h3>
                
                <div className="summary-items">
                  {items.map((item) => (
                    <div key={item.id} className="summary-item">
                      <div className="summary-item-image">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="img-fluid rounded"
                        />
                      </div>
                      <div className="summary-item-details">
                        <h5 className="summary-item-name">{item.name}</h5>
                        <p className="summary-item-quantity">Qty: {item.quantity}</p>
                        <p className="summary-item-price">${parseFloat(item.price.toString()).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summary-totals">
                  <div className="summary-row">
                    <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''}):</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="summary-total">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="security-info">
                  <i className="fas fa-shield-alt text-success me-2"></i>
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-title {
          font-family: var(--font-family-heading);
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 0;
        }

        .checkout-subtitle {
          color: var(--gray-600);
          font-size: 1.1rem;
          margin-bottom: 0;
        }

        .form-section {
          background: white;
          padding: 30px;
          border-radius: var(--border-radius-lg);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          margin-bottom: 30px;
        }

        .section-title {
          font-family: var(--font-family-heading);
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 20px;
          font-size: 18px;
          border-bottom: 2px solid var(--primary-color);
          padding-bottom: 10px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 8px;
          display: block;
        }

        .form-control {
          border: 2px solid #e9ecef;
          border-radius: var(--border-radius-sm);
          padding: 12px 15px;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .form-control:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 0.2rem rgba(67, 172, 233, 0.25);
        }

        .payment-methods {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .payment-option {
          flex: 1;
          min-width: 150px;
        }

        .payment-option input[type="radio"] {
          display: none;
        }

        .payment-label {
          display: flex;
          align-items: center;
          padding: 20px;
          border: 2px solid #e9ecef;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          background: white;
          width: 100%;
        }

        .payment-option input[type="radio"]:checked + .payment-label {
          border-color: var(--primary-color);
          background: rgba(67, 172, 233, 0.1);
          color: var(--primary-color);
        }

        .payment-logo {
          flex: 0 0 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
        }

        .gateway-logo {
          border-radius: 4px;
          object-fit: contain;
        }

        .payment-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .gateway-name {
          font-weight: 700;
          font-size: 16px;
          color: var(--secondary-color);
        }

        .gateway-description {
          color: var(--gray-600);
          font-size: 12px;
        }

        .gateway-fee {
          color: var(--gray-500);
          font-size: 11px;
          font-weight: 500;
        }

        .test-mode-badge {
          background: #ffc107;
          color: #000;
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          align-self: flex-start;
          margin-top: 4px;
        }

        .card-details {
          background: #f8f9fa;
          padding: 20px;
          border-radius: var(--border-radius-sm);
          margin-top: 20px;
        }

        .checkout-actions {
          background: white;
          padding: 30px;
          border-radius: var(--border-radius-lg);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          text-align: center;
        }

        .btn-checkout {
          padding: 15px 40px;
          font-size: 18px;
          font-weight: 700;
          border-radius: var(--border-radius-lg);
          margin-bottom: 15px;
          width: 100%;
        }

        .order-summary {
          background: white;
          padding: 30px;
          border-radius: var(--border-radius-lg);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 20px;
        }

        .summary-title {
          font-family: var(--font-family-heading);
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 20px;
          font-size: 20px;
          border-bottom: 2px solid var(--primary-color);
          padding-bottom: 10px;
        }

        .summary-items {
          margin-bottom: 20px;
        }

        .summary-item {
          display: flex;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #f1f3f4;
        }

        .summary-item:last-child {
          border-bottom: none;
        }

        .summary-item-image {
          flex: 0 0 60px;
          margin-right: 15px;
        }

        .summary-item-details {
          flex: 1;
        }

        .summary-item-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 5px;
        }

        .summary-item-quantity {
          font-size: 12px;
          color: var(--gray-600);
          margin-bottom: 5px;
        }

        .summary-item-price {
          font-size: 14px;
          font-weight: 600;
          color: var(--primary-color);
          margin-bottom: 0;
        }

        .summary-totals {
          margin-bottom: 20px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          font-size: 14px;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-top: 2px solid var(--primary-color);
          margin-top: 15px;
          font-size: 18px;
          font-weight: 700;
          color: var(--secondary-color);
        }

        .security-info {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: var(--gray-600);
          padding-top: 15px;
          border-top: 1px solid #e9ecef;
        }

        .order-success {
          background: white;
          padding: 60px 40px;
          border-radius: var(--border-radius-lg);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .success-icon {
          font-size: 4rem;
          color: #28a745;
          margin-bottom: 20px;
        }

        .order-success h1 {
          font-family: var(--font-family-heading);
          color: var(--secondary-color);
          margin-bottom: 15px;
        }

        .order-details {
          background: #f8f9fa;
          padding: 20px;
          border-radius: var(--border-radius-sm);
          margin: 30px 0;
        }

        .success-actions {
          margin-top: 30px;
        }

        @media (max-width: 991.98px) {
          .payment-methods {
            flex-direction: column;
          }

          .order-summary {
            position: static;
            margin-top: 30px;
          }
        }
      `}</style>
    </Layout>
  );
}