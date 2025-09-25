'use client';

import React, { useState } from 'react';



const WoodMartNewsletter = ({
  title = "Stay Updated",
  subtitle = "Newsletter",
  description = "Subscribe to our newsletter and get 10% off your first order",
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  backgroundImage = "/images/placeholder.svg"
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="woodmart-newsletter">
        <div 
          className="newsletter-wrapper"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="newsletter-overlay"></div>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <div className="newsletter-success">
                  <div className="success-icon">
                    <i className="f-check-circle"></i>
                  </div>
                  <h3 className="success-title">Thank You!</h3>
                  <p className="success-message">
                    You have successfully subscribed to our newsletter. Check your email for confirmation.
                  </p>
                  <button 
                    className="btn-resubscribe"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Subscribe Another Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="woodmart-newsletter">
      <div 
        className="newsletter-wrapper"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="newsletter-overlay"></div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div className="newsletter-content">
                <span className="newsletter-subtitle">{subtitle}</span>
                <h2 className="newsletter-title">{title}</h2>
                <p className="newsletter-description">{description}</p>
                
                <form onSubmit={handleSubmit} className="newsletter-form">
                  <div className="input-group">
                    <input
                      type="email"
                      className="form-control"
                      placeholder={placeholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button 
                      className="btn btn-primary" 
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
                          {buttonText}
                          <i className="f-arrow-right ms-2"></i>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="newsletter-features">
                  <div className="feature-item">
                    <i className="f-gift"></i>
                    <span>10% Off First Order</span>
                  </div>
                  <div className="feature-item">
                    <i className="f-bell"></i>
                    <span>Latest Updates</span>
                  </div>
                  <div className="feature-item">
                    <i className="f-heart"></i>
                    <span>Exclusive Offers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .woodmart-newsletter {
          margin: 4rem 0;
        }

        .newsletter-wrapper {
          position: relative;
          padding: 5rem 2rem;
          border-radius: var(--border-radius-xl);
          overflow: hidden;
        }

        .newsletter-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(131, 173, 50, 0.9) 0%,
            rgba(107, 143, 40, 0.8) 50%,
            rgba(90, 122, 30, 0.9) 100%
          );
          z-index: 1;
        }

        .newsletter-content {
          position: relative;
          z-index: 2;
          color: #ffffff;
        }

        .newsletter-subtitle {
          display: inline-block;
          font-family: var(--font-family-heading);
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 1rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1rem;
          border-radius: var(--border-radius-sm);
          backdrop-filter: blur(10px);
        }

        .newsletter-title {
          font-family: var(--font-family-heading);
          font-size: 3rem;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .newsletter-description {
          font-family: var(--font-family);
          font-size: 1.125rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          opacity: 0.9;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .newsletter-form {
          max-width: 500px;
          margin: 0 auto 3rem;
        }

        .newsletter-form .input-group {
          border-radius: var(--border-radius-round);
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .newsletter-form .form-control {
          border: none;
          padding: 1rem 1.5rem;
          font-size: 1rem;
          background: #ffffff;
          color: var(--secondary-color);
        }

        .newsletter-form .form-control:focus {
          box-shadow: none;
          border-color: transparent;
        }

        .newsletter-form .form-control::placeholder {
          color: var(--gray-600);
        }

        .newsletter-form .btn {
          border: none;
          padding: 1rem 2rem;
          font-family: var(--font-family-heading);
          font-size: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          background: var(--secondary-color);
          color: #ffffff;
          transition: all 0.3s ease;
        }

        .newsletter-form .btn:hover {
          background: var(--primary-color);
          transform: translateX(-2px);
        }

        .newsletter-form .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .newsletter-features {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-family);
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .feature-item i {
          font-size: 1rem;
          color: #ffffff;
        }

        /* Success State */
        .newsletter-success {
          color: #ffffff;
        }

        .success-icon {
          font-size: 4rem;
          color: #ffffff;
          margin-bottom: 2rem;
        }

        .success-title {
          font-family: var(--font-family-heading);
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .success-message {
          font-family: var(--font-family);
          font-size: 1.125rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          opacity: 0.9;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .btn-resubscribe {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 1rem 2rem;
          border-radius: var(--border-radius-round);
          font-family: var(--font-family-heading);
          font-size: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .btn-resubscribe:hover {
          background: #ffffff;
          color: var(--primary-color);
          border-color: #ffffff;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .newsletter-wrapper {
            padding: 3rem 1rem;
            margin: 0 1rem;
          }

          .newsletter-title {
            font-size: 2rem;
          }

          .newsletter-description {
            font-size: 1rem;
          }

          .newsletter-form {
            max-width: 100%;
          }

          .newsletter-form .form-control {
            padding: 0.75rem 1rem;
            font-size: 1rem;
          }

          .newsletter-form .btn {
            padding: 0.75rem 1rem;
            font-size: 1rem;
          }

          .newsletter-features {
            gap: 1rem;
          }

          .feature-item {
            font-size: 1rem;
          }
        }

        @media (max-width) {
          .newsletter-title {
            font-size: 1rem;
          }

          .newsletter-description {
            font-size: 1rem;
          }

          .newsletter-features {
            flex-direction: column;
            gap: 1rem;
          }

          .success-title {
            font-size: 1rem;
          }

          .success-message {
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default WoodMartNewsletter;

