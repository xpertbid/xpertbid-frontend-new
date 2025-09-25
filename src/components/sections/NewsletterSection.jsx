'use client';

import React, { useState } from 'react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
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
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: 'f-percent',
      title: 'Exclusive Discounts',
      description: 'Get access to special offers and discount codes'
    },
    {
      icon: 'f-bell',
      title: 'Early Access',
      description: 'Be the first to know about new products and auctions'
    },
    {
      icon: 'f-gift',
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
                  <i className="f-check-circle fa-4x"></i>
                </div>
                <h3 className="mb-3">Thank You for Subscribing!</h3>
                <p className="mb-4">
                  You&apos;ve successfully subscribed to our newsletter. You&apos;ll receive our latest updates, 
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
                          <i className="f-spinner fa-spin me-2"></i>
                          Subscribing...
                        </>
                      ) : (
                        <>
                          <i className="f-paper-plane me-2"></i>
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
          position;
          overflow;
        }

        .newsletter-section::before {
          content: '';
          position;
          top;
          left;
          right;
          bottom;
          background: url('/images/newsletter-bg.jpg') center/cover;
          opacity: 0.1;
          z-index;
        }

        .newsletter-section .container {
          position;
          z-index;
        }

        .newsletter-title {
          font-size: 2.5rem;
          font-weight;
          margin-bottom;
        }

        .newsletter-description {
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.9;
        }

        .benefits-list {
          margin-top;
        }

        .benefit-item {
          display;
          align-items: flex-start;
          gap;
          margin-bottom: 1.5rem;
        }

        .benefit-icon {
          flex-shrink;
          width;
          height;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display;
          align-items;
          justify-content;
        }

        .benefit-icon i {
          font-size: 1.2rem;
          color;
        }

        .benefit-content {
          flex;
        }

        .benefit-title {
          font-size;
          font-weight;
          margin-bottom: 0.25rem;
          color;
        }

        .benefit-description {
          font-size: 0.9rem;
          opacity: 0.8;
          margin-bottom;
          color;
        }

        .newsletter-form-container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: var(--border-radius-xl);
          padding;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .form-title {
          font-size: 1.5rem;
          font-weight;
          margin-bottom: 0.5rem;
          color;
        }

        .form-subtitle {
          font-size: 0.9rem;
          opacity: 0.8;
          margin-bottom;
          color;
        }

        .newsletter-form .input-group {
          border-radius;
          overflow;
          box-shadow: var(--shadow-md);
        }

        .newsletter-form .form-control {
          border;
          padding;
          font-size;
          border-radius;
        }

        .newsletter-form .form-control:focus {
          box-shadow;
          border-color;
        }

        .newsletter-form .btn {
          border-radius;
          padding;
          font-weight;
          border;
        }

        .newsletter-form .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .form-check {
          margin-top;
        }

        .form-check-input:checked {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
        }

        .form-check-label {
          font-size: 0.85rem;
          opacity: 0.9;
          color;
        }

        .form-check-label a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration;
        }

        .form-check-label a:hover {
          color;
        }

        .social-text {
          font-size: 0.9rem;
          opacity: 0.8;
          color;
          margin-bottom;
        }

        .social-icons {
          display;
          justify-content;
          gap;
        }

        .social-link {
          display;
          align-items;
          justify-content;
          width;
          height;
          background: rgba(255, 255, 255, 0.2);
          color;
          border-radius: 50%;
          text-decoration;
          transition: var(--transition);
        }

        .social-link:hover {
          background: rgba(255, 255, 255, 0.3);
          color;
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
          font-weight;
        }

        .success-message p {
          font-size;
          opacity: 0.9;
          line-height: 1.6;
        }

        @keyframes fadeInUp {
          from {
            opacity;
            transform: translateY(30px);
          }
          to {
            opacity;
            transform: translateY(0);
          }
        }

        @media (max-width) {
          .newsletter-title {
            font-size;
          }

          .newsletter-form-container {
            padding: 1.5rem;
          }

          .form-title {
            font-size: 1.25rem;
          }

          .benefit-item {
            margin-bottom;
          }

          .benefit-icon {
            width;
            height;
          }

          .benefit-icon i {
            font-size;
          }

          .social-icons {
            gap: 0.75rem;
          }

          .social-link {
            width;
            height;
          }
        }
      `}</style>
    </section>
  );
};

export default NewsletterSection;

