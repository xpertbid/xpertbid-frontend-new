'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Image from 'next/image';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Bid } from '@/types';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [userEmail, setUserEmail] = useState<string>('');
  const [userBids, setUserBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bids' | 'won' | 'settings'>('bids');

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      // Use authenticated user's email
      setUserEmail(user.email);
      fetchUserBids(user.email);
    } else {
      // Get user email from localStorage or prompt for it
      const savedEmail = localStorage.getItem('userEmail');
      if (savedEmail) {
        setUserEmail(savedEmail);
        fetchUserBids(savedEmail);
      }
    }
  }, [isAuthenticated, user]);

  const fetchUserBids = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getUserBids(email);
      
      if (response.success) {
        setUserBids(response.data);
      } else {
        setError('Failed to fetch bidding history');
      }
    } catch (err) {
      console.error('Error fetching user bids:', err);
      setError('Failed to fetch bidding history');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userEmail && userEmail.includes('@')) {
      localStorage.setItem('userEmail', userEmail);
      fetchUserBids(userEmail);
    } else {
      setError('Please enter a valid email address');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBidStatus = (bid: Bid) => {
    if (bid.auction_status === 'ended') {
      // Check if this was the winning bid (simplified logic)
      return 'Won';
    }
    return 'Active';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Won': return 'text-success';
      case 'Active': return 'text-primary';
      case 'Outbid': return 'text-danger';
      default: return 'text-muted';
    }
  };

  if (!userEmail && !isAuthenticated) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header text-center">
                  <h3>Access Your Profile</h3>
                </div>
                <div className="card-body">
                  <p className="text-center mb-4">Enter your email address to view your bidding history and profile.</p>
                  
                  <form onSubmit={handleEmailSubmit}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                    
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    
                    <button type="submit" className="btn btn-primary w-100">
                      Access Profile
                    </button>
                  </form>
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
      <div className="container py-5">
        {/* Profile Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="profile-header">
              <h1 className="profile-title">My Profile</h1>
              <p className="profile-subtitle">
                Welcome back, {isAuthenticated ? user?.name : userEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="row">
          <div className="col-12">
            <div className="profile-tabs">
              <ul className="nav nav-tabs" id="profileTabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'bids' ? 'active' : ''}`}
                    onClick={() => setActiveTab('bids')}
                  >
                    My Bids ({userBids.length})
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'won' ? 'active' : ''}`}
                    onClick={() => setActiveTab('won')}
                  >
                    Won Auctions
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                  >
                    Settings
                  </button>
                </li>
              </ul>

              <div className="tab-content mt-4">
                {/* My Bids Tab */}
                {activeTab === 'bids' && (
                  <div className="tab-pane fade show active">
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
                    ) : userBids.length === 0 ? (
                      <div className="text-center py-5">
                        <i className="fas fa-gavel fa-3x text-muted mb-3"></i>
                        <h5 className="text-muted">No Bids Yet</h5>
                        <p className="text-muted">You haven't placed any bids yet. Start bidding on auctions!</p>
                        <Link href="/auctions" className="btn btn-primary">
                          Browse Auctions
                        </Link>
                      </div>
                    ) : (
                      <div className="row">
                        {userBids.map((bid) => (
                          <div key={bid.id} className="col-lg-6 col-md-12 mb-4">
                            <div className="bid-card">
                              <div className="row">
                                <div className="col-4">
                                  <div className="bid-image">
                                    <Image
                                      src={bid.product_image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop'}
                                      alt={bid.product_name || 'Auction Item'}
                                      width={120}
                                      height={80}
                                      className="img-fluid rounded"
                                      style={{ objectFit: 'cover' }}
                                    />
                                  </div>
                                </div>
                                <div className="col-8">
                                  <div className="bid-details">
                                    <h6 className="bid-title">{bid.product_name || 'Auction Item'}</h6>
                                    <div className="bid-amount">
                                      <strong>${bid.bid_amount.toLocaleString()}</strong>
                                    </div>
                                    <div className="bid-meta">
                                      <small className="text-muted">
                                        Bid placed: {formatDate(bid.bid_time)}
                                      </small>
                                    </div>
                                    <div className="bid-status">
                                      <span className={`badge ${getStatusColor(getBidStatus(bid))}`}>
                                        {getBidStatus(bid)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Won Auctions Tab */}
                {activeTab === 'won' && (
                  <div className="tab-pane fade show active">
                    <div className="text-center py-5">
                      <i className="fas fa-trophy fa-3x text-warning mb-3"></i>
                      <h5>Won Auctions</h5>
                      <p className="text-muted">Auctions you've won will appear here.</p>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="tab-pane fade show active">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="card">
                          <div className="card-header">
                            <h5>Profile Settings</h5>
                          </div>
                          <div className="card-body">
                            <div className="mb-3">
                              <label htmlFor="currentEmail" className="form-label">Current Email</label>
                              <input
                                type="email"
                                className="form-control"
                                id="currentEmail"
                                value={isAuthenticated ? user?.email : userEmail}
                                readOnly
                              />
                            </div>
                            <button 
                              className="btn btn-outline-danger"
                              onClick={() => {
                                localStorage.removeItem('userEmail');
                                setUserEmail('');
                                setUserBids([]);
                              }}
                            >
                              Clear Profile Data
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card">
                          <div className="card-header">
                            <h5>Notification Settings</h5>
                          </div>
                          <div className="card-body">
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="emailNotifications" defaultChecked />
                              <label className="form-check-label" htmlFor="emailNotifications">
                                Email notifications for outbid
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input className="form-check-input" type="checkbox" id="auctionEndNotifications" defaultChecked />
                              <label className="form-check-label" htmlFor="auctionEndNotifications">
                                Notifications when auctions end
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .profile-title {
          font-family: var(--font-family-heading);
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 0.5rem;
        }

        .profile-subtitle {
          font-size: 1.1rem;
          color: var(--gray-600);
        }

        .bid-card {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: var(--border-radius-lg);
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .bid-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .bid-image {
          width: 100%;
          height: 80px;
          overflow: hidden;
          border-radius: var(--border-radius-sm);
        }

        .bid-title {
          font-family: var(--font-family-heading);
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .bid-amount {
          font-size: 1.1rem;
          color: var(--primary-color);
          margin-bottom: 0.5rem;
        }

        .bid-meta {
          margin-bottom: 0.5rem;
        }

        .bid-status .badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
        }

        .nav-tabs .nav-link {
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--gray-600);
          font-weight: 500;
          padding: 1rem 1.5rem;
        }

        .nav-tabs .nav-link.active {
          border-bottom-color: var(--primary-color);
          color: var(--primary-color);
        }

        .nav-tabs .nav-link:hover {
          border-color: transparent;
          color: var(--primary-color);
        }

        .card {
          border: 1px solid #e9ecef;
          border-radius: var(--border-radius-lg);
        }

        .card-header {
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
          font-family: var(--font-family-heading);
          font-weight: 600;
        }
      `}</style>
    </Layout>
  );
}
