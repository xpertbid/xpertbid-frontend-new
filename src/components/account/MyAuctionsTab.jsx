'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

const MyAuctionsTab = ({ userId }) => {
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAuctions();
  }, [userId]);

  const loadAuctions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getUserAuctions();
      
      if (response.success) {
        setAuctions(response.data || []);
      } else {
        setError(response.message || 'Failed to load auctions');
      }
    } catch (error) {
      console.error('Error loading auctions:', error);
      setError('Failed to load auctions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return 'bg-secondary';
      case 'active':
        return 'bg-success';
      case 'paused':
        return 'bg-warning';
      case 'ended':
        return 'bg-danger';
      case 'cancelled':
        return 'bg-dark';
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
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
      <div className="auctions-content">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading your auctions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auctions-content">
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
        <button className="btn btn-outline-primary" onClick={loadAuctions}>
          <i className="fas fa-refresh me-2"></i>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="auctions-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <i className="fas fa-hammer me-2 text-primary"></i>
          My Auctions
        </h4>
        <div className="d-flex gap-2">
          <span className="badge bg-primary">{auctions.length} Auctions</span>
          <a href="/auctions/create" className="btn btn-primary btn-sm">
            <i className="fas fa-plus me-1"></i>
            Create Auction
          </a>
        </div>
      </div>

      {auctions.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="fas fa-hammer fa-4x text-muted mb-3"></i>
            <h5 className="text-muted">No Auctions Created</h5>
            <p className="text-muted mb-4">
              You haven't created any auctions yet. Start selling by creating your first auction.
            </p>
            <a href="/auctions/create" className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>
              Create Auction
            </a>
          </div>
        </div>
      ) : (
        <div className="row">
          {auctions.map((auction) => (
            <div key={auction.id} className="col-12 mb-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">{auction.title}</h6>
                    <small className="text-muted">Created on {formatDate(auction.created_at)}</small>
                  </div>
                  <div className="text-end">
                    <span className={`badge ${getStatusBadgeClass(auction.status)}`}>
                      {auction.status?.toUpperCase()}
                    </span>
                    <div className="mt-1">
                      <strong>{formatPrice(auction.current_bid || auction.starting_price)}</strong>
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
                              <strong>Starting Price:</strong> {formatPrice(auction.starting_price)}
                            </p>
                            <p className="mb-1">
                              <strong>Current Bid:</strong> {formatPrice(auction.current_bid || auction.starting_price)}
                            </p>
                            <p className="mb-1">
                              <strong>Reserve Price:</strong> {formatPrice(auction.reserve_price || 0)}
                            </p>
                          </div>
                          <div className="col-sm-6">
                            <p className="mb-1">
                              <strong>Bid Count:</strong> {auction.bid_count || 0}
                            </p>
                            <p className="mb-1">
                              <strong>Time Remaining:</strong> 
                              <span className={`ms-1 ${getTimeRemaining(auction.end_time) === 'Ended' ? 'text-danger' : 'text-success'}`}>
                                {getTimeRemaining(auction.end_time)}
                              </span>
                            </p>
                            <p className="mb-1">
                              <strong>Views:</strong> {auction.views || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="auction-summary">
                        <h6>Auction Summary:</h6>
                        <div className="auction-details">
                          <div className="d-flex justify-content-between">
                            <span>Status:</span>
                            <span className={`badge ${getStatusBadgeClass(auction.status)}`}>
                              {auction.status?.toUpperCase()}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Created:</span>
                            <span>{formatDate(auction.created_at)}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Ends:</span>
                            <span>{formatDate(auction.end_time)}</span>
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
                        Auction ends: {formatDate(auction.end_time)}
                      </small>
                    </div>
                    <div>
                      <button className="btn btn-outline-primary btn-sm me-2">
                        <i className="fas fa-eye me-1"></i>
                        View Auction
                      </button>
                      {auction.status === 'draft' && (
                        <button className="btn btn-outline-success btn-sm me-2">
                          <i className="fas fa-play me-1"></i>
                          Start Auction
                        </button>
                      )}
                      <button className="btn btn-outline-secondary btn-sm">
                        <i className="fas fa-edit me-1"></i>
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .auctions-content .card {
          transition: all 0.3s ease;
        }
        
        .auctions-content .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .auction-summary {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 0.375rem;
        }
        
        .auction-details > div {
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

export default MyAuctionsTab;
