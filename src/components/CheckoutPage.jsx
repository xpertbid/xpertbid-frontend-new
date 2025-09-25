'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';

const CheckoutPage = () => {
  const { items, subtotal, shipping, tax, total, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Billing Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Shipping Information
    shippingSameAsBilling,
    shippingFirstName: '',
    shippingLastName: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZipCode: '',
    shippingCountry: 'United States',
    
    // Payment Information
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    
    // Order Notes
    orderNotes: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const checked = (e.target ).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect to success page
      clearCart();
      window.location.href = '/checkout/success';
    } catch (error) {
      console.error('Order processing failed:', error);
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="empty-cart text-center py-5">
                <h3 className="mb-3">Your cart is empty</h3>
                <p className="text-muted mb-4">
                  You need to add items to your cart before proceeding to checkout.
                </p>
                <Link href="/shop" className="btn btn-primary btn-lg">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/cart">Cart</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Checkout
            </li>
          </ol>
        </nav>

        <div className="row">
          {/* Checkout Form */}
          <div className="col-lg-8">
            <h2 className="checkout-title mb-4" style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontSize: '28px', 
              fontWeight: '600',
              color: '#000'
            }}>
              Checkout
            </h2>

            {/* Progress Steps */}
            <div className="checkout-steps mb-5">
              <div className="row">
                <div className="col-4">
                  <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                    <div className="step-number">1</div>
                    <div className="step-label">Billing Info</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                    <div className="step-number">2</div>
                    <div className="step-label">Shipping</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                    <div className="step-number">3</div>
                    <div className="step-label">Payment</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1: Billing Information */}
            {currentStep === 1 && (
              <div className="checkout-step">
                <div className="step-header mb-4">
                  <h4 className="mb-2">Billing Information</h4>
                  <p className="text-muted">Enter your billing details</p>
                </div>

                <form className="billing-form">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Address *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">State *</label>
                      <select
                        className="form-select"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select State</option>
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">ZIP Code *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Country *</label>
                    <select
                      className="form-select"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>

                  <div className="text-end">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNextStep}
                      style={{
                        padding: '12px 30px',
                        fontSize: '16px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      Continue to Shipping
                      <i className="f-arrow-right ms-2"></i>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Shipping Information */}
            {currentStep === 2 && (
              <div className="checkout-step">
                <div className="step-header mb-4">
                  <h4 className="mb-2">Shipping Information</h4>
                  <p className="text-muted">Enter your shipping details</p>
                </div>

                <div className="mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="shippingSameAsBilling"
                      checked={formData.shippingSameAsBilling}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label">
                      Ship to the same address </label>
                  </div>
                </div>

                {!formData.shippingSameAsBilling && (
                  <form className="shipping-form">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">First Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="shippingFirstName"
                          value={formData.shippingFirstName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Last Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="shippingLastName"
                          value={formData.shippingLastName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Address *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">City *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="shippingCity"
                          value={formData.shippingCity}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">State *</label>
                        <select
                          className="form-select"
                          name="shippingState"
                          value={formData.shippingState}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select State</option>
                          <option value="CA">California</option>
                          <option value="NY">New York</option>
                          <option value="TX">Texas</option>
                          <option value="FL">Florida</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">ZIP Code *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="shippingZipCode"
                          value={formData.shippingZipCode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </form>
                )}

                {/* Shipping Method */}
                <div className="shipping-methods mb-4">
                  <h6 className="mb-3">Shipping Method</h6>
                  <div className="shipping-options">
                    <div className="form-check mb-3">
                      <input className="form-check-input" type="radio" name="shippingMethod" id="standard" value="standard" defaultChecked />
                      <label className="form-check-label d-flex justify-content-between w-100" htmlFor="standard">
                        <div>
                          <strong>Standard Shipping</strong>
                          <div className="text-muted small">5-7 business days</div>
                        </div>
                        <span className="fw-bold">FREE</span>
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input className="form-check-input" type="radio" name="shippingMethod" id="express" value="express" />
                      <label className="form-check-label d-flex justify-content-between w-100" htmlFor="express">
                        <div>
                          <strong>Express Shipping</strong>
                          <div className="text-muted small">2-3 business days</div>
                        </div>
                        <span className="fw-bold">$15.99</span>
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="shippingMethod" id="overnight" value="overnight" />
                      <label className="form-check-label d-flex justify-content-between w-100" htmlFor="overnight">
                        <div>
                          <strong>Overnight Shipping</strong>
                          <div className="text-muted small">Next business day</div>
                        </div>
                        <span className="fw-bold">$29.99</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handlePrevStep}
                  >
                    <i className="f-arrow-left me-2"></i>
                    Back to Billing
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNextStep}
                  >
                    Continue to Payment
                    <i className="f-arrow-right ms-2"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="checkout-step">
                <div className="step-header mb-4">
                  <h4 className="mb-2">Payment Information</h4>
                  <p className="text-muted">Choose your payment method</p>
                </div>

                <div className="payment-methods mb-4">
                  <div className="form-check mb-3">
                    <input className="form-check-input" type="radio" name="paymentMethod" id="card" value="card" defaultChecked />
                    <label className="form-check-label" htmlFor="card">
                      <i className="f-credit-card me-2"></i>
                      Credit/Debit Card
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input className="form-check-input" type="radio" name="paymentMethod" id="paypal" value="paypal" />
                    <label className="form-check-label" htmlFor="paypal">
                      <i className="fab fa-paypal me-2"></i>
                      PayPal
                    </label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="paymentMethod" id="apple" value="apple" />
                    <label className="form-check-label" htmlFor="apple">
                      <i className="fab fa-apple-pay me-2"></i>
                      Apple Pay
                    </label>
                  </div>
                </div>

                {formData.paymentMethod === 'card' && (
                  <form className="payment-form">
                    <div className="mb-3">
                      <label className="form-label">Card Number *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Expiry Date *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">CVV *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Cardholder Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </form>
                )}

                {/* Order Notes */}
                <div className="order-notes mb-4">
                  <label className="form-label">Order Notes (Optional)</label>
                  <textarea
                    className="form-control"
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any special instructions for your order..."
                  />
                </div>

                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handlePrevStep}
                  >
                    <i className="f-arrow-left me-2"></i>
                    Back to Shipping
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={handleSubmitOrder}
                    disabled={isProcessing}
                    style={{
                      padding: '15px 40px',
                      fontSize: '16px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="f-lock me-2"></i>
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="col-lg-4">
            <div className="order-summary">
              <div className="summary-card border rounded p-4">
                <h5 className="summary-title mb-4" style={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  Order Summary
                </h5>

                {/* Order Items */}
                <div className="order-items mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="order-item d-flex align-items-center mb-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="me-3"
                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <div className="flex-grow-1">
                        <div className="item-name small fw-bold">{item.name}</div>
                        <div className="item-quantity text-muted small">Qty: {item.quantity}</div>
                      </div>
                      <div className="item-price fw-bold">
                        ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <hr />

                <div className="summary-details">
                  <div className="summary-row d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row d-flex justify-content-between mb-2">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="summary-row d-flex justify-content-between mb-2">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="summary-row d-flex justify-content-between mb-4">
                    <span className="h5 mb-0">Total</span>
                    <span className="h5 mb-0 text-primary fw-bold">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="security-notice text-center">
                  <small className="text-muted">
                    <i className="f-shield-alt me-1"></i>
                    Your payment information is secure and encrypted
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .checkout-steps {
          position;
        }
        
        .step {
          text-align;
          position;
        }
        
        .step-number {
          width;
          height;
          border-radius: 50%;
          background-color: #dee2e6;
          color: #6c757d;
          display;
          align-items;
          justify-content;
          font-weight;
          margin;
          transition: all 0.3s ease;
        }
        
        .step.active .step-number {
          background-color: #43ACE9;
          color;
        }
        
        .step.completed .step-number {
          background-color: #28a745;
          color;
        }
        
        .step-label {
          font-size;
          font-weight;
          color: #6c757d;
        }
        
        .step.active .step-label {
          color: #43ACE9;
        }
        
        .step.completed .step-label {
          color: #28a745;
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;

