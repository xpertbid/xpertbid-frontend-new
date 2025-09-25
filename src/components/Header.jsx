'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LoginModal from './LoginModal';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import CurrencySwitcher from './CurrencySwitcher';

const Header = ({ className = '' }) => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { itemCount: cartCount, openDrawer } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
 
  const navigation = [
    { name: 'Home', href: '/', hasDropdown: false },
    { name: 'Shop', href: '/shop', hasDropdown: true, children: [
      { name: 'All Products', href: '/shop' },
      { name: 'New Arrivals', href: '/shop?filter=new' },
      { name: 'Best Sellers', href: '/shop?filter=bestsellers' },
      { name: 'Sale', href: '/shop?filter=sale' },
    ]},
    { name: 'Categories', href: '/categories', hasDropdown: true, children: [
      { name: 'Electronics', href: '/categories/electronics' },
      { name: 'Fashion', href: '/categories/fashion' },
      { name: 'Home & Garden', href: '/categories/home-garden' },
      { name: 'Sports', href: '/categories/sports' },
    ]},
    { name: 'Auctions', href: '/auctions', hasDropdown: true, children: [
      { name: 'Live Auctions', href: '/auctions/live' },
      { name: 'Upcoming', href: '/auctions/upcoming' },
      { name: 'Ended', href: '/auctions/ended' },
    ]},
    { name: 'Vehicles', href: '/vehicles', hasDropdown: true, children: [
      { name: 'All Vehicles', href: '/vehicles' },
      { name: 'Cars', href: '/vehicles?type=car' },
      { name: 'Trucks', href: '/vehicles?type=truck' },
      { name: 'Motorcycles', href: '/vehicles?type=motorcycle' },
    ]},
    { name: 'Properties', href: '/properties', hasDropdown: true, children: [
      { name: 'All Properties', href: '/properties' },
      { name: 'Houses', href: '/properties?type=house' },
      { name: 'Apartments', href: '/properties?type=apartment' },
      { name: 'Commercial', href: '/properties?type=commercial' },
    ]},
    { name: 'About', href: '/about', hasDropdown: false },
    { name: 'Contact', href: '/contact', hasDropdown: false },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLoginSuccess = (userData) => {
    setShowLoginModal(false);
    // Auth state will be updated by AuthContext
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
      <header className={`header ${className}`}>
      {/* Top Bar - Woodmart Style */}
      <div className="header-top bg-primary text-white py-2" style={{fontSize: '12px', fontWeight: '500'}}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <div className="dropdown me-4">
                  <button className="btn btn-link text-white p-0 border-0" type="button" data-bs-toggle="dropdown" style={{fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                    ENGLISH
                    <i className="fas fa-chevron-down ms-1" style={{fontSize: '10px'}}></i>
                  </button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">English</a></li>
                    <li><a className="dropdown-item" href="#">Spanish</a></li>
                    <li><a className="dropdown-item" href="#">French</a></li>
                  </ul>
                </div>
                <div className="dropdown me-4">
                  <button className="btn btn-link text-white p-0 border-0" type="button" data-bs-toggle="dropdown" style={{fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                    COUNTRY
                    <i className="fas fa-chevron-down ms-1" style={{fontSize: '10px'}}></i>
                  </button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">USA</a></li>
                    <li><a className="dropdown-item" href="#">Canada</a></li>
                    <li><a className="dropdown-item" href="#">UK</a></li>
                  </ul>
                </div>
                <span style={{fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                  FREE SHIPPING FOR ALL ORDERS OF $150
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-end align-items-center">
                <div className="d-flex align-items-center me-3">
                  <a href="#" className="text-white me-3" style={{fontSize: '14px'}}>
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="text-white me-3" style={{fontSize: '14px'}}>
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="text-white me-3" style={{fontSize: '14px'}}>
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="text-white me-3" style={{fontSize: '14px'}}>
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
                <a href="#" className="text-white" style={{fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                  NEWSLETTER
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main bg-light border-bottom">
        <div className="container">
          <div className="row align-items-center py-3">
            {/* Logo - WoodMart Style */}
            <div className="col-lg-2 col-md-3 col-6">
              <Link href="/" className="logo">
                <h2 className="text-primary mb-0 fw-bold" style={{
                  fontFamily: 'Poppins, sans-serif', 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  letterSpacing: '-0.02em',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  color: 'var(--primary-color)'
                }}>WoodMart</h2>
              </Link>
            </div>

            {/* Search Bar - Woodmart Style */}
            <div className="col-lg-6 col-md-5 d-none d-md-block">
              <form onSubmit={handleSearch} className="search-form">
                <div className="input-group" style={{borderRadius: '2px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                  <div className="dropdown">
                    <button 
                      className="btn btn-outline-secondary dropdown-toggle" 
                      type="button" 
                      data-bs-toggle="dropdown"
                      style={{borderRadius: '0', borderRight: 'none', fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '14px 16px', backgroundColor: '#f8f9fa', borderColor: '#606060', WebkitFontSmoothing: 'antialiased'}}
                    >
                      All Categories
                    </button>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#">All Categories</a></li>
                      <li><a className="dropdown-item" href="#">Electronics</a></li>
                      <li><a className="dropdown-item" href="#">Fashion</a></li>
                      <li><a className="dropdown-item" href="#">Home & Garden</a></li>
                      <li><a className="dropdown-item" href="#">Sports</a></li>
                    </ul>
                  </div>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{borderRadius: '0', borderLeft: 'none', borderRight: 'none', fontFamily: 'Inter, sans-serif', fontSize: '14px', padding: '14px 16px', borderColor: '#606060', WebkitFontSmoothing: 'antialiased'}}
                  />
                  <button className="btn btn-primary" type="submit" style={{borderRadius: '0', fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: '500', padding: '14px 20px', textTransform: 'uppercase', letterSpacing: '0.5px', WebkitFontSmoothing: 'antialiased'}}>
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </form>
            </div>

            {/* Header Actions - Woodmart Style */}
            <div className="col-lg-4 col-md-4 col-6">
              <div className="d-flex justify-content-end align-items-center">
                {/* Mobile Search */}
                <button 
                  className="btn btn-link d-md-none me-3"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  style={{color: '#000', fontSize: '18px'}}
                >
                  <i className="fas fa-search"></i>
                </button>

                {/* User Account - Woodmart Style */}
                <div className="me-4 d-flex align-items-center">
                  {isAuthenticated ? (
                    <div className="dropdown">
                      <button className="btn btn-link p-0 border-0 d-flex align-items-center" type="button" data-bs-toggle="dropdown" style={{color: '#000', fontSize: '14px', fontFamily: 'Poppins, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                        <i className="fas fa-user me-2" style={{fontSize: '16px'}}></i>
                        {user?.name || 'Account'}
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li><Link className="dropdown-item" href="/profile">My Profile</Link></li>
                        <li><Link className="dropdown-item" href="/account">My Account</Link></li>
                        <li><Link className="dropdown-item" href="/orders">My Orders</Link></li>
                        <li><Link className="dropdown-item" href="/wishlist">Wishlist</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><button className="dropdown-item" onClick={handleLogout}>Sign Out</button></li>
                      </ul>
                    </div>
                  ) : (
                    <div className="dropdown">
                      <button 
                        className="btn btn-link p-0 border-0 d-flex align-items-center" 
                        type="button" 
                        data-bs-toggle="dropdown"
                        style={{color: '#000', fontSize: '14px', fontFamily: 'Poppins, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px'}}
                      >
                        <i className="fas fa-user me-2" style={{fontSize: '16px'}}></i>
                        Login / Register
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li><button className="dropdown-item" onClick={handleLogin}>Login / Register</button></li>
                        <li><Link className="dropdown-item" href="/profile">My Profile</Link></li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Wishlist */}
                <Link href="/wishlist" className="btn btn-link p-2 position-relative me-4 border-0" style={{color: '#000', fontSize: '18px'}}>
                  <i className="fas fa-heart"></i>
                  {wishlistCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '10px', minWidth: '16px', height: '16px'}}>
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Shopping Cart */}
                <button 
                  onClick={openDrawer}
                  className="btn btn-link p-2 position-relative me-3 border-0" 
                  style={{color: '#000', fontSize: '18px'}}
                >
                  <i className="fas fa-shopping-cart"></i>
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" style={{fontSize: '10px', minWidth: '16px', height: '16px'}}>
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Mobile Menu Toggle */}
                <button 
                  className="btn btn-link d-lg-none p-2 border-0"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  style={{color: '#000', fontSize: '18px'}}
                >
                  <i className="fas fa-bars"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {isSearchOpen && (
        <div className="mobile-search bg-light p-3 d-md-none">
          <div className="container">
            <form onSubmit={handleSearch}>
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Navigation - Woodmart Style */}
      <nav className="header-nav bg-primary">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="d-flex align-items-center">
                {/* All Categories Dropdown */}
                <div className="dropdown me-4">
                  <button 
                    className="btn btn-dark dropdown-toggle px-4 py-3" 
                    type="button" 
                    data-bs-toggle="dropdown"
                    style={{fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px', borderRadius: '2px', WebkitFontSmoothing: 'antialiased'}}
                  >
                    <i className="fas fa-bars me-2" style={{fontSize: '14px'}}></i>
                    All Categories
                  </button>
                  <ul className="dropdown-menu dropdown-menu-start">
                    <li><Link className="dropdown-item" href="/categories/electronics">Electronics</Link></li>
                    <li><Link className="dropdown-item" href="/categories/fashion">Fashion</Link></li>
                    <li><Link className="dropdown-item" href="/categories/home-garden">Home & Garden</Link></li>
                    <li><Link className="dropdown-item" href="/categories/sports">Sports</Link></li>
                    <li><Link className="dropdown-item" href="/categories/books">Books</Link></li>
                    <li><Link className="dropdown-item" href="/categories/automotive">Automotive</Link></li>
                  </ul>
                </div>

                {/* Main Navigation */}
                <div className={`navbar-nav flex-row ${isMenuOpen ? 'show' : 'd-none d-lg-flex'}`}>
                  {navigation.map((item, index) => (
                    <div key={index} className="nav-item dropdown">
                      <Link 
                        className="nav-link text-white px-3 py-3" 
                        href={item.href}
                        data-bs-toggle={item.hasDropdown ? 'dropdown' : undefined}
                        style={{fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px', WebkitFontSmoothing: 'antialiased'}}
                      >
                        {item.name}
                        {item.hasDropdown && <i className="fas fa-chevron-down ms-1" style={{fontSize: '11px'}}></i>}
                      </Link>
                      {item.hasDropdown && item.children && (
                        <ul className="dropdown-menu">
                          {item.children.map((child, childIndex) => (
                            <li key={childIndex}>
                              <Link className="dropdown-item" href={child.href}>
                                {child.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .header-top {
          font-size: 14px;
        }

        .header-top .btn-link {
          color: white;
          text-decoration: none;
          font-size: 14px;
        }

        .header-top .btn-link:hover {
          color: var(--primary-light);
        }

        .logo h2 {
          font-size: 28px;
          font-weight: 700;
        }

        .search-form .input-group {
          border-radius: 25px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .search-form .form-control {
          border: none;
          padding: 12px 20px;
        }

        .search-form .form-control:focus {
          box-shadow: none;
        }

        .search-form .btn {
          border-radius: 0 25px 25px 0;
          padding: 12px 20px;
        }

        .header-actions .btn-link {
          color: var(--secondary-color);
          text-decoration: none;
          position: relative;
        }

        .header-actions .btn-link:hover {
          color: var(--primary-color);
        }

        .header-nav .nav-link {
          color: white !important;
          font-weight: 500;
          text-decoration: none;
          transition: var(--transition-fast);
        }

        .header-nav .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .header-nav .dropdown-menu {
          border: none;
          box-shadow: var(--shadow-lg);
          border-radius: var(--border-radius-lg);
        }

        .mobile-search {
          border-bottom: 1px solid #606060;
        }

        .badge {
          font-size: 10px;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 991px) {
          .header-nav .navbar-nav {
            flex-direction: column;
            background-color: var(--primary-color);
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            box-shadow: var(--shadow-lg);
          }

          .header-nav .navbar-nav.show {
            display: flex !important;
          }

          .header-nav .nav-item {
                width: 100%;
          }

          .header-nav .nav-link {
            padding: 15px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
        }
      `}</style>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleCloseLoginModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </header>
  );
};

export default Header;