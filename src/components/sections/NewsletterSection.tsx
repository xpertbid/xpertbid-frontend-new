'use client';

import React, { useState } from 'react';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Replace with actual API call
      // const response = await fetch('/api/newsletter/subscribe', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email }),
      // });

      // if (!response.ok) {
      //   throw new Error('Subscription failed');
      // }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      setEmail('');
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: 'fas fa-percent',
      title: 'Exclusive Discounts',
      description: 'Get access to special offers and discount codes'
    },
    {
      icon: 'fas fa-bell',
      title: 'Early Access',
      description: 'Be the first to know about new products and auctions'
    },
    {
      icon: 'fas fa-gift',
      title: 'Special Gifts',
      description: 'Receive exclusive gifts and rewards for subscribers'
    }
  ];

  if (isSubscribed) {
    return (
      <section className="newsletter-section py-5 bg-primary text-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div className="success-message">
                <div className="success-icon mb-4">
                  <i className="fas fa-check-circle fa-4x"></i>
                </div>
                <h3 className="mb-3">Thank You for Subscribing!</h3>
                <p className="mb-4">
                  You've successfully subscribed to our newsletter. You'll receive our latest updates, 
                  exclusive offers, and special promotions directly in your inbox.
                </p>
                <button 
                  className="btn btn-light"
                  onClick={() => setIsSubscribed(false)}
                >
                  Subscribe Another Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="newsletter-section py-5 bg-primary text-white">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="newsletter-content">
              <h2 className="newsletter-title mb-3">Stay Updated</h2>
              <p className="newsletter-description mb-4">
                Subscribe to our newsletter and get the latest news, updates, exclusive offers, 
                and early access to new products and auctions.
              </p>
              
              <div className="benefits-list">
                {benefits.map((benefit, index) => (
                  <div key={index} className="benefit-item">
                    <div className="benefit-icon">
                      <i className={benefit.icon}></i>
                    </div>
                    <div className="benefit-content">
                      <h6 className="benefit-title">{benefit.title}</h6>
                      <p className="benefit-description">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="newsletter-form-container">
              <div className="form-header text-center mb-4">
                <h4 className="form-title">Subscribe Now</h4>
                <p className="form-subtitle">Join thousands of happy subscribers</p>
              </div>

              <form onSubmit={handleSubmit} className="newsletter-form">
                <div className="form-group mb-3">
                  <div className="input-group">
                    <input
                      type="email"
                      className={`form-control ${error ? 'is-invalid' : ''}`}
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                    <button 
                      className="btn btn-dark" 
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          Subscribing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>
                          Subscribe
                        </>
                      )}
                    </button>
                  </div>
                  {error && (
                    <div className="invalid-feedback d-block">
                      {error}
                    </div>
                  )}
                </div>

                <div className="form-footer">
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="newsletterTerms" 
                      required 
                    />
                    <label className="form-check-label" htmlFor="newsletterTerms">
                      I agree to receive marketing emails and have read the{' '}
                      <a href="/privacy" className="text-white-50">Privacy Policy</a>
                    </label>
                  </div>
                </div>
              </form>

              <div className="social-links text-center mt-4">
                <p className="social-text mb-3">Follow us on social media</p>
                <div className="social-icons">
                  <a href="#" className="social-link" aria-label="Facebook">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="social-link" aria-label="Twitter">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-link" aria-label="Instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="social-link" aria-label="YouTube">
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a href="#" className="social-link" aria-label="LinkedIn">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .newsletter-section {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
          position: relative;
          overflow: hidden;
        }

        .newsletter-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('/images/newsletter-bg.jpg') center/cover;
          opacity: 0.1;
          z-index: 1;
        }

        .newsletter-section .container {
          position: relative;
          z-index: 2;
        }

        .newsletter-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .newsletter-description {
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.9;
        }

        .benefits-list {
          margin-top: 2rem;
        }

        .benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .benefit-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .benefit-icon i {
          font-size: 1.2rem;
          color: white;
        }

        .benefit-content {
          flex: 1;
        }

        .benefit-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: white;
        }

        .benefit-description {
          font-size: 0.9rem;
          opacity: 0.8;
          margin-bottom: 0;
          color: white;
        }

        .newsletter-form-container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: var(--border-radius-xl);
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .form-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: white;
        }

        .form-subtitle {
          font-size: 0.9rem;
          opacity: 0.8;
          margin-bottom: 0;
          color: white;
        }

        .newsletter-form .input-group {
          border-radius: 25px;
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        .newsletter-form .form-control {
          border: none;
          padding: 12px 20px;
          font-size: 1rem;
          border-radius: 25px 0 0 25px;
        }

        .newsletter-form .form-control:focus {
          box-shadow: none;
          border-color: transparent;
        }

        .newsletter-form .btn {
          border-radius: 0 25px 25px 0;
          padding: 12px 24px;
          font-weight: 500;
          border: none;
        }

        .newsletter-form .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .form-check {
          margin-top: 1rem;
        }

        .form-check-input:checked {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
        }

        .form-check-label {
          font-size: 0.85rem;
          opacity: 0.9;
          color: white;
        }

        .form-check-label a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: underline;
        }

        .form-check-label a:hover {
          color: white;
        }

        .social-text {
          font-size: 0.9rem;
          opacity: 0.8;
          color: white;
          margin-bottom: 1rem;
        }

        .social-icons {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border-radius: 50%;
          text-decoration: none;
          transition: var(--transition);
        }

        .social-link:hover {
          background: rgba(255, 255, 255, 0.3);
          color: white;
          transform: translateY(-2px);
        }

        .success-message {
          animation: fadeInUp 0.5s ease-out;
        }

        .success-icon {
          color: rgba(255, 255, 255, 0.9);
        }

        .success-message h3 {
          font-size: 1.75rem;
          font-weight: 600;
        }

        .success-message p {
          font-size: 1rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .newsletter-title {
            font-size: 2rem;
          }

          .newsletter-form-container {
            padding: 1.5rem;
          }

          .form-title {
            font-size: 1.25rem;
          }

          .benefit-item {
            margin-bottom: 1rem;
          }

          .benefit-icon {
            width: 35px;
            height: 35px;
          }

          .benefit-icon i {
            font-size: 1rem;
          }

          .social-icons {
            gap: 0.75rem;
          }

          .social-link {
            width: 35px;
            height: 35px;
          }
        }
      `}</style>
    </section>
  );
};

export default NewsletterSection;
