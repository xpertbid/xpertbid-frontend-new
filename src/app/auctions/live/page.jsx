'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { apiService } from '@/services/api';
import Link from 'next/link';
import Image from 'next/image';

export default function LiveAuctionsPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveAuctions = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAuctions();
        if (response.success) {
          // Filter for live auctions (you can adjust this logic based on your API)
          const liveAuctions = response.data.filter(auction => 
            auction.status === 'live' || auction.end_time > new Date().toISOString()
          );
          setAuctions(liveAuctions);
        } else {
          setError('Failed to fetch live auctions');
        }
      } catch (err) {
        setError('Error loading live auctions');
        console.error('Error fetching live auctions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveAuctions();
  }, []);

  const getFirstImage = (images) => {
    if (!images) return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop';
    if (Array.isArray(images)) return images[0] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop';
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop';
      } catch {
        return images;
      }
    }
    return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop';
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading live auctions...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <h1 className="mb-4">Live Auctions</h1>
            <p className="text-muted mb-5">Bid on live auctions happening right now!</p>
          </div>
        </div>

        {auctions.length > 0 ? (
          <div className="row">
            {auctions.map((auction) => (
              <div key={auction.id} className="col-lg-4 col-md-6 col-sm-6 col-12 mb-4">
                <div className="card h-100">
                  <div className="position-relative">
                    <Image
                      src={getFirstImage(auction.product_image)}
                      alt={auction.product_name || 'Auction Item'}
                      width={400}
                      height={300}
                      className="card-img-top"
                      style={{ objectFit: 'cover', height: '250px' }}
                    />
                    <div className="position-absolute top-0 start-0 m-2">
                      <span className="badge bg-danger">
                        <i className="fas fa-circle me-1"></i>
                        Live
                      </span>
                    </div>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{auction.product_name || 'Auction Item'}</h5>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Current Bid:</span>
                        <span className="fw-bold text-primary">${auction.current_bid?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Bidders:</span>
                        <span>{auction.bid_count || 0}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Time Left:</span>
                        <span className="text-danger">
                          {auction.end_time ? 'Live Now' : 'Ended'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <Link href={`/auctions/${auction.slug || auction.id}`} className="btn btn-primary w-100">
                        <i className="fas fa-gavel me-2"></i>
                        Place Bid
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="row">
            <div className="col-12 text-center py-5">
              <i className="fas fa-gavel fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">No live auctions available</h4>
              <p className="text-muted">Check back later for new live auctions.</p>
              <Link href="/auctions" className="btn btn-outline-primary">
                View All Auctions
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
