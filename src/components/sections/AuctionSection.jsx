'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService } from '@/services/api';
import { Auction } from '@/types';

const AuctionSection = () => {
  const [auctions, setAuctions] = useState<Array<Auction>>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({});

  // Mock data - replace with API call
  const mockAuctions = [
    {
      id,
      slug: 'vintage-rolex-submariner-watch',
      product_name: 'Vintage Rolex Submariner Watch',
      product_image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop',
      seller_name: 'LuxuryWatches',
      current_bid,
      reserve_price,
      end_time: '2024-12-25T15:30:00Z',
      bid_count,
      status: 'active',
      description: 'Authentic 1960s Rolex Submariner in excellent condition',
      category_name: 'Jewelry & Watches',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      title: 'Vintage Rolex Submariner Watch',
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop',
      vendor: { name: 'LuxuryWatches', slug: 'luxurywatches' },
      category: 'Jewelry & Watches',
      featured,
      starting_bid,
      buy_now_price: 12000
    },
    {
      id,
      slug: 'limited-edition-gaming-console',
      product_name: 'Limited Edition Gaming Console',
      product_image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
      seller_name: 'GameCollectors',
      current_bid,
      reserve_price,
      end_time: '2024-12-24T20:00:00Z',
      bid_count,
      status: 'active',
      description: 'Rare limited edition gaming console with custom artwork',
      category_name: 'Electronics',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      title: 'Limited Edition Gaming Console',
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
      vendor: { name: 'GameCollectors', slug: 'gamecollectors' },
      category: 'Electronics',
      featured,
      starting_bid,
      buy_now_price: undefined
    },
    {
      id,
      slug: 'antique-persian-rug',
      product_name: 'Antique Persian Rug',
      product_image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      seller_name: 'AntiqueTreasures',
      current_bid,
      reserve_price,
      end_time: '2024-12-26T12:00:00Z',
      bid_count,
      status: 'active',
      description: 'Beautiful hand-woven Persian rug from the 1800s',
      category_name: 'Home & Garden',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      title: 'Antique Persian Rug',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      vendor: { name: 'AntiqueTreasures', slug: 'antiquetreasures' },
      category: 'Home & Garden',
      featured,
      starting_bid,
      buy_now_price: 4500
    },
    {
      id,
      slug: 'signed-sports-memorabilia',
      product_name: 'Signed Sports Memorabilia',
      product_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      seller_name: 'SportsCollectibles',
      current_bid,
      reserve_price,
      end_time: '2024-12-23T18:30:00Z',
      bid_count,
      status: 'active',
      description: 'Autographed jersey from legendary athlete',
      category_name: 'Sports',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      title: 'Signed Sports Memorabilia',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      vendor: { name: 'SportsCollectibles', slug: 'sportscollectibles' },
      category: 'Sports',
      featured,
      starting_bid,
      buy_now_price: undefined
    }
  ];

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      try {
        // Try to fetch from API first
        const apiAuctions = await apiService.getAuctions();
        
        // Check if API returned valid data
        if (apiAuctions && apiAuctions.success && Array.isArray(apiAuctions.data) && apiAuctions.data.length > 0) {
          // Map API data to component format
          const mappedAuctions = apiAuctions.data.map(auction => ({
            ...auction,
            title: auction.product_name,
            image: auction.product_image,
            vendor: { name: auction.seller_name, slug: auction.seller_name.toLowerCase().replace(/\s+/g, '-') },
            category: auction.category_name || 'General',
            featured,
            starting_bid: auction.reserve_price,
            buy_now_price: undefined
          }));
          setAuctions(mappedAuctions );
        } else {
          // API returned null/empty, use mock data
          console.log('API auctions not available, using mock data');
          setAuctions(mockAuctions );
        }
      } catch (error) {
        console.error('Error fetching auctions:', error);
        // Fallback to mock data
        console.log('Using mock auctions due to error');
        setAuctions(mockAuctions );
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  useEffect(() => {
    const updateTimers = () => {
      const newTimeLeft = {};
      
      if (!auctions || auctions.length === 0) return;
      
      auctions.forEach((auction) => {
        const endTime = new Date(auction.end_time).getTime();
        const now = new Date().getTime();
        const difference = endTime - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          if (days > 0) {
            newTimeLeft[auction.id] = `${days}d ${hours}h ${minutes}m`;
          } else if (hours > 0) {
            newTimeLeft[auction.id] = `${hours}h ${minutes}m ${seconds}s`;
          } else {
            newTimeLeft[auction.id] = `${minutes}m ${seconds}s`;
          }
        } else {
          newTimeLeft[auction.id] = 'Ended';
        }
      });

      setTimeLeft(newTimeLeft);
    };

    updateTimers();
    const timer = setInterval(updateTimers, 1000);

    return () => clearInterval(timer);
  }, [auctions]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount);
  };

  const getTimeClass = (auctionId) => {
    const time = timeLeft[auctionId];
    if (!time || time === 'Ended') return 'time-ended';
    if (time.includes('m') && !time.includes('h') && !time.includes('d')) return 'time-critical';
    return 'time-normal';
  };

  if (loading) {
    return (
     <section className="auction-section py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-header text-center mb-5">
                <h2 className="section-title">Live Auctions</h2>
                <p className="section-subtitle">Bid on unique and rare items</p>
              </div>
            </div>
          </div>
          
          <div className="row">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="auction-card loading">
                  <div className="auction-image loading-shimmer"></div>
                  <div className="auction-content">
                    <div className="auction-title loading-shimmer"></div>
                    <div className="auction-bid loading-shimmer"></div>
                    <div className="auction-timer loading-shimmer"></div>
                    <div className="auction-bid-count loading-shimmer"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="auction-section py-5 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-header text-center mb-5">
              <h2 className="section-title">Live Auctions</h2>
              <p className="section-subtitle">Bid on unique and rare items</p>
            </div>
          </div>
        </div>

        <div className="row">
          {auctions.map((auction) => (
            <div key={auction.id} className="col-lg-3 col-md-6 mb-4">
              <Link href={`/auctions/${auction.slug}`} className="auction-link">
                <div className="auction-card">
                  <div className="auction-image">
                    <img 
                      src={auction.image} 
                      alt={auction.title}
                      onError={(e) => {
                        const target = e.target;
                        if (target && target.tagName === 'IMG') {
                          target.src = '/images/placeholder-auction.jpg';
                        }
                      }}
                    />
                    
                    {/* Featured Badge */}
                    {auction.featured && (
                      <div className="auction-badge">
                        <i className="fas fa-star me-1"></i>
                        Featured
                      </div>
                    )}

                    {/* Category */}
                    <div className="auction-category">
                      {auction.category}
                    </div>

                    {/* Quick Actions */}
                    <div className="auction-actions">
                      <button className="auction-action-btn" title="Add to Watchlist">
                        <i className="far fa-heart"></i>
                      </button>
                      <button className="auction-action-btn" title="Share">
                        <i className="fas fa-share"></i>
                      </button>
                    </div>
                  </div>

                  <div className="auction-content">
                    <div className="auction-vendor">
                      <span className="vendor-name" onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = `/vendors/${auction.vendor.slug}`;
                      }}>
                        {auction.vendor.name}
                      </span>
                    </div>
                    
                    <h4 className="auction-title">{auction.title}</h4>
                    
                    <div className="auction-bid-info">
                      <div className="current-bid">
                        <span className="bid-label">Current Bid:</span>
                        <span className="bid-amount">{formatCurrency(auction.current_bid)}</span>
                      </div>
                      
                      <div className="bid-count">
                        <i className="fas fa-gavel me-1"></i>
                        {auction.bid_count} bids
                      </div>
                    </div>

                    <div className="auction-timer">
                      <div className={`timer-display ${getTimeClass(auction.id)}`}>
                        <i className="fas fa-clock me-2"></i>
                        {timeLeft[auction.id] || 'Loading...'}
                      </div>
                    </div>

                    {auction.buy_now_price && (
                      <div className="buy-now-price">
                        <span className="buy-now-label">Buy Now:</span>
                        <span className="buy-now-amount">{formatCurrency(auction.buy_now_price)}</span>
                      </div>
                    )}

                    <button className="btn btn-primary btn-bid w-100">
                      <i className="fas fa-gavel me-2"></i>
                      Place Bid
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="row mt-5">
          <div className="col-12 text-center">
            <Link href="/auctions" className="btn btn-outline-primary btn-lg me-3">
              View All Auctions
            </Link>
            <Link href="/auctions/live" className="btn btn-accent btn-lg">
              <i className="fas fa-broadcast-tower me-2"></i>
              Live Auctions
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auction-section {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .section-header {
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 1rem;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: var(--gray-600);
          margin-bottom: 0;
        }

        .auction-link {
          text-decoration: none;
          color: inherit;
          display: block;
          height: 100%;
        }

        .auction-card {
          background: white;
          border-radius: var(--border-radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
          height: 100%;
          display: flex;
          flex-direction: column;
          border: 2px solid transparent;
        }

        .auction-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary-color);
        }

        .auction-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .auction-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition);
        }

        .auction-card:hover .auction-image img {
          transform: scale(1.1);
        }

        .auction-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: var(--warning-color);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          z-index: 2;
        }

        .auction-category {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
          z-index: 2;
        }

        .auction-actions {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          opacity: 0;
          transition: var(--transition);
          z-index: 2;
        }

        .auction-card:hover .auction-actions {
          opacity: 1;
        }

        .auction-action-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--secondary-color);
          transition: var(--transition);
          cursor: pointer;
        }

        .auction-action-btn:hover {
          background: var(--primary-color);
          color: white;
          transform: scale(1.1);
        }

        .auction-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .auction-vendor {
          margin-bottom: 0.5rem;
        }

        .vendor-name {
          font-size: 0.85rem;
          color: var(--gray-600);
          text-decoration: none;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .vendor-name:hover {
          color: var(--primary-color);
        }

        .auction-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 1rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .auction-bid-info {
          margin-bottom: 1rem;
        }

        .current-bid {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .bid-label {
          font-size: 0.9rem;
          color: var(--gray-600);
        }

        .bid-amount {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .bid-count {
          font-size: 0.85rem;
          color: var(--gray-600);
          display: flex;
          align-items: center;
        }

        .auction-timer {
          margin-bottom: 1rem;
        }

        .timer-display {
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .time-normal {
          background: var(--primary-color);
          color: white;
        }

        .time-critical {
          background: var(--danger-color);
          color: white;
          animation: pulse 1s infinite;
        }

        .time-ended {
          background: var(--gray-500);
          color: white;
        }

        .buy-now-price {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding: 8px 12px;
          background: var(--gray-100);
          border-radius: 8px;
        }

        .buy-now-label {
          font-size: 0.85rem;
          color: var(--gray-600);
        }

        .buy-now-amount {
          font-size: 1rem;
          font-weight: 600;
          color: var(--secondary-color);
        }

        .btn-bid {
          padding: 10px;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 25px;
          margin-top: auto;
        }

        .btn-accent {
          background-color: var(--accent-color);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: 500;
          transition: var(--transition);
        }

        .btn-accent:hover {
          background-color: var(--accent-hover);
          transform: translateY(-2px);
          color: white;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        /* Loading States */
        .loading-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }

        .auction-card.loading .auction-image {
          background: #f0f0f0;
        }

        .auction-card.loading .auction-title {
          width: 90%;
          height: 20px;
          margin-bottom: 1rem;
        }

        .auction-card.loading .auction-bid {
          width: 70%;
          height: 24px;
          margin-bottom: 1rem;
        }

        .auction-card.loading .auction-timer {
          width: 80%;
          height: 32px;
          margin-bottom: 1rem;
        }

        .auction-card.loading .auction-bid-count {
          width: 50%;
          height: 16px;
          margin-bottom: 1rem;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
          }

          .auction-image {
            height: 180px;
          }

          .auction-content {
            padding: 1rem;
          }

          .auction-title {
            font-size: 1rem;
          }

          .bid-amount {
            font-size: 1.1rem;
          }

          .timer-display {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </section>
  );
};

export default AuctionSection;

