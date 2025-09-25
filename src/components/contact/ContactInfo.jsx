'use client';

import Link from 'next/link';
import React from 'react';

const ContactInfo = () => {
  const contactMethods = [
    {
      icon: 'f-map-marker-alt',
      title: 'Visit Us',
      details: [
        '123 Commerce Street',
        'Business City, BC 12345',
        'United States'
      ],
      color: 'primary'
    },
    {
      icon: 'f-phone',
      title: 'Call Us',
      details: [
        '+1 (555) 123-4567',
        '+1 (555) 987-6543',
        'Mon - Fri: 9:00 AM - 6:00 PM'
      ],
      color: 'success'
    },
    {
      icon: 'f-envelope',
      title: 'Email Us',
      details: [
        'info@xpertbid.com',
        'support@xpertbid.com',
        'sales@xpertbid.com'
      ],
      color: 'info'
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: 'fab fa-facebook-f', url: '#', color: '#1877f2' },
    { name: 'Twitter', icon: 'fab fa-twitter', url: '#', color: '#1da1f2' },
    { name: 'Instagram', icon: 'fab fa-instagram', url: '#', color: '#e4405f' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin-in', url: '#', color: '#0077b5' },
    { name: 'YouTube', icon: 'fab fa-youtube', url: '#', color: '#ff0000' }
  ];

  return (
    <div className="contact-info">
      <div className="contact-methods">
        {contactMethods.map((method, index) => (
          <div key={index} className={`contact-method contact-method-${method.color}`}>
            <div className="contact-method-icon">
              <i className={method.icon}></i>
            </div>
            <div className="contact-method-content">
              <h5 className="contact-method-title">{method.title}</h5>
              <div className="contact-method-details">
                {method.details.map((detail, detailIndex) => (
                  <p key={detailIndex} className="contact-method-detail">{detail}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="business-hours mt-4">
        <div className="business-hours-card">
          <h5 className="business-hours-title">
            <i className="fas fa-clock me-2"></i>
            Business Hours
          </h5>
          <div className="business-hours-list">
            <div className="business-hours-item">
              <span className="day">Monday - Friday</span>
              <span className="time">9:00 AM - 6:00 PM</span>
            </div>
            <div className="business-hours-item">
              <span className="day">Saturday</span>
              <span className="time">10:00 AM - 4:00 PM</span>
            </div>
            <div className="business-hours-item">
              <span className="day">Sunday</span>
              <span className="time">Closed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="social-links mt-4">
        <div className="social-links-card">
          <h5 className="social-links-title">
            <i className="fas fa-share-alt me-2"></i>
            Follow Us
          </h5>
          <div className="social-links-list">
            {socialLinks.map((social, index) => (
              <a 
                key={index}
                href={social.url} 
                className="social-link"
                style={{ '--social-color': social.color }}
                title={social.name}
              >
                <i className={social.icon}></i>
                <span>{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="quick-links mt-4">
        <div className="quick-links-card">
          <h5 className="quick-links-title">
            <i className="fas fa-link me-2"></i>
            Quick Links
          </h5>
          <div className="quick-links-list">
            <a href="/faq" className="quick-link">FAQ</a>
            <a href="/shipping" className="quick-link">Shipping Info</a>
            <a href="/returns" className="quick-link">Returns</a>
            <a href="/privacy" className="quick-link">Privacy Policy</a>
            <a href="/terms" className="quick-link">Terms of Service</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-info {
          position: sticky;
          top: 100px;
        }

        .contact-method {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
          background: white;
          box-shadow: var(--shadow-sm);
          border-radius: 0;
          margin-bottom: 1rem;
          border-left: 4px solid var(--primary-color);
        }

        .contact-method-primary {
          border-left-color: var(--primary-color);
        }

        .contact-method-success {
          border-left-color: var(--success-color);
        }

        .contact-method-info {
          border-left-color: var(--info-color);
        }

        .contact-method-icon {
          flex-shrink: 0;
          width: 50px;
          height: 50px;
          background: var(--gray-100);
          border-radius: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contact-method-primary .contact-method-icon {
          background: rgba(131, 183, 53, 0.1);
          color: var(--primary-color);
        }

        .contact-method-success .contact-method-icon {
          background: rgba(40, 167, 69, 0.1);
          color: var(--success-color);
        }

        .contact-method-info .contact-method-icon {
          background: rgba(23, 162, 184, 0.1);
          color: var(--info-color);
        }

        .contact-method-icon i {
          font-size: 1.25rem;
        }

        .contact-method-content {
          flex: 1;
        }

        .contact-method-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 0.5rem;
        }

        .contact-method-detail {
          font-size: 0.9rem;
          color: var(--gray-600);
          margin-bottom: 0.25rem;
        }

        .business-hours-card,
        .social-links-card,
        .quick-links-card {
          background: white;
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
          border-radius: 0;
        }

        .business-hours-title,
        .social-links-title,
        .quick-links-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 1rem;
        }

        .business-hours-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--gray-200);
        }

        .business-hours-item:last-child {
          border-bottom: none;
        }

        .day {
          font-weight: 500;
          color: var(--secondary-color);
        }

        .time {
          font-size: 0.9rem;
          color: var(--gray-600);
        }

        .social-links-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          color: var(--gray-700);
          text-decoration: none;
          border-radius: 0;
          transition: var(--transition-fast);
          border: 1px solid var(--gray-200);
        }

        .social-link:hover {
          background-color: var(--social-color);
          color: white;
          border-color: var(--social-color);
        }

        .social-link i {
          width: 20px;
          text-align: center;
        }

        .quick-links-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .quick-link {
          color: var(--gray-700);
          text-decoration: none;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--gray-200);
          transition: var(--transition-fast);
        }

        .quick-link:hover {
          color: var(--primary-color);
          padding-left: 0.5rem;
        }

        .quick-link:last-child {
          border-bottom: none;
        }

        @media (max-width: 991px) {
          .contact-info {
            position: static;
            margin-top: 2rem;
          }
        }

        @media (max-width: 768px) {
          .contact-method {
            padding: 1rem;
          }

          .contact-method-icon {
            width: 40px;
            height: 40px;
          }

          .business-hours-card,
          .social-links-card,
          .quick-links-card {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactInfo;

