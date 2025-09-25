'use client';

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

const Footer = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'All Products', href: '/shop' },
      { name: 'Electronics', href: '/categories/electronics' },
      { name: 'Fashion', href: '/categories/fashion' },
      { name: 'Sports & Outdoors', href: '/categories/sports' }
    ],
    auctions: [
      { name: 'Live Auctions', href: '/auctions/live' },
      { name: 'Upcoming Auctions', href: '/auctions/upcoming' },
      { name: 'Ended Auctions', href: '/auctions/ended' },
      { name: 'How to Bid', href: '/help/bidding' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' }
    ]
  };

  return (
    <footer className={`woodmart-footer ${className}`}>
      {/* Footer Top */}
      <div className="footer-top">
        <div className="container">
          <div className="row g-4">
            {/* Company Info */}
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget">
                <Logo showText={true} className="mb-4" />
                <p className="footer-description">
                  XpertBid is your premier destination for auctions, vehicles, properties, and quality products. 
                  Discover amazing deals, participate in live auctions, and find your perfect match with style.
                </p>
                <div className="footer-social">
                  <h5 className="social-title">Follow Us</h5>
                  <div className="social-links">
                    <a href="#" className="social-link" aria-label="Facebook">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="social-link" aria-label="Twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="social-link" aria-label="Instagram">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="social-link" aria-label="LinkedIn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" className="social-link" aria-label="YouTube">
                      <i className="fab fa-youtube"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Shop Links */}
            <div className="col-lg-2 col-md-6 col-sm-6">
              <div className="footer-widget">
                <h5 className="widget-title">Shop</h5>
                <ul className="footer-links">
                  {footerLinks.shop.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Auctions Links */}
            <div className="col-lg-2 col-md-6 col-sm-6">
              <div className="footer-widget">
                <h5 className="widget-title">Auctions</h5>
                <ul className="footer-links">
                  {footerLinks.auctions.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Support & Company */}
            <div className="col-lg-2 col-md-6 col-sm-6">
              <div className="footer-widget">
                <h5 className="widget-title">Support</h5>
                <ul className="footer-links">
                  {footerLinks.support.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Company */}
            <div className="col-lg-2 col-md-6 col-sm-6">
              <div className="footer-widget">
                <h5 className="widget-title">Company</h5>
                <ul className="footer-links">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Middle */}
      <div className="footer-middle">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12">
              <div className="footer-newsletter">
                <h5 className="newsletter-title">Stay Updated</h5>
                <p className="newsletter-text">Subscribe to get updates on new products, auctions, and exclusive deals</p>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <form className="newsletter-form">
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    required
                  />
                  <button className="btn btn-primary" type="submit">
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12">
              <div className="footer-copyright">
                <p>&copy; {currentYear} XpertBid. All rights reserved.</p>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="footer-legal">
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Service</Link>
                <Link href="/cookies">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .woodmart-footer {
          background-color: #000000;
          color: #ffffff;
          margin-top: 80px;
        }

        .footer-top {
          padding: 80px 0 40px;
          border-bottom: 1px solid #333333;
        }

        .footer-widget {
          margin-bottom: 40px;
        }

        .footer-description {
          font-size: 16px;
          line-height: 1.6;
          color: #cccccc;
          margin-bottom: 30px;
        }

        .widget-title {
          font-family: 'Poppins', sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: #cccccc;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s ease;
          display: block;
          padding: 4px 0;
        }

        .footer-links a:hover {
          color: #83B735;
        }

        .footer-social {
          margin-top: 30px;
        }

        .social-title {
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .social-links {
          display: flex;
          gap: 12px;
        }

        .social-link {
          width: 40px;
          height: 40px;
          background: #333333;
          color: #ffffff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: #83B735;
          color: #ffffff;
          transform: translateY(-2px);
        }

        .footer-middle {
          padding: 40px 0;
          border-bottom: 1px solid #333333;
          background: #111111;
        }

        .footer-newsletter {
          margin-bottom: 20px;
        }

        .newsletter-title {
          font-family: 'Poppins', sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .newsletter-text {
          font-size: 14px;
          color: #cccccc;
          margin: 0;
        }

        .newsletter-form .input-group {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .newsletter-form .form-control {
          border: none;
          background: #ffffff;
          padding: 12px 16px;
          font-size: 14px;
          color: #374151;
        }

        .newsletter-form .form-control:focus {
          box-shadow: none;
          border-color: transparent;
        }

        .newsletter-form .form-control::placeholder {
          color: #9ca3af;
        }

        .newsletter-form .btn {
          background: #83B735;
          border: none;
          padding: 12px 24px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 14px;
        }

        .newsletter-form .btn:hover {
          background: #6B9B2A;
        }

        .footer-bottom {
          padding: 30px 0;
          background: #000000;
        }

        .footer-copyright p {
          font-size: 14px;
          color: #cccccc;
          margin: 0;
        }

        .footer-legal {
          display: flex;
          gap: 24px;
          justify-content: flex-end;
        }

        .footer-legal a {
          color: #cccccc;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s ease;
        }

        .footer-legal a:hover {
          color: #83B735;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .footer-top {
            padding: 60px 0 30px;
          }

          .footer-newsletter {
            margin-bottom: 30px;
          }
        }

        @media (max-width: 768px) {
          .woodmart-footer {
            margin-top: 60px;
          }

          .footer-top {
            padding: 40px 0 20px;
          }

          .footer-middle {
            padding: 30px 0;
          }

          .footer-bottom {
            padding: 20px 0;
          }

          .footer-legal {
            justify-content: flex-start;
            margin-top: 16px;
            gap: 16px;
          }

          .social-links {
            justify-content: center;
          }

          .newsletter-form {
            margin-top: 20px;
          }
        }

        @media (max-width: 480px) {
          .footer-legal {
            flex-direction: column;
            gap: 8px;
          }

          .footer-legal a {
            font-size: 13px;
          }

          .social-links {
            gap: 8px;
          }

          .social-link {
            width: 36px;
            height: 36px;
          }

          .widget-title {
            font-size: 16px;
          }

          .footer-description {
            font-size: 14px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;