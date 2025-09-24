'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface AuctionPageProps {
  auction: {
    id: string;
    title: string;
    description: string;
    images: string[];
    currentBid: number;
    startingBid: number;
    bidIncrement: number;
    endTime: string;
    startTime: string;
    status: 'upcoming' | 'active' | 'ended';
    category: string;
    vendor: string;
    condition: string;
    location: string;
    bidCount: number;
    watchers: number;
    previousBids: Array<{
      id: string;
      bidder: string;
      amount: number;
      timestamp: string;
    }>;
  };
}

const AuctionPage: React.FC<AuctionPageProps> = ({ auction }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [bidAmount, setBidAmount] = useState(auction.currentBid + auction.bidIncrement);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isWatching, setIsWatching] = useState(false);

  // Countdown timer
  useEffect(() => {
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
  }, [auction.endTime]);

  const handlePlaceBid = () => {
    if (bidAmount <= auction.currentBid) {
      alert('Bid must be higher than current bid');
      return;
    }
    
    // Place bid logic
    console.log('Placing bid:', {
      auctionId: auction.id,
      amount: bidAmount
    });
  };

  const handleWatch = () => {
    setIsWatching(!isWatching);
    // Watch/unwatch logic
    console.log('Toggling watch:', auction.id);
  };

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <div className="auction-page">
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/auctions">Auctions</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {auction.title}
            </li>
          </ol>
        </nav>

        <div className="row">
          {/* Auction Images */}
          <div className="col-lg-6">
            <div className="auction-images">
              {/* Main Image */}
              <div className="main-image mb-3 position-relative">
                <img
                  src={auction.images[selectedImage]}
                  alt={auction.title}
                  className="img-fluid w-100"
                  style={{ borderRadius: '8px', aspectRatio: '1/1', objectFit: 'cover' }}
                />
                
                {/* Status Badge */}
                <div className="position-absolute top-0 start-0 m-3">
                  <span className={`badge ${auction.status === 'active' ? 'bg-success' : auction.status === 'upcoming' ? 'bg-warning' : 'bg-danger'}`}>
                    {auction.status.toUpperCase()}
                  </span>
                </div>

                {/* Watch Button */}
                <div className="position-absolute top-0 end-0 m-3">
                  <button
                    className={`btn ${isWatching ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={handleWatch}
                    style={{ borderRadius: '50%', width: '40px', height: '40px' }}
                  >
                    <i className={`fas ${isWatching ? 'fa-heart' : 'fa-heart-o'}`}></i>
                  </button>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="thumbnail-images d-flex gap-2">
                {auction.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${auction.title} ${index + 1}`}
                    className={`img-thumbnail ${selectedImage === index ? 'active' : ''}`}
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid #43ACE9' : '1px solid #dee2e6'
                    }}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Auction Details */}
          <div className="col-lg-6">
            <div className="auction-details">
              {/* Title */}
              <h1 className="auction-title mb-3" style={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontSize: '28px', 
                fontWeight: '600',
                color: '#000'
              }}>
                {auction.title}
              </h1>

              {/* Countdown Timer */}
              {auction.status === 'active' && (
                <div className="countdown-timer mb-4">
                  <div className="alert alert-warning">
                    <h6 className="mb-2">
                      <i className="fas fa-clock me-2"></i>
                      Time Remaining:
                    </h6>
                    <div className="countdown-display d-flex gap-3 justify-content-center">
                      <div className="time-unit text-center">
                        <div className="time-value bg-primary text-white rounded p-2" style={{ fontSize: '24px', fontWeight: 'bold', minWidth: '60px' }}>
                          {formatTime(timeLeft.days)}
                        </div>
                        <div className="time-label text-muted small">Days</div>
                      </div>
                      <div className="time-unit text-center">
                        <div className="time-value bg-primary text-white rounded p-2" style={{ fontSize: '24px', fontWeight: 'bold', minWidth: '60px' }}>
                          {formatTime(timeLeft.hours)}
                        </div>
                        <div className="time-label text-muted small">Hours</div>
                      </div>
                      <div className="time-unit text-center">
                        <div className="time-value bg-primary text-white rounded p-2" style={{ fontSize: '24px', fontWeight: 'bold', minWidth: '60px' }}>
                          {formatTime(timeLeft.minutes)}
                        </div>
                        <div className="time-label text-muted small">Minutes</div>
                      </div>
                      <div className="time-unit text-center">
                        <div className="time-value bg-primary text-white rounded p-2" style={{ fontSize: '24px', fontWeight: 'bold', minWidth: '60px' }}>
                          {formatTime(timeLeft.seconds)}
                        </div>
                        <div className="time-label text-muted small">Seconds</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bidding Section */}
              <div className="bidding-section mb-4">
                <div className="current-bid mb-3">
                  <div className="row">
                    <div className="col-6">
                      <div className="text-center p-3 bg-light rounded">
                        <div className="text-muted small">Current Bid</div>
                        <div className="h4 mb-0 text-primary" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700' }}>
                          ${auction.currentBid.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center p-3 bg-light rounded">
                        <div className="text-muted small">Bid Count</div>
                        <div className="h4 mb-0 text-success" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700' }}>
                          {auction.bidCount}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Place Bid Form */}
                {auction.status === 'active' && (
                  <div className="place-bid-form">
                    <h5 className="mb-3">Place Your Bid</h5>
                    <div className="row mb-3">
                      <div className="col-8">
                        <label className="form-label">Your Bid Amount</label>
                        <div className="input-group">
                          <span className="input-group-text">$</span>
                          <input
                            type="number"
                            className="form-control"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(parseFloat(e.target.value) || 0)}
                            min={auction.currentBid + auction.bidIncrement}
                            step={auction.bidIncrement}
                          />
                        </div>
                        <small className="text-muted">
                          Minimum bid: ${(auction.currentBid + auction.bidIncrement).toLocaleString()}
                        </small>
                      </div>
                      <div className="col-4">
                        <label className="form-label">Quick Bid</label>
                        <div className="d-grid gap-2">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => setBidAmount(auction.currentBid + auction.bidIncrement)}
                          >
                            +${auction.bidIncrement}
                          </button>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => setBidAmount(auction.currentBid + (auction.bidIncrement * 5))}
                          >
                            +${auction.bidIncrement * 5}
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-primary w-100"
                      onClick={handlePlaceBid}
                      style={{
                        padding: '15px',
                        fontSize: '16px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      <i className="fas fa-gavel me-2"></i>
                      Place Bid
                    </button>
                  </div>
                )}
              </div>

              {/* Auction Info */}
              <div className="auction-info mb-4">
                <div className="row">
                  <div className="col-6">
                    <strong>Starting Bid:</strong> ${auction.startingBid.toLocaleString()}
                  </div>
                  <div className="col-6">
                    <strong>Bid Increment:</strong> ${auction.bidIncrement}
                  </div>
                  <div className="col-6">
                    <strong>Condition:</strong> {auction.condition}
                  </div>
                  <div className="col-6">
                    <strong>Location:</strong> {auction.location}
                  </div>
                  <div className="col-6">
                    <strong>Vendor:</strong> {auction.vendor}
                  </div>
                  <div className="col-6">
                    <strong>Watchers:</strong> {auction.watchers}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="description mb-4">
                <p style={{ color: '#606060', lineHeight: '1.6' }}>
                  {auction.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Auction Tabs */}
        <div className="auction-tabs mt-5">
          <ul className="nav nav-tabs" id="auctionTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="bids-tab"
                data-bs-toggle="tab"
                data-bs-target="#bids"
                type="button"
                role="tab"
                aria-controls="bids"
                aria-selected="true"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', textTransform: 'uppercase' }}
              >
                Bidding History ({auction.bidCount})
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="details-tab"
                data-bs-toggle="tab"
                data-bs-target="#details"
                type="button"
                role="tab"
                aria-controls="details"
                aria-selected="false"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', textTransform: 'uppercase' }}
              >
                Details
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="terms-tab"
                data-bs-toggle="tab"
                data-bs-target="#terms"
                type="button"
                role="tab"
                aria-controls="terms"
                aria-selected="false"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', textTransform: 'uppercase' }}
              >
                Terms & Conditions
              </button>
            </li>
          </ul>

          <div className="tab-content" id="auctionTabsContent">
            <div className="tab-pane fade show active" id="bids" role="tabpanel" aria-labelledby="bids-tab">
              <div className="p-4">
                {auction.previousBids.length > 0 ? (
                  <div className="bids-list">
                    {auction.previousBids.map((bid, index) => (
                      <div key={bid.id} className="bid-item d-flex justify-content-between align-items-center p-3 border-bottom">
                        <div>
                          <div className="bidder-name fw-bold">{bid.bidder}</div>
                          <div className="bid-time text-muted small">
                            {new Date(bid.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div className="bid-amount text-primary fw-bold">
                          ${bid.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No bids yet. Be the first to bid!</p>
                )}
              </div>
            </div>

            <div className="tab-pane fade" id="details" role="tabpanel" aria-labelledby="details-tab">
              <div className="p-4">
                <p>{auction.description}</p>
                {/* Additional details would go here */}
              </div>
            </div>

            <div className="tab-pane fade" id="terms" role="tabpanel" aria-labelledby="terms-tab">
              <div className="p-4">
                <h6>Terms & Conditions</h6>
                <ul>
                  <li>All bids are final and binding</li>
                  <li>Payment must be completed within 48 hours of auction end</li>
                  <li>Buyer is responsible for shipping and handling</li>
                  <li>Item sold as-is, no returns or exchanges</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionPage;
