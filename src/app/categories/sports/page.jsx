'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { apiService } from '@/services/api';
import Link from 'next/link';
import Image from 'next/image';

export default function SportsCategoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSportsProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProducts();
        if (response.success) {
          // Filter for sports products
          const sportsProducts = response.data.filter(product => 
            product.category?.toLowerCase().includes('sports') ||
            product.category?.toLowerCase().includes('sport') ||
            product.category?.toLowerCase().includes('fitness') ||
            product.category?.toLowerCase().includes('exercise') ||
            product.tags?.some(tag => 
              ['sports', 'sport', 'fitness', 'exercise', 'gym', 'workout', 'athletic', 'outdoor'].includes(tag.toLowerCase())
            )
          );
          setProducts(sportsProducts);
        } else {
          setError('Failed to fetch sports products');
        }
      } catch (err) {
        setError('Error loading sports products');
        console.error('Error fetching sports products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSportsProducts();
  }, []);

  const getFirstImage = (images) => {
    if (!images) return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop';
    if (Array.isArray(images)) return images[0] || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop';
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop';
      } catch {
        return images;
      }
    }
    return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop';
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading sports products...</p>
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
            <h1 className="mb-4">Sports</h1>
            <p className="text-muted mb-5">Gear up for your favorite sports and fitness activities.</p>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="row">
            {products.map((product) => (
              <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                <div className="card h-100">
                  <div className="position-relative">
                    <Image
                      src={getFirstImage(product.images)}
                      alt={product.name || 'Product'}
                      width={400}
                      height={300}
                      className="card-img-top"
                      style={{ objectFit: 'cover', height: '250px' }}
                    />
                    {product.isNew && (
                      <div className="position-absolute top-0 start-0 m-2">
                        <span className="badge bg-success">New</span>
                      </div>
                    )}
                    {product.isSale && (
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className="badge bg-danger">Sale</span>
                      </div>
                    )}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.name || 'Product'}</h5>
                    <p className="card-text text-muted small">
                      {product.description?.substring(0, 100)}...
                    </p>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="h5 text-primary mb-0">${product.price?.toLocaleString() || '0'}</span>
                        {product.comparePrice && (
                          <span className="text-muted text-decoration-line-through">
                            ${product.comparePrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {product.rating && (
                        <div className="d-flex align-items-center mt-2">
                          <div className="text-warning me-2">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fas fa-star ${i < product.rating ? '' : 'text-muted'}`}></i>
                            ))}
                          </div>
                          <small className="text-muted">({product.reviewsCount || 0})</small>
                        </div>
                      )}
                    </div>
                    <div className="mt-auto">
                      <Link href={`/shop/${product.slug || product.id}`} className="btn btn-primary w-100">
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
              <i className="fas fa-dumbbell fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">No sports products available</h4>
              <p className="text-muted">Check back later for new sports products.</p>
              <Link href="/shop" className="btn btn-outline-primary">
                View All Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
