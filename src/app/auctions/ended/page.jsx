'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { apiService } from '@/services/api';
import Link from 'next/link';
import Image from 'next/image';

export default function EndedAuctionsPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEndedAuctions = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAuctions();
        if (response.success) {
          // Filter for ended auctions
          const endedAuctions = response.data.filter(auction => 
            auction.status === 'ended' || new Date(auction.end_time) < new Date()
          );
          setAuctions(endedAuctions);
        } else {
          setError('Failed to fetch ended auctions');
        }
      } catch (err) {
        setError('Error loading ended auctions');
        console.error('Error fetching ended auctions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEndedAuctions();
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
            <p className="mt-3">Loading ended auctions...</p>
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
            <h1 className="mb-4">Ended Auctions</h1>
            <p className="text-muted mb-5">Browse completed auctions and their final results.</p>
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
                      <span className="badge bg-secondary">
                        <i className="fas fa-check-circle me-1"></i>
                        Ended
                      </span>
                    </div>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{auction.product_name || 'Auction Item'}</h5>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Final Price:</span>
                        <span className="fw-bold text-success">${auction.final_price?.toLocaleString() || auction.current_bid?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Total Bids:</span>
                        <span>{auction.bid_count || 0}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Ended:</span>
                        <span>
                          {auction.end_time ? new Date(auction.end_time).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <Link href={`/auctions/${auction.slug || auction.id}`} className="btn btn-outline-secondary w-100">
                        <i className="fas fa-eye me-2"></i>
                        View Results
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
              <i className="fas fa-check-circle fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">No ended auctions</h4>
              <p className="text-muted">No completed auctions to display at the moment.</p>
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
