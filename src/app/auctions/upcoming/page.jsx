'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { apiService } from '@/services/api';
import Link from 'next/link';
import Image from 'next/image';

export default function UpcomingAuctionsPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcomingAuctions = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAuctions();
        if (response.success) {
          // Filter for upcoming auctions
          const upcomingAuctions = response.data.filter(auction => 
            auction.status === 'upcoming' || new Date(auction.start_time) > new Date()
          );
          setAuctions(upcomingAuctions);
        } else {
          setError('Failed to fetch upcoming auctions');
        }
      } catch (err) {
        setError('Error loading upcoming auctions');
        console.error('Error fetching upcoming auctions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingAuctions();
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
            <p className="mt-3">Loading upcoming auctions...</p>
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
            <h1 className="mb-4">Upcoming Auctions</h1>
            <p className="text-muted mb-5">Get ready for these exciting upcoming auctions!</p>
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
                      <span className="badge bg-warning">
                        <i className="fas fa-clock me-1"></i>
                        Upcoming
                      </span>
                    </div>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{auction.product_name || 'Auction Item'}</h5>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Starting Price:</span>
                        <span className="fw-bold text-primary">${auction.starting_price?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Start Time:</span>
                        <span>
                          {auction.start_time ? new Date(auction.start_time).toLocaleDateString() : 'TBA'}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">End Time:</span>
                        <span>
                          {auction.end_time ? new Date(auction.end_time).toLocaleDateString() : 'TBA'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <Link href={`/auctions/${auction.slug || auction.id}`} className="btn btn-outline-primary w-100">
                        <i className="fas fa-eye me-2"></i>
                        View Details
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
              <i className="fas fa-clock fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">No upcoming auctions</h4>
              <p className="text-muted">Check back later for new upcoming auctions.</p>
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
