'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const AuctionPage = ({ auction }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [bidAmount, setBidAmount] = useState(auction?.currentBid + 10 || 0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isWatching, setIsWatching] = useState(false);

  useEffect(() => {
    if (auction?.endTime) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const endTime = new Date(auction.endTime).getTime();
        const distance = endTime - now;

        if (distance > 0) {
          setTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
          });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [auction?.endTime]);

  const handleBidSubmit = (e) => {
    e.preventDefault();
    // Handle bid submission
    console.log('Bid submitted:', bidAmount);
  };

  const images = auction?.images || ['/images/placeholder.svg'];

  return (
    <div className="auction-page">
      <div className="container py-4">
        <div className="row">
          {/* Product Images */}
          <div className="col-lg-6">
            <div className="product-images">
              <div className="main-image">
                <img 
                  src={images[selectedImage]} 
                  alt={auction?.productName || 'Auction Item'}
                  className="img-fluid"
                />
              </div>
              <div className="thumbnail-images">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${auction?.productName || 'Auction Item'} ${index + 1}`}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="col-lg-6">
            <div className="product-details">
              <h1 className="product-title">{auction?.productName || 'Auction Item'}</h1>
              <p className="product-description">{auction?.description || 'No description available'}</p>
              
              {/* Auction Info */}
              <div className="auction-info">
                <div className="current-bid">
                  <span className="label">Current Bid:</span>
                  <span className="amount">${auction?.currentBid || 0}</span>
                </div>
                <div className="bid-count">
                  <span className="label">Bids:</span>
                  <span className="count">{auction?.bidCount || 0}</span>
                </div>
                <div className="seller">
                  <span className="label">Seller:</span>
                  <span className="name">{auction?.sellerName || 'Unknown'}</span>
                </div>
              </div>

              {/* Time Left */}
              <div className="time-left">
                <h4>Time Left:</h4>
                <div className="countdown">
                  <div className="time-unit">
                    <span className="number">{timeLeft.days}</span>
                    <span className="label">Days</span>
                  </div>
                  <div className="time-unit">
                    <span className="number">{timeLeft.hours}</span>
                    <span className="label">Hours</span>
                  </div>
                  <div className="time-unit">
                    <span className="number">{timeLeft.minutes}</span>
                    <span className="label">Minutes</span>
                  </div>
                  <div className="time-unit">
                    <span className="number">{timeLeft.seconds}</span>
                    <span className="label">Seconds</span>
                  </div>
                </div>
              </div>

              {/* Bid Form */}
              <form onSubmit={handleBidSubmit} className="bid-form">
                <div className="form-group">
                  <label htmlFor="bidAmount">Your Bid Amount:</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      id="bidAmount"
                      className="form-control"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      min={auction?.currentBid + 1 || 1}
                      step="0.01"
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-100">
                  Place Bid
                </button>
              </form>

              {/* Watch Button */}
              <button
                className={`btn btn-outline-secondary w-100 mt-2 ${isWatching ? 'active' : ''}`}
                onClick={() => setIsWatching(!isWatching)}
              >
                {isWatching ? 'Watching' : 'Watch Auction'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auction-page {
          min-height: 100vh;
        }

        .product-images {
          margin-bottom: 30px;
        }

        .main-image {
          margin-bottom: 15px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .main-image img {
          width: 100%;
          height: 400px;
          object-fit: cover;
        }

        .thumbnail-images {
          display: flex;
          gap: 10px;
          overflow-x: auto;
        }

        .thumbnail {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color 0.2s;
        }

        .thumbnail.active {
          border-color: #007bff;
        }

        .product-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 15px;
          color: #333;
        }

        .product-description {
          color: #666;
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .auction-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }

        .auction-info > div {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .auction-info > div:last-child {
          margin-bottom: 0;
        }

        .label {
          font-weight: 600;
          color: #666;
        }

        .amount {
          font-size: 1.2rem;
          font-weight: 700;
          color: #28a745;
        }

        .time-left {
          text-align: center;
          margin-bottom: 30px;
        }

        .time-left h4 {
          margin-bottom: 15px;
          color: #333;
        }

        .countdown {
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        .time-unit {
          text-align: center;
          background: #fff;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          min-width: 80px;
        }

        .time-unit .number {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #007bff;
        }

        .time-unit .label {
          display: block;
          font-size: 0.9rem;
          color: #666;
          margin-top: 5px;
        }

        .bid-form {
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }

        .btn.active {
          background-color: #28a745;
          border-color: #28a745;
          color: white;
        }

        @media (max-width: 768px) {
          .countdown {
            gap: 10px;
          }

          .time-unit {
            padding: 10px;
            min-width: 60px;
          }

          .time-unit .number {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AuctionPage;