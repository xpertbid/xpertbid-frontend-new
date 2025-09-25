'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { apiService } from '@/services/api';
import PriceDisplay from '@/components/PriceDisplay';

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [auctionsPerPage] = useState(12);

  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    categories: [],
    status: [],
    timeLeft: '',
    sortBy: 'ending-soon',
    viewMode: 'grid'
  });

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAuctions();
      
      if (response.success && response.data) {
        setAuctions(response.data);
        setFilteredAuctions(response.data);
      } else {
        // Fallback to mock data if API fails
        console.warn('API failed, using mock data:', response.error);
        const mockAuctions = [
          {
            id: 1,
            product_name: 'Vintage Rolex Watch',
            slug: 'vintage-rolex-watch',
            current_bid: 2500,
            reserve_price: 3000,
            product_image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
            end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            seller_name: 'John Smith',
            category: 'Watches',
            description: 'Beautiful vintage Rolex watch in excellent condition.',
            status: 'active',
            bid_count: 15,
            location: 'New York, NY',
            starting_bid: 1000,
            is_featured: true
          },
          {
            id: 2,
            product_name: 'Abstract Oil Painting',
            slug: 'abstract-oil-painting',
            current_bid: 850,
            reserve_price: 1200,
            product_image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
            end_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            seller_name: 'Art Gallery NYC',
            category: 'Art',
            description: 'Original abstract oil painting by emerging artist.',
            status: 'active',
            bid_count: 8,
            location: 'Los Angeles, CA',
            starting_bid: 500,
            is_featured: false
          },
          {
            id: 3,
            product_name: 'Antique Mahogany Desk',
            slug: 'antique-mahogany-desk',
            current_bid: 1200,
            reserve_price: 1500,
            product_image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
            end_time: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
            seller_name: 'Antique Dealer',
            category: 'Furniture',
            description: 'Rare 19th century mahogany writing desk.',
            status: 'active',
            bid_count: 22,
            location: 'Boston, MA',
            starting_bid: 800,
            is_featured: true
          },
          {
            id: 4,
            product_name: 'Diamond Tennis Bracelet',
            slug: 'diamond-tennis-bracelet',
            current_bid: 3200,
            reserve_price: 4000,
            product_image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
            end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            seller_name: 'Luxury Jewelers',
            category: 'Jewelry',
            description: '14k white gold tennis bracelet with diamonds.',
            status: 'active',
            bid_count: 12,
            location: 'Miami, FL',
            starting_bid: 2000,
            is_featured: false
          },
          {
            id: 5,
            product_name: 'Rare Baseball Card Collection',
            slug: 'rare-baseball-card-collection',
            current_bid: 750,
            reserve_price: 1000,
            product_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
            end_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
            seller_name: 'Sports Memorabilia',
            category: 'Collectibles',
            description: 'Collection of vintage baseball cards from the 1960s.',
            status: 'active',
            bid_count: 18,
            location: 'Chicago, IL',
            starting_bid: 300,
            is_featured: true
          },
          {
            id: 6,
            product_name: 'Professional Camera Lens',
            slug: 'professional-camera-lens',
            current_bid: 450,
            reserve_price: 600,
            product_image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
            end_time: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
            seller_name: 'Camera Shop',
            category: 'Electronics',
            description: 'Canon 70-200mm f/2.8L professional lens.',
            status: 'active',
            bid_count: 7,
            location: 'San Francisco, CA',
            starting_bid: 200,
            is_featured: false
          }
        ];
        
        setAuctions(mockAuctions);
        setFilteredAuctions(mockAuctions);
      }
    } catch (err) {
      setError('Error loading auctions');
      console.error('Error fetching auctions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get filter options from actual auction data
  const getFilterOptions = () => {
    const allCategories = new Set();
    const allStatuses = new Set();
    
    auctions.forEach(auction => {
      if (auction.category) allCategories.add(auction.category);
      if (auction.status) allStatuses.add(auction.status);
    });

    return {
      categories: Array.from(allCategories).sort(),
      statuses: Array.from(allStatuses).sort()
    };
  };

  const filterOptions = getFilterOptions();

  // Helper function to calculate time left
  const getTimeLeft = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Helper function to safely get auction image
  const getAuctionImage = (auction) => {
    const fallbackImage = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=center';
    
    if (!auction.product_image) {
      return fallbackImage;
    }

    // If it's already a valid URL string, return it
    if (typeof auction.product_image === 'string') {
      try {
        new URL(auction.product_image);
        return auction.product_image;
      } catch {
        return fallbackImage;
      }
    }

    // If it's an array, get the first valid image
    if (Array.isArray(auction.product_image)) {
      for (const image of auction.product_image) {
        if (typeof image === 'string') {
          try {
            new URL(image);
            return image;
          } catch {
            continue;
          }
        }
      }
    }

    return fallbackImage;
  };

  // Filter auctions based on current filters
  useEffect(() => {
    let filtered = [...auctions];

    // Filter by price range
    filtered = filtered.filter(auction => {
      const price = parseFloat(auction.current_bid || 0);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(auction => filters.categories.includes(auction.category));
    }

    // Filter by status
    if (filters.status.length > 0) {
      filtered = filtered.filter(auction => filters.status.includes(auction.status));
    }

    // Filter by time left
    if (filters.timeLeft) {
      const now = new Date();
      filtered = filtered.filter(auction => {
        const end = new Date(auction.end_time);
        const diff = end - now;
        const hours = diff / (1000 * 60 * 60);
        
        switch (filters.timeLeft) {
          case 'ending-soon':
            return hours <= 24 && hours > 0;
          case 'ending-today':
            return hours <= 24 && hours > 0;
          case 'ending-week':
            return hours <= 168 && hours > 0;
          default:
            return true;
        }
      });
    }

    // Sort auctions
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'ending-soon':
          return new Date(a.end_time) - new Date(b.end_time);
        case 'price-low':
          return a.current_bid - b.current_bid;
        case 'price-high':
          return b.current_bid - a.current_bid;
        case 'most-bids':
          return b.bid_count - a.bid_count;
        case 'newest':
          return b.id - a.id;
        default:
          return new Date(a.end_time) - new Date(b.end_time);
      }
    });

    setFilteredAuctions(filtered);
    setCurrentPage(1);
  }, [auctions, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckboxChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      categories: [],
      status: [],
      timeLeft: '',
      sortBy: 'ending-soon',
      viewMode: 'grid'
    });
  };

  // Pagination
  const indexOfLastAuction = currentPage * auctionsPerPage;
  const indexOfFirstAuction = indexOfLastAuction - auctionsPerPage;
  const currentAuctions = filteredAuctions.slice(indexOfFirstAuction, indexOfLastAuction);
  const totalPages = Math.ceil(filteredAuctions.length / auctionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading auctions...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error!</h4>
            <p>{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="auctions-page py-5">
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link href="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Auctions</li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="page-header d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="page-title">Live Auctions</h1>
                  <p className="page-subtitle">
                    Showing {indexOfFirstAuction + 1}-{Math.min(indexOfLastAuction, filteredAuctions.length)} of {filteredAuctions.length} auctions
                  </p>
                </div>
                <div className="shop-controls d-flex align-items-center gap-3">
                  <div className="sort-controls">
                    <select 
                      className="form-select" 
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                      <option value="ending-soon">Ending Soon</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="most-bids">Most Bids</option>
                      <option value="newest">Newest</option>
                    </select>
                  </div>
                  <div className="view-mode">
                    <button 
                      className={`btn btn-outline-secondary ${filters.viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('viewMode', 'grid')}
                    >
                      <i className="fas fa-th"></i>
                    </button>
                    <button 
                      className={`btn btn-outline-secondary ${filters.viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => handleFilterChange('viewMode', 'list')}
                    >
                      <i className="fas fa-list"></i>
                    </button>
                  </div>
                  <button 
                    className="btn btn-primary d-lg-none"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <i className="fas fa-filter me-2"></i>Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Sidebar Filters */}
            <div className={`col-lg-3 ${showFilters ? 'd-block' : 'd-none d-lg-block'}`}>
              <div className="auctions-sidebar">
                <div className="sidebar-header d-flex justify-content-between align-items-center mb-3">
                  <h5>Filters</h5>
                  <button className="btn btn-sm btn-outline-secondary" onClick={clearFilters}>
                    Clear All
                  </button>
                </div>

                {/* Price Range Filter */}
                <div className="filter-section mb-4">
                  <h6 className="filter-title">Current Bid Range</h6>
                  <div className="price-range">
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="10000"
                      step="100"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                    />
                    <div className="price-values d-flex justify-content-between">
                      <span>${filters.priceRange[0].toLocaleString()}</span>
                      <span>${filters.priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="filter-section mb-4">
                  <h6 className="filter-title">Category</h6>
                  <div className="category-options">
                    {filterOptions.categories.map(category => (
                      <label key={category} className="category-option">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category)}
                          onChange={() => handleCheckboxChange('categories', category)}
                        />
                        <span className="category-name">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Time Left Filter */}
                <div className="filter-section mb-4">
                  <h6 className="filter-title">Time Left</h6>
                  <div className="time-options">
                    <label className="time-option">
                      <input
                        type="radio"
                        name="timeLeft"
                        value=""
                        checked={filters.timeLeft === ''}
                        onChange={(e) => handleFilterChange('timeLeft', e.target.value)}
                      />
                      <span className="time-name">All Auctions</span>
                    </label>
                    <label className="time-option">
                      <input
                        type="radio"
                        name="timeLeft"
                        value="ending-soon"
                        checked={filters.timeLeft === 'ending-soon'}
                        onChange={(e) => handleFilterChange('timeLeft', e.target.value)}
                      />
                      <span className="time-name">Ending Soon (24h)</span>
                    </label>
                    <label className="time-option">
                      <input
                        type="radio"
                        name="timeLeft"
                        value="ending-week"
                        checked={filters.timeLeft === 'ending-week'}
                        onChange={(e) => handleFilterChange('timeLeft', e.target.value)}
                      />
                      <span className="time-name">Ending This Week</span>
                    </label>
                  </div>
                </div>

                {/* Status Filter */}
                <div className="filter-section mb-4">
                  <h6 className="filter-title">Status</h6>
                  <div className="status-options">
                    {filterOptions.statuses.map(status => (
                      <label key={status} className="status-option">
                        <input
                          type="checkbox"
                          checked={filters.status.includes(status)}
                          onChange={() => handleCheckboxChange('status', status)}
                        />
                        <span className="status-name">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Auctions Grid */}
            <div className="col-lg-9">
              <div className={`auctions-grid ${filters.viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
                <div className="row g-4">
                  {currentAuctions.map((auction) => (
                    <div key={auction.id} className={filters.viewMode === 'list' ? 'col-12' : 'col-lg-4 col-md-6 col-sm-6 col-12'}>
                      <div className="auction-card">
                        <div className="auction-image-wrapper">
                          <Link href={`/auctions/${auction.slug}`}>
                            <div className="auction-image">
                              <Image
                                src={getAuctionImage(auction)}
                                alt={auction.product_name}
                                width={filters.viewMode === 'list' ? 200 : 300}
                                height={filters.viewMode === 'list' ? 200 : 200}
                                className="img-fluid"
                              />
                            </div>
                          </Link>
                          
                          {/* Auction Badges */}
                          <div className="auction-badges">
                            {auction.is_featured && (
                              <span className="badge badge-featured">
                                <i className="fas fa-crown"></i>
                                Featured
                              </span>
                            )}
                            <span className="badge badge-live">
                              <i className="fas fa-circle pulse"></i>
                              Live
                            </span>
                          </div>

                          {/* Time Left */}
                          <div className="time-left">
                            <i className="fas fa-clock"></i>
                            <span>{getTimeLeft(auction.end_time)}</span>
                          </div>
                        </div>

                        <div className="auction-info">
                          <h4 className="auction-title">
                            <Link href={`/auctions/${auction.slug}`}>{auction.product_name}</Link>
                          </h4>

                          {/* Auction Details */}
                          <div className="auction-details">
                            <div className="bid-info">
                              <div className="current-bid">
                                <span className="label">Current Bid</span>
                                <PriceDisplay 
                                  amount={parseFloat(auction.current_bid?.toString() || '0')} 
                                  className="amount"
                                  fromCurrency="USD"
                                />
                              </div>
                              {auction.reserve_price && (
                                <div className="reserve-price">
                                  <span className="label">Reserve</span>
                                  <PriceDisplay 
                                    amount={parseFloat(auction.reserve_price?.toString() || '0')} 
                                    className="amount-small"
                                    fromCurrency="USD"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Auction Stats */}
                          <div className="auction-stats">
                            <div className="stat-item">
                              <i className="fas fa-gavel"></i>
                              <span>{auction.bid_count || 0} bids</span>
                            </div>
                            <div className="stat-item">
                              <i className="fas fa-map-marker-alt"></i>
                              <span>{auction.location || 'N/A'}</span>
                            </div>
                          </div>

                          {/* Seller Info */}
                          <div className="seller-info">
                            <div className="seller">
                              <i className="fas fa-user"></i>
                              <span>{auction.seller_name || 'Seller'}</span>
                            </div>
                            <div className="category">
                              <i className="fas fa-tag"></i>
                              <span>{auction.category || 'General'}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="auction-actions">
                            <Link href={`/auctions/${auction.slug}`} className="btn btn-primary btn-sm">
                              <i className="fas fa-gavel"></i>
                              Place Bid
                            </Link>
                            <button className="btn btn-outline-secondary btn-sm">
                              <i className="fas fa-heart"></i>
                              Watch
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination-wrapper mt-5">
                    <nav aria-label="Auctions pagination">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <i className="fas fa-chevron-left"></i>
                          </button>
                        </li>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => paginate(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            <i className="fas fa-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auctions-page {
          background-color: var(--light-color);
        }

        .page-title {
          font-family: var(--font-family-heading);
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          font-size: 1rem;
          color: var(--gray-600);
          margin-bottom: 0;
        }

        .shop-controls {
          flex-wrap: wrap;
        }

        .sort-controls .form-select {
          min-width: 200px;
        }

        .view-mode .btn {
          padding: 8px 12px;
        }

        .view-mode .btn.active {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
        }

        .auctions-sidebar {
          background: white;
          padding: 24px;
          border-radius: var(--border-radius-lg);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 20px;
        }

        .sidebar-header h5 {
          font-family: var(--font-family-heading);
          font-weight: 600;
          color: var(--secondary-color);
          margin: 0;
        }

        .filter-section {
          border-bottom: 1px solid #e9ecef;
          padding-bottom: 20px;
        }

        .filter-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .filter-title {
          font-family: var(--font-family-heading);
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 12px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .price-range {
          margin-top: 12px;
        }

        .price-values {
          font-size: 12px;
          color: var(--gray-600);
          margin-top: 8px;
        }

        .category-options, .status-options, .time-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .category-option, .status-option, .time-option {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 14px;
        }

        .category-option input, .status-option input, .time-option input {
          margin-right: 8px;
          accent-color: var(--primary-color);
        }

        .category-name, .status-name, .time-name {
          color: var(--gray-700);
        }

        .auction-card {
          background: white;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .auction-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .auction-image-wrapper {
          position: relative;
          overflow: hidden;
          height: 200px;
          flex-shrink: 0;
        }

        .auction-image {
          position: relative;
          height: 100%;
          overflow: hidden;
        }

        .auction-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .auction-card:hover .auction-image img {
          transform: scale(1.05);
        }

        .auction-badges {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 2;
        }

        .time-left {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: var(--border-radius-sm);
          margin-right: 4px;
          margin-bottom: 4px;
          padding: 4px 8px;
        }

        .badge-featured {
          background: var(--primary-color);
          color: white;
        }

        .badge-live {
          background: var(--danger-color);
          color: white;
        }

        .pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .auction-info {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .auction-title {
          margin-bottom: 12px;
        }

        .auction-title a {
          font-family: var(--font-family-heading);
          font-size: 16px;
          font-weight: 600;
          color: var(--secondary-color);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .auction-title a:hover {
          color: var(--primary-color);
        }

        .auction-details {
          margin-bottom: 12px;
        }

        .bid-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .current-bid .label {
          display: block;
          font-size: 11px;
          color: var(--gray-600);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .current-bid .amount {
          font-family: var(--font-family-heading);
          font-size: 18px;
          font-weight: 700;
          color: var(--primary-color);
        }

        .reserve-price .label {
          display: block;
          font-size: 10px;
          color: var(--gray-500);
          text-transform: uppercase;
        }

        .reserve-price .amount-small {
          font-size: 12px;
          color: var(--gray-600);
        }

        .auction-stats {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--gray-600);
        }

        .stat-item i {
          font-size: 10px;
          color: var(--primary-color);
        }

        .seller-info {
          margin-bottom: 12px;
        }

        .seller, .category {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--gray-600);
          margin-bottom: 4px;
        }

        .seller i, .category i {
          font-size: 10px;
          color: var(--primary-color);
        }

        .auction-actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
        }

        .auction-actions .btn {
          flex: 1;
          font-size: 12px;
          padding: 6px 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .auction-actions .btn i {
          font-size: 10px;
        }

        .pagination-wrapper {
          margin-top: 40px;
        }

        .pagination .page-link {
          color: var(--primary-color);
          border-color: #dee2e6;
          padding: 8px 12px;
        }

        .pagination .page-item.active .page-link {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
        }

        .pagination .page-link:hover {
          color: var(--primary-hover);
          background-color: #f8f9fa;
        }

        .pagination .page-item.disabled .page-link {
          color: #6c757d;
          background-color: #fff;
          border-color: #dee2e6;
        }

        .auctions-grid.list-view .auction-card {
          display: flex;
          align-items: center;
          padding: 20px;
          height: auto;
          flex-direction: row;
        }

        .auctions-grid.list-view .auction-image-wrapper {
          flex: 0 0 200px;
          margin-right: 20px;
          height: 150px;
        }

        .auctions-grid.list-view .auction-info {
          flex: 1;
          padding: 0;
        }

        @media (max-width: 991.98px) {
          .auctions-sidebar {
            position: static;
            margin-bottom: 20px;
          }
          
          .page-header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 15px;
          }
          
          .shop-controls {
            width: 100%;
            justify-content: space-between;
          }

          .auction-details {
            margin-bottom: 8px;
          }

          .auction-stats {
            flex-direction: column;
            gap: 4px;
            margin-bottom: 8px;
          }

          .auction-actions {
            flex-direction: column;
            gap: 6px;
            margin-top: 8px;
          }

          .auction-actions .btn {
            font-size: 11px;
            padding: 8px 12px;
          }
        }
      `}</style>
    </Layout>
  );
}