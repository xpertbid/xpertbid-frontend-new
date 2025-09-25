'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyLanguageContext';
import PriceDisplay from '@/components/PriceDisplay';
import TranslatedText from '@/components/TranslatedText';

export default function WishlistPage() {
  const { user, isAuthenticated } = useAuth();
  // const { formatPrice } = useCurrency();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getWishlist();
      
      if (response.success) {
        setWishlistItems(response.data );
      } else {
        setError('Failed to fetch wishlist');
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Error loading wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await apiService.removeFromWishlist(productId.toString());
      
      if (response.success) {
        // Remove item from local state
        setWishlistItems(prev => prev.filter(item => item.product.id !== productId));
      } else {
        console.error('Failed to remove from wishlist:', response.message);
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  const clearWishlist = async () => {
    if (!confirm('Are you sure you want to clear your entire wishlist?')) {
      return;
    }

    try {
      const response = await apiService.clearWishlist();
      
      if (response.success) {
        setWishlistItems([]);
      } else {
        console.error('Failed to clear wishlist:', response.message);
      }
    } catch (err) {
      console.error('Error clearing wishlist:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <div className="wishlist-login-prompt">
              <i className="f-heart fa-3x text-muted mb-4"></i>
              <h2 className="mb-3">
                <TranslatedText text="Login Required" />
              </h2>
              <p className="text-muted mb-4">
                <TranslatedText text="Please log in to view your wishlist" />
              </p>
              <Link href="/login" className="btn btn-primary">
                <TranslatedText text="Login" />
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">
                <TranslatedText text="Loading..." />
              </span>
            </div>
            <p className="mt-3">
              <TranslatedText text="Loading your wishlist..." />
            </p>
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
      <div className="wishlist-page">
        {/* Hero Section */}
        <div className="page-hero bg-light py-5">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h1 className="page-title mb-3">
                  <TranslatedText text="My Wishlist" />
                </h1>
                <p className="page-subtitle text-muted mb-0">
                  <TranslatedText text="Your saved items" />
                </p>
              </div>
              <div className="col-lg-4 text-end">
                <div className="wishlist-actions">
                  {wishlistItems.length > 0 && (
                    <button 
                      className="btn btn-outline-danger"
                      onClick={clearWishlist}
                    >
                      <i className="f-trash me-2"></i>
                      <TranslatedText text="Clear All" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-5">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-5">
              <div className="empty-wishlist">
                <i className="f-heart fa-3x text-muted mb-3"></i>
                <h4 className="text-muted mb-3">
                  <TranslatedText text="Your wishlist is empty" />
                </h4>
                <p className="text-muted mb-4">
                  <TranslatedText text="Start adding products you love to your wishlist" />
                </p>
                <Link href="/shop" className="btn btn-primary">
                  <TranslatedText text="Start Shopping" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="wishlist-content">
              <div className="wishlist-header mb-4">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <h5 className="mb-0">
                      <TranslatedText text="Items in your wishlist" /> ({wishlistItems.length})
                    </h5>
                  </div>
                  <div className="col-md-6 text-end">
                    <small className="text-muted">
                      <TranslatedText text="Last updated" />: {new Date().toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>

              <div className="row g-4">
                {wishlistItems.map((item) => (
                  <div key={item.wishlist_id} className="col-lg-4 col-md-6 col-sm-6 col-12">
                    <div className="wishlist-item-card h-100">
                      <div className="wishlist-item-image">
                        <Link href={`/shop/${item.product.slug}`}>
                          <Image
                            src={item.product.featured_image && typeof item.product.featured_image === 'string' && item.product.featured_image.startsWith('[') 
                              ? JSON.parse(item.product.featured_image)[0] 
                              : item.product.featured_image || '/images/placeholder-product.jpg'}
                            alt={item.product.name}
                            width={300}
                            height={300}
                            className="img-fluid"
                          />
                        </Link>
                        
                        {/* Product Badges */}
                        <div className="product-badges">
                          {item.product.is_featured && (
                            <span className="badge badge-featured">
                              <TranslatedText text="Featured" />
                            </span>
                          )}
                          {item.product.is_sale && (
                            <span className="badge badge-sale">
                              <TranslatedText text="Sale" />
                            </span>
                          )}
                        </div>

                        {/* Remove from wishlist button */}
                        <button 
                          className="remove-from-wishlist"
                          onClick={() => removeFromWishlist(item.product.id)}
                          title="Remove from wishlist"
                        >
                          <i className="f-heart-broken"></i>
                        </button>
                      </div>

                      <div className="wishlist-item-info">
                        <h5 className="wishlist-item-title">
                          <Link href={`/shop/${item.product.slug}`}>
                            {item.product.name}
                          </Link>
                        </h5>
                        
                        <p className="wishlist-item-category text-muted">
                          <i className="f-tag me-1"></i>
                          {item.product.category_name}
                        </p>

                        <p className="wishlist-item-vendor text-muted">
                          <i className="f-store me-1"></i>
                          {item.product.vendor_name}
                        </p>
                        
                        <div className="wishlist-item-price">
                          <PriceDisplay 
                            amount={parseFloat(item.product.price?.toString() || '0')} 
                            className="current-price"
                            fromCurrency="USD"
                          />
                          {item.product.sale_price && (
                            <span className="compare-price">
                              <del>
                                <PriceDisplay 
                                  amount={parseFloat(item.product.sale_price.toString())} 
                                  fromCurrency="USD"
                                />
                              </del>
                            </span>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="wishlist-item-rating">
                          <div className="stars">
                            {[...Array(5)].map((_, i) => (
                              <i 
                                key={i} 
                                className={`f-star ${i < (item.product.rating || 0) ? 'text-warning' : 'text-muted'}`}
                              ></i>
                            ))}
                          </div>
                          <span className="rating-count">
                            ({item.product.reviews_count || 0})
                          </span>
                        </div>

                        {/* Added date */}
                        <div className="wishlist-item-meta">
                          <small className="text-muted">
                            <TranslatedText text="Added" />: {new Date(item.added_at).toLocaleDateString()}
                          </small>
                        </div>

                        {/* Quick actions */}
                        <div className="wishlist-item-actions">
                          <Link 
                            href={`/shop/${item.product.slug}`}
                            className="btn btn-primary btn-sm"
                          >
                            <TranslatedText text="View Details" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .page-hero {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        
        .page-title {
          font-family: 'Poppins', sans-serif;
          font-weight;
          color: #000;
          font-size: 2.5rem;
        }
        
        .page-subtitle {
          font-size: 1.1rem;
        }

        .wishlist-item-card {
          background: #fff;
          border: 1px solid #e9ecef;
          border-radius;
          overflow;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .wishlist-item-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .wishlist-item-image {
          position;
          overflow;
        }

        .wishlist-item-image img {
          width: 100%;
          height;
          object-fit;
          transition: transform 0.3s ease;
        }

        .wishlist-item-card:hover .wishlist-item-image img {
          transform: scale(1.05);
        }

        .product-badges {
          position;
          top;
          left;
          z-index;
        }

        .badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight;
          border-radius;
          margin-right: 0.25rem;
        }

        .badge-featured {
          background-color: var(--success-color);
          color;
        }

        .badge-sale {
          background-color: var(--danger-color);
          color;
        }

        .remove-from-wishlist {
          position;
          top;
          right;
          background: rgba(255, 255, 255, 0.9);
          border;
          border-radius: 50%;
          width;
          height;
          display;
          align-items;
          justify-content;
          color: #dc3545;
          transition: all 0.3s ease;
          z-index;
        }

        .remove-from-wishlist:hover {
          background: #dc3545;
          color;
          transform: scale(1.1);
        }

        .wishlist-item-info {
          padding: 1.5rem;
        }

        .wishlist-item-title {
          font-size: 1.1rem;
          font-weight;
          margin-bottom: 0.5rem;
        }

        .wishlist-item-title a {
          color: var(--secondary-color);
          text-decoration;
        }

        .wishlist-item-title a:hover {
          color: var(--primary-color);
        }

        .wishlist-item-category,
        .wishlist-item-vendor {
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .wishlist-item-price {
          margin-bottom: 0.5rem;
        }

        .current-price {
          font-size: 1.2rem;
          font-weight;
          color: var(--primary-color);
        }

        .compare-price {
          font-size;
          color: var(--third-color);
          margin-left: 0.5rem;
        }

        .wishlist-item-rating {
          display;
          align-items;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .stars {
          display;
          gap: 0.1rem;
        }

        .rating-count {
          font-size: 0.8rem;
          color: var(--third-color);
        }

        .wishlist-item-meta {
          margin-bottom;
          padding-top: 0.5rem;
          border-top: 1px solid #eee;
        }

        .wishlist-item-actions {
          display;
          gap: 0.5rem;
        }

        .empty-wishlist {
          padding;
        }

        .wishlist-login-prompt {
          padding;
        }

        .wishlist-header {
          background: #fff;
          padding;
          border-radius;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        @media (max-width) {
          .page-title {
            font-size;
          }
          
          .wishlist-actions {
            margin-top;
          }
        }
      `}</style>
    </Layout>
  );
}

