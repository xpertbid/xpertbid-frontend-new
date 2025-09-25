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
  const [activeMenu, setActiveMenu] = useState(null);

  const mainCategories = [
    { name: 'Home', href: '/', hasDropdown: false },
    { name: 'Shop', href: '/shop', hasDropdown: true },
    { name: 'Categories', href: '/categories', hasDropdown: true },
    { name: 'Sale', href: '/sale', hasDropdown: false },
    { name: 'Blog', href: '/blog', hasDropdown: false },
    { name: 'Pages', href: '#', hasDropdown: true },
    { name: 'Contact', href: '/contact', hasDropdown: false }
  ];

  const shopDropdown = [
    { name: 'All Products', href: '/shop' },
    { name: 'Living Room', href: '/shop?category=living-room' },
    { name: 'Bedroom', href: '/shop?category=bedroom' },
    { name: 'Kitchen', href: '/shop?category=kitchen' },
    { name: 'Office', href: '/shop?category=office' },
    { name: 'Outdoor', href: '/shop?category=outdoor' }
  ];

  const categoriesDropdown = [
    { name: 'Furniture', href: '/shop?category=furniture' },
    { name: 'Lighting', href: '/shop?category=lighting' },
    { name: 'Decor', href: '/shop?category=decor' },
    { name: 'Storage', href: '/shop?category=storage' }
  ];

  const pagesDropdown = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Terms', href: '/terms' },
    { name: 'Privacy', href: '/privacy' }
  ];

  return (
    <header className={`header ${className}`}>
        {/* Header Top Bar */}
        <div className="header-top">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="header-top-left d-flex align-items-center">
                    <div className="header-top-dropdowns">
                    <select className="form-select me-3">
                      <option>ENGLISH</option>
                      <option>FRANÇAIS</option>
                      <option>DEUTSCH</option>
                    </select>
                    </div>
                    <div className="header-top-dropdowns">
                    <select className="form-select me-3">
                      <option>COUNTRY</option>
                      <option>USA</option>
                      <option>CANADA</option>
                      <option>UK</option>
                    </select>
                  </div>
                  <span className="welcome-text">
                    <i className="fas fa-truck me-2"></i>
                    FREE SHIPPING FOR ALL ORDERS OF $150
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="header-top-right d-flex justify-content-end align-items-center">
                  <div className="header-top-social">
                    <a href="#" className="social-link me-2"><i className="fab fa-facebook-f"></i></a>
                    <a href="#" className="social-link me-2"><i className="fab fa-twitter"></i></a>
                    <a href="#" className="social-link me-2"><i className="fab fa-instagram"></i></a>
                    <a href="#" className="social-link me-2"><i className="fab fa-youtube"></i></a>
                  </div>
                  <div className="header-top-links">
                    <Link href="/newsletter">NEWSLETTER</Link>
                    <Link href="/contact">CONTACT US</Link>
                    <Link href="/faqs">FAQS</Link>
                  </div>
                
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Header Main */}
      <div className="header-main">
        <div className="container">
          <div className="row align-items-center">
            {/* Logo */}
            <div className="col-lg-3 col-md-4 col-6">
              <div className="logo-section">
                <Link href="/" className="logo-link">
                  <span className="logo-text">woodmart.</span>
                  <i className="fas fa-caret-up logo-icon"></i>
                </Link>
              </div>
            </div>

            {/* Search Bar */}
            <div className="col-lg-6 col-md-8 col-6 d-none d-md-block">
              <div className="search-form">
                <form className="d-flex w-100 " style={{border: '2px solid #e5e7eb'}}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search for products"
                      aria-label="Search"
                    />
                    <button className="btn search-btn" type="submit">
                      <i className="fas fa-search"></i>
                    </button>
                    <select className="form-select search-category">
                      <option value="">SELECT CATEGORY</option>
                      <option value="furniture">Furniture</option>
                      <option value="cooking">Cooking</option>
                      <option value="accessories">Accessories</option>
                      <option value="fashion">Fashion</option>
                      <option value="lighting">Lighting</option>
                    </select>
                  </div>
                </form>
              </div>
            </div>

            {/* Header Actions */}
            <div className="col-lg-3 col-md-12">
              <div className="header-actions d-flex justify-content-end align-items-center">
                <Link href="/account" className="header-action-item">
                  <span className="action-label">MY ACCOUNT</span>
                </Link>
                <Link href="/wishlist" className="header-action-item">
                  <i className="fas fa-heart"></i>
                  <span className="badge">0</span>
                </Link>
                <Link href="/cart" className="header-action-item">
                  <i className="fas fa-shopping-bag"></i>
                  <span className="badge">1</span>
                  <span className="cart-price">$599.00</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <button
            className="navbar-toggler d-md-none"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
            <div className="navbar-nav d-flex align-items-center w-100" style={{ minHeight: '60px' }}>
              <button className="btn btn-primary browse-categories-btn me-4">
                <i className="fas fa-bars me-2"></i>
                BROWSE CATEGORIES
                <i className="fas fa-chevron-down ms-2"></i>
              </button>
              <ul className="navbar-nav d-flex align-items-center mx-auto">
                <li className="nav-item dropdown" onMouseEnter={() => setActiveMenu('home')} onMouseLeave={() => setActiveMenu(null)}>
                  <Link href="/" className="nav-link dropdown-toggle">
                    HOME
                    <i className="fas fa-chevron-down ms-1" style={{ fontSize: '10px' }}></i>
                  </Link>
                </li>
                <li className="nav-item dropdown" onMouseEnter={() => setActiveMenu('products')} onMouseLeave={() => setActiveMenu(null)}>
                  <Link href="/shop" className="nav-link dropdown-toggle">
                    PRODUCTS
                    <i className="fas fa-chevron-down ms-1" style={{ fontSize: '10px' }}></i>
                  </Link>
                  <ul className={`dropdown-menu ${activeMenu === 'products' ? 'show' : ''}`}>
                    <li><Link href="/shop" className="dropdown-item">All Products</Link></li>
                  </ul>
                </li>
                <li className="nav-item dropdown" onMouseEnter={() => setActiveMenu('categories')} onMouseLeave={() => setActiveMenu(null)}>
                  <Link href="/categories" className="nav-link dropdown-toggle">
                    CATEGORIES
                    <i className="fas fa-chevron-down ms-1" style={{ fontSize: '10px' }}></i>
                  </Link>
                  <ul className={`dropdown-menu ${activeMenu === 'categories' ? 'show' : ''}`}>
                    <li><Link href="/categories" className="dropdown-item">All Categories</Link></li>
                  </ul>
                </li>
                <li className="nav-item dropdown" onMouseEnter={() => setActiveMenu('properties')} onMouseLeave={() => setActiveMenu(null)}>
                  <Link href="/properties" className="nav-link dropdown-toggle">
                    PROPERTIES
                    <i className="fas fa-chevron-down ms-1" style={{ fontSize: '10px' }}></i>
                  </Link>
                  <ul className={`dropdown-menu ${activeMenu === 'properties' ? 'show' : ''}`}>
                    <li><Link href="/properties" className="dropdown-item">All Properties</Link></li>
                  </ul>
                </li>
                <li className="nav-item dropdown" onMouseEnter={() => setActiveMenu('vehicles')} onMouseLeave={() => setActiveMenu(null)}>
                  <Link href="/vehicles" className="nav-link dropdown-toggle">
                    VEHICLES
                    <i className="fas fa-chevron-down ms-1" style={{ fontSize: '10px' }}></i>
                  </Link>
                  <ul className={`dropdown-menu ${activeMenu === 'vehicles' ? 'show' : ''}`}>
                    <li><Link href="/vehicles" className="dropdown-item">All Vehicles</Link></li>
                  </ul>
                </li>
                <li className="nav-item dropdown" onMouseEnter={() => setActiveMenu('auction')} onMouseLeave={() => setActiveMenu(null)}>
                  <Link href="/auctions" className="nav-link dropdown-toggle">
                    AUCTION
                    <i className="fas fa-chevron-down ms-1" style={{ fontSize: '10px' }}></i>
                  </Link>
                  <ul className={`dropdown-menu ${activeMenu === 'auction' ? 'show' : ''}`}>
                    <li><Link href="/auctions" className="dropdown-item">All Auctions</Link></li>
                  </ul>
                </li>
                <li className="nav-item dropdown" onMouseEnter={() => setActiveMenu('blog')} onMouseLeave={() => setActiveMenu(null)}>
                  <Link href="/blog" className="nav-link dropdown-toggle">
                    BLOG
                    <i className="fas fa-chevron-down ms-1" style={{ fontSize: '10px' }}></i>
                  </Link>
                  <ul className={`dropdown-menu ${activeMenu === 'blog' ? 'show' : ''}`}>
                    <li><Link href="/blog" className="dropdown-item">All Blogs</Link></li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link href="/about" className="nav-link">ABOUT</Link>
                </li>
                <li className="nav-item">
                  <Link href="/contact" className="nav-link">CONTACT US</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .header {
          background-color: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1030;
        }

        .header-top {
          background-color: #83B735 !important;
          border-bottom: none;
          padding: 8px 0;
          font-size: 12px;
          min-height: 40px;
          display: flex;
          align-items: center;
        }

        .header-top-left .welcome-text {
          color: #ffffff !important;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .header-top-right {
          gap: 15px;
        }

        .header-top-dropdowns .form-select {
          background-color: transparent;
          color: #ffffff;
          font-size: 11px;
          padding: 4px 8px;
          min-width: 80px;
          border: none;
        }
          .header-top-dropdowns option {
          background-color: #ffffff;
          color: #1A1A1A !important;
        }

        .header-top-dropdowns .form-select:focus {
          box-shadow: none;
        }

        .header-top-social .social-link {
          color: #ffffff;
          font-size: 12px;
          transition: opacity 0.3s ease;
        }

        .header-top-social .social-link:hover {
          opacity: 0.7;
        }

        .header-top-links {
          display: flex;
          gap: 15px;
        }

        .header-top-links a {
          color: #ffffff !important;
          text-decoration: none;
          font-weight: 600;
          transition: opacity 0.3s ease;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .header-top-links a:hover {
          opacity: 0.8;
        }

        .header-main {
          padding: 20px 0;
          min-height: 80px;
          display: flex;
          align-items: center;
        }

        .logo-section .logo-link {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .logo-text {
          font-family: 'Poppins', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #1A1A1A;
          text-transform: lowercase;
        }

        .logo-icon {
          font-size: 12px;
          color: #1A1A1A;
          margin-top: -5px;
        }

        .search-form {
          height: 100%;
          display: flex;
          align-items: center;
        }

        .search-form .input-group {
          border-radius: 0;
          overflow: hidden;
          box-shadow: none;
          border: 1px solid #e5e7eb;
          display: flex;
          height: 45px;
        }

        .search-form .form-control {
          border: none;
          padding: 12px 16px;
          font-size: 14px;
          border-radius: 0;
          order: 1;
          flex: 1;
        }

        .search-form .form-control:focus {
          box-shadow: none;
          border-color: transparent;
        }

        .search-category {
          border: none;
          border-left: 1px solid #e5e7eb;
          padding: 12px 16px;
          font-size: 12px;
          background-color: #f9fafb;
          color: #374151;
          min-width: 150px;
          order: 2;
        }

        .search-btn {
          border: none !important;
          background-color: #83B735 !important;
          padding: 0px 16px;
          color: white !important;
          border-radius: 0;
          font-weight: 500;
          order: 3;
        }

        .search-btn:hover {
          background-color: #83B735 !important;
          color: white !important;
        }

        .header-actions {
          gap: 25px;
        }

        .header-action-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          color: #374151;
          transition: color 0.15s ease;
          position: relative;
          padding: 8px 12px;
          border-radius: 6px;
        }

        .header-action-item:hover {
          color: #83B735 !important;
          background-color: rgba(131, 183, 53, 0.1);
        }

        .header-action-item i {
          font-size: 18px;
          margin-bottom: 4px;
          color: #83B735;
        }

        .action-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #374151;
        }

        .header-action-item .badge {
          position: absolute;
          top: 0;
          right: 0;
          background-color: #83B735;
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-price {
          font-size: 12px;
          font-weight: 600;
          color: #83B735;
          margin-top: 2px;
        }

        .navbar {
          background-color: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          padding: 0;
          min-height: 60px;
          display: flex;
          align-items: center;
        }

        .browse-categories-btn {
          background-color: #83B735 !important;
          border-color: #83B735 !important;
          color: white !important;
          padding: 20px 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: 0;
          display: flex;
          align-items: center;
          height: 60px;
        }

        .browse-categories-btn:hover {
          background-color: #6B9B2A !important;
          border-color: #6B9B2A !important;
        }

        .nav-link {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 12px;
          color: #374151 !important;
          padding: 20px 15px;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.15s ease;
          border-radius: 0;
          position: relative;
          display: flex;
          align-items: center;
        }

        .nav-link:hover {
          color: #83B735 !important;
          background-color: rgba(131, 183, 53, 0.1);
        }

        .dropdown-menu {
          border: none;
          border-radius: 8px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          padding: 8px 0;
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          min-width: 180px;
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s ease;
        }

        .dropdown-menu.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-item {
          font-size: 12px;
          color: #374151;
          padding: 10px 20px;
          transition: all 0.15s ease;
          text-transform: none;
          letter-spacing: normal;
          font-weight: 500;
        }

        .dropdown-item:hover {
          background-color: #83B735;
          color: white;
        }

        .nav-item.dropdown {
          position: relative;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background-color: #83B735;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .nav-link:hover::after {
          width: 80%;
        }

        .dropdown-menu {
          border: none;
          border-radius: 8px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          padding: 8px 0;
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
          min-width: 200px;
        }

        .dropdown-item {
          font-size: 14px;
          color: #374151;
          padding: 12px 20px;
          transition: all 0.15s ease;
          text-transform: none;
          letter-spacing: normal;
        }

        .dropdown-item:hover {
          background-color: #83B735;
          color: white;
        }

        .navbar-toggler {
          border: none;
          padding: 4px 8px;
        }

        .navbar-toggler:focus {
          box-shadow: none;
        }

        .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%2833, 37, 41, 0.75%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='m4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }

        /* Additional Woodmart Styling Overrides */
        .header {
          background-color: #ffffff !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header-main {
          background-color: #ffffff !important;
          padding: 16px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .navbar {
          background-color: #ffffff !important;
          border-bottom: 1px solid #e5e7eb;
          padding: 0;
        }

        /* Ensure proper spacing and alignment */
        .container {
          max-width: 1300px;
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .header-top {
            display: none;
          }

          .header-main {
            padding: 12px 0;
          }

          .header-actions {
            gap: 12px;
          }

          .header-action-item {
            padding: 6px 8px;
          }

          .header-action-item i {
            font-size: 18px;
          }

          .action-label {
            font-size: 10px;
          }

          .search-form {
            margin-top: 12px;
          }

          .navbar-nav {
            flex-direction: column;
            gap: 0;
          }

          .nav-link {
            padding: 12px 16px;
            border-bottom: 1px solid #f3f4f6;
          }

          .dropdown-menu {
            position: static;
            box-shadow: none;
            border: none;
            border-radius: 0;
            background-color: #f9fafb;
          }

          .dropdown-item {
            padding: 10px 32px;
            font-size: 13px;
          }
        }

        @media (max-width: 480px) {
          .header-main .container {
            padding: 0 12px;
          }

          .header-actions {
            gap: 8px;
          }

          .header-action-item {
            padding: 4px 6px;
          }

          .header-action-item i {
            font-size: 16px;
          }

          .action-label {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;