'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PriceDisplay from '@/components/PriceDisplay';
import TranslatedText from '@/components/TranslatedText';





const WoodMartAuctions = ({
  title = "Live Auctions",
  subtitle = "Bid and win amazing deals",
  auctions,
  columns = 4,
  showViewAll = true,
  viewAllLink = "/auctions"
}) => {
  const gridClass = `col-lg-${12 / columns} col-md-6 col-sm-6 col-12`;
  const [currentTime, setCurrentTime] = useState(new Date());

  // Helper function to safely get first image
  const getFirstImage = (images)=> {
    if (!images) return '/images/placeholder-auction.jpg';
    if (Array.isArray(images)) return images[0] || '/images/placeholder-auction.jpg';
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : '/images/placeholder-auction.jpg';
      } catch {
        return images; // If it's not JSON, treat }
    }
    return '/images/placeholder-auction.jpg';
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateTimeLeft = (endTime) => {
    const end = new Date(endTime);
    const now = currentTime;
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      return "Ended";
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

  return (
    <section className="woodmart-auctions py-5 bg-light">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center mb-5">
          <span className="section-subtitle">{subtitle}</span>
          <h2 className="section-title">{title}</h2>
        </div>

        {/* Auctions Grid */}
        <div className="row g-4">
          {auctions.map((auction) => (
            <div key={auction.id} className={gridClass}>
              <div className="auction-card" onClick={() => window.location.href = `/auctions/${auction.slug}`} style={{ cursor: 'pointer' }}>
                <div className="auction-link">
                  <div className="auction-image-wrapper">
                    <div className="auction-image">
                      <Image
                        src={auction.image}
                        alt={auction.name}
                        width={300}
                        height={200}
                        className="img-fluid"
                      />
                    </div>
                    
                    {/* Auction Badges */}
                    <div className="auction-badges">
                      {auction.isNew && <span className="badge badge-new">New</span>}
                      {auction.isFeatured && <span className="badge badge-featured">Featured</span>}
                      {auction.badge && <span className="badge badge-custom">{auction.badge}</span>}
                      <span className="badge badge-live">Live</span>
                    </div>

                    {/* Auction Overlay */}
                    <div className="auction-overlay">
                      <div className="auction-actions">
                        <button className="btn-action btn-wishlist" title="Add to Wishlist">
                          <i className="far fa-heart"></i>
                        </button>
                        <button className="btn-action btn-watch" title="Watch Auction">
                          <i className="far fa-eye"></i>
                        </button>
                        <button className="btn-action btn-quick-view" title="Quick View">
                          <i className="fas fa-gavel"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="auction-content">
                    <h3 className="auction-name">{auction.name}</h3>
                    
                    {/* Product Info */}
                    {auction.productName && (
                      <div className="auction-product">
                        <span className="product-label">Product:</span>
                        <span className="product-name">{auction.productName}</span>
                      </div>
                    )}
                    
                    {/* Seller Info */}
                    {auction.sellerName && (
                      <div className="auction-seller">
                        <i className="fas fa-user"></i>
                        <span>By {auction.sellerName}</span>
                      </div>
                    )}

                    {/* Bid Info */}
                    <div className="auction-bid-info">
                      <div className="current-bid">
                        <span className="bid-label">Current Bid:</span>
                        <span className="bid-amount">${auction.currentBid.toLocaleString()}</span>
                      </div>
                      {auction.bidCount && (
                        <div className="bid-count">
                          <span className="count-label">Bids:</span>
                          <span className="count-number">{auction.bidCount}</span>
                        </div>
                      )}
                    </div>

                    {/* Reserve Price */}
                    {auction.reservePrice && (
                      <div className="reserve-price">
                        <i className="fas fa-shield-alt"></i>
                        <span>Reserve: ${auction.reservePrice.toLocaleString()}</span>
                      </div>
                    )}

                    {/* Time Left */}
                    {auction.endTime && (
                      <div className="auction-timer">
                        <div className="timer-label">Time Left:</div>
                        <div className="timer-countdown">
                          {calculateTimeLeft(auction.endTime)}
                        </div>
                      </div>
                    )}

                    {/* Rating */}
                    <div className="auction-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star ${i < Math.floor(auction.rating) ? 'active' : ''}`}
                          />
                        ))}
                      </div>
                      <span className="rating-text">
                        ({auction.reviewsCount} reviews)
                      </span>
                    </div>

                    {/* Action Button */}
                    <div className="auction-actions-bottom">
                      <Link href={`/auctions/${auction.slug}`} className="btn btn-primary btn-block" onClick={(e) => e.stopPropagation()}>
                        Place Bid
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        {showViewAll && (
          <div className="text-center mt-5">
            <Link href={viewAllLink} className="btn btn-outline-primary btn-lg">
              View All Auctions
              <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .woodmart-auctions {
          background: var(--gray-100);
        }

        .section-header {
          margin-bottom: 60px;
        }

        .section-subtitle {
          display: inline-block;
          font-family: var(--font-family-heading);
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--primary-color);
          margin-bottom: 15px;
        }

        .section-title {
          font-family: var(--font-family-heading);
          font-size: 36px;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 0;
        }

        .auction-card {
          background: white;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          height: 100%;
          border: 2px solid transparent;
        }

        .auction-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          border-color: var(--primary-color);
        }

        .auction-link {
          display: block;
          text-decoration: none;
          color: inherit;
          height: 100%;
        }

        .auction-link:hover {
          text-decoration: none;
          color: inherit;
        }

        .auction-image-wrapper {
          position: relative;
          overflow: hidden;
          padding-top: 66.66%; /* 3:2 aspect ratio */
        }

        .auction-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
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
          top: 15px;
          left: 15px;
          z-index: 3;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .badge {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 4px 8px;
          border-radius: var(--border-radius-sm);
        }

        .badge-new {
          background: var(--success-color);
          color: white;
        }

        .badge-featured {
          background: var(--primary-color);
          color: white;
        }

        .badge-live {
          background: var(--accent-color);
          color: white;
          animation: pulse 2s infinite;
        }

        .badge-custom {
          background: var(--warning-color);
          color: white;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }

        .auction-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 2;
        }

        .auction-card:hover .auction-overlay {
          opacity: 1;
        }

        .auction-actions {
          display: flex;
          gap: 15px;
        }

        .btn-action {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          border: none;
          background: white;
          color: var(--secondary-color);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .btn-action:hover {
          background: var(--primary-color);
          color: white;
          transform: scale(1.1);
        }

        .auction-content {
          padding: 20px;
        }

        .auction-name {
          font-family: var(--font-family-heading);
          font-size: 18px;
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 10px;
          line-height: 1.3;
        }

        .auction-product {
          margin-bottom: 10px;
          font-size: 14px;
        }

        .product-label {
          color: var(--gray-600);
          margin-right: 5px;
        }

        .product-name {
          color: var(--primary-color);
          font-weight: 500;
        }

        .auction-seller {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 15px;
          color: var(--gray-600);
          font-size: 14px;
        }

        .auction-seller i {
          color: var(--primary-color);
        }

        .auction-bid-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 10px;
          background: var(--gray-100);
          border-radius: var(--border-radius-sm);
        }

        .current-bid {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .bid-label {
          font-size: 12px;
          color: var(--gray-600);
          margin-bottom: 2px;
        }

        .bid-amount {
          font-family: var(--font-family-heading);
          font-size: 18px;
          font-weight: 700;
          color: var(--primary-color);
        }

        .bid-count {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .count-label {
          font-size: 12px;
          color: var(--gray-600);
          margin-bottom: 2px;
        }

        .count-number {
          font-size: 16px;
          font-weight: 600;
          color: var(--secondary-color);
        }

        .reserve-price {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 15px;
          color: var(--gray-600);
          font-size: 12px;
        }

        .reserve-price i {
          color: var(--warning-color);
        }

        .auction-timer {
          background: var(--accent-color);
          color: white;
          padding: 10px;
          border-radius: var(--border-radius-sm);
          text-align: center;
          margin-bottom: 15px;
        }

        .timer-label {
          font-size: 12px;
          margin-bottom: 5px;
        }

        .timer-countdown {
          font-family: var(--font-family-heading);
          font-size: 16px;
          font-weight: 700;
        }

        .auction-rating {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .stars {
          display: flex;
          gap: 2px;
        }

        .stars i {
          font-size: 12px;
          color: var(--gray-300);
        }

        .stars i.active {
          color: var(--warning-color);
        }

        .rating-text {
          font-size: 12px;
          color: var(--gray-600);
        }

        .auction-actions-bottom .btn {
          width: 100%;
          font-size: 14px;
          font-weight: 600;
          padding: 12px 20px;
          background: var(--accent-color);
          border-color: var(--accent-color);
        }

        .auction-actions-bottom .btn:hover {
          background: var(--accent-hover);
          border-color: var(--accent-hover);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .section-title {
            font-size: 28px;
          }

          .auction-name {
            font-size: 16px;
          }

          .auction-content {
            padding: 15px;
          }

          .auction-bid-info {
            flex-direction: column;
            gap: 10px;
          }
        }

        @media (max-width: 480px) {
          .auction-bid-info {
            padding: 8px;
          }

          .bid-amount {
            font-size: 16px;
          }

          .timer-countdown {
            font-size: 14px;
          }
        }
      `}</style>
    </section>
  );
};
}
export default WoodMartAuctions;

