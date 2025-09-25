'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { apiService } from '@/services/api';
import { useCurrency } from '@/contexts/CurrencyLanguageContext';
import PriceDisplay from '@/components/PriceDisplay';

export default function AuctionDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const { formatPrice } = useCurrency();

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  // Helper function to safely get auction images
  const getAuctionImages = (auction) => {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=center'
    ];
    
    if (!auction.product_image && !auction.images) {
      return fallbackImages;
    }

    let images = [];

    // Handle product_image field
    if (auction.product_image) {
      if (typeof auction.product_image === 'string') {
        try {
          new URL(auction.product_image);
          images.push(auction.product_image);
        } catch {
          // Invalid URL, skip
        }
      } else if (Array.isArray(auction.product_image)) {
        for (const image of auction.product_image) {
          if (typeof image === 'string') {
            try {
              new URL(image);
              images.push(image);
            } catch {
              // Invalid URL, skip
            }
          }
        }
      }
    }

    // Handle images field
    if (auction.images) {
      if (typeof auction.images === 'string') {
        try {
          // Try to parse as JSON first
          const parsed = JSON.parse(auction.images);
          if (Array.isArray(parsed)) {
            for (const image of parsed) {
              if (typeof image === 'string') {
                try {
                  new URL(image);
                  images.push(image);
                } catch {
                  // Invalid URL, skip
                }
              }
            }
          }
        } catch {
          // Not JSON, try as direct URL
          try {
            new URL(auction.images);
            images.push(auction.images);
          } catch {
            // Invalid URL, skip
          }
        }
      } else if (Array.isArray(auction.images)) {
        for (const image of auction.images) {
          if (typeof image === 'string') {
            try {
              new URL(image);
              images.push(image);
            } catch {
              // Invalid URL, skip
            }
          }
        }
      }
    }

    return images.length > 0 ? images : fallbackImages;
  };

  // Calculate time left
  const calculateTimeLeft = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Auction Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API first
        const response = await apiService.getAuctionBySlug ? 
          await apiService.getAuctionBySlug(slug) : 
          { success: false, error: 'Method not available' };
        
        if (response.success && response.data) {
          // Transform API data to match our component structure
          const apiAuction = response.data;
          const transformedAuction = {
            id: apiAuction.id,
            slug: apiAuction.slug || slug,
            product_name: apiAuction.product_name || apiAuction.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            current_bid: parseFloat(apiAuction.current_bid || 0),
            reserve_price: apiAuction.reserve_price ? parseFloat(apiAuction.reserve_price) : null,
            starting_bid: parseFloat(apiAuction.starting_bid || apiAuction.current_bid || 0),
            product_image: apiAuction.product_image,
            images: apiAuction.images,
            end_time: apiAuction.end_time || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            seller_name: apiAuction.seller_name || apiAuction.seller || 'Seller',
            category: apiAuction.category?.name || apiAuction.category || 'General',
            description: apiAuction.description || apiAuction.product_description || `This is a detailed description of the ${slug.replace(/-/g, ' ')}.`,
            long_description: apiAuction.long_description || apiAuction.description || `The ${slug.replace(/-/g, ' ')} is a premium item available for auction.`,
            status: apiAuction.status || 'active',
            bid_count: apiAuction.bid_count || apiAuction.bids?.length || 0,
            location: apiAuction.location || apiAuction.seller_location || 'N/A',
            is_featured: apiAuction.is_featured || false,
            condition: apiAuction.condition || 'Excellent',
            specifications: apiAuction.specifications || {
              'Condition': apiAuction.condition || 'Excellent',
              'Category': apiAuction.category?.name || apiAuction.category || 'General',
              'Location': apiAuction.location || 'N/A',
              'Seller': apiAuction.seller_name || 'Verified Seller'
            }
          };
          
          setAuction(transformedAuction);
        } else {
          // Fallback to mock data if API fails
          console.warn('API failed, using mock data:', response.error);
          const mockAuction = {
            id: 1,
            slug: slug,
            product_name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            current_bid: Math.floor(Math.random() * 5000) + 500,
            reserve_price: Math.floor(Math.random() * 7000) + 1000,
            starting_bid: Math.floor(Math.random() * 500) + 100,
            product_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=center',
            images: [
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=center',
              'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&crop=center',
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&crop=center',
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&crop=center'
            ],
            end_time: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            seller_name: 'Premium Auction House',
            category: 'Electronics',
            description: `This is a premium ${slug.replace(/-/g, ' ')} available for auction.`,
            long_description: `The ${slug.replace(/-/g, ' ')} is a high-quality item in excellent condition. This auction includes detailed photos and a comprehensive description. The item has been authenticated and comes with a certificate of authenticity.`,
            status: 'active',
            bid_count: Math.floor(Math.random() * 50) + 5,
            location: 'New York, NY',
            is_featured: Math.random() > 0.5,
            condition: 'Excellent',
            specifications: {
              'Condition': 'Excellent',
              'Category': 'Electronics',
              'Location': 'New York, NY',
              'Seller': 'Premium Auction House',
              'Authenticity': 'Verified',
              'Warranty': '30 Days',
              'Shipping': 'Free Worldwide'
            }
          };
          
          setAuction(mockAuction);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching auction:', error);
        setError('Auction not found');
        setLoading(false);
      }
    };

    if (slug) {
      fetchAuction();
    }
  }, [slug]);

  // Update time left every second
  useEffect(() => {
    if (auction && auction.end_time) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(auction.end_time));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [auction]);

  // Set initial bid amount
  useEffect(() => {
    if (auction && auction.current_bid) {
      const nextBid = auction.current_bid + Math.ceil(auction.current_bid * 0.05); // 5% increment
      setBidAmount(nextBid.toString());
    }
  }, [auction]);

  const handlePlaceBid = async () => {
    try {
      const response = await apiService.placeBid ? 
        await apiService.placeBid(auction.id, parseFloat(bidAmount)) :
        { success: true, message: 'Bid placed successfully' };
        
      if (response.success) {
        console.log('Bid placed successfully');
        // Refresh auction data
        // In a real app, you'd refetch the auction data here
      } else {
        console.error('Failed to place bid:', response.error);
      }
    } catch (error) {
      console.error('Error placing bid:', error);
    }
  };

  const handleWatchAuction = async () => {
    try {
      const response = await apiService.watchAuction ? 
        await apiService.watchAuction(auction.id) :
        { success: true, message: 'Added to watchlist' };
        
      if (response.success) {
        console.log('Added to watchlist successfully');
      } else {
        console.error('Failed to add to watchlist:', response.error);
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading auction...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error!</h4>
            <p>{error}</p>
            <Link href="/auctions" className="btn btn-primary">
              Back to Auctions
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!auction) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <h2>Auction not found</h2>
          <Link href="/auctions" className="btn btn-primary">
            Back to Auctions
          </Link>
        </div>
      </Layout>
    );
  }

  const auctionImages = getAuctionImages(auction);

  return (
    <Layout>
      <div className="auction-detail-page py-5">
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link href="/">Home</Link></li>
              <li className="breadcrumb-item"><Link href="/auctions">Auctions</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{auction.product_name}</li>
            </ol>
          </nav>

          <div className="row">
            {/* Image Gallery */}
            <div className="col-lg-6 mb-4">
              <div className="auction-gallery">
                <div className="main-image mb-3">
                  <Image
                    src={auctionImages[selectedImage]}
                    alt={auction.product_name}
                    width={600}
                    height={600}
                    className="img-fluid rounded"
                    style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                  />
                  
                  {/* Auction Status Badge */}
                  <div className="auction-status-badge">
                    {auction.status === 'active' && (
                      <span className="badge badge-live">
                        <i className="fas fa-circle pulse"></i>
                        Live Auction
                      </span>
                    )}
                    {auction.is_featured && (
                      <span className="badge badge-featured">
                        <i className="fas fa-crown"></i>
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                <div className="thumbnail-gallery">
                  <div className="row g-2">
                    {auctionImages.map((image, index) => (
                      <div key={index} className="col-3">
                        <div 
                          className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                          onClick={() => setSelectedImage(index)}
                        >
                          <Image
                            src={image}
                            alt={`${auction.product_name} ${index + 1}`}
                            width={150}
                            height={150}
                            className="img-fluid rounded"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Auction Details */}
            <div className="col-lg-6">
              <div className="auction-details">
                <h1 className="auction-title">{auction.product_name}</h1>
                
                {/* Time Left */}
                <div className="time-left-section">
                  <div className="time-left-display">
                    <i className="fas fa-clock"></i>
                    <span className="time-text">{timeLeft}</span>
                  </div>
                </div>

                {/* Current Bid */}
                <div className="bid-section">
                  <div className="current-bid">
                    <span className="label">Current Bid</span>
                    <div className="amount">
                      <PriceDisplay 
                        amount={auction.current_bid} 
                        className="bid-amount"
                        fromCurrency="USD"
                      />
                    </div>
                  </div>

                  {auction.reserve_price && (
                    <div className="reserve-price">
                      <span className="label">Reserve Price</span>
                      <PriceDisplay 
                        amount={auction.reserve_price} 
                        className="reserve-amount"
                        fromCurrency="USD"
                      />
                    </div>
                  )}

                  <div className="bid-stats">
                    <div className="stat">
                      <i className="fas fa-gavel"></i>
                      <span>{auction.bid_count} bids</span>
                    </div>
                    <div className="stat">
                      <i className="fas fa-eye"></i>
                      <span>{Math.floor(Math.random() * 100) + 50} watching</span>
                    </div>
                  </div>
                </div>

                {/* Bidding Form */}
                <div className="bidding-form">
                  <div className="bid-input-group">
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        className="form-control"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min={auction.current_bid + 1}
                        step="1"
                      />
                    </div>
                    <button 
                      className="btn btn-primary btn-place-bid"
                      onClick={handlePlaceBid}
                    >
                      <i className="fas fa-gavel"></i>
                      Place Bid
                    </button>
                  </div>
                  
                  <div className="bid-actions">
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={handleWatchAuction}
                    >
                      <i className="fas fa-heart"></i>
                      Watch Auction
                    </button>
                    <button className="btn btn-outline-info">
                      <i className="fas fa-share-alt"></i>
                      Share
                    </button>
                  </div>
                </div>

                {/* Seller Information */}
                <div className="seller-info">
                  <h6>Seller Information</h6>
                  <div className="seller-details">
                    <div className="seller-name">
                      <i className="fas fa-user"></i>
                      <span>{auction.seller_name}</span>
                    </div>
                    <div className="seller-location">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{auction.location}</span>
                    </div>
                    <div className="seller-rating">
                      <i className="fas fa-star"></i>
                      <span>4.8 (234 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description and Specifications */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="auction-info-tabs">
                <ul className="nav nav-tabs" id="auctionTabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="description-tab" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab">
                      Description
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="specifications-tab" data-bs-toggle="tab" data-bs-target="#specifications" type="button" role="tab">
                      Specifications
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="bidding-history-tab" data-bs-toggle="tab" data-bs-target="#bidding-history" type="button" role="tab">
                      Bidding History
                    </button>
                  </li>
                </ul>
                
                <div className="tab-content" id="auctionTabsContent">
                  <div className="tab-pane fade show active" id="description" role="tabpanel">
                    <div className="description-content">
                      <h5>About This Item</h5>
                      <p>{auction.description}</p>
                      <p>{auction.long_description}</p>
                    </div>
                  </div>
                  
                  <div className="tab-pane fade" id="specifications" role="tabpanel">
                    <div className="specifications-content">
                      <h5>Item Specifications</h5>
                      <div className="specifications-list">
                        {Object.entries(auction.specifications).map(([key, value]) => (
                          <div key={key} className="spec-item">
                            <span className="spec-label">{key}:</span>
                            <span className="spec-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="tab-pane fade" id="bidding-history" role="tabpanel">
                    <div className="bidding-history-content">
                      <h5>Recent Bids</h5>
                      <div className="bid-history-list">
                        {/* Mock bidding history */}
                        {Array.from({ length: Math.min(auction.bid_count, 10) }, (_, i) => (
                          <div key={i} className="bid-history-item">
                            <div className="bidder">User{Math.floor(Math.random() * 1000)}</div>
                            <div className="bid-amount">${(auction.current_bid - (i * 50)).toLocaleString()}</div>
                            <div className="bid-time">{i + 1} hour{i !== 0 ? 's' : ''} ago</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auction-detail-page {
          background-color: var(--light-color);
        }

        .auction-gallery {
          position: sticky;
          top: 20px;
        }

        .main-image {
          position: relative;
          overflow: hidden;
          border-radius: var(--border-radius-lg);
        }

        .auction-status-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          z-index: 2;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: var(--border-radius-sm);
          margin-right: 8px;
          padding: 6px 12px;
        }

        .badge-live {
          background: var(--danger-color);
          color: white;
        }

        .badge-featured {
          background: var(--primary-color);
          color: white;
        }

        .pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .thumbnail {
          cursor: pointer;
          border: 2px solid transparent;
          border-radius: var(--border-radius);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .thumbnail:hover {
          border-color: var(--primary-color);
        }

        .thumbnail.active {
          border-color: var(--primary-color);
          box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.3);
        }

        .auction-title {
          font-family: var(--font-family-heading);
          font-size: 2rem;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 1rem;
        }

        .time-left-section {
          background: linear-gradient(135deg, var(--danger-color), #ff6b6b);
          color: white;
          padding: 15px 20px;
          border-radius: var(--border-radius-lg);
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .time-left-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .time-left-display i {
          font-size: 1.2rem;
        }

        .time-text {
          font-size: 1.5rem;
          font-weight: 700;
          font-family: var(--font-family-heading);
        }

        .bid-section {
          background: white;
          padding: 25px;
          border-radius: var(--border-radius-lg);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          margin-bottom: 1.5rem;
        }

        .current-bid .label {
          display: block;
          font-size: 14px;
          color: var(--gray-600);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }

        .bid-amount {
          font-family: var(--font-family-heading);
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .reserve-price {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e9ecef;
        }

        .reserve-price .label {
          display: block;
          font-size: 12px;
          color: var(--gray-500);
          text-transform: uppercase;
          margin-bottom: 3px;
        }

        .reserve-amount {
          font-size: 1.2rem;
          color: var(--gray-600);
        }

        .bid-stats {
          display: flex;
          gap: 20px;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e9ecef;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          color: var(--gray-600);
        }

        .stat i {
          color: var(--primary-color);
        }

        .bidding-form {
          background: white;
          padding: 25px;
          border-radius: var(--border-radius-lg);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          margin-bottom: 1.5rem;
        }

        .bid-input-group {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .input-group {
          flex: 1;
        }

        .btn-place-bid {
          padding: 12px 24px;
          font-weight: 600;
          white-space: nowrap;
        }

        .bid-actions {
          display: flex;
          gap: 10px;
        }

        .bid-actions .btn {
          flex: 1;
          padding: 10px 20px;
        }

        .seller-info {
          background: white;
          padding: 25px;
          border-radius: var(--border-radius-lg);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        }

        .seller-info h6 {
          font-family: var(--font-family-heading);
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 15px;
        }

        .seller-details > div {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-size: 14px;
          color: var(--gray-700);
        }

        .seller-details i {
          color: var(--primary-color);
          width: 16px;
        }

        .auction-info-tabs {
          background: white;
          border-radius: var(--border-radius-lg);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .nav-tabs {
          border-bottom: 1px solid #dee2e6;
          margin-bottom: 0;
        }

        .nav-tabs .nav-link {
          color: var(--gray-600);
          font-weight: 500;
          border: none;
          border-bottom: 2px solid transparent;
          padding: 15px 25px;
        }

        .nav-tabs .nav-link.active {
          color: var(--primary-color);
          border-bottom-color: var(--primary-color);
          background: none;
        }

        .tab-content {
          padding: 25px;
        }

        .description-content h5,
        .specifications-content h5,
        .bidding-history-content h5 {
          font-family: var(--font-family-heading);
          font-weight: 600;
          color: var(--secondary-color);
          margin-bottom: 20px;
        }

        .specifications-list {
          display: grid;
          gap: 10px;
        }

        .spec-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #f8f9fa;
        }

        .spec-label {
          font-weight: 500;
          color: var(--gray-600);
        }

        .spec-value {
          font-weight: 600;
          color: var(--secondary-color);
        }

        .bid-history-list {
          display: grid;
          gap: 10px;
        }

        .bid-history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f8f9fa;
          border-radius: var(--border-radius);
        }

        .bidder {
          font-weight: 500;
          color: var(--secondary-color);
        }

        .bid-amount {
          font-weight: 600;
          color: var(--primary-color);
        }

        .bid-time {
          font-size: 12px;
          color: var(--gray-500);
        }

        @media (max-width: 991.98px) {
          .auction-gallery {
            position: static;
            margin-bottom: 30px;
          }
          
          .auction-title {
            font-size: 1.5rem;
          }
          
          .bid-amount {
            font-size: 2rem;
          }
          
          .bid-input-group {
            flex-direction: column;
          }
          
          .bid-actions {
            flex-direction: column;
          }
          
          .nav-tabs .nav-link {
            padding: 12px 20px;
            font-size: 14px;
          }
        }
      `}</style>
    </Layout>
  );
}
