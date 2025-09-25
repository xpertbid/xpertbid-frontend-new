'use client';

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

const Footer = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'All Products', href: '/shop' },
      { name: 'Categories', href: '/categories' },
      { name: 'Featured', href: '/shop?featured=true' },
      { name: 'New Arrivals', href: '/shop?new=true' }
    ],
    auctions: [
      { name: 'Live Auctions', href: '/auctions' },
      { name: 'Ending Soon', href: '/auctions?ending=true' },
      { name: 'My Bids', href: '/bids' },
      { name: 'Create Auction', href: '/auctions/create' }
    ],
    vehicles: [
      { name: 'All Vehicles', href: '/vehicles' },
      { name: 'Cars', href: '/vehicles?type=car' },
      { name: 'Motorcycles', href: '/vehicles?type=motorcycle' },
      { name: 'Trucks', href: '/vehicles?type=truck' }
    ],
    properties: [
      { name: 'All Properties', href: '/properties' },
      { name: 'Houses', href: '/properties?type=house' },
      { name: 'Apartments', href: '/properties?type=apartment' },
      { name: 'Commercial', href: '/properties?type=commercial' }
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
    <footer className={`footer ${className}`}>
      <div className="container">
        {/* Main Footer Content */}
        <div className="footer-main">
          <div className="row">
            {/* Company Info */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="footer-brand">
                <Logo />
                <p className="footer-description">
                  Your premier destination for e-commerce, auctions, vehicles, and properties. 
                  Discover amazing deals and connect with sellers worldwide.
                </p>
                <div className="social-links">
                  <a href="#" className="social-link">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Shop Links */}
            <div className="col-lg-2 col-md-6 col-sm-6 mb-4">
              <h6 className="footer-title">Shop</h6>
              <ul className="footer-links">
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Auctions Links */}
            <div className="col-lg-2 col-md-6 col-sm-6 mb-4">
              <h6 className="footer-title">Auctions</h6>
              <ul className="footer-links">
                {footerLinks.auctions.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vehicles & Properties */}
            <div className="col-lg-2 col-md-6 col-sm-6 mb-4">
              <h6 className="footer-title">Vehicles</h6>
              <ul className="footer-links">
                {footerLinks.vehicles.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Company */}
            <div className="col-lg-2 col-md-6 col-sm-6 mb-4">
              <h6 className="footer-title">Support</h6>
              <ul className="footer-links">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="copyright">
                © {currentYear} XpertBid. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="footer-bottom-links">
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Service</Link>
                <Link href="/cookies">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: #2c3e50;
          color: white;
          padding: 40px 0 20px;
          margin-top: 60px;
        }

        .footer-brand {
          margin-bottom: 20px;
        }

        .footer-description {
          color: #bdc3c7;
          margin: 15px 0;
          line-height: 1.6;
        }

        .social-links {
          display: flex;
          gap: 15px;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: #34495e;
          color: white;
          border-radius: 50%;
          text-decoration: none;
          transition: background-color 0.3s;
        }

        .social-link:hover {
          background: #3498db;
          color: white;
        }

        .footer-title {
          color: white;
          font-weight: 600;
          margin-bottom: 20px;
          font-size: 16px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 8px;
        }

        .footer-links a {
          color: #bdc3c7;
          text-decoration: none;
          transition: color 0.3s;
        }

        .footer-links a:hover {
          color: white;
        }

        .footer-bottom {
          border-top: 1px solid #34495e;
          padding-top: 20px;
          margin-top: 30px;
        }

        .copyright {
          color: #bdc3c7;
          margin: 0;
        }

        .footer-bottom-links {
          display: flex;
          gap: 20px;
          justify-content: flex-end;
        }

        .footer-bottom-links a {
          color: #bdc3c7;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s;
        }

        .footer-bottom-links a:hover {
          color: white;
        }

        @media (max-width: 768px) {
          .footer-bottom-links {
            justify-content: flex-start;
            margin-top: 15px;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;