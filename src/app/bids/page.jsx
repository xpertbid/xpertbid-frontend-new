'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import Link from 'next/link';
import Image from 'next/image';

export default function BidsPage() {
  const { user, isAuthenticated } = useAuth();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchBids();
    }
  }, [isAuthenticated, user]);

  const fetchBids = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getUserBids();
      
      if (response.success) {
        setBids(response.data);
      } else {
        setError('Failed to fetch bidding history');
      }
    } catch (err) {
      console.error('Error fetching bids:', err);
      setError('Failed to fetch bidding history');
    } finally {
      setLoading(false);
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getBidStatus = (bid) => {
    if (bid.auction_status === 'ended') {
      return { status: 'Ended', color: 'secondary' };
    }
    return { status: 'Active', color: 'success' };
  };

  // Helper function to safely get first image
  const getFirstImage = (images)=> {
    if (!images) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop';
    if (Array.isArray(images)) return images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop';
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop';
      } catch {
        return images;
      }
    }
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop';
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <div className="card">
                <div className="card-body py-5">
                  <i className="f-gavel fa-5x text-muted mb-4"></i>
                  <h3 className="mb-3">Please Login</h3>
                  <p className="text-muted mb-4">You need to be logged in to view your bidding history.</p>
                  <Link href="/login" className="btn btn-primary">
                    Login to Continue
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Banner */}
      <div className="bids-hero">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="hero-content">
                <h1 className="hero-title">My Bids</h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">My Bids</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className="bids-header mb-4">
              <h2>Bidding History</h2>
              <p className="text-muted">Track all your auction bids and their status.</p>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading your bids...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : bids.length === 0 ? (
              <div className="text-center py-5">
                <i className="f-gavel fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">No Bids Yet</h5>
                <p className="text-muted">You haven&apos;t placed any bids yet. Start bidding on auctions!</p>
                <Link href="/auctions" className="btn btn-primary">
                  Browse Auctions
                </Link>
              </div>
            ) : (
              <div className="row">
                {bids.map((bid) => {
                  const statusInfo = getBidStatus(bid);
                  return (
                    <div key={bid.id} className="col-lg-6 col-md-12 mb-4">
                      <div className="bid-card">
                        <div className="row g-0">
                          <div className="col-md-4">
                            <div className="bid-image">
                              <Image
                                src={getFirstImage(bid.product_image)}
                                alt={bid.product_name || 'Auction Item'}
                                width={200}
                                height={150}
                                className="img-fluid"
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                          </div>
                          <div className="col-md-8">
                            <div className="bid-details">
                              <h5 className="bid-title">{bid.product_name || 'Auction Item'}</h5>
                              <div className="bid-amount">
                                <strong>{formatCurrency(bid.bid_amount)}</strong>
                              </div>
                              <div className="bid-meta">
                                <p className="mb-1">
                                  <small className="text-muted">
                                    Bid placed: {formatDate(bid.created_at)}
                                  </small>
                                </p>
                                <p className="mb-2">
                                  <span className={`badge bg-${statusInfo.color}`}>
                                    {statusInfo.status}
                                  </span>
                                </p>
                              </div>
                              <div className="bid-actions">
                                <Link 
                                  href={`/auctions/${bid.auction_id}`} 
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  View Auction
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .bids-hero {
          background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), 
                      url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=400&fit=crop') center/cover;
          padding;
          color;
        }

        .hero-title {
          font-size;
          font-weight;
          margin-bottom;
        }

        .breadcrumb {
          margin-bottom;
        }

        .breadcrumb-item a {
          color;
          text-decoration;
        }

        .breadcrumb-item.active {
          color: rgba(255, 255, 255, 0.8);
        }

        .bids-header h2 {
          color: #333;
          font-weight;
          margin-bottom: 0.5rem;
        }

        .bid-card {
          background;
          border: 1px solid #e9ecef;
          border-radius;
          overflow;
          transition: all 0.3s ease;
          height: 100%;
        }

        .bid-card:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .bid-image {
          width: 100%;
          height;
          overflow;
        }

        .bid-image img {
          width: 100%;
          height: 100%;
          object-fit;
        }

        .bid-details {
          padding: 1.5rem;
        }

        .bid-title {
          font-weight;
          color: #333;
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
        }

        .bid-amount {
          font-size: 1.25rem;
          color: #007bff;
          margin-bottom: 0.75rem;
          font-weight;
        }

        .bid-meta {
          margin-bottom;
        }

        .bid-actions {
          margin-top;
        }

        .btn-outline-primary {
          border-color: #007bff;
          color: #007bff;
        }

        .btn-outline-primary:hover {
          background-color: #007bff;
          border-color: #007bff;
        }

        @media (max-width) {
          .hero-title {
            font-size;
          }
          
          .bid-card .row {
            flex-direction;
          }
          
          .bid-image {
            height;
          }
        }
      `}</style>
    </Layout>
  );
}

