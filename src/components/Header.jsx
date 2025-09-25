'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import CurrencySwitcher from './CurrencySwitcher';

const Header = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [wishlistCount] = useState(0);

  return (
    <header className={`header ${className}`}>
      <div className="container">
        <div className="row align-items-center">
          {/* Logo */}
          <div className="col-auto">
            <Link href="/" className="logo-link">
              <Logo />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="col">
            <div className="search-container">
              <div className="search-input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products, auctions, vehicles..."
                />
                <button className="btn btn-primary">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="col-auto">
            <div className="header-actions">
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Currency Switcher */}
              <CurrencySwitcher />

              {/* Wishlist */}
              <Link href="/wishlist" className="header-action-btn">
                <i className="fas fa-heart"></i>
                {wishlistCount > 0 && (
                  <span className="badge bg-danger">{wishlistCount}</span>
                )}
              </Link>

              {/* Cart */}
              <Link href="/cart" className="header-action-btn">
                <i className="fas fa-shopping-cart"></i>
              </Link>

              {/* User Menu */}
              <div className="dropdown">
                <button className="btn btn-outline-primary dropdown-toggle">
                  <i className="fas fa-user"></i>
                </button>
                <div className="dropdown-menu">
                  <Link href="/login" className="dropdown-item">Login</Link>
                  <Link href="/register" className="dropdown-item">Register</Link>
                  <Link href="/dashboard" className="dropdown-item">Dashboard</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="col-auto d-lg-none">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <div className="row">
              <div className="col-12">
                <nav className="mobile-nav">
                  <Link href="/shop" className="nav-link">Shop</Link>
                  <Link href="/auctions" className="nav-link">Auctions</Link>
                  <Link href="/vehicles" className="nav-link">Vehicles</Link>
                  <Link href="/properties" className="nav-link">Properties</Link>
                  <Link href="/about" className="nav-link">About</Link>
                  <Link href="/contact" className="nav-link">Contact</Link>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .header {
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .logo-link {
          text-decoration: none;
        }

        .search-container {
          max-width: 500px;
          margin: 0 auto;
        }

        .search-input-group {
          display: flex;
        }

        .search-input-group input {
          border-radius: 25px 0 0 25px;
          border-right: none;
        }

        .search-input-group button {
          border-radius: 0 25px 25px 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .header-action-btn {
          position: relative;
          color: #333;
          text-decoration: none;
          padding: 8px;
          border-radius: 50%;
          transition: background-color 0.2s;
        }

        .header-action-btn:hover {
          background-color: #f8f9fa;
          color: #333;
        }

        .header-action-btn .badge {
          position: absolute;
          top: 0;
          right: 0;
          font-size: 10px;
          padding: 2px 5px;
        }

        .mobile-menu {
          border-top: 1px solid #eee;
          padding: 15px 0;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mobile-nav .nav-link {
          color: #333;
          text-decoration: none;
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .mobile-nav .nav-link:hover {
          color: #007bff;
        }

        @media (max-width: 768px) {
          .search-container {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;