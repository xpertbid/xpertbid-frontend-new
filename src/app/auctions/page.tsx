'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { apiService } from '@/services/api';

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [filteredAuctions, setFilteredAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [auctionsPerPage] = useState(12);

  // Filter states
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    category: '',
    status: '',
    timeLeft: '',
    seller: '',
    search: ''
  });

  // Available filter options
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    sellers: [],
    statuses: ['live', 'ending_soon', 'upcoming', 'ended']
  });

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        
        const auctionsResponse = await apiService.getAuctions();
        
        if (auctionsResponse.success) {
          const auctionsData = auctionsResponse.data || [];
          setAuctions(auctionsData);
          setFilteredAuctions(auctionsData);
          
          // Extract filter options from data
          const categories = [...new Set(auctionsData.map(a => a.category).filter(Boolean))];
          const sellers = [...new Set(auctionsData.map(a => a.seller_name).filter(Boolean))];
          
          setFilterOptions({
            categories,
            sellers,
            statuses: ['live', 'ending_soon', 'upcoming', 'ended']
          });
        }
      } catch (err) {
        console.error('Error fetching auctions:', err);
        setError('Failed to load auctions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...auctions];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(auction =>
        auction.product_name?.toLowerCase().includes(searchTerm) ||
        auction.seller_name?.toLowerCase().includes(searchTerm) ||
        auction.category?.toLowerCase().includes(searchTerm)
      );
    }

    // Price filter
    if (filters.minPrice) {
      filtered = filtered.filter(auction => 
        auction.current_bid >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(auction => 
        auction.current_bid <= parseFloat(filters.maxPrice)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(auction => 
        auction.category === filters.category
      );
    }

    // Seller filter
    if (filters.seller) {
      filtered = filtered.filter(auction => 
        auction.seller_name === filters.seller
      );
    }

    // Status filter
    if (filters.status) {
      const now = new Date();
      filtered = filtered.filter(auction => {
        const endTime = new Date(auction.end_time);
        const timeLeft = endTime.getTime() - now.getTime();
        const hoursLeft = timeLeft / (1000 * 60 * 60);

        switch (filters.status) {
          case 'live':
            return timeLeft > 0 && hoursLeft > 24;
          case 'ending_soon':
            return timeLeft > 0 && hoursLeft <= 24 && hoursLeft > 0;
          case 'upcoming':
            return timeLeft > 0 && hoursLeft > 24;
          case 'ended':
            return timeLeft <= 0;
          default:
            return true;
        }
      });
    }

    // Time left filter
    if (filters.timeLeft) {
      const now = new Date();
      filtered = filtered.filter(auction => {
        const endTime = new Date(auction.end_time);
        const timeLeft = endTime.getTime() - now.getTime();
        const hoursLeft = timeLeft / (1000 * 60 * 60);

        switch (filters.timeLeft) {
          case '1hour':
            return timeLeft > 0 && hoursLeft <= 1;
          case '6hours':
            return timeLeft > 0 && hoursLeft <= 6;
          case '24hours':
            return timeLeft > 0 && hoursLeft <= 24;
          case '7days':
            return timeLeft > 0 && hoursLeft <= 168;
          default:
            return true;
        }
      });
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'highest_bid':
        filtered.sort((a, b) => (b.current_bid || 0) - (a.current_bid || 0));
        break;
      case 'lowest_bid':
        filtered.sort((a, b) => (a.current_bid || 0) - (b.current_bid || 0));
        break;
      case 'ending_soon':
        filtered.sort((a, b) => {
          const aTime = new Date(a.end_time).getTime();
          const bTime = new Date(b.end_time).getTime();
          return aTime - bTime;
        });
        break;
      case 'most_bids':
        filtered.sort((a, b) => (b.bid_count || 0) - (a.bid_count || 0));
        break;
    }

    setFilteredAuctions(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [auctions, filters, sortBy]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      category: '',
      status: '',
      timeLeft: '',
      seller: '',
      search: ''
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredAuctions.length / auctionsPerPage);
  const startIndex = (currentPage - 1) * auctionsPerPage;
  const currentAuctions = filteredAuctions.slice(startIndex, startIndex + auctionsPerPage);

  const formatTimeLeft = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const timeLeft = end.getTime() - now.getTime();
    
    if (timeLeft <= 0) return 'Ended';
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getAuctionStatus = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const timeLeft = end.getTime() - now.getTime();
    const hoursLeft = timeLeft / (1000 * 60 * 60);
    
    if (timeLeft <= 0) return 'ended';
    if (hoursLeft <= 1) return 'ending-soon';
    if (hoursLeft <= 24) return 'ending-today';
    return 'live';
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading auctions...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Header */}
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/" className="text-decoration-none">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">Auctions</li>
              </ol>
            </nav>
          </div>
        </div>
        
        <div className="row align-items-center">
          <div className="col-md-6">
            <h1 className="h2 mb-0">Live Auctions</h1>
            <p className="text-muted">Bid and win amazing deals</p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="d-flex justify-content-md-end gap-2">
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn btn-outline-secondary ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <i className="fas fa-th"></i>
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-secondary ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row">
          {/* Filters Sidebar */}
          <div className="col-lg-3">
            <div className="filters-sidebar">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Filters</h5>
                <button 
                  type="button" 
                  className="btn btn-link btn-sm p-0"
                  onClick={clearFilters}
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="filter-group mb-4">
                <label className="form-label">Search</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search auctions..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              {/* Price Range */}
              <div className="filter-group mb-4">
                <label className="form-label">Price Range</label>
                <div className="row">
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Category */}
              {filterOptions.categories.length > 0 && (
                <div className="filter-group mb-4">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {filterOptions.categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Seller */}
              {filterOptions.sellers.length > 0 && (
                <div className="filter-group mb-4">
                  <label className="form-label">Seller</label>
                  <select
                    className="form-select"
                    value={filters.seller}
                    onChange={(e) => handleFilterChange('seller', e.target.value)}
                  >
                    <option value="">All Sellers</option>
                    {filterOptions.sellers.map(seller => (
                      <option key={seller} value={seller}>{seller}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Status */}
              <div className="filter-group mb-4">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="live">Live</option>
                  <option value="ending_soon">Ending Soon</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ended">Ended</option>
                </select>
              </div>

              {/* Time Left */}
              <div className="filter-group mb-4">
                <label className="form-label">Time Left</label>
                <select
                  className="form-select"
                  value={filters.timeLeft}
                  onChange={(e) => handleFilterChange('timeLeft', e.target.value)}
                >
                  <option value="">Any Time</option>
                  <option value="1hour">Ending in 1 hour</option>
                  <option value="6hours">Ending in 6 hours</option>
                  <option value="24hours">Ending in 24 hours</option>
                  <option value="7days">Ending in 7 days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Auctions Grid */}
          <div className="col-lg-9">
            {/* Results Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <p className="mb-0">
                  Showing {startIndex + 1}-{Math.min(startIndex + auctionsPerPage, filteredAuctions.length)} of {filteredAuctions.length} auctions
                </p>
              </div>
              <div className="d-flex align-items-center gap-3">
                <label className="form-label mb-0">Sort by:</label>
                <select
                  className="form-select"
                  style={{ width: 'auto' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest_bid">Highest Bid</option>
                  <option value="lowest_bid">Lowest Bid</option>
                  <option value="ending_soon">Ending Soon</option>
                  <option value="most_bids">Most Bids</option>
                </select>
              </div>
            </div>

            {/* Auctions Grid */}
            {currentAuctions.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-4">
                  <i className="fas fa-gavel fa-3x text-muted"></i>
                </div>
                <h4>No auctions found</h4>
                <p className="text-muted">Try adjusting your filters or search terms.</p>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={`row ${viewMode === 'list' ? 'gy-4' : 'gy-4'}`}>
                {currentAuctions.map((auction) => {
                  const status = getAuctionStatus(auction.end_time);
                  const timeLeft = formatTimeLeft(auction.end_time);
                  
                  return (
                    <div key={auction.id} className={`${viewMode === 'grid' ? 'col-lg-4 col-md-6' : 'col-12'}`}>
                      <div className={`auction-card ${viewMode === 'list' ? 'd-flex' : ''}`}>
                        {viewMode === 'list' ? (
                          <>
                            <div className="auction-image-wrapper flex-shrink-0">
                              <div className="auction-image">
                                <Image
                                  src={auction.product_image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'}
                                  alt={auction.product_name || 'Auction Item'}
                                  width={200}
                                  height={150}
                                  className="img-fluid"
                                />
                                <div className={`auction-status ${status}`}>
                                  {status === 'ended' ? 'Ended' : 
                                   status === 'ending-soon' ? 'Ending Soon' :
                                   status === 'ending-today' ? 'Ending Today' : 'Live'}
                                </div>
                              </div>
                            </div>
                            <div className="auction-content flex-grow-1 ms-3">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h5 className="auction-title mb-0">
                                  <Link href={`/auctions/${auction.slug}`} className="text-decoration-none">
                                    {auction.product_name || 'Auction Item'}
                                  </Link>
                                </h5>
                                <span className="badge bg-primary">{timeLeft}</span>
                              </div>
                              <p className="text-muted mb-2">by {auction.seller_name || 'Seller'}</p>
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <div className="current-bid">${auction.current_bid || 0}</div>
                                  <small className="text-muted">{auction.bid_count || 0} bids</small>
                                </div>
                                <Link href={`/auctions/${auction.slug}`} className="btn btn-primary btn-sm">
                                  Place Bid
                                </Link>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="auction-image-wrapper">
                              <div className="auction-image">
                                <Image
                                  src={auction.product_image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'}
                                  alt={auction.product_name || 'Auction Item'}
                                  width={400}
                                  height={300}
                                  className="img-fluid"
                                />
                                <div className={`auction-status ${status}`}>
                                  {status === 'ended' ? 'Ended' : 
                                   status === 'ending-soon' ? 'Ending Soon' :
                                   status === 'ending-today' ? 'Ending Today' : 'Live'}
                                </div>
                              </div>
                            </div>
                            <div className="auction-content">
                              <h5 className="auction-title">
                                <Link href={`/auctions/${auction.slug}`} className="text-decoration-none">
                                  {auction.product_name || 'Auction Item'}
                                </Link>
                              </h5>
                              <p className="text-muted mb-2">by {auction.seller_name || 'Seller'}</p>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="current-bid">${auction.current_bid || 0}</div>
                                <span className="badge bg-primary">{timeLeft}</span>
                              </div>
                              <small className="text-muted d-block mb-3">{auction.bid_count || 0} bids</small>
                              <Link href={`/auctions/${auction.slug}`} className="btn btn-primary btn-block">
                                Place Bid
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav aria-label="Auctions pagination" className="mt-5">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .filters-sidebar {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          height: fit-content;
          position: sticky;
          top: 20px;
        }

        .filter-group {
          border-bottom: 1px solid #dee2e6;
          padding-bottom: 1rem;
        }

        .filter-group:last-child {
          border-bottom: none;
        }

        .auction-card {
          background: #fff;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
          height: 100%;
        }

        .auction-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }

        .auction-image-wrapper {
          position: relative;
          overflow: hidden;
        }

        .auction-image {
          position: relative;
          overflow: hidden;
        }

        .auction-image img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .auction-card:hover .auction-image img {
          transform: scale(1.05);
        }

        .auction-status {
          position: absolute;
          top: 10px;
          left: 10px;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .auction-status.live {
          background: #28a745;
          color: white;
        }

        .auction-status.ending-soon {
          background: #ffc107;
          color: #212529;
        }

        .auction-status.ending-today {
          background: #fd7e14;
          color: white;
        }

        .auction-status.ended {
          background: #6c757d;
          color: white;
        }

        .auction-content {
          padding: 1.25rem;
        }

        .auction-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .auction-title a {
          color: #212529;
        }

        .auction-title a:hover {
          color: #43ACE9;
        }

        .current-bid {
          font-size: 1.25rem;
          font-weight: 700;
          color: #43ACE9;
        }

        .btn-block {
          width: 100%;
        }

        @media (max-width: 768px) {
          .filters-sidebar {
            position: static;
            margin-bottom: 2rem;
          }
          
          .auction-card.d-flex {
            flex-direction: column;
          }
          
          .auction-content {
            margin-left: 0 !important;
            margin-top: 1rem;
          }
        }
      `}</style>
    </Layout>
  );
}
