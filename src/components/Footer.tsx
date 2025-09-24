'use client';

import React from 'react';
import Link from 'next/link';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'All Products', href: '/shop' },
      { name: 'New Arrivals', href: '/shop?filter=new' },
      { name: 'Best Sellers', href: '/shop?filter=bestsellers' },
      { name: 'Sale Items', href: '/shop?filter=sale' },
      { name: 'Gift Cards', href: '/gift-cards' },
    ],
    categories: [
      { name: 'Electronics', href: '/categories/electronics' },
      { name: 'Fashion', href: '/categories/fashion' },
      { name: 'Home & Garden', href: '/categories/home-garden' },
      { name: 'Sports', href: '/categories/sports' },
      { name: 'Books', href: '/categories/books' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
      { name: 'Size Guide', href: '/size-guide' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Partners', href: '/partners' },
      { name: 'Blog', href: '/blog' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' },
      { name: 'Accessibility', href: '/accessibility' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: 'fab fa-facebook-f', href: '#' },
    { name: 'Twitter', icon: 'fab fa-twitter', href: '#' },
    { name: 'Instagram', icon: 'fab fa-instagram', href: '#' },
    { name: 'YouTube', icon: 'fab fa-youtube', href: '#' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin-in', href: '#' },
    { name: 'Pinterest', icon: 'fab fa-pinterest-p', href: '#' },
  ];

  const paymentMethods = [
    { name: 'Visa', icon: 'fab fa-cc-visa' },
    { name: 'Mastercard', icon: 'fab fa-cc-mastercard' },
    { name: 'American Express', icon: 'fab fa-cc-amex' },
    { name: 'PayPal', icon: 'fab fa-cc-paypal' },
    { name: 'Apple Pay', icon: 'fab fa-cc-apple-pay' },
    { name: 'Google Pay', icon: 'fab fa-google-pay' },
  ];

  return (
    <footer className={`footer ${className}`}>
      {/* Newsletter Section */}
      <div className="footer-newsletter bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-4 mb-3 mb-lg-0">
              <h4 className="mb-2">Stay Updated</h4>
              <p className="mb-0 opacity-75">Get the latest news, updates, and exclusive offers</p>
            </div>
            <div className="col-lg-8">
              <form className="newsletter-form">
                <div className="input-group">
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Enter your email address"
                    required
                  />
                  <button className="btn btn-dark" type="submit">
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main bg-dark text-white py-5">
        <div className="container">
          <div className="row">
            {/* Company Info */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="footer-widget">
                <Link href="/" className="footer-logo mb-3 d-inline-block">
                  <h3 className="text-white mb-0">XpertBid</h3>
                </Link>
                <p className="mb-4 opacity-75">
                  Your premier destination for multi-vendor marketplace and auction platform. 
                  Discover amazing products, participate in exciting auctions, and enjoy a seamless shopping experience.
                </p>
                <div className="contact-info">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-map-marker-alt me-3 text-primary"></i>
                    <span>123 Commerce Street, Business City, BC 12345</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-phone me-3 text-primary"></i>
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-envelope me-3 text-primary"></i>
                    <span>info@xpertbid.com</span>
                  </div>
                </div>
                <div className="social-links">
                  {socialLinks.map((social, index) => (
                    <a 
                      key={index}
                      href={social.href} 
                      className="social-link me-2"
                      aria-label={social.name}
                    >
                      <i className={`${social.icon} fs-5`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Shop Links */}
            <div className="col-lg-2 col-md-6 col-6 mb-4">
              <div className="footer-widget">
                <h5 className="widget-title mb-3">Shop</h5>
                <ul className="footer-links">
                  {footerLinks.shop.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="footer-link">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Categories Links */}
            <div className="col-lg-2 col-md-6 col-6 mb-4">
              <div className="footer-widget">
                <h5 className="widget-title mb-3">Categories</h5>
                <ul className="footer-links">
                  {footerLinks.categories.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="footer-link">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Support Links */}
            <div className="col-lg-2 col-md-6 col-6 mb-4">
              <div className="footer-widget">
                <h5 className="widget-title mb-3">Support</h5>
                <ul className="footer-links">
                  {footerLinks.support.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="footer-link">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Company Links */}
            <div className="col-lg-2 col-md-6 col-6 mb-4">
              <div className="footer-widget">
                <h5 className="widget-title mb-3">Company</h5>
                <ul className="footer-links">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="footer-link">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom bg-darker py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0 opacity-75">
                © {currentYear} XpertBid. All rights reserved.
              </p>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-md-end align-items-center">
                {/* Legal Links */}
                <div className="legal-links me-4">
                  {footerLinks.legal.map((link, index) => (
                    <React.Fragment key={index}>
                      <Link href={link.href} className="legal-link me-3">
                        {link.name}
                      </Link>
                    </React.Fragment>
                  ))}
                </div>
                
                {/* Payment Methods */}
                <div className="payment-methods">
                  {paymentMethods.map((payment, index) => (
                    <span key={index} className="payment-icon me-2" title={payment.name}>
                      <i className={`${payment.icon} fs-5 opacity-75`}></i>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          margin-top: auto;
        }

        .footer-newsletter {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
        }

        .newsletter-form .input-group {
          max-width: 500px;
        }

        .newsletter-form .form-control {
          border: none;
          padding: 12px 20px;
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
        }

        .footer-main {
          background-color: var(--secondary-dark);
        }

        .footer-logo h3 {
          font-size: 24px;
          font-weight: 700;
        }

        .widget-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 8px;
        }

        .footer-link {
          color: rgba(255, 255, 255, 0.75);
          text-decoration: none;
          font-size: 14px;
          transition: var(--transition-fast);
        }

        .footer-link:hover {
          color: var(--primary-color);
        }

        .contact-info span {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.75);
        }

        .social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 50%;
          text-decoration: none;
          transition: var(--transition-fast);
        }

        .social-link:hover {
          background-color: var(--primary-color);
          color: white;
          transform: translateY(-2px);
        }

        .footer-bottom {
          background-color: #000000;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .legal-link {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-size: 12px;
          transition: var(--transition-fast);
        }

        .legal-link:hover {
          color: var(--primary-color);
        }

        .payment-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          color: white;
          transition: var(--transition-fast);
        }

        .payment-icon:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .opacity-75 {
          opacity: 0.75;
        }

        @media (max-width: 768px) {
          .footer-newsletter .row {
            text-align: center;
          }

          .newsletter-form .input-group {
            max-width: 100%;
          }

          .footer-bottom .row {
            text-align: center;
          }

          .legal-links {
            margin-bottom: 15px !important;
          }

          .payment-methods {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
