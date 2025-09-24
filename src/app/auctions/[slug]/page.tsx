'use client';

import React, { useEffect, useState, use } from 'react';
import Layout from '@/components/Layout';
import Image from 'next/image';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface AuctionDetailPageProps {
  params: {
    slug: string;
  };
}

export default function AuctionDetailPage({ params }: AuctionDetailPageProps) {
  const resolvedParams = use(params);
  const { user, isAuthenticated } = useAuth();
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [currentBid, setCurrentBid] = useState<string>('');
  const [bidAmount, setBidAmount] = useState<string>('');
  const [bidderName, setBidderName] = useState<string>('');
  const [bidderEmail, setBidderEmail] = useState<string>('');
  const [bidMessage, setBidMessage] = useState<string>('');
  const [isPlacingBid, setIsPlacingBid] = useState<boolean>(false);

  // Auto-populate bidder info if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setBidderName(user.name || '');
      setBidderEmail(user.email || '');
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        setLoading(true);
        
        // Get all auctions first, then find by slug
        const auctionsResponse = await apiService.getAuctions();
        
        if (auctionsResponse.success) {
          const foundAuction = auctionsResponse.data.find(a => a.slug === resolvedParams.slug);
          
          if (foundAuction) {
            setAuction(foundAuction);
            setCurrentBid(foundAuction.current_bid?.toString() || '0');
            setBidAmount((parseFloat(foundAuction.current_bid?.toString() || '0') + 10).toString());
            
            // Set initial image
            let initialImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop';
            
            if (foundAuction.product_image && foundAuction.product_image.trim() !== '') {
              initialImage = foundAuction.product_image;
            }
            
            setSelectedImage(initialImage);
          } else {
            // Create a mock auction for demonstration
            const mockAuction = {
              id: 999,
              slug: resolvedParams.slug,
              product_name: 'Antique Persian Rug',
              product_image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop',
              seller_name: 'Antique Collectors',
              current_bid: 3200,
              reserve_price: 4000,
              end_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
              bid_count: 15,
              status: 'active'
            };
            
            setAuction(mockAuction);
            setCurrentBid('3200');
            setBidAmount('3210');
            setSelectedImage(mockAuction.product_image);
          }
        } else {
          setError('Failed to load auction data from server');
        }
      } catch (err) {
        console.error('Error fetching auction:', err);
        
        // Create a fallback auction for demonstration
        const fallbackAuction = {
          id: 999,
          slug: resolvedParams.slug,
          product_name: resolvedParams.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          product_image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
          seller_name: 'Demo Seller',
          current_bid: 1000,
          reserve_price: 1500,
          end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          bid_count: 5,
          status: 'active'
        };
        
        setAuction(fallbackAuction);
        setCurrentBid('1000');
        setBidAmount('1010');
        setSelectedImage(fallbackAuction.product_image);
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [resolvedParams.slug]);

  const handlePlaceBid = async () => {
    if (!auction || !bidAmount) {
      setBidMessage('Please enter a bid amount');
      return;
    }

    // For non-authenticated users, check if name and email are provided
    if (!isAuthenticated && (!bidderName || !bidderEmail)) {
      setBidMessage('Please fill in all required fields');
      return;
    }

    // For non-authenticated users, validate email format
    if (!isAuthenticated && !bidderEmail.includes('@')) {
      setBidMessage('Please enter a valid email address');
      return;
    }
    
    const bidValue = parseFloat(bidAmount);
    const currentBidValue = parseFloat(currentBid);
    
    if (bidValue <= currentBidValue) {
      setBidMessage('Your bid must be higher than the current bid!');
      return;
    }
    
    try {
      setIsPlacingBid(true);
      setBidMessage('');
      
      const response = await apiService.placeBid(auction.id, {
        bid_amount: bidValue,
        bidder_name: isAuthenticated ? (user?.name || '') : bidderName,
        bidder_email: isAuthenticated ? (user?.email || '') : bidderEmail
      });
      
      if (response.success) {
        setBidMessage('Bid placed successfully!');
        setCurrentBid(bidAmount);
        setBidAmount((bidValue + 10).toString());
        
        // Reset form fields only for non-authenticated users
        if (!isAuthenticated) {
          setBidderName('');
          setBidderEmail('');
        }
        
        // Show success message for 3 seconds
        setTimeout(() => {
          setBidMessage('');
        }, 3000);
      } else {
        setBidMessage(response.message || 'Failed to place bid');
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      setBidMessage('Failed to place bid. Please try again.');
    } finally {
      setIsPlacingBid(false);
    }
  };

  const calculateTimeLeft = (endTime: string) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      return "Auction Ended";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading auction...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !auction) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            {error || 'Auction not found'}
          </div>
        </div>
      </Layout>
    );
  }

  const timeLeft = auction.end_time ? calculateTimeLeft(auction.end_time) : 'Time not specified';

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="container py-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/" className="text-decoration-none">Home</a>
            </li>
            <li className="breadcrumb-item">
              <a href="/auctions" className="text-decoration-none">Auctions</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {auction.product_name || 'Auction Item'}
            </li>
          </ol>
        </nav>
      </div>

      {/* Auction Detail */}
      <div className="container py-4">
        <div className="row">
          {/* Auction Images */}
          <div className="col-lg-6">
            <div className="auction-images">
              {/* Main Image */}
              <div className="main-image mb-3">
                <Image
                  src={selectedImage}
                  alt={auction.product_name || 'Auction Item'}
                  width={600}
                  height={400}
                  className="img-fluid rounded"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Live Badge */}
              <div className="live-badge">
                <span className="badge bg-danger">
                  <i className="fas fa-circle me-2"></i>
                  LIVE
                </span>
              </div>
            </div>
          </div>

          {/* Auction Info */}
          <div className="col-lg-6">
            <div className="auction-info">
              <h1 className="auction-title mb-3">{auction.product_name || 'Auction Item'}</h1>
              
              {/* Seller Info */}
              {auction.seller_name && (
                <div className="seller-info mb-3">
                  <span className="text-muted">Seller: </span>
                  <strong>{auction.seller_name}</strong>
                </div>
              )}

              {/* Current Bid */}
              <div className="current-bid-section mb-4">
                <div className="current-bid-label">Current Bid</div>
                <div className="current-bid-amount">
                  ${(auction.current_bid || 0).toLocaleString()}
                </div>
                {auction.reserve_price && (
                  <div className="reserve-price">
                    Reserve: ${auction.reserve_price.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Time Left */}
              <div className="time-left-section mb-4">
                <div className="time-left-label">Time Left</div>
                <div className="time-left-countdown text-danger">
                  {timeLeft}
                </div>
              </div>

              {/* Bid Form */}
              <div className="bid-form mb-4">
                <h5>Place Your Bid</h5>
                
                {bidMessage && (
                  <div className={`alert ${bidMessage.includes('successfully') ? 'alert-success' : 'alert-danger'} mb-3`}>
                    {bidMessage}
                  </div>
                )}
                
                {!isAuthenticated && (
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="bidderName" className="form-label">Your Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="bidderName"
                        value={bidderName}
                        onChange={(e) => setBidderName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="bidderEmail" className="form-label">Your Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        id="bidderEmail"
                        value={bidderEmail}
                        onChange={(e) => setBidderEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>
                )}
                
                {isAuthenticated && (
                  <div className="alert alert-info mb-3">
                    <i className="fas fa-user me-2"></i>
                    Bidding as: <strong>{user?.name}</strong> ({user?.email})
                  </div>
                )}
                
                <div className="row mb-3">
                  <div className="col-md-8">
                    <label htmlFor="bidAmount" className="form-label">Bid Amount *</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        className="form-control"
                        id="bidAmount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="Enter your bid amount"
                        min={parseFloat(currentBid) + 1}
                        step="1"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <button 
                      className="btn btn-primary btn-lg w-100"
                      onClick={handlePlaceBid}
                      disabled={
                        isPlacingBid || 
                        !bidAmount || 
                        parseFloat(bidAmount) <= parseFloat(currentBid) ||
                        (!isAuthenticated && (!bidderName || !bidderEmail))
                      }
                    >
                      {isPlacingBid ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Placing...
                        </>
                      ) : (
                        'Place Bid'
                      )}
                    </button>
                  </div>
                </div>
                
                <small className="text-muted">
                  Minimum bid: ${(parseFloat(currentBid) + 1).toLocaleString()}
                </small>
              </div>

              {/* Auction Stats */}
              <div className="auction-stats mb-4">
                <div className="row text-center">
                  <div className="col-4">
                    <div className="stat-value">{(auction.bid_count || 0).toLocaleString()}</div>
                    <div className="stat-label">Bids</div>
                  </div>
                  <div className="col-4">
                    <div className="stat-value">4.5</div>
                    <div className="stat-label">Rating</div>
                  </div>
                  <div className="col-4">
                    <div className="stat-value">156</div>
                    <div className="stat-label">Watchers</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="auction-actions">
                <div className="row g-2">
                  <div className="col-6">
                    <button className="btn btn-outline-secondary w-100">
                      <i className="far fa-heart me-2"></i>
                      Watch
                    </button>
                  </div>
                  <div className="col-6">
                    <button className="btn btn-outline-secondary w-100">
                      <i className="fas fa-share me-2"></i>
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auction Details Tabs */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="auction-details">
              <ul className="nav nav-tabs" id="auctionTabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button className="nav-link active" id="description-tab" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab">
                    Description
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="bids-tab" data-bs-toggle="tab" data-bs-target="#bids" type="button" role="tab">
                    Bidding History
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button className="nav-link" id="shipping-tab" data-bs-toggle="tab" data-bs-target="#shipping" type="button" role="tab">
                    Shipping & Payment
                  </button>
                </li>
              </ul>
              
              <div className="tab-content" id="auctionTabContent">
                <div className="tab-pane fade show active" id="description" role="tabpanel">
                  <div className="p-4">
                    <h5>Item Description</h5>
                    <p>This is a detailed description of the auction item. The seller has provided comprehensive information about the condition, history, and unique features of this item.</p>
                    <p>All items are sold as-is. Please review all photos and descriptions carefully before bidding.</p>
                  </div>
                </div>
                
                <div className="tab-pane fade" id="bids" role="tabpanel">
                  <div className="p-4">
                    <h5>Bidding History</h5>
                    <div className="bidding-history">
                      <div className="bid-item">
                        <div className="bid-amount">$850</div>
                        <div className="bid-bidder">bidder123</div>
                        <div className="bid-time">2 hours ago</div>
                      </div>
                      <div className="bid-item">
                        <div className="bid-amount">$800</div>
                        <div className="bid-bidder">collector456</div>
                        <div className="bid-time">4 hours ago</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="tab-pane fade" id="shipping" role="tabpanel">
                  <div className="p-4">
                    <h5>Shipping & Payment Information</h5>
                    <ul>
                      <li>Free shipping on orders over $100</li>
                      <li>Standard delivery: 5-7 business days</li>
                      <li>Payment methods: Credit Card, PayPal</li>
                      <li>Returns accepted within 30 days</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auction-title {
          font-family: var(--font-family-heading);
          font-weight: 600;
          color: var(--secondary-color);
        }

        .current-bid-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: var(--border-radius-lg);
          text-align: center;
        }

        .current-bid-label {
          font-size: 14px;
          color: var(--gray-600);
          margin-bottom: 5px;
        }

        .current-bid-amount {
          font-size: 32px;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 5px;
        }

        .reserve-price {
          font-size: 14px;
          color: var(--gray-600);
        }

        .time-left-section {
          background: #fff3cd;
          padding: 20px;
          border-radius: var(--border-radius-lg);
          text-align: center;
          border: 1px solid #ffeaa7;
        }

        .time-left-label {
          font-size: 14px;
          color: var(--gray-600);
          margin-bottom: 5px;
        }

        .time-left-countdown {
          font-size: 24px;
          font-weight: 700;
        }

        .bid-form {
          background: white;
          padding: 20px;
          border-radius: var(--border-radius-lg);
          border: 1px solid #e9ecef;
        }

        .auction-stats {
          background: #f8f9fa;
          padding: 20px;
          border-radius: var(--border-radius-lg);
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--primary-color);
        }

        .stat-label {
          font-size: 12px;
          color: var(--gray-600);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .live-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 3;
        }

        .live-badge .badge {
          font-size: 12px;
          padding: 8px 12px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }

        .bidding-history .bid-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #f8f9fa;
        }

        .bidding-history .bid-item:last-child {
          border-bottom: none;
        }

        .bid-amount {
          font-weight: 600;
          color: var(--primary-color);
        }

        .bid-bidder {
          color: var(--gray-600);
        }

        .bid-time {
          font-size: 12px;
          color: var(--gray-500);
        }

        .auction-details {
          background: white;
          border-radius: var(--border-radius-lg);
          border: 1px solid #e9ecef;
        }

        .nav-tabs .nav-link {
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--gray-600);
          font-weight: 500;
        }

        .nav-tabs .nav-link.active {
          border-bottom-color: var(--primary-color);
          color: var(--primary-color);
        }
      `}</style>
    </Layout>
  );
}
