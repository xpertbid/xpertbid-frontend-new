'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useCurrency } from '@/contexts/CurrencyLanguageContext';

const MyBidsTab = ({ userId }) => {
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    loadBids();
  }, [userId]);

  const loadBids = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getUserBids();
      
      if (response.success) {
        setBids(response.data || []);
      } else {
        setError(response.message || 'Failed to load bids');
      }
    } catch (error) {
      console.error('Error loading bids:', error);
      setError('Failed to load bids. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-success';
      case 'outbid':
        return 'bg-warning';
      case 'won':
        return 'bg-primary';
      case 'lost':
        return 'bg-danger';
      case 'expired':
        return 'bg-secondary';
      default:
        return 'bg-info';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) {
      return 'Ended';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  if (isLoading) {
    return (
      <div className="bids-content">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading your bids...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bids-content">
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
        <button className="btn btn-outline-primary" onClick={loadBids}>
          <i className="fas fa-refresh me-2"></i>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bids-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <i className="fas fa-gavel me-2 text-primary"></i>
          My Bids
        </h4>
        <span className="badge bg-primary">{bids.length} Bids</span>
      </div>

      {bids.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="fas fa-gavel fa-4x text-muted mb-3"></i>
            <h5 className="text-muted">No Bids Yet</h5>
            <p className="text-muted mb-4">
              You haven't placed any bids yet. Browse auctions to start bidding.
            </p>
            <a href="/auctions" className="btn btn-primary">
              <i className="fas fa-hammer me-2"></i>
              Browse Auctions
            </a>
          </div>
        </div>
      ) : (
        <div className="row">
          {bids.map((bid) => (
            <div key={bid.id} className="col-12 mb-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">{bid.auction_title || 'Auction Item'}</h6>
                    <small className="text-muted">Bid placed on {formatDate(bid.bid_time || bid.created_at)}</small>
                  </div>
                  <div className="text-end">
                    <span className={`badge ${getStatusBadgeClass(bid.status)}`}>
                      {bid.status?.toUpperCase()}
                    </span>
                    <div className="mt-1">
                      <strong>{formatPrice(bid.bid_amount)}</strong>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <div className="auction-info">
                        <h6>Auction Details:</h6>
                        <div className="row">
                          <div className="col-sm-6">
                            <p className="mb-1">
                              <strong>Current Bid:</strong> {formatPrice(bid.current_bid || bid.bid_amount)}
                            </p>
                            <p className="mb-1">
                              <strong>Reserve Price:</strong> {formatPrice(bid.reserve_price || 0)}
                            </p>
                          </div>
                          <div className="col-sm-6">
                            <p className="mb-1">
                              <strong>Bid Count:</strong> {bid.bid_count || 1}
                            </p>
                            <p className="mb-1">
                              <strong>Time Remaining:</strong> 
                              <span className={`ms-1 ${getTimeRemaining(bid.end_time) === 'Ended' ? 'text-danger' : 'text-success'}`}>
                                {getTimeRemaining(bid.end_time)}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="bid-summary">
                        <h6>Your Bid:</h6>
                        <div className="bid-details">
                          <div className="d-flex justify-content-between">
                            <span>Bid Amount:</span>
                            <strong>{formatPrice(bid.bid_amount)}</strong>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Bid Time:</span>
                            <span>{formatDate(bid.bid_time || bid.created_at)}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Status:</span>
                            <span className={`badge ${getStatusBadgeClass(bid.status)}`}>
                              {bid.status?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">
                        <i className="fas fa-calendar-alt me-1"></i>
                        Auction ends: {formatDate(bid.end_time)}
                      </small>
                    </div>
                    <div>
                      <button className="btn btn-outline-primary btn-sm me-2">
                        <i className="fas fa-eye me-1"></i>
                        View Auction
                      </button>
                      {bid.status === 'won' && (
                        <button className="btn btn-success btn-sm">
                          <i className="fas fa-trophy me-1"></i>
                          You Won!
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .bids-content .card {
          transition: all 0.3s ease;
        }
        
        .bids-content .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .bid-summary {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 0.375rem;
        }
        
        .bid-details > div {
          margin-bottom: 0.5rem;
        }
        
        .auction-info h6 {
          color: #495057;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default MyBidsTab;
