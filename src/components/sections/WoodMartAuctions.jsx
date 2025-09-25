'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrency } from '@/contexts/CurrencyLanguageContext';

const WoodMartAuctions = ({
  title = "Live Auctions",
  subtitle = "Bid and win amazing deals",
  auctions = [],
  columns = 4,
  showViewAll = true,
  viewAllLink = "/auctions"
}) => {
  const [imageErrors, setImageErrors] = useState(new Set());
  const { formatPrice } = useCurrency();
  const gridClass = `col-lg-${12 / columns} col-md-6 col-sm-6 col-12`;

  const handleImageError = (auctionId) => {
    setImageErrors(prev => new Set(prev).add(auctionId));
  };

  const getAuctionImage = (auction) => {
    if (imageErrors.has(auction.id) || !auction.image) {
      return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=center';
    }
    return auction.image;
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
        <div className="row">
          {auctions && auctions.length > 0 ? (
            auctions.map((auction) => (
              <div key={auction.id} className={gridClass}>
                <div className="auction-card">
                  <div className="auction-image">
                    <Image
                      src={getAuctionImage(auction)}
                      alt={auction.name || 'Auction Item'}
                      width={300}
                      height={200}
                      className="img-fluid"
                      onError={() => handleImageError(auction.id)}
                    />
                  </div>
                  <div className="auction-content">
                    <h3 className="auction-name">{auction.name || 'Auction Item'}</h3>
                    
                    {/* Auction Details */}
                    <div className="auction-details">
                      <div className="detail-row">
                        <span className="detail-item">
                          <i className="fas fa-gavel"></i>
                          <span className="detail-label">Current Bid</span>
                          <span className="detail-value">{formatPrice(auction.currentBid || 0)}</span>
                        </span>
                        <span className="detail-item">
                          <i className="fas fa-users"></i>
                          <span className="detail-label">Bidders</span>
                          <span className="detail-value">{auction.bidCount || 0}</span>
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-item">
                          <i className="fas fa-shield-alt"></i>
                          <span className="detail-label">Reserve</span>
                          <span className="detail-value">{auction.reservePrice ? formatPrice(auction.reservePrice) : 'N/A'}</span>
                        </span>
                        <span className="detail-item">
                          <i className="fas fa-clock"></i>
                          <span className="detail-label">Time Left</span>
                          <span className="detail-value">{auction.endTime ? 'Live' : 'Ended'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Auction Status Badges */}
                    <div className="auction-badges">
                      <span className="badge badge-live">
                        <i className="fas fa-circle"></i>
                        Live
                      </span>
                      {auction.isNew && <span className="badge badge-new">
                        <i className="fas fa-star"></i>
                        New
                      </span>}
                      {auction.isFeatured && <span className="badge badge-featured">
                        <i className="fas fa-crown"></i>
                        Featured
                      </span>}
                      {auction.badge && <span className="badge badge-custom">
                        <i className="fas fa-tag"></i>
                        {auction.badge}
                      </span>}
                    </div>

                    {/* Seller Information */}
                    <div className="seller-info">
                      <div className="seller-details">
                        <i className="fas fa-user"></i>
                        <span className="seller-name">{auction.sellerName || 'Seller'}</span>
                      </div>
                      {auction.rating && (
                        <div className="auction-rating">
                          <div className="stars">
                            {[...Array(5)].map((_, index) => (
                              <i
                                key={index}
                                className={`fas fa-star ${index < (auction.rating || 0) ? 'filled' : ''}`}
                              ></i>
                            ))}
                          </div>
                          <span className="rating-text">({auction.reviewsCount || 0})</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="auction-actions">
                      <Link href={`/auctions/${auction.slug || auction.id}`} className="btn btn-primary">
                        <i className="fas fa-gavel"></i>
                        Place Bid
                      </Link>
                      <button className="btn btn-outline-secondary">
                        <i className="fas fa-heart"></i>
                        Watch
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="empty-state">
                <i className="fas fa-gavel fa-3x text-muted mb-3"></i>
                <h4 className="text-muted">No auctions available</h4>
                <p className="text-muted">Check back later for new auction listings.</p>
              </div>
            </div>
          )}
        </div>

        {/* View All Button */}
        {showViewAll && auctions && auctions.length > 0 && (
          <div className="text-center mt-4">
            <Link href={viewAllLink} className="btn btn-outline-primary">
              View All Auctions
              <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .woodmart-auctions {
          background: var(--light-color);
        }

        .section-header {
          margin-bottom: 3rem;
        }

        .section-subtitle {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: var(--primary-color);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .section-title {
          font-family: var(--font-family-heading);
          font-size: 36px;
          font-weight: 700;
          color: var(--secondary-color);
          margin: 0;
          line-height: 1.2;
        }

        .auction-card {
          background: white;
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .auction-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .auction-image {
          position: relative;
          height: 250px;
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

        .auction-content {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .auction-name {
          font-family: var(--font-family-heading);
          font-size: 18px;
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 16px;
          line-height: 1.3;
        }

        .auction-details {
          margin-bottom: 16px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--gray-600);
          flex: 1;
        }

        .detail-item i {
          color: var(--primary-color);
          width: 14px;
          text-align: center;
        }

        .detail-label {
          font-weight: 500;
          color: var(--gray-700);
        }

        .detail-value {
          font-weight: 600;
          color: var(--secondary-color);
        }

        .auction-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 12px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: var(--border-radius-sm);
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .badge-live {
          background: var(--danger-color);
          color: white;
          animation: pulse 2s infinite;
        }

        .badge-new {
          background: var(--success-color);
          color: white;
        }

        .badge-featured {
          background: var(--warning-color);
          color: white;
        }

        .badge-custom {
          background: var(--primary-color);
          color: white;
        }

        .seller-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding: 8px 0;
          border-top: 1px solid var(--gray-200);
          border-bottom: 1px solid var(--gray-200);
        }

        .seller-details {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--gray-600);
        }

        .seller-details i {
          color: var(--primary-color);
        }

        .seller-name {
          font-weight: 600;
          color: var(--secondary-color);
        }

        .auction-rating {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .stars {
          display: flex;
          gap: 2px;
        }

        .stars i {
          font-size: 10px;
          color: var(--gray-300);
        }

        .stars i.filled {
          color: var(--warning-color);
        }

        .rating-text {
          font-size: 10px;
          color: var(--gray-500);
        }

        .auction-actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
        }

        .btn {
          padding: 10px 16px;
          font-family: var(--font-family-heading);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: var(--border-radius);
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 2px solid transparent;
          cursor: pointer;
          font-size: 12px;
        }

        .btn-primary {
          background: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
          flex: 1;
        }

        .btn-primary:hover {
          background: var(--primary-hover);
          border-color: var(--primary-hover);
          color: white;
          transform: translateY(-1px);
        }

        .btn-outline-secondary {
          background: white;
          border: 2px solid var(--gray-300);
          color: var(--gray-600);
          padding: 10px 12px;
        }

        .btn-outline-secondary:hover {
          background: var(--danger-color);
          border-color: var(--danger-color);
          color: white;
          transform: translateY(-1px);
        }

        .empty-state {
          padding: 3rem 1rem;
        }

        .empty-state i {
          color: var(--gray-400);
        }

        .empty-state h4 {
          margin-bottom: 1rem;
          font-family: var(--font-family-heading);
        }

        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .auction-name {
            font-size: 16px;
          }

          .detail-row {
            flex-direction: column;
            gap: 6px;
          }

          .auction-actions {
            flex-direction: column;
          }

          .btn {
            justify-content: center;
          }

          .seller-info {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }
        }

        @media (max-width: 576px) {
          .auction-badges {
            justify-content: center;
          }

          .seller-info {
            text-align: center;
            align-items: center;
          }
        }
      `}</style>
    </section>
  );
};

export default WoodMartAuctions;