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
          <span className="section-subtitle">
            <TranslatedText text={subtitle} />
          </span>
          <h2 className="section-title">
            <TranslatedText text={title} />
          </h2>
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
                        src={getFirstImage(auction.image)}
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
                          <i className="f-gavel"></i>
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
                        <i className="f-user"></i>
                        <span>By {auction.sellerName}</span>
                      </div>
                    )}

                    {/* Bid Info */}
                    <div className="auction-bid-info">
                      <div className="current-bid">
                        <span className="bid-label">
                          <TranslatedText text="Current Bid" />:
                        </span>
                        <PriceDisplay 
                          amount={auction.currentBid} 
                          className="bid-amount"
                          fromCurrency="USD"
                        />
                      </div>
                      {auction.bidCount && (
                        <div className="bid-count">
                          <span className="count-label">
                            <TranslatedText text="Bids" />:
                          </span>
                          <span className="count-number">{auction.bidCount}</span>
                        </div>
                      )}
                    </div>

                    {/* Reserve Price */}
                    {auction.reservePrice && (
                      <div className="reserve-price">
                        <i className="f-shield-alt"></i>
                        <span>
                          <TranslatedText text="Reserve" />: 
                        </span>
                        <PriceDisplay 
                          amount={auction.reservePrice} 
                          fromCurrency="USD"
                        />
                      </div>
                    )}

                    {/* Time Left */}
                    {auction.endTime && (
                      <div className="auction-timer">
                        <div className="timer-label">
                          <TranslatedText text="Time Left" />:
                        </div>
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
                            className={`f-star ${i < Math.floor(auction.rating) ? 'active' : ''}`}
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
              <i className="f-arrow-right ms-2"></i>
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .woodmart-auctions {
          background: var(--gray-100);
        }

        .section-header {
          margin-bottom;
        }

        .section-subtitle {
          display: inline-block;
          font-family: var(--font-family-heading);
          font-size;
          font-weight;
          text-transform;
          letter-spacing;
          color: var(--primary-color);
          margin-bottom;
        }

        .section-title {
          font-family: var(--font-family-heading);
          font-size;
          font-weight;
          color: var(--secondary-color);
          margin-bottom;
        }

        .auction-card {
          background;
          border-radius: var(--border-radius-lg);
          overflow;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          height: 100%;
          border;
        }

        .auction-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          border-color: var(--primary-color);
        }

        .auction-link {
          display;
          text-decoration;
          color;
          height: 100%;
        }

        .auction-link:hover {
          text-decoration;
          color;
        }

        .auction-image-wrapper {
          position;
          overflow;
          padding-top: 66.66%; /* 3:2 aspect ratio */
        }

        .auction-image {
          position;
          top;
          left;
          width: 100%;
          height: 100%;
        }

        .auction-image img {
          width: 100%;
          height: 100%;
          object-fit;
          transition: transform 0.3s ease;
        }

        .auction-card:hover .auction-image img {
          transform: scale(1.05);
        }

        .auction-badges {
          position;
          top;
          left;
          z-index;
          display;
          flex-direction;
          gap;
        }

        .badge {
          font-size;
          font-weight;
          text-transform;
          letter-spacing: 0.5px;
          padding;
          border-radius: var(--border-radius-sm);
        }

        .badge-new {
          background: var(--success-color);
          color;
        }

        .badge-featured {
          background: var(--primary-color);
          color;
        }

        .badge-live {
          background: var(--accent-color);
          color;
          animation;
        }

        .badge-custom {
          background: var(--warning-color);
          color;
        }

        @keyframes pulse {
          0% { opacity; }
          50% { opacity: 0.7; }
          100% { opacity; }
        }

        .auction-overlay {
          position;
          top;
          left;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display;
          align-items;
          justify-content;
          opacity;
          transition: opacity 0.3s ease;
          z-index;
        }

        .auction-card:hover .auction-overlay {
          opacity;
        }

        .auction-actions {
          display;
          gap;
        }

        .btn-action {
          width;
          height;
          border-radius: 50%;
          border;
          background;
          color: var(--secondary-color);
          display;
          align-items;
          justify-content;
          transition: all 0.3s ease;
          cursor;
        }

        .btn-action:hover {
          background: var(--primary-color);
          color;
          transform: scale(1.1);
        }

        .auction-content {
          padding;
        }

        .auction-name {
          font-family: var(--font-family-heading);
          font-size;
          font-weight;
          color: var(--secondary-color);
          margin-bottom;
          line-height: 1.3;
        }

        .auction-product {
          margin-bottom;
          font-size;
        }

        .product-label {
          color: var(--gray-600);
          margin-right;
        }

        .product-name {
          color: var(--primary-color);
          font-weight;
        }

        .auction-seller {
          display;
          align-items;
          gap;
          margin-bottom;
          color: var(--gray-600);
          font-size;
        }

        .auction-seller i {
          color: var(--primary-color);
        }

        .auction-bid-info {
          display;
          justify-content: space-between;
          margin-bottom;
          padding;
          background: var(--gray-100);
          border-radius: var(--border-radius-sm);
        }

        .current-bid {
          display;
          flex-direction;
          align-items;
        }

        .bid-label {
          font-size;
          color: var(--gray-600);
          margin-bottom;
        }

        .bid-amount {
          font-family: var(--font-family-heading);
          font-size;
          font-weight;
          color: var(--primary-color);
        }

        .bid-count {
          display;
          flex-direction;
          align-items;
        }

        .count-label {
          font-size;
          color: var(--gray-600);
          margin-bottom;
        }

        .count-number {
          font-size;
          font-weight;
          color: var(--secondary-color);
        }

        .reserve-price {
          display;
          align-items;
          gap;
          margin-bottom;
          color: var(--gray-600);
          font-size;
        }

        .reserve-price i {
          color: var(--warning-color);
        }

        .auction-timer {
          background: var(--accent-color);
          color;
          padding;
          border-radius: var(--border-radius-sm);
          text-align;
          margin-bottom;
        }

        .timer-label {
          font-size;
          margin-bottom;
        }

        .timer-countdown {
          font-family: var(--font-family-heading);
          font-size;
          font-weight;
        }

        .auction-rating {
          display;
          align-items;
          gap;
          margin-bottom;
        }

        .stars {
          display;
          gap;
        }

        .stars i {
          font-size;
          color: var(--gray-300);
        }

        .stars i.active {
          color: var(--warning-color);
        }

        .rating-text {
          font-size;
          color: var(--gray-600);
        }

        .auction-actions-bottom .btn {
          width: 100%;
          font-size;
          font-weight;
          padding;
          background: var(--accent-color);
          border-color: var(--accent-color);
        }

        .auction-actions-bottom .btn:hover {
          background: var(--accent-hover);
          border-color: var(--accent-hover);
        }

        /* Responsive Design */
        @media (max-width) {
          .section-title {
            font-size;
          }

          .auction-name {
            font-size;
          }

          .auction-content {
            padding;
          }

          .auction-bid-info {
            flex-direction;
            gap;
          }
        }

        @media (max-width) {
          .auction-bid-info {
            padding;
          }

          .bid-amount {
            font-size;
          }

          .timer-countdown {
            font-size;
          }
        }
      `}</style>
    </section>
  );
};
}
export default WoodMartAuctions;

